import React, { useState } from 'react';
import { useData, type MachineCategory } from '../../context/DataContext';
import { Plus, Trash2, Edit2, Check, X, FolderTree } from 'lucide-react';

const MachineCategoriesManager: React.FC = () => {
    const { machineCategories, addMachineCategory, updateMachineCategory, deleteMachineCategory } = useData();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newName, setNewName] = useState('');
    const [editName, setEditName] = useState('');

    const handleAdd = async () => {
        if (!newName.trim()) return;
        await addMachineCategory({ id: '', name: newName.trim() });
        setNewName('');
        setIsAdding(false);
    };

    const handleUpdate = async (id: string) => {
        if (!editName.trim()) return;
        await updateMachineCategory(id, { id, name: editName.trim() });
        setEditingId(null);
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Sei sicuro di voler eliminare la categoria "${name}"?`)) {
            await deleteMachineCategory(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
                        <FolderTree size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">Categorie Macchine</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Definisci i tipi di macchinario (es. Gru, Escavatori)</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-amber-500 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-600 flex items-center gap-2 transition-all shadow-xl shadow-amber-500/30 active:scale-95"
                >
                    <Plus size={20} /> AGGIUNGI
                </button>
            </div>

            <div className="grid gap-4">
                {isAdding && (
                    <div className="bg-white p-4 rounded-[24px] shadow-sm border-2 border-amber-500/20 flex items-center gap-4 animate-in slide-in-from-top-4 duration-300">
                        <input
                            autoFocus
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Nome Categoria (es. Gru)"
                            className="flex-grow p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        />
                        <button onClick={handleAdd} className="p-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all">
                            <Check size={20} />
                        </button>
                        <button onClick={() => setIsAdding(false)} className="p-4 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200 transition-all">
                            <X size={20} />
                        </button>
                    </div>
                )}

                {machineCategories.map((cat) => (
                    <div key={cat.id} className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-4 group">
                        {editingId === cat.id ? (
                            <>
                                <input
                                    autoFocus
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="flex-grow p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                                <button onClick={() => handleUpdate(cat.id)} className="p-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all">
                                    <Check size={20} />
                                </button>
                                <button onClick={() => setEditingId(null)} className="p-4 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200 transition-all">
                                    <X size={20} />
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="p-4 bg-slate-50 rounded-2xl uppercase font-black text-slate-400 text-xs">ID: {cat.id.slice(-4)}</div>
                                <div className="flex-grow">
                                    <h3 className="font-black text-xl italic uppercase text-slate-900">{cat.name}</h3>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                                        className="p-3 text-sky-500 bg-sky-50 hover:bg-sky-100 rounded-xl transition-all"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat.id, cat.name)}
                                        className="p-3 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {machineCategories.length === 0 && !isAdding && (
                    <div className="text-center py-12 bg-slate-50/50 rounded-[40px] border-4 border-dashed border-slate-100">
                        <FolderTree size={40} className="mx-auto text-slate-200 mb-2" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nessuna categoria definita</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MachineCategoriesManager;
