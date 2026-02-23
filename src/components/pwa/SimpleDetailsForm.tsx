import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { uploadMachine } from '../../services/pwaUpload';
import { clearPhotos } from '../../services/pwaStorage';
import { useData } from '../../context/DataContext';
import { Loader2, CheckCircle, AlertCircle, ChevronRight, ChevronLeft, Plus, X, Settings, Info } from 'lucide-react';

export const SimpleDetailsForm: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { machineCategories, specCategories } = useData();
    const orderedIds = location.state?.orderedIds as string[] || [];

    const [currentStep, setCurrentStep] = useState<1 | 2>(1);
    const [formData, setFormData] = useState({
        model: '',
        brand: '',
        type: 'sale' as 'sale' | 'rental',
        price: '',
        category: '',
        condition: 'NUOVO' as 'NUOVO' | 'USATO' | 'OTTIME CONDIZIONI',
        powerType: 'DIESEL',
        rentalPrice: '',
        description: '',
        features: [] as string[],
        specs: {} as Record<string, string>,
    });

    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        setError(null);

        try {
            await uploadMachine({
                ...formData,
                price: Number(formData.price),
                type: formData.type as 'sale' | 'rental',
            }, orderedIds);

            await clearPhotos();
            setIsSuccess(true);
            setTimeout(() => {
                navigate('/admin/pwa');
            }, 2000);
        } catch (err: any) {
            console.error('Upload Error Details:', err);
            setError(`Errore: ${err.message || 'Riprova più tardi'}`);
            setIsUploading(false);
        }
    };

    const handleSpecChange = (specId: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            specs: {
                ...prev.specs,
                [specId]: value
            }
        }));
    };

    const handleAddFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, '']
        }));
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const handleRemoveFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-white p-4">
                <div className="bg-green-500 p-6 rounded-full shadow-2xl shadow-green-500/40 mb-8 animate-in zoom-in spin-in-12 duration-700">
                    <CheckCircle className="w-16 h-16 text-white" strokeWidth={3} />
                </div>
                <h2 className="text-3xl font-black text-zinc-900 mb-2 uppercase tracking-tight">Fatto!</h2>
                <p className="text-zinc-500 text-center font-medium">Macchina caricata con successo.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="p-6 border-b bg-white/80 backdrop-blur-md safe-area-top sticky top-0 z-20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => currentStep === 1 ? navigate(-1) : setCurrentStep(1)} className="p-2 -ml-2 text-zinc-400">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight">
                        {currentStep === 1 ? 'Dati Essenziali' : 'Specifiche & Extra'}
                    </h2>
                </div>
                <div className="flex gap-1">
                    <div className={`w-2 h-2 rounded-full ${currentStep === 1 ? 'bg-amber-500' : 'bg-zinc-200'}`}></div>
                    <div className={`w-2 h-2 rounded-full ${currentStep === 2 ? 'bg-amber-500' : 'bg-zinc-200'}`}></div>
                </div>
            </div>

            <div className="flex-1 p-4 pb-32">
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3 border border-red-100">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {currentStep === 1 ? (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-zinc-400 mb-2 px-1">Marca</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-4 rounded-2xl border-2 border-zinc-100 bg-white focus:border-amber-500 transition-all font-bold outline-none"
                                    value={formData.brand}
                                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                    placeholder="Caterpillar"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-zinc-400 mb-2 px-1">Modello</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-4 rounded-2xl border-2 border-zinc-100 bg-white focus:border-amber-500 transition-all font-bold outline-none"
                                    value={formData.model}
                                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                                    placeholder="320 GC"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2 px-1">Categoria</label>
                            <select
                                required
                                className="w-full p-4 rounded-2xl border-2 border-zinc-100 bg-white focus:border-amber-500 transition-all font-bold outline-none appearance-none"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="">Seleziona Categoria</option>
                                {machineCategories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2 px-1">Tipo Offerta</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'sale' })}
                                    className={`p-4 rounded-xl text-center font-black transition-all ${formData.type === 'sale' ? 'bg-amber-500 text-white shadow-lg' : 'bg-white text-zinc-400 border-2 border-zinc-100'}`}
                                >
                                    VENDITA
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'rental' })}
                                    className={`p-4 rounded-xl text-center font-black transition-all ${formData.type === 'rental' ? 'bg-zinc-900 text-white shadow-lg' : 'bg-white text-zinc-400 border-2 border-zinc-100'}`}
                                >
                                    NOLEGGIO
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-zinc-400 mb-2 px-1">
                                    {formData.type === 'sale' ? 'Prezzo Prezzo (€)' : 'Prezzo (Libero)'}
                                </label>
                                {formData.type === 'sale' ? (
                                    <input
                                        type="number"
                                        className="w-full p-4 rounded-2xl border-2 border-zinc-100 bg-white focus:border-amber-500 transition-all font-bold outline-none"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        className="w-full p-4 rounded-2xl border-2 border-zinc-100 bg-white focus:border-amber-500 transition-all font-bold outline-none"
                                        value={formData.rentalPrice}
                                        onChange={e => setFormData({ ...formData, rentalPrice: e.target.value })}
                                        placeholder="es. 150€ / gg"
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-zinc-400 mb-2 px-1">Condizione</label>
                                <select
                                    className="w-full p-4 rounded-2xl border-2 border-zinc-100 bg-white focus:border-amber-500 transition-all font-bold outline-none appearance-none"
                                    value={formData.condition}
                                    onChange={e => setFormData({ ...formData, condition: e.target.value as any })}
                                >
                                    <option value="NUOVO">NUOVO</option>
                                    <option value="USATO">USATO</option>
                                    <option value="OTTIME CONDIZIONI">OTTIME CONDIZIONI</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2 px-1">Alimentazione</label>
                            <select
                                className="w-full p-4 rounded-2xl border-2 border-zinc-100 bg-white focus:border-amber-500 transition-all font-bold outline-none appearance-none"
                                value={formData.powerType}
                                onChange={e => setFormData({ ...formData, powerType: e.target.value })}
                            >
                                <option value="DIESEL">DIESEL</option>
                                <option value="ELETTRICO">ELETTRICO</option>
                                <option value="BENZINA">BENZINA</option>
                                <option value="IBRIDO">IBRIDO</option>
                            </select>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Settings className="w-4 h-4 text-amber-500" />
                                <label className="block text-xs font-bold uppercase text-zinc-400 tracking-widest">Specifiche Tecniche</label>
                            </div>
                            <div className="grid grid-cols-1 gap-4 bg-zinc-100/50 p-4 rounded-2xl">
                                {specCategories.map(cat => (
                                    <div key={cat.id} className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-zinc-400 ml-1 uppercase">{cat.name}</span>
                                        <input
                                            type="text"
                                            className="w-full p-3 rounded-xl border border-zinc-200 bg-white focus:border-amber-500 transition-all font-bold text-sm outline-none"
                                            value={formData.specs[cat.id] || ''}
                                            onChange={e => handleSpecChange(cat.id, e.target.value)}
                                            placeholder="Inserisci valore"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Plus className="w-4 h-4 text-amber-500" />
                                    <label className="block text-xs font-bold uppercase text-zinc-400 tracking-widest">Accessori & Extra</label>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddFeature}
                                    className="text-[10px] font-black bg-amber-500 text-white px-3 py-1 rounded-full uppercase transition-all active:scale-90"
                                >
                                    + Aggiungi
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formData.features.map((feat, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            className="flex-1 p-3 rounded-xl border border-zinc-200 bg-white font-bold text-sm outline-none"
                                            value={feat}
                                            onChange={e => handleFeatureChange(idx, e.target.value)}
                                            placeholder="es. Attacco rapido"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFeature(idx)}
                                            className="p-2 text-red-500 bg-red-50 rounded-xl"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {formData.features.length === 0 && (
                                    <p className="text-center py-4 text-xs text-zinc-400 italic">Nessun accessorio aggiunto</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2 px-1">Descrizione</label>
                            <textarea
                                className="w-full p-4 rounded-2xl border-2 border-zinc-200 bg-white focus:border-amber-500 transition-all font-medium text-sm outline-none resize-none"
                                rows={4}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Descrivi brevemente lo stato e le caratteristiche..."
                            />
                        </div>

                        <div className="bg-amber-50 p-4 rounded-2xl flex gap-3 border border-amber-100">
                            <Info className="w-5 h-5 text-amber-500 flex-shrink-0" />
                            <p className="text-[10px] text-amber-800 font-medium leading-relaxed uppercase">
                                I dati compilati qui saranno immediatamente visibili sul sito web. Assicurati che le specifiche siano corrette per i filtri di ricerca.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 bg-white safe-area-bottom fixed bottom-0 left-0 right-0 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] z-20">
                {currentStep === 1 ? (
                    <button
                        onClick={() => {
                            if (!formData.brand || !formData.model || !formData.category) {
                                alert("Compila i campi obbligatori (Marca, Modello, Categoria)");
                                return;
                            }
                            setCurrentStep(2);
                        }}
                        className="w-full bg-zinc-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-black active:scale-95 transition-all text-lg uppercase tracking-tight"
                    >
                        PROSEGUI <ChevronRight className="w-6 h-6" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={isUploading}
                        className="w-full bg-amber-500 text-black py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-amber-600 disabled:opacity-50 shadow-xl shadow-amber-500/20 active:scale-95 transition-all text-lg uppercase tracking-tight"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                CARICAMENTO...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-6 h-6" />
                                PUBBLICA ORA
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};
