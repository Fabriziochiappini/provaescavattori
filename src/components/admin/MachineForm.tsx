import React, { useState, useEffect } from 'react';
import { Excavator, useData } from '../../context/DataContext';
import ImageUploader from '../ImageUploader';
import { Reorder } from 'framer-motion';
import { X, GripVertical, Trash2, Plus, Save, ArrowLeft } from 'lucide-react';

interface MachineFormProps {
    initialData?: Excavator | null;
    onSave: (data: Excavator) => Promise<void>;
    onCancel: () => void;
}

const MachineForm: React.FC<MachineFormProps> = ({ initialData, onSave, onCancel }) => {
    const { uploadImage, deleteImage, specCategories } = useData();
    const [formData, setFormData] = useState<Partial<Excavator>>({
        type: 'sale',
        category: 'Mini',
        features: [],
        images: [],
        available: true,
        condition: 5,
        powerType: 'Termico',
        specs: {}
    });

    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState<1 | 2 | 3>(1);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setImages(initialData.images || []);
            if (initialData.imageUrl && (!initialData.images || initialData.images.length === 0)) {
                setImages([initialData.imageUrl]);
            }
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('spec_')) {
            const specId = name.replace('spec_', '');
            setFormData(prev => ({
                ...prev,
                specs: {
                    ...(prev.specs || {}),
                    [specId]: value
                }
            }));
            return;
        }
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'weight' || name === 'hours' || name === 'year' || name === 'condition'
                ? parseFloat(value) || 0
                : value
        }));
    };

    const handleFeatureAdd = () => {
        setFormData(prev => ({
            ...prev,
            features: [...(prev.features || []), '']
        }));
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...(formData.features || [])];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const handleFeatureRemove = (index: number) => {
        const newFeatures = [...(formData.features || [])];
        newFeatures.splice(index, 1);
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const handleImageUpload = async (file: File) => {
        try {
            const url = await uploadImage(file, 'excavators');
            setImages(prev => [...prev, url]);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Errore caricamento immagine");
        }
    };

    const handleImageDelete = async (url: string) => {
        if (window.confirm("Eliminare questa immagine?")) {
            await deleteImage(url);
            setImages(prev => prev.filter(img => img !== url));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.brand) return alert("Compila i campi obbligatori!");

        setLoading(true);
        try {
            const finalData: Excavator = {
                ...formData as Excavator,
                images: images,
                imageUrl: images[0] || '', // Main image is the first one
            };

            // Generate ID if new
            if (!finalData.id) finalData.id = Date.now().toString();

            await onSave(finalData);
        } catch (error) {
            console.error(error);
            alert("Errore durante il salvataggio");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Compact Header for Tab Navigation */}
            <div className="flex gap-2 w-full overflow-x-auto no-scrollbar pb-4 mb-6 border-b border-gray-100 dark:border-gray-700">
                <button
                    type="button"
                    onClick={() => setActiveSection(1)}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeSection === 1 ? 'bg-amber-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    1. Info
                </button>
                <button
                    type="button"
                    onClick={() => setActiveSection(2)}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeSection === 2 ? 'bg-amber-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    2. Galleria
                </button>
                <button
                    type="button"
                    onClick={() => setActiveSection(3)}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeSection === 3 ? 'bg-amber-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    3. Dati
                </button>
            </div>

            <form onSubmit={handleSubmit}>

                {/* SECTION 1: MAIN INFO */}
                {activeSection === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Marca *</label>
                                <input
                                    name="brand"
                                    value={formData.brand || ''}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-amber-500 dark:text-white"
                                    placeholder="es. Caterpillar, Kubota"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Modello *</label>
                                <input
                                    name="name"
                                    value={formData.name || ''}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-amber-500 dark:text-white"
                                    placeholder="es. 320 GC"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descrizione Commerciale</label>
                            <textarea
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                                rows={6}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-amber-500 dark:text-white"
                                placeholder="Descrivi i punti di forza della macchina..."
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setActiveSection(2)}
                                className="w-full md:w-auto px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
                            >
                                Avanti: Galleria
                            </button>
                        </div>
                    </div>
                )}

                {/* SECTION 2: GALLERY */}
                {activeSection === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-200 text-sm flex items-center gap-2">
                            <span className="material-icons-outlined">info</span>
                            Trascina le immagini per riordinarle. La prima immagine sarà la copertina.
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Carica Nuove</label>
                                <ImageUploader
                                    onUpload={handleImageUpload}
                                    multiple={true}
                                    label="Seleziona Foto"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Galleria Attuale ({images.length})</label>
                                <Reorder.Group axis="y" values={images} onReorder={setImages} className="space-y-2">
                                    {images.map((img) => (
                                        <Reorder.Item key={img} value={img} className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4 cursor-grab active:cursor-grabbing">
                                            <div className="text-gray-400"><GripVertical size={20} /></div>
                                            <img src={img} alt="preview" className="w-16 h-12 object-cover rounded-md pointer-events-none" />
                                            <div className="flex-grow text-xs text-gray-500 truncate">{img.split('%2F').pop()?.split('?')[0]}</div>
                                            <button
                                                type="button"
                                                onClick={() => handleImageDelete(img)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </Reorder.Item>
                                    ))}
                                </Reorder.Group>
                                {images.length === 0 && (
                                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                                        Nessuna immagine caricata
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col-reverse md:flex-row justify-between gap-3">
                            <button
                                type="button"
                                onClick={() => setActiveSection(1)}
                                className="w-full md:w-auto px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                Indietro
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveSection(3)}
                                className="w-full md:w-auto px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
                            >
                                Avanti: Dati Tecnici
                            </button>
                        </div>
                    </div>
                )}

                {/* SECTION 3: TECH DATA */}
                {activeSection === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tipo Offerta *</label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, type: 'sale' }))}
                                        className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${formData.type === 'sale' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-500'}`}
                                    >
                                        Vendita
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, type: 'rent' }))}
                                        className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${formData.type === 'rent' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500'}`}
                                    >
                                        Noleggio
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                                    {formData.type === 'sale' ? 'Prezzo Vendita (€)' : 'Prezzo Noleggio (Testo libero)'}
                                </label>
                                {formData.type === 'sale' ? (
                                    <input
                                        name="price"
                                        type="number"
                                        value={formData.price || ''}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-amber-500 dark:text-white"
                                    />
                                ) : (
                                    <input
                                        name="rentalPrice"
                                        type="text"
                                        value={formData.rentalPrice || ''}
                                        onChange={handleChange}
                                        placeholder="es. 150€ / giorno"
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Massa (t)</label>
                                <input name="weight" type="number" step="0.1" value={formData.weight || ''} onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Anno</label>
                                <input name="year" type="number" value={formData.year || ''} onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Ore</label>
                                <input name="hours" type="number" value={formData.hours || ''} onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Categoria</label>
                                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl">
                                    <option value="Mini">Mini (0-5t)</option>
                                    <option value="Medio">Medio (6-20t)</option>
                                    <option value="Pesante">Pesante (&gt;20t)</option>
                                    <option value="Specialistico">Specialistico</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Alimentazione</label>
                                <div className="flex gap-2">
                                    {['Termico', 'Elettrico'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, powerType: type as any }))}
                                            className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${formData.powerType === type ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-500'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {specCategories.length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Caratteristiche Variabili</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {specCategories.map(cat => (
                                        <div key={cat.id}>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">{cat.name}</label>
                                            <input
                                                name={`spec_${cat.id}`}
                                                value={formData.specs?.[cat.id] || ''}
                                                onChange={handleChange}
                                                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-amber-500 dark:text-white"
                                                placeholder={`Inserisci ${cat.name}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-2">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Caratteristiche & Accessori</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {formData.features?.map((feat, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            value={feat}
                                            onChange={(e) => handleFeatureChange(idx, e.target.value)}
                                            className="flex-grow p-2 bg-white border border-gray-200 rounded-lg text-sm"
                                            placeholder="es. Attacco rapido"
                                        />
                                        <button type="button" onClick={() => handleFeatureRemove(idx)} className="text-red-500 hover:text-red-700">
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleFeatureAdd}
                                    className="flex items-center justify-center gap-2 p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-amber-500 hover:text-amber-500 transition-colors"
                                >
                                    <Plus size={18} /> Aggiungi
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-900 rounded-xl">
                            <input
                                type="checkbox"
                                id="available"
                                checked={formData.available !== false} // default true
                                onChange={(e) => setFormData(p => ({ ...p, available: e.target.checked }))}
                                className="w-5 h-5 text-amber-500 rounded focus:ring-amber-500"
                            />
                            <label htmlFor="available" className="font-bold text-gray-700 cursor-pointer select-none">Macchina Disponibile</label>
                        </div>

                        <div className="pt-4 flex flex-col-reverse md:flex-row justify-between border-t border-gray-100 mt-6 gap-3">
                            <button
                                type="button"
                                onClick={() => setActiveSection(2)}
                                className="w-full md:w-auto px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                Indietro
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto px-8 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/30 flex justify-center items-center gap-2"
                            >
                                {loading ? <span className="animate-spin material-icons-outlined">refresh</span> : <Save size={20} />}
                                Salva Tutto
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default MachineForm;
