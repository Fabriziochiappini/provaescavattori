import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Machine } from '../types';
import { ChevronRight, Zap, Scale, Clock, Maximize2 } from 'lucide-react';
import GalleryModal from './GalleryModal';

interface MachineCardProps {
  machine: Machine;
}

const MachineCard: React.FC<MachineCardProps> = ({ machine }) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Use machine images if available, otherwise just use the main imageUrl
  // We'll treat imageUrl as the first image if images array is empty/undefined
  const galleryImages = machine.images && machine.images.length > 0
    ? machine.images
    : [machine.imageUrl];

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsGalleryOpen(true);
  };
  return (
    <>
      <div className="group bg-white border border-slate-200 rounded-none overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
        <div
          className="relative h-72 overflow-hidden cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src={machine.imageUrl}
            alt={machine.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-0 left-0 flex flex-col z-10">
            {machine.type === 'sale' || machine.type === 'both' ? (
              <span className="bg-slate-900 text-white text-[10px] font-bold px-4 py-2 uppercase tracking-[0.2em]">In Vendita</span>
            ) : null}
            {machine.type === 'rental' || machine.type === 'both' ? (
              <span className="bg-orange-600 text-white text-[10px] font-bold px-4 py-2 uppercase tracking-[0.2em]">Disponibile a Noleggio</span>
            ) : null}
          </div>

          <div className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-3 rounded-none text-white backdrop-blur-md transition-colors z-10 opacity-0 group-hover:opacity-100 border border-white/20">
            <Maximize2 size={18} />
          </div>

          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <span className="text-white font-bold tracking-widest text-xs uppercase border-b-2 border-orange-600 pb-1">Visualizza Gallery</span>
          </div>
        </div>

        <div className="p-6 border-t-4 border-transparent group-hover:border-orange-600 transition-all duration-500">
          <div className="mb-4">
            <p className="text-orange-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{machine.brand}</p>
            <h3 className="text-2xl font-bold text-slate-900 leading-tight tracking-tight uppercase">{machine.name}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 my-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Peso Operativo</span>
              <div className="flex items-center gap-2 text-slate-700 font-bold">
                <Scale size={14} className="text-orange-600" />
                <span>{machine.weight} T</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Categoria</span>
              <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                <Zap size={14} className="text-orange-600" />
                <span>{machine.category}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-end justify-between">
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">Quotazione</p>
              <p className="text-2xl font-black text-slate-900 tracking-tighter">
                {machine.type === 'rental' ? (
                  <span className="text-lg">{machine.rentalPrice}</span>
                ) : (
                  <>
                    <span className="text-sm font-bold mr-1">€</span>
                    {machine.price?.toLocaleString()}
                  </>
                )}
              </p>
            </div>
            <Link
              to={`/macchina/${machine.id}`}
              className="bg-slate-900 hover:bg-orange-600 text-white p-4 transition-all duration-300 group/btn"
            >
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={galleryImages}
        initialIndex={0}
      />
    </>
  );
};

export default MachineCard;
