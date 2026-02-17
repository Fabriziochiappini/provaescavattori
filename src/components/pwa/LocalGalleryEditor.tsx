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
import { Trash2, ArrowRight, Camera, Plus } from 'lucide-react';

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
            className="relative aspect-square bg-gray-200 rounded-2xl overflow-hidden touch-none shadow-md border-2 border-transparent active:border-amber-500 active:scale-95 transition-all"
        >
            <img src={photo.url} alt="Captured" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onRemove(photo.id);
                }}
                className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center bg-red-500 rounded-full text-white shadow-lg active:scale-90 transition-transform z-10"
                onPointerDown={(e) => e.stopPropagation()}
            >
                <Trash2 className="w-5 h-5" />
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

        // Sort by timestamp (explicitly handle missing timestamps just in case)
        storedPhotos.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

        const photosWithUrls = storedPhotos.map(p => ({
            id: p.id,
            blob: p.blob,
            url: URL.createObjectURL(p.blob)
        }));
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
                        <div className="grid grid-cols-3 gap-4">
                            {photos.map((photo) => (
                                <SortablePhoto key={photo.id} photo={photo} onRemove={handleRemove} />
                            ))}

                            {/* Add More Photos Tile */}
                            <button
                                onClick={() => navigate('/admin/pwa/camera', { state: { fromGallery: true } })}
                                className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 active:bg-gray-100 active:border-amber-500 active:text-amber-500 transition-all"
                            >
                                <Camera className="w-8 h-8" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Aggiungi</span>
                            </button>
                        </div>
                    </SortableContext>
                </DndContext>

                {photos.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
                        <p>Nessuna foto disponibile.</p>
                        <button
                            onClick={() => navigate('/admin/pwa/camera', { state: { fromGallery: true } })}
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
