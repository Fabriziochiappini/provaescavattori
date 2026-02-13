
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Machine } from '../types';
import MachineCard from '../components/MachineCard';
import { Clock, Shield, Zap, Filter, Search } from 'lucide-react';

const Rental: React.FC = () => {
  const { excavators, specCategories, machineCategories } = useData();
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

  const rentalMachines = machines.filter(m => m.type === 'rent' || m.type === 'both');

  const brands = ['Tutte', ...new Set(rentalMachines.map(m => m.brand).filter(Boolean))];

  // Pre-filter for Category/Brand/Power/Search to determine which SPEC FILTERS to show
  const machinesInView = rentalMachines.filter(m => {
    const matchesCategory = activeCategory === 'Tutti' || m.category === activeCategory;
    const matchesBrand = selectedBrand === 'Tutte' || m.brand === selectedBrand;
    const matchesPower = selectedPower === 'Tutte' || m.powerType === selectedPower;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.model.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesBrand && matchesPower && matchesSearch;
  });

  const filteredMachines = machinesInView.filter(m => {
    // Check dynamic specs
    const matchesSpecs = Object.entries(selectedSpecs).every(([catId, value]) => {
      if (!value || value === 'Tutte') return true;
      return m.specs?.[catId] === value;
    });

    return matchesSpecs;
  });

  const categories = ['Tutti', ...machineCategories.map(c => c.name)];

  const getSpecOptions = (catId: string) => {
    // Only look at machines currently in view (respecting category/search)
    const options = machinesInView.map(m => m.specs?.[catId]).filter(Boolean);
    const uniqueOptions = Array.from(new Set(options)).sort((a, b) => parseFloat(a as string) - parseFloat(b as string));
    return ['Tutte', ...uniqueOptions];
  };

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic mb-6">
            NOLEGGIO <span className="text-orange-600">FLESSIBILE</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl text-lg">
            Soluzioni di noleggio a breve e lungo termine. Mezzi moderni, pronti all'uso e coperti da assistenza completa.
          </p>
        </header>

        {/* Advanced Filters */}
        <div className="bg-zinc-950 p-6 rounded-2xl mb-12">
          {/* Categories Bar */}
          <div className="flex items-center gap-4 overflow-x-auto w-full pb-6 no-scrollbar border-b border-zinc-800 mb-8">
            <Filter size={18} className="text-orange-500 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full font-bold uppercase tracking-wider text-[10px] transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-orange-600 text-black' : 'text-zinc-500 hover:text-white hover:bg-zinc-900 border border-zinc-900'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="relative">
              <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest px-1">Cerca</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input
                  type="text"
                  placeholder="Modello o marca..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border-none rounded-xl py-4 pl-12 pr-6 text-white text-xs focus:ring-1 focus:ring-orange-600 outline-none"
                />
              </div>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest px-1">Marca</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-zinc-900 border-none rounded-xl py-4 px-4 text-white text-xs focus:ring-1 focus:ring-orange-600 outline-none appearance-none"
              >
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* Power Type Filter */}
            <div>
              <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest px-1">Alimentazione</label>
              <select
                value={selectedPower}
                onChange={(e) => setSelectedPower(e.target.value)}
                className="w-full bg-zinc-900 border-none rounded-xl py-4 px-4 text-white text-xs focus:ring-1 focus:ring-orange-600 outline-none appearance-none"
              >
                <option value="Tutte">Tutte</option>
                <option value="Termico">Termico</option>
                <option value="Elettrico">Elettrico</option>
              </select>
            </div>

            {/* Dynamic Specs Filters */}
            {specCategories.map(cat => {
              const options = getSpecOptions(cat.id);
              if (options.length <= 1) return null;
              return (
                <div key={cat.id}>
                  <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest px-1">{cat.name}</label>
                  <select
                    value={selectedSpecs[cat.id] || 'Tutte'}
                    onChange={(e) => setSelectedSpecs(prev => ({ ...prev, [cat.id]: e.target.value }))}
                    className="w-full bg-zinc-900 border-none rounded-xl py-4 px-4 text-white text-xs focus:ring-1 focus:ring-orange-600 outline-none appearance-none"
                  >
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMachines.map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>

        {filteredMachines.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-zinc-500 text-xl font-light italic">Nessun mezzo disponibile per i criteri selezionati.</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 bg-zinc-950 rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-3xl font-black text-white uppercase italic mb-2">HAI BISOGNO DI UN'INTERA FLOTTA?</h3>
            <p className="text-zinc-400">Offriamo quotazioni personalizzate per noleggi di più mezzi e per lunghe durate.</p>
          </div>
          <button className="bg-orange-600 hover:bg-orange-700 text-black font-black px-10 py-5 rounded-full whitespace-nowrap transition-all shadow-xl shadow-orange-600/20">
            RICHIEDI PREVENTIVO FLOTTA
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rental;
