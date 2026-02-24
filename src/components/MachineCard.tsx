import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Machine } from '../types';
import { ChevronRight, Zap, Scale, Clock, Maximize2, Tag, FileText } from 'lucide-react';
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
  
  // Safety checks for numeric values
  const getSafeNumber = (val: any) => {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (typeof val === 'string') {
        const num = Number(val.replace(',', '.')); // Handle comma decimals if any
        return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const safeWeight = getSafeNumber(machine.weight);
  const safeHours = getSafeNumber(machine.hours);
  const safePrice = getSafeNumber(machine.price);
  
  const mainImage = machine.imageUrl || (Array.isArray(machine.images) && machine.images.length > 0 ? machine.images[0] : 'https://placehold.co/600x400?text=No+Image');

  const rawImages = Array.isArray(machine.images) ? machine.images : [];
  const galleryImages = rawImages.length > 0 ? rawImages : [mainImage];

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsGalleryOpen(true);
  };

  return (
    <>
      <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-orange-200 transition-all duration-300 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden cursor-pointer bg-slate-100" onClick={handleImageClick}>
          <img
            src={mainImage}
            alt={machine.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <Maximize2 className="text-slate-900" size={20} />
            </div>
          </div>

          {/* Condition Badge */}
          {machine.condition && (
            <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
              {machine.condition}
            </div>
          )}

          {/* PDF Badge */}
          {machine.technicalSheetUrl && (
            <a 
              href={machine.technicalSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 left-20 bg-red-600/90 text-white p-1 rounded shadow-sm hover:bg-red-700 transition-colors z-10"
              title="Scheda Tecnica PDF"
              onClick={(e) => e.stopPropagation()}
            >
              <FileText size={14} />
            </a>
          )}

          {/* Type Badge */}
          <div className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm ${
            machine.type === 'sale' 
              ? 'bg-emerald-600 text-white' 
              : (machine.type === 'rental' || machine.type === 'rent')
              ? 'bg-blue-600 text-white'
              : 'bg-orange-600 text-white'
          }`}>
            {machine.type === 'sale' ? 'Vendita' : (machine.type === 'rental' || machine.type === 'rent') ? 'Noleggio' : 'Vendita / Noleggio'}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="mb-4">
            <div className="flex justify-between items-start mb-1">
              <span className="text-orange-600 font-bold text-[10px] uppercase tracking-wider">{machine.brand}</span>
              {machine.year && (
                <span className="text-slate-500 font-bold text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  {machine.year}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-orange-600 transition-colors truncate">
              {machine.name} {machine.model}
            </h3>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-2 mb-4 border-t border-b border-slate-100 py-3">
            
            {/* Weight - Only show if > 0 */}
            {(safeWeight > 0) ? (
              <div className="flex items-center gap-2">
                <Scale size={14} className="text-slate-400" />
                <div className="flex flex-col leading-none">
                  <span className="text-[9px] uppercase text-slate-400 font-bold tracking-wide">Peso</span>
                  <span className="font-bold text-slate-700 text-xs">
                    {safeWeight > 1000 ? `${(safeWeight / 1000).toFixed(1)} t` : `${safeWeight} kg`}
                  </span>
                </div>
              </div>
            ) : null}

            {/* Alimentazione (Power Type) */}
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-slate-400" />
              <div className="flex flex-col leading-none">
                <span className="text-[9px] uppercase text-slate-400 font-bold tracking-wide">Alim.</span>
                <span className="font-bold text-slate-700 text-xs">
                  {machine.powerType === 'Termico' ? 'Diesel' : (machine.powerType || 'Diesel')}
                </span>
              </div>
            </div>

            {/* Categoria */}
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-slate-400" />
              <div className="flex flex-col leading-none">
                <span className="text-[9px] uppercase text-slate-400 font-bold tracking-wide">Cat.</span>
                <span className="font-bold text-slate-700 text-xs truncate max-w-[80px]" title={typeof machine.category === 'string' ? machine.category : ''}>
                  {typeof machine.category === 'string' ? machine.category : 'Standard'}
                </span>
              </div>
            </div>

            {/* Hours */}
            {safeHours > 0 ? (
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-slate-400" />
                <div className="flex flex-col leading-none">
                  <span className="text-[9px] uppercase text-slate-400 font-bold tracking-wide">Ore</span>
                  <span className="font-bold text-slate-700 text-xs">{safeHours} h</span>
                </div>
              </div>
            ) : null}
            
          </div>

          <div className="mt-auto space-y-3">
            {/* Price */}
            {showPrices && (safePrice > 0 || machine.rentalPrice) && (
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-bold text-slate-400">da</span>
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  {(machine.type === 'rental' || machine.type === 'rent') && machine.rentalPrice 
                    ? machine.rentalPrice 
                    : safePrice > 0
                      ? `€ ${safePrice.toLocaleString('it-IT')}`
                      : 'Trattativa Riservata'}
                </span>
              </div>
            )}

            <Link 
              to={`/macchina/${machine.id}`}
              className="w-full bg-slate-900 text-white hover:bg-orange-600 py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all group/btn"
            >
              Dettagli
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
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