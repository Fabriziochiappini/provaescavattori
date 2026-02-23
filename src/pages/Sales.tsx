
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Machine } from '../types';
import MachineCard from '../components/MachineCard';
import { Filter, Search } from 'lucide-react';

const Sales: React.FC = () => {
  const { excavators, specCategories, machineCategories } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('Tutti');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Tutte');
  const [selectedPower, setSelectedPower] = useState('Tutte');
  // Dynamic Specs Filter State
  const [activeSpecId, setActiveSpecId] = useState<string>('');
  const [activeSpecValue, setActiveSpecValue] = useState<string>('Tutte');
  
  // Pagination State
  const [visibleCount, setVisibleCount] = useState(12);

  // Transform Excavators (DB) to Machines (UI)
  const machines: any[] = excavators.map(exc => ({
    ...exc,
    id: exc.id,
    imageUrl: exc.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image',
    category: exc.category || 'Altro',
    model: exc.model || exc.name,
  }));

  const saleMachines = machines
    .filter(m => m.type === 'sale' || m.type === 'both')
    .sort((a, b) => {
      const getTime = (t: any) => {
        if (!t) return 0;
        if (typeof t === 'number') return t;
        if (typeof t?.toMillis === 'function') return t.toMillis();
        if (t?.seconds) return t.seconds * 1000;
        return 0;
      };
      const timeA = getTime(a.createdAt);
      const timeB = getTime(b.createdAt);
      if (timeA !== timeB) return timeB - timeA;
      return 0;
    });

  const brands = ['Tutte', ...new Set(saleMachines.map(m => m.brand).filter(Boolean))];

  // Pre-filter for Category/Brand/Power/Search to determine which SPEC FILTERS to show
  const machinesInView = saleMachines.filter(m => {
    const matchesCategory = activeCategory === 'Tutti' || m.category === activeCategory;
    const matchesBrand = selectedBrand === 'Tutte' || m.brand === selectedBrand;
    const matchesPower = selectedPower === 'Tutte' || 
      m.powerType === selectedPower || 
      (selectedPower === 'DIESEL' && m.powerType === 'Termico');
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.model.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesBrand && matchesPower && matchesSearch;
  });

  const filteredMachines = machinesInView.filter(m => {
    // Check dynamic spec filter
    if (!activeSpecId || !activeSpecValue || activeSpecValue === 'Tutte') return true;
    return m.specs?.[activeSpecId] === activeSpecValue;
  });

  const categories = ['Tutti', ...machineCategories.map(c => c.name)];

  // Get unique values for the CURRENTLY SELECTED spec category
  const getActiveSpecOptions = () => {
    if (!activeSpecId) return [];
    
    // Only look at machines currently in view (respecting category/search)
    const options = machinesInView.map(m => m.specs?.[activeSpecId]).filter(Boolean);
    const uniqueOptions = Array.from(new Set(options)).sort((a, b) => parseFloat(a as string) - parseFloat(b as string));
    return ['Tutte', ...uniqueOptions];
  };

  // Get available spec categories that actually have values in current view
  const availableSpecCategories = specCategories.filter(cat => {
    const options = machinesInView.map(m => m.specs?.[cat.id]).filter(Boolean);
    const uniqueOptions = new Set(options);
    return uniqueOptions.size > 0;
  });

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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative col-span-2 md:col-span-2">
              <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest px-1">Cerca Modello</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input
                  type="text"
                  placeholder="Marca o modello..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border-none rounded-xl py-3 pl-10 pr-4 text-white text-xs focus:ring-1 focus:ring-orange-600 outline-none"
                />
              </div>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest px-1">Marca</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-zinc-900 border-none rounded-xl py-3 px-3 text-white text-xs focus:ring-1 focus:ring-orange-600 outline-none appearance-none"
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
                className="w-full bg-zinc-900 border-none rounded-xl py-3 px-3 text-white text-xs focus:ring-1 focus:ring-orange-600 outline-none appearance-none"
              >
                <option value="Tutte">Tutte</option>
                <option value="DIESEL">Diesel</option>
                <option value="ELETTRICO">Elettrico</option>
                <option value="BENZINA">Benzina</option>
                <option value="IBRIDO">Ibrido</option>
              </select>
            </div>

            {/* Dynamic Specs Filter Selector */}
            <div>
              <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest px-1">Specifica</label>
              <select
                value={activeSpecId}
                onChange={(e) => {
                  setActiveSpecId(e.target.value);
                  setActiveSpecValue('Tutte');
                }}
                className="w-full bg-zinc-900 border-none rounded-xl py-3 px-3 text-white text-xs focus:ring-1 focus:ring-orange-600 outline-none appearance-none"
              >
                <option value="">Nessuna</option>
                {availableSpecCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>

            {/* Dynamic Spec Value Selector */}
            {activeSpecId && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest px-1 truncate">
                  Valore {specCategories.find(c => c.id === activeSpecId)?.name}
                </label>
                <select
                  value={activeSpecValue}
                  onChange={(e) => setActiveSpecValue(e.target.value)}
                  className="w-full bg-zinc-900 border-none rounded-xl py-3 px-3 text-white text-xs focus:ring-1 focus:ring-orange-600 outline-none appearance-none"
                >
                  {getActiveSpecOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            )}
          </div>

          {(activeCategory !== 'Tutti' || searchQuery || selectedBrand !== 'Tutte' || selectedPower !== 'Tutte' || (activeSpecId && activeSpecValue !== 'Tutte')) && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setActiveCategory('Tutti');
                  setSearchQuery('');
                  setSelectedBrand('Tutte');
                  setSelectedPower('Tutte');
                  setActiveSpecId('');
                  setActiveSpecValue('Tutte');
                  setVisibleCount(12);
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMachines.slice(0, visibleCount).map((machine) => (
                <MachineCard key={machine.id} machine={machine} />
              ))}
            </div>
            
            {visibleCount < filteredMachines.length && (
              <div className="mt-12 text-center">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  className="bg-zinc-900 text-white hover:bg-orange-600 px-8 py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg"
                >
                  Carica Altri
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-zinc-400 text-xl italic font-light">Nessun macchinario trovato con questi criteri.</p>
            <button onClick={() => { setActiveCategory('Tutti'); setSearchQuery(''); setSelectedBrand('Tutte'); setSelectedPower('Tutte'); setActiveSpecId(''); setActiveSpecValue('Tutte'); setVisibleCount(12); }} className="mt-4 text-orange-600 font-bold underline italic">Resetta filtri</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;
