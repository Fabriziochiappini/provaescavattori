
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Machine } from '../types';
import MachineCard from '../components/MachineCard';
import { Filter, Search } from 'lucide-react';

const Sales: React.FC = () => {
  const { excavators, specCategories } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('Tutti');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Tutte');
  const [selectedPower, setSelectedPower] = useState('Tutte');
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({});

  // Transform Excavators (DB) to Machines (UI)
  const machines: any[] = excavators.map(exc => ({
    ...exc,
    id: exc.id,
    imageUrl: exc.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image',
    category: exc.category || 'Altro',
    model: exc.model || exc.name,
  }));

  const saleMachines = machines.filter(m => m.type === 'sale' || m.type === 'both');

  const brands = ['Tutte', ...new Set(saleMachines.map(m => m.brand).filter(Boolean))];

  const filteredMachines = saleMachines.filter(m => {
    const matchesCategory = activeCategory === 'Tutti' || m.category === activeCategory;
    const matchesBrand = selectedBrand === 'Tutte' || m.brand === selectedBrand;
    const matchesPower = selectedPower === 'Tutte' || m.powerType === selectedPower;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.model.toLowerCase().includes(searchQuery.toLowerCase());

    // Check dynamic specs
    const matchesSpecs = Object.entries(selectedSpecs).every(([catId, value]) => {
      if (!value || value === 'Tutte') return true;
      return m.specs?.[catId] === value;
    });

    return matchesCategory && matchesBrand && matchesPower && matchesSearch && matchesSpecs;
  });

  const categories = ['Tutti', 'Mini', 'Medio', 'Pesante', 'Specialistico'];

  // Get unique values for each spec category to build filter selects
  const getSpecOptions = (catId: string) => {
    const options = saleMachines.map(m => m.specs?.[catId]).filter(Boolean);
    return ['Tutte', ...new Set(options)];
  };

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic mb-6">
            VENDITA <span className="text-orange-600">NUOVO E USATO</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl text-lg">
            Sfoglia il nostro catalogo di macchine nuove e usate. Ogni mezzo è certificato e garantito per offrirti il massimo.
          </p>
        </header>

        {/* Categories Bar */}
        <div className="flex items-center gap-4 overflow-x-auto w-full pb-6 no-scrollbar border-b border-zinc-100 mb-8">
          <Filter className="text-orange-500 shrink-0" size={20} />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-bold uppercase tracking-wider text-xs transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-orange-600 text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters Grid */}
        <div className="bg-zinc-950 p-6 rounded-2xl mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="relative">
              <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest px-1">Cerca Modello</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="text"
                  placeholder="Marca o modello..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border-none rounded-xl py-4 pl-12 pr-6 text-white text-sm focus:ring-2 focus:ring-orange-600 outline-none"
                />
              </div>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest px-1">Marca</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-zinc-900 border-none rounded-xl py-4 px-4 text-white text-sm focus:ring-2 focus:ring-orange-600 outline-none appearance-none"
              >
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* Power Type */}
            <div>
              <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest px-1">Alimentazione</label>
              <select
                value={selectedPower}
                onChange={(e) => setSelectedPower(e.target.value)}
                className="w-full bg-zinc-900 border-none rounded-xl py-4 px-4 text-white text-sm focus:ring-2 focus:ring-orange-600 outline-none appearance-none"
              >
                <option value="Tutte">Tutte</option>
                <option value="Termico">Termico</option>
                <option value="Elettrico">Elettrico</option>
              </select>
            </div>

            {/* Dynamic Specs Filters */}
            {specCategories.map(cat => {
              const options = getSpecOptions(cat.id);
              if (options.length <= 1) return null; // Only show if there are actual values
              return (
                <div key={cat.id}>
                  <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest px-1">{cat.name}</label>
                  <select
                    value={selectedSpecs[cat.id] || 'Tutte'}
                    onChange={(e) => setSelectedSpecs(prev => ({ ...prev, [cat.id]: e.target.value }))}
                    className="w-full bg-zinc-900 border-none rounded-xl py-4 px-4 text-white text-sm focus:ring-2 focus:ring-orange-600 outline-none appearance-none"
                  >
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              );
            })}
          </div>

          {(activeCategory !== 'Tutti' || searchQuery || selectedBrand !== 'Tutte' || selectedPower !== 'Tutte' || Object.values(selectedSpecs).some(v => v !== 'Tutte')) && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setActiveCategory('Tutti');
                  setSearchQuery('');
                  setSelectedBrand('Tutte');
                  setSelectedPower('Tutte');
                  setSelectedSpecs({});
                }}
                className="text-orange-600 text-[10px] font-black uppercase tracking-widest hover:underline"
              >
                Reset Filtri
              </button>
            </div>
          )}
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
            <button onClick={() => { setActiveCategory('Tutti'); setSearchQuery(''); setSelectedBrand('Tutte'); setSelectedPower('Tutte'); setSelectedSpecs({}); }} className="mt-4 text-orange-600 font-bold underline italic">Resetta filtri</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;
