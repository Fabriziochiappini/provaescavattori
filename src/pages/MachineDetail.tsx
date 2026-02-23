import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ChevronLeft, Scale, Clock, Zap, Calendar, Wrench, Phone, Mail, Share2, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import GalleryModal from '../components/GalleryModal';

const MachineDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { excavators, specCategories, adminSettings } = useData(); // Added specCategories
    const showPrices = adminSettings?.showPrices !== false;
    const [machine, setMachine] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'features'>('desc');
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    useEffect(() => {
        if (excavators.length > 0 && id) {
            const found = excavators.find(e => e.id === id);
            if (found) {
                setMachine(found);
            } else {
                // Fallback or loading state could go here, for now redirect 
                // navigate('/vendita'); 
            }
        }
    }, [id, excavators, navigate]);

    if (!machine) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    const galleryImages = machine.images && machine.images.length > 0
        ? machine.images
        : [machine.imageUrl];

    const hasWeight = (machine.weight || 0) > 0;
    const hasYear = (machine.year || 0) > 0;
    const hasHours = (machine.hours || 0) > 0;
    const hasCondition = !!machine.condition;
    const showKeyStats = hasWeight || hasYear || hasHours || hasCondition;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-zinc-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb / Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-zinc-500 hover:text-amber-500 transition-colors mb-6 font-medium"
                >
                    <ChevronLeft size={20} />
                    Torna all'elenco
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* LEFT COLUMN: Gallery */}
                    <div className="space-y-4">
                        <div
                            className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
                            onClick={() => setIsGalleryOpen(true)}
                        >
                            <img
                                src={galleryImages[0]}
                                alt={machine.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg text-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                <Maximize2 size={24} />
                            </div>

                            <div className="absolute bottom-4 left-4 flex gap-2">
                                {machine.type === 'sale' && (
                                    <span className="bg-amber-500 text-white px-3 py-1 rounded-md text-sm font-bold shadow-md uppercase tracking-wider">
                                        In Vendita
                                    </span>
                                )}
                                {machine.type === 'rent' && (
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-bold shadow-md uppercase tracking-wider">
                                        Noleggio
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {galleryImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {galleryImages.slice(1, 5).map((img: string, idx: number) => (
                                    <div
                                        key={idx}
                                        className="aspect-square rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-amber-500 transition-all opacity-70 hover:opacity-100"
                                        onClick={() => setIsGalleryOpen(true)}
                                    >
                                        <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                {galleryImages.length > 5 && (
                                    <div
                                        className="aspect-square rounded-xl overflow-hidden cursor-pointer bg-zinc-200 flex items-center justify-center text-zinc-500 font-bold hover:bg-zinc-300 transition-colors"
                                        onClick={() => setIsGalleryOpen(true)}
                                    >
                                        +{galleryImages.length - 5}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Info */}
                    <div className="flex flex-col h-full">
                        <div className="mb-2">
                            <h2 className="text-amber-500 font-bold tracking-wider uppercase text-sm mb-1">{machine.brand}</h2>
                            <h1 className="text-4xl font-extrabold text-zinc-900 mb-4">{machine.name}</h1>
                            <div className="flex items-end gap-2 mb-6">
                                <span className="text-3xl font-bold text-zinc-900">
                                    {machine.type === 'rent' ? (
                                        machine.rentalPrice
                                    ) : showPrices ? (
                                        `€ ${machine.price?.toLocaleString()}`
                                    ) : (
                                        <span className="text-amber-600 text-2xl uppercase tracking-widest">Trattativa Riservata</span>
                                    )}
                                </span>
                                {machine.type === 'rent' && <span className="text-zinc-500 mb-1">/ giorno</span>}
                            </div>
                        </div>

                        {/* Key Stats Grid - Conditional Rendering */}
                        {showKeyStats && (
                            <div className="grid grid-cols-2 gap-4 mb-8 bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
                                {hasWeight && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Scale size={20} /></div>
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase font-bold">Peso</p>
                                            <p className="font-semibold">{machine.weight} ton</p>
                                        </div>
                                    </div>
                                )}
                                {hasYear && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Calendar size={20} /></div>
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase font-bold">Anno</p>
                                            <p className="font-semibold">{machine.year}</p>
                                        </div>
                                    </div>
                                )}
                                {hasHours && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Clock size={20} /></div>
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase font-bold">Ore</p>
                                            <p className="font-semibold">{machine.hours} h</p>
                                        </div>
                                    </div>
                                )}
                                {hasCondition && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Wrench size={20} /></div>
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase font-bold">Stato</p>
                                            <p className="font-semibold">{machine.condition}</p>
                                        </div>
                                    </div>
                                )}
                                {machine.powerType && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><Zap size={20} /></div>
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase font-bold">Alimentazione</p>
                                            <p className="font-semibold">{machine.powerType}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden flex-grow flex flex-col">
                            <div className="flex border-b border-zinc-100">
                                <button
                                    onClick={() => setActiveTab('desc')}
                                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'desc' ? 'bg-amber-50 text-amber-600 border-b-2 border-amber-500' : 'text-zinc-400 hover:text-zinc-600'}`}
                                >
                                    Descrizione
                                </button>
                                <button
                                    onClick={() => setActiveTab('specs')}
                                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'specs' ? 'bg-amber-50 text-amber-600 border-b-2 border-amber-500' : 'text-zinc-400 hover:text-zinc-600'}`}
                                >
                                    Specifiche
                                </button>
                                <button
                                    onClick={() => setActiveTab('features')}
                                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'features' ? 'bg-amber-50 text-amber-600 border-b-2 border-amber-500' : 'text-zinc-400 hover:text-zinc-600'}`}
                                >
                                    Accessori
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[300px]">
                                {activeTab === 'desc' && (
                                    <div className="prose prose-zinc max-w-none">
                                        <p className="text-zinc-600 leading-relaxed font-light whitespace-pre-line">
                                            {machine.description || "Nessuna descrizione disponibile."}
                                        </p>
                                    </div>
                                )}

                                {activeTab === 'specs' && (
                                    <table className="w-full text-sm">
                                        <tbody>
                                            <tr className="border-b border-zinc-100">
                                                <td className="py-2 text-zinc-500 font-medium">Marca</td>
                                                <td className="py-2 text-zinc-900 font-bold text-right">{machine.brand}</td>
                                            </tr>
                                            <tr className="border-b border-zinc-100">
                                                <td className="py-2 text-zinc-500 font-medium">Modello</td>
                                                <td className="py-2 text-zinc-900 font-bold text-right">{machine.name}</td>
                                            </tr>
                                            <tr className="border-b border-zinc-100">
                                                <td className="py-2 text-zinc-500 font-medium">Categoria</td>
                                                <td className="py-2 text-zinc-900 font-bold text-right">{machine.category}</td>
                                            </tr>
                                            <tr className="border-b border-zinc-100">
                                                <td className="py-2 text-zinc-500 font-medium">Alimentazione</td>
                                                <td className="py-2 text-zinc-900 font-bold text-right">{machine.powerType || '-'}</td>
                                            </tr>
                                            {/* Dynamic Specs */}
                                            {specCategories.map(cat => {
                                                const val = machine.specs?.[cat.id];
                                                if (!val) return null;
                                                return (
                                                    <tr key={cat.id} className="border-b border-zinc-100">
                                                        <td className="py-2 text-zinc-500 font-medium">{cat.name}</td>
                                                        <td className="py-2 text-zinc-900 font-bold text-right">{val}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}

                                {activeTab === 'features' && (
                                    <ul className="grid grid-cols-1 gap-2">
                                        {machine.features && machine.features.length > 0 ? (
                                            machine.features.map((feat: string, i: number) => (
                                                <li key={i} className="flex items-center gap-3 text-zinc-700 bg-zinc-50 p-2 rounded-lg">
                                                    <Zap size={16} className="text-amber-500" />
                                                    <span className="font-medium">{feat}</span>
                                                </li>
                                            ))
                                        ) : (
                                            <p className="text-zinc-400 italic">Nessun accessorio specificato.</p>
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="mt-8 flex gap-4">
                            <Link
                                to="/contatti"
                                state={{ prefill: `Richiesta info per: ${machine.name} (${machine.brand})` }}
                                className="flex-1 bg-zinc-900 text-white py-4 rounded-xl font-bold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <Mail size={20} />
                                Richiedi Informazioni
                            </Link>
                            <a
                                href="tel:+39061234567"
                                className="px-6 py-4 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors flex items-center justify-center"
                            >
                                <Phone size={24} />
                            </a>
                            <button
                                onClick={() => {
                                    navigator.share({
                                        title: `Conte Group - ${machine.name}`,
                                        text: `Guarda questo mezzo: ${machine.name}`,
                                        url: window.location.href,
                                    }).catch(() => { });
                                }}
                                className="px-6 py-4 bg-zinc-100 text-zinc-900 rounded-xl font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center"
                            >
                                <Share2 size={24} />
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <GalleryModal
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                images={galleryImages}
            />
        </div>
    );
};

export default MachineDetail;
