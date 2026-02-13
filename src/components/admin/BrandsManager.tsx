import React, { useState } from 'react';
import { useData, BrandsBannerData, BrandLogo } from '../../context/DataContext';
import { Trash2 } from 'lucide-react';
import ImageUploader from '../ImageUploader';
import { Reorder, AnimatePresence, motion } from 'framer-motion';

const BrandsManager: React.FC = () => {
    const { brandsBanner, updateBrandsBanner, uploadImage, deleteImage } = useData();
    const [isUploading, setIsUploading] = useState(false);

    const handleUpdateSetting = (key: keyof BrandsBannerData, value: any) => {
        updateBrandsBanner({ ...brandsBanner, [key]: value });
    };

    const handleUploadLogos = async (files: File[]) => {
        setIsUploading(true);
        try {
            const newLogos: BrandLogo[] = [...brandsBanner.logos];
            for (const file of files) {
                const url = await uploadImage(file, 'brands');
                newLogos.push({
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    image: url
                });
            }
            await updateBrandsBanner({ ...brandsBanner, logos: newLogos });
        } catch (error) {
            console.error("Error uploading brand logos:", error);
            alert("Errore durante il caricamento di alcuni marchi.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteLogo = async (logoId: string) => {
        const logoToDelete = brandsBanner.logos.find(l => l.id === logoId);
        if (logoToDelete) {
            if (window.confirm("Sei sicuro di voler eliminare questo marchio?")) {
                await deleteImage(logoToDelete.image);
                const newLogos = brandsBanner.logos.filter(l => l.id !== logoId);
                await updateBrandsBanner({ ...brandsBanner, logos: newLogos });
            }
        }
    };

    const handleReorder = (newOrder: BrandLogo[]) => {
        updateBrandsBanner({ ...brandsBanner, logos: newOrder });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Settings Section */}
                <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <span className="material-icons-outlined text-amber-500">settings</span>
                        Impostazioni Banner
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <span className="font-medium">Stato Banner</span>
                            <button
                                onClick={() => handleUpdateSetting('active', !brandsBanner.active)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${brandsBanner.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                            >
                                {brandsBanner.active ? 'ATTIVO' : 'DISATTIVATO'}
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Modalità di Visualizzazione</label>
                            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                                <button
                                    onClick={() => handleUpdateSetting('mode', 'dynamic')}
                                    className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${brandsBanner.mode === 'dynamic' ? 'bg-white dark:bg-gray-600 shadow-sm text-amber-500' : 'text-gray-500'}`}
                                >
                                    Dinamico (Scorrimento)
                                </button>
                                <button
                                    onClick={() => handleUpdateSetting('mode', 'fixed')}
                                    className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${brandsBanner.mode === 'fixed' ? 'bg-white dark:bg-gray-600 shadow-sm text-amber-500' : 'text-gray-500'}`}
                                >
                                    Fisso (Griglia)
                                </button>
                            </div>
                        </div>

                        {brandsBanner.mode === 'dynamic' && (
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Velocità Scorrimento</label>
                                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                                    {(['slow', 'medium', 'fast'] as const).map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleUpdateSetting('speed', s)}
                                            className={`flex-1 py-2 rounded-md text-sm font-bold capitalize transition-all ${brandsBanner.speed === s ? 'bg-white dark:bg-gray-600 shadow-sm text-amber-500' : 'text-gray-500'}`}
                                        >
                                            {s === 'slow' ? 'Lento' : s === 'medium' ? 'Medio' : 'Veloce'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Posizione in Home Page</label>
                            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                                <button
                                    onClick={() => handleUpdateSetting('position', 'after_hero')}
                                    className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${brandsBanner.position === 'after_hero' ? 'bg-white dark:bg-gray-600 shadow-sm text-amber-500' : 'text-gray-500'}`}
                                >
                                    Dopo Hero
                                </button>
                                <button
                                    onClick={() => handleUpdateSetting('position', 'before_footer')}
                                    className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${brandsBanner.position === 'before_footer' ? 'bg-white dark:bg-gray-600 shadow-sm text-amber-500' : 'text-gray-500'}`}
                                >
                                    Prima del Footer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upload Section */}
                <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <span className="material-icons-outlined text-amber-500">add_photo_alternate</span>
                        Aggiungi Marchi
                    </h3>
                    <p className="text-sm text-gray-500">Trascina qui i loghi dei marchi (PNG, JPG o WEBP). Puoi caricarne più di uno contemporaneamente.</p>

                    <div className="relative">
                        <ImageUploader
                            onUpload={(file) => handleUploadLogos([file])}
                        // Note: Assuming ImageUploader handles single file but we can wrap it or modify if it supports multiple.
                        // Based on current projects, many ImageUploaders are single-file. 
                        // Let's make sure we can handle multiple if possible, otherwise user can click multiple times.
                        />
                        {isUploading && (
                            <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center rounded-xl z-10">
                                <span className="material-icons-outlined animate-spin text-amber-500 text-3xl">refresh</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Logos Grid / List */}
            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <span className="material-icons-outlined text-amber-500">view_list</span>
                        Marchi Caricati ({brandsBanner.logos.length})
                    </h3>
                    <p className="text-xs text-gray-400 italic">Trascina per riordinare</p>
                </div>

                <Reorder.Group axis="y" values={brandsBanner.logos} onReorder={handleReorder} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <AnimatePresence>
                        {brandsBanner.logos.map((logo) => (
                            <Reorder.Item
                                key={logo.id}
                                value={logo}
                                className="relative aspect-square bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 p-4 flex items-center justify-center cursor-move group"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <img src={logo.image} alt="Brand logo" className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all" />
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteLogo(logo.id); }}
                                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </Reorder.Item>
                        ))}
                    </AnimatePresence>
                </Reorder.Group>

                {brandsBanner.logos.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-2xl">
                        <span className="material-icons-outlined text-5xl mb-2">image_not_supported</span>
                        <p>Nessun marchio caricato</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrandsManager;
