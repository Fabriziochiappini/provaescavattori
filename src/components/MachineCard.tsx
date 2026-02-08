
import React from 'react';
import { Link } from 'react-router-dom';
import { Machine } from '../types';
import { ChevronRight, Zap, Scale, Clock } from 'lucide-react';

interface MachineCardProps {
  machine: Machine;
}

const MachineCard: React.FC<MachineCardProps> = ({ machine }) => {
  return (
    <div className="group bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-64 overflow-hidden">
        <img
          src={machine.imageUrl}
          alt={machine.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {machine.type === 'sale' || machine.type === 'both' ? (
            <span className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider shadow-lg">In Vendita</span>
          ) : null}
          {machine.type === 'rental' || machine.type === 'both' ? (
            <span className="bg-orange-500 text-black text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider shadow-lg">Disponibile a Noleggio</span>
          ) : null}
        </div>
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-zinc-300 text-xs italic line-clamp-2">{machine.description}</p>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-orange-600 text-xs font-bold uppercase tracking-widest mb-1">{machine.brand}</p>
            <h3 className="text-xl font-bold text-zinc-900 leading-tight group-hover:text-orange-600 transition-colors">{machine.name}</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <Scale size={16} className="text-orange-500" />
            <span>{machine.weight} Tonnellate</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <Zap size={16} className="text-orange-500" />
            <span>{machine.category}</span>
          </div>
          {machine.hours && (
            <div className="flex items-center gap-2 text-zinc-500 text-sm">
              <Clock size={16} className="text-orange-500" />
              <span>{machine.hours} h</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-tighter">A partire da</p>
            <p className="text-xl font-extrabold text-zinc-900">
              {machine.type === 'rental' ? machine.rentalPrice : `€ ${machine.price?.toLocaleString()}`}
            </p>
          </div>
          <Link
            to="/contatti"
            className="bg-zinc-950 hover:bg-orange-600 text-white hover:text-black p-3 rounded-full transition-all duration-300"
          >
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MachineCard;
