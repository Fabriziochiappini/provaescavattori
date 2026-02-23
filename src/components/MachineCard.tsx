import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Machine } from '../types';
import { ChevronRight, Zap, Scale, Clock, Maximize2, Tag } from 'lucide-react';
import GalleryModal from './GalleryModal';
import { useData } from '../context/DataContext';

interface MachineCardProps {
  machine: Machine;
}

const MachineCard: React.FC<MachineCardProps> = ({ machine }) => {
  const { adminSettings } = useData();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  if (!machine || !machine.name) {
    return null;
  }

  const showPrices = adminSettings?.showPrices ?? true;
  
  const mainImage = machine.imageUrl || 'https://placehold.co/600x400?text=No+Image';

  const galleryImages = machine.images && machine.images.length > 0
    ? machine.images
    : [mainImage];

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsGalleryOpen(true);
  };

  return (
    <>
      <div className="group bg-white border border-slate-200 rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden cursor-pointer bg-slate-100" onClick={handleImageClick}>
          <img
            src={mainImage}
            alt={machine.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <Maximize2 className="text-white" size={24} />
            </div>
          </div>

          {/* Condition Badge */}
          {machine.condition && (
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/10 shadow-lg">
              {machine.condition}
            </div>
          )}

          {/* Type Badge */}
          <div className={`absolute top-4 right-4 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg ${
            machine.type === 'sale' 
              ? 'bg-emerald-500 text-white' 
              : (machine.type === 'rental' || machine.type === 'rent')
              ? 'bg-blue-500 text-white'
              : 'bg-orange-500 text-white'
          }`}>
            {machine.type === 'sale' ? 'Vendita' : (machine.type === 'rental' || machine.type === 'rent') ? 'Noleggio' : 'Vendita / Noleggio'}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col flex-grow">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-orange-600 font-bold text-xs uppercase tracking-[0.2em]">{machine.brand}</span>
              {machine.year && (
                <span className="text-slate-400 font-medium text-xs bg-slate-100 px-2 py-1 rounded">
                  {machine.year}
                </span>
              )}
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase italic leading-tight group-hover:text-orange-600 transition-colors">
              {machine.name} {machine.model}
            </h3>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-8 border-y border-slate-100 py-6">
            
            {/* Weight - Only show if > 0 */}
            {(machine.weight && machine.weight > 0) ? (
              <div className="flex items-center gap-3">
                <Scale size={16} className="text-slate-400" />
                <div>
                  <span className="block text-[10px] uppercase text-slate-400 font-bold tracking-wider">Peso</span>
                  <span className="font-bold text-slate-700 text-sm">
                    {machine.weight > 1000 ? `${(machine.weight / 1000).toFixed(1)} t` : `${machine.weight} kg`}
                  </span>
                </div>
              </div>
            ) : null}

            {/* Alimentazione (Power Type) */}
            <div className="flex items-center gap-3">
              <Zap size={16} className="text-slate-400" />
              <div>
                <span className="block text-[10px] uppercase text-slate-400 font-bold tracking-wider">Alim.</span>
                <span className="font-bold text-slate-700 text-sm">
                  {machine.powerType === 'Termico' ? 'Diesel' : (machine.powerType || 'Diesel')}
                </span>
              </div>
            </div>

            {/* Categoria */}
            <div className="flex items-center gap-3">
              <Tag size={16} className="text-slate-400" />
              <div>
                <span className="block text-[10px] uppercase text-slate-400 font-bold tracking-wider">Cat.</span>
                <span className="font-bold text-slate-700 text-sm truncate max-w-[100px]" title={typeof machine.category === 'string' ? machine.category : ''}>
                  {typeof machine.category === 'string' ? machine.category : 'Standard'}
                </span>
              </div>
            </div>

            {/* Hours */}
            {machine.hours !== undefined && machine.hours > 0 ? (
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-slate-400" />
                <div>
                  <span className="block text-[10px] uppercase text-slate-400 font-bold tracking-wider">Ore</span>
                  <span className="font-bold text-slate-700 text-sm">{machine.hours} h</span>
                </div>
              </div>
            ) : null}
            
          </div>

          <div className="mt-auto space-y-4">
            {/* Price */}
            {showPrices && (machine.price || machine.rentalPrice) && (
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-slate-400">da</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {(machine.type === 'rental' || machine.type === 'rent') && machine.rentalPrice 
                    ? machine.rentalPrice 
                    : machine.price 
                      ? `€ ${machine.price.toLocaleString('it-IT')}`
                      : 'Trattativa Riservata'}
                </span>
              </div>
            )}

            <Link 
              to={`/macchina/${machine.id}`}
              className="w-full bg-slate-900 text-white hover:bg-orange-600 py-4 px-6 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all group/btn"
            >
              Dettagli
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
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