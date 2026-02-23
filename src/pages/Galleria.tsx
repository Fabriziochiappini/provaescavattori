
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData, type Gallery } from '../context/DataContext';
import GalleryModal from '../components/GalleryModal';
import { ImageIcon, Maximize2 } from 'lucide-react';

const Galleria: React.FC = () => {
    const { galleries } = useData();
    const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
    const [initialIndex, setInitialIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openGallery = (gallery: Gallery, index: number) => {
        setSelectedGallery(gallery);
        setInitialIndex(index);
        setIsModalOpen(true);
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="pt-32 pb-24 bg-zinc-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="mb-16 text-center"
                >
                    <span className="text-orange-600 font-bold text-xs uppercase tracking-[0.3em] mb-4 block">Archivio Fotografico</span>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase italic tracking-tighter mb-6">
                        CONTE<span className="text-orange-600">GROUP</span>
                    </h1>
                    <div className="w-24 h-2 bg-orange-600 mx-auto"></div>
                </motion.div>

                {/* Galleries List */}
                <div className="space-y-24">
                    {galleries.length > 0 ? (
                        galleries.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).map((gallery) => (
                            <motion.section
                                key={gallery.id}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                variants={fadeInUp}
                                className="space-y-8"
                            >
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
                                    <div className="max-w-2xl">
                                        <h2 className="text-3xl font-black text-slate-900 uppercase italic mb-4">{gallery.title}</h2>
                                        <p className="text-slate-500 font-medium leading-relaxed">{gallery.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                                        <ImageIcon size={16} />
                                        {gallery.images?.length || 0} Foto
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {gallery.images?.map((img, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.02 }}
                                            className="relative aspect-[4/3] group cursor-pointer overflow-hidden rounded-[24px] shadow-sm border border-slate-100"
                                            onClick={() => openGallery(gallery, idx)}
                                        >
                                            <img
                                                src={img}
                                                alt={`${gallery.title} ${idx + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                    <Maximize2 className="text-white" size={24} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        ))
                    ) : (
                        <div className="text-center py-32 border-4 border-dashed border-slate-200 rounded-[48px]">
                            <ImageIcon size={64} className="mx-auto text-slate-200 mb-6" />
                            <h3 className="text-2xl font-black text-slate-400 uppercase italic">Nessun contenuto disponibile</h3>
                        </div>
                    )}
                </div>
            </div>

            {selectedGallery && (
                <GalleryModal
                    images={selectedGallery.images}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialIndex={initialIndex}
                />
            )}
        </div>
    );
};

export default Galleria;
