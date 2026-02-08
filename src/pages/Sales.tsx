
import React, { useState } from 'react';
import { MACHINES_DATA } from '../constants';
import MachineCard from '../components/MachineCard';
import { Filter, Search } from 'lucide-react';

const Sales: React.FC = () => {
  const [filter, setFilter] = useState<string>('Tutti');
  const [searchQuery, setSearchQuery] = useState('');

  const saleMachines = MACHINES_DATA.filter(m => m.type === 'sale' || m.type === 'both');
  
  const filteredMachines = saleMachines.filter(m => {
    const matchesCategory = filter === 'Tutti' || m.category === filter;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         m.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['Tutti', 'Mini', 'Medio', 'Pesante'];

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic mb-6">
            Vendita <span className="text-orange-600">Escavatori</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl text-lg">
            Sfoglia il nostro catalogo di macchinari usati e nuovi. Ogni mezzo è certificato e garantito per offrirti il massimo della resa operativa.
          </p>
        </header>

        {/* Filters */}
        <div className="bg-zinc-950 p-6 rounded-2xl mb-12 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            <Filter className="text-orange-500 shrink-0" size={20} />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full font-bold uppercase tracking-wider text-xs transition-all whitespace-nowrap ${
                  filter === cat ? 'bg-orange-600 text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input
              type="text"
              placeholder="Cerca marca o modello..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border-none rounded-full py-3 pl-12 pr-6 text-white focus:ring-2 focus:ring-orange-600 outline-none"
            />
          </div>
        </div>

        {/* Results */}
        {filteredMachines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMachines.map((machine) => (
              <MachineCard key={machine.id} machine={machine} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-zinc-400 text-xl italic font-light">Nessun macchinario trovato con questi criteri.</p>
            <button onClick={() => {setFilter('Tutti'); setSearchQuery('');}} className="mt-4 text-orange-600 font-bold underline">Resetta filtri</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;
