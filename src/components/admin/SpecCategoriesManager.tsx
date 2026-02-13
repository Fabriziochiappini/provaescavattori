import React, { useState } from 'react';
import { useData, type SpecCategory } from '../../context/DataContext';
import { Settings, Plus, Trash2, GripVertical, Check, X } from 'lucide-react';
import { Reorder } from 'framer-motion';

const SpecCategoriesManager: React.FC = () => {
    const { specCategories, addSpecCategory, updateSpecCategory, deleteSpecCategory } = useData();
    const [isAdding, setIsAdding] = useState(false);
    const [newCatName, setNewCatName] = useState('');

    const handleAdd = async () => {
        if (!newCatName.trim()) return;
        await addSpecCategory({
            id: '',
            name: newCatName.trim(),
            order: specCategories.length + 1
        });
        setNewCatName('');
        setIsAdding(false);
    };

    const handleReorder = (newOrder: SpecCategory[]) => {
        newOrder.forEach((cat, index) => {
            if (cat.order !== index + 1) {
                updateSpecCategory(cat.id, { ...cat, order: index + 1 });
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">Filtri Variabili</h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Gestisci le caratteristiche personalizzate per i tuoi mezzi</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-amber-500 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-600 flex items-center gap-2 transition-all shadow-xl shadow-amber-500/30 active:scale-95"
                    >
                        <Plus size={18} /> AGGIUNGI FILTRO
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-[32px] border-2 border-amber-500/20 shadow-xl animate-in zoom-in-95 duration-200">
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest px-1">Nome Caratteristica (es. Portata, Altezza)</label>
                    <div className="flex gap-4">
                        <input
                            autoFocus
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            className="flex-grow p-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
                            placeholder="es. Portata (kg)"
                        />
                        <button onClick={handleAdd} className="bg-emerald-500 text-white p-4 rounded-2xl hover:bg-emerald-600 transition-all active:scale-90">
                            <Check size={20} />
                        </button>
                        <button onClick={() => setIsAdding(false)} className="bg-slate-100 text-slate-400 p-4 rounded-2xl hover:bg-slate-200 transition-all active:scale-90">
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}

            <Reorder.Group axis="y" values={specCategories} onReorder={handleReorder} className="space-y-3">
                {specCategories.map((cat) => (
                    <Reorder.Item
                        key={cat.id}
                        value={cat}
                        className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-4 group cursor-grab active:cursor-grabbing hover:shadow-lg hover:shadow-slate-200/30 transition-all"
                    >
                        <GripVertical className="text-slate-300 group-hover:text-amber-500 transition-colors" size={20} />
                        <div className="flex-grow">
                            <span className="font-black text-slate-900 uppercase italic text-lg">{cat.name}</span>
                        </div>
                        <button
                            onClick={async () => {
                                if (window.confirm(`Sei sicuro di voler eliminare "${cat.name}"? Questo non cancellerà i dati già salvati nelle macchine, ma non saranno più gestibili.`)) {
                                    await deleteSpecCategory(cat.id);
                                }
                            }}
                            className="p-3 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all active:scale-90 opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={18} />
                        </button>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            {specCategories.length === 0 && !isAdding && (
                <div className="text-center py-20 bg-slate-50/50 rounded-[40px] border-4 border-dashed border-slate-100">
                    <Settings size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest">Nessuna categoria variabile configurata</p>
                </div>
            )}
        </div>
    );
};

export default SpecCategoriesManager;
