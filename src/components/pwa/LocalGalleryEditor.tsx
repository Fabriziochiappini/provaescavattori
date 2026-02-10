import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    TouchSensor,
    MouseSensor
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getAllPhotos, deletePhoto } from '../../services/pwaStorage';
import { Trash2, ArrowRight } from 'lucide-react';

interface Photo {
    id: string;
    blob: Blob;
    url: string;
}

const SortablePhoto = ({ photo, onRemove }: { photo: Photo; onRemove: (id: string) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: photo.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden touch-none shadow-sm"
        >
            <img src={photo.url} alt="Captured" className="w-full h-full object-cover" />
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Stop drag start
                    // Prevent default to be safe
                    e.preventDefault();
                    onRemove(photo.id);
                }}
                className="absolute top-1 right-1 p-1.5 bg-red-500/80 rounded-full text-white backdrop-blur-sm z-10"
                onPointerDown={(e) => e.stopPropagation()}
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
};

export const LocalGalleryEditor: React.FC = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const navigate = useNavigate();

    const sensors = useSensors(
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250, // Long press for touch
                tolerance: 5,
            },
        }),
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        loadPhotos();
        return () => {
            // Cleanup URLs to avoid memory leaks
            photos.forEach(p => URL.revokeObjectURL(p.url));
        };
    }, []);

    const loadPhotos = async () => {
        const storedPhotos = await getAllPhotos();
        const photosWithUrls = storedPhotos.map(p => ({
            id: p.id,
            blob: p.blob,
            url: URL.createObjectURL(p.blob)
        }));
        // Sort by timestamp if needed, but IDB usually returns loosely sorted.
        // We'll trust IDB order initially.
        setPhotos(photosWithUrls);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setPhotos((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleRemove = async (id: string) => {
        await deletePhoto(id);
        setPhotos(prev => prev.filter(p => p.id !== id));
    };

    const handleConfirm = () => {
        navigate('/admin/pwa/details', { state: { orderedIds: photos.map(p => p.id) } });
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 safe-area-top">
                <h2 className="text-xl font-bold text-gray-800">Galleria ({photos.length})</h2>
                <span className="text-sm text-gray-500">Tieni premuto per riordinare</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={photos.map(p => p.id)}
                        strategy={rectSortingStrategy}
                    >
                        <div className="grid grid-cols-3 gap-3">
                            {photos.map((photo) => (
                                <SortablePhoto key={photo.id} photo={photo} onRemove={handleRemove} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                {photos.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
                        <p>Nessuna foto disponibile.</p>
                        <button
                            onClick={() => navigate('/admin/pwa/camera')}
                            className="mt-4 text-blue-600 font-semibold"
                        >
                            Torna alla fotocamera
                        </button>
                    </div>
                )}
            </div>

            <div className="p-4 border-t bg-white safe-area-bottom">
                <button
                    onClick={handleConfirm}
                    disabled={photos.length === 0}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 active:scale-98 transition-all"
                >
                    CONFERMA E PROCEDI <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
