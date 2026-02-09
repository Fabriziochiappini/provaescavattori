import React, { useState } from 'react';
import { useData, type Excavator, type Service, type ContactInfo } from '../context/DataContext';
import ImageUploader from '../components/ImageUploader';
import { Reorder } from 'framer-motion';

const Admin: React.FC = () => {
    const {
        excavators, addExcavator, updateExcavator, deleteExcavator,
        services, addService, updateService, deleteService,
        contacts, updateContact,
        homeGallery, updateHomeGallery,
        uploadImage, deleteImage
    } = useData();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Check auth state on mount
    React.useEffect(() => {
        const checkAuth = async () => {
            try {
                const { auth } = await import('../firebase');
                const { onAuthStateChanged } = await import('firebase/auth');

                onAuthStateChanged(auth, (user) => {
                    if (user) setIsAuthenticated(true);
                    else setIsAuthenticated(false);
                });
            } catch (e) {
                console.error("Firebase Auth not initialized, running in demo mode.", e);
                // In a real app, you might want to set isAuthenticated to true for a demo user
                // or handle this more gracefully, e.g., disable auth features.
                setIsAuthenticated(true); // For demo purposes, assume authenticated if Firebase fails
            }
        };
        checkAuth();
    }, []);

    const [activeTab, setActiveTab] = useState<'excavators' | 'services' | 'contacts' | 'gallery'>('excavators');

    // CMS State
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [editType, setEditType] = useState<'excavator' | 'service' | 'contact' | 'gallery' | null>(null);

    // Form State
    const [formData, setFormData] = useState<any>({});
    const [galleryHeader, setGalleryHeader] = useState({ title: '', subtitle: '' });

    React.useEffect(() => {
        if (activeTab === 'gallery' && homeGallery) {
            setGalleryHeader({ title: homeGallery.title || '', subtitle: homeGallery.subtitle || '' });
        }
    }, [activeTab, homeGallery]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { auth } = await import('../firebase');
            const { signInWithEmailAndPassword } = await import('firebase/auth');
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
                setError('Email o password errati');
            } else {
                setError('Errore durante il login: ' + err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        const { auth } = await import('../firebase');
        const { signOut } = await import('firebase/auth');
        await signOut(auth);
        setPassword('');
        resetForm();
    };

    const resetForm = () => {
        setFormData({});
        setEditingItem(null);
        setIsAdding(false);
        setEditType(null);
    };

    const startEdit = (item: any, type: 'excavator' | 'service' | 'contact' | 'gallery') => {
        setEditingItem(item);
        setFormData({ ...item });
        setIsAdding(false);
        setEditType(type);
    };

    const startAdd = (type: 'excavator' | 'service' | 'contact' | 'gallery') => {
        setIsAdding(true);
        setEditType(type);
        setEditingItem(null);

        if (type === 'excavator') {
            setFormData({
                id: Date.now().toString(),
                features: [],
                condition: 5,
                weight: 0,
                price: 0,
                type: 'sale',
                images: []
            });
        } else if (type === 'service') {
            setFormData({
                id: Date.now().toString(),
                title: '',
                description: '',
                image: "https://via.placeholder.com/800x600"
            });
        } else if (type === 'gallery') {
            setFormData({
                id: Date.now().toString(),
                title: '',
                subtitle: '',
                image: "https://via.placeholder.com/800x600"
            });
        }
    };

    const handleDelete = async (id: string, type: 'excavator' | 'service' | 'gallery') => {
        if (window.confirm('Sei sicuro di voler cancellare questo elemento?')) {
            if (type === 'excavator') {
                const item = excavators.find(r => r.id === id);
                if (item && item.images) {
                    for (const imgUrl of item.images) await deleteImage(imgUrl);
                }
                deleteExcavator(id);
            }
            else if (type === 'service') {
                const item = services.find(a => a.id === id);
                if (item && item.image) await deleteImage(item.image);
                deleteService(id);
            }
            else if (type === 'gallery') {
                const item = homeGallery.items.find(i => i.id === id);
                if (item && item.image) await deleteImage(item.image);
                const newItems = homeGallery.items.filter(i => i.id !== id);
                await updateHomeGallery({ ...homeGallery, items: newItems });
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editType === 'excavator') {
            if (!formData.name || !formData.price) return alert('Nome e Prezzo sono obbligatori');
            if (isAdding) {
                addExcavator(formData as Excavator);
            } else {
                // Check if images were removed
                if (editingItem && editingItem.images) {
                    const oldImages = editingItem.images as string[];
                    const newImages = formData.images as string[] || [];
                    const removedImages = oldImages.filter(img => !newImages.includes(img));
                    removedImages.forEach(img => deleteImage(img).catch(console.error));
                }
                updateExcavator(editingItem.id, formData as Excavator);
            }
        } else if (editType === 'service') {
            if (!formData.title) return alert('Titolo obbligatorio');
            if (isAdding) {
                addService(formData as Service);
            } else {
                if (editingItem && editingItem.image && editingItem.image !== formData.image) {
                    deleteImage(editingItem.image).catch(console.error);
                }
                updateService(editingItem.id, formData as Service);
            }
        } else if (editType === 'contact') {
            updateContact(editingItem.id, formData as ContactInfo);
        } else if (editType === 'gallery') {
            if (!formData.image) return alert('Immagine obbligatoria');
            let newItems = [...homeGallery.items];
            if (isAdding) {
                newItems.push(formData);
            } else {
                if (editingItem && editingItem.image && editingItem.image !== formData.image) {
                    deleteImage(editingItem.image).catch(console.error);
                }
                newItems = newItems.map(item => item.id === editingItem.id ? formData : item);
            }
            await updateHomeGallery({ ...homeGallery, items: newItems });
        }
        resetForm();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: name === 'price' || name === 'weight' || name === 'hours' || name === 'year' || name === 'condition' ? parseFloat(value) : value
        }));
    };

    const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setFormData((prev: any) => ({
            ...prev,
            features: val.split(',').map(s => s.trim())
        }));
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-700">
                    <h1 className="text-2xl font-bold mb-6 text-center text-primary font-oswald text-amber-500">Admin Area</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Amministratore"
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border-none rounded-lg focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white mb-4"
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border-none rounded-lg focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-amber-500 text-white py-3 rounded-lg font-bold hover:bg-amber-600 transition-colors flex justify-center items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <span className="material-icons-outlined animate-spin">refresh</span>
                            ) : (
                                "Entra"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold font-oswald text-amber-500">Pannello di Controllo</h1>
                    <div className="flex items-center gap-6">
                        <nav className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl overflow-x-auto">
                            {(['excavators', 'services', 'contacts', 'gallery'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => { setActiveTab(tab); resetForm(); }}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab
                                        ? 'bg-white dark:bg-gray-700 shadow-sm text-amber-500'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                        }`}
                                >
                                    {tab === 'excavators' ? 'Parco Macchine' : tab === 'services' ? 'Servizi' : tab === 'gallery' ? 'Galleria' : 'Contatti'}
                                </button>
                            ))}
                        </nav>
                        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 font-bold">Log Out</button>
                    </div>
                </div>

                {!isAdding && !editingItem ? (
                    <div className="space-y-8">
                        {activeTab === 'excavators' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold">Gestione Escavatori</h2>
                                    <button
                                        onClick={() => startAdd('excavator')}
                                        className="bg-amber-500 text-white px-6 py-2 rounded-full font-bold hover:bg-amber-600 flex items-center gap-2"
                                    >
                                        <span className="material-icons-outlined">add</span> Aggiungi Macchina
                                    </button>
                                </div>
                                <div className="grid gap-4">
                                    {excavators.map(excavator => (
                                        <div key={excavator.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                                            <img src={excavator.images?.[0] || 'https://via.placeholder.com/150'} alt={excavator.name} className="w-20 h-20 object-cover rounded-lg" />
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-lg">{excavator.name}</h3>
                                                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${excavator.type === 'sale' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {excavator.type === 'sale' ? 'Vendita' : 'Noleggio'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                                    €{excavator.price.toLocaleString()} | {excavator.weight}t | {excavator.hours || 0}h | Anno {excavator.year || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => startEdit(excavator, 'excavator')} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                                                    <span className="material-icons-outlined">edit</span>
                                                </button>
                                                <button onClick={() => handleDelete(excavator.id, 'excavator')} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                                    <span className="material-icons-outlined">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'services' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold">I Nostri Servizi</h2>
                                    <button
                                        onClick={() => startAdd('service')}
                                        className="bg-amber-500 text-white px-6 py-2 rounded-full font-bold hover:bg-amber-600 flex items-center gap-2 text-sm"
                                    >
                                        <span className="material-icons-outlined">add</span> Aggiungi Servizio
                                    </button>
                                </div>
                                <div className="grid gap-4">
                                    {services.map(attr => (
                                        <div key={attr.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                                            <img src={attr.image} alt={attr.title} className="w-16 h-16 object-cover rounded-lg" />
                                            <div className="flex-grow">
                                                <h3 className="font-bold">{attr.title}</h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{attr.description}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => startEdit(attr, 'service')} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                                                    <span className="material-icons-outlined">edit</span>
                                                </button>
                                                <button onClick={() => handleDelete(attr.id, 'service')} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                                    <span className="material-icons-outlined">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'contacts' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold">Gestione Contatti</h2>
                                <div className="grid gap-4">
                                    {contacts.map(contact => (
                                        <div key={contact.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                                <span className="material-icons-outlined">{contact.icon}</span>
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{contact.label}</p>
                                                <h3 className="text-lg font-bold">{contact.value}</h3>
                                                <p className="text-sm text-gray-500 italic">{contact.sub}</p>
                                            </div>
                                            <button onClick={() => startEdit(contact, 'contact')} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                                                <span className="material-icons-outlined">edit</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'gallery' && (
                            <div className="space-y-8">
                                <section className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold">Foto Gallery Homepage</h2>
                                        <button
                                            onClick={() => startAdd('gallery' as any)}
                                            className="bg-amber-500 text-white px-6 py-2 rounded-full font-bold hover:bg-amber-600 flex items-center gap-2 text-sm"
                                        >
                                            <span className="material-icons-outlined">add</span> Aggiungi Foto
                                        </button>
                                    </div>

                                    <Reorder.Group axis="y" values={homeGallery.items || []} onReorder={(newOrder) => updateHomeGallery({ ...homeGallery, items: newOrder })} className="grid gap-4">
                                        {homeGallery.items?.map(item => (
                                            <Reorder.Item key={item.id} value={item} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 cursor-move">
                                                <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg pointer-events-none" />
                                                <div className="flex-grow pointer-events-none">
                                                    <h3 className="font-bold">{item.title}</h3>
                                                    <p className="text-xs text-gray-500 line-clamp-1">{item.subtitle}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={(e) => { e.stopPropagation(); startEdit(item, 'gallery'); }} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                                                        <span className="material-icons-outlined">edit</span>
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id, 'gallery'); }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                                        <span className="material-icons-outlined">delete</span>
                                                    </button>
                                                </div>
                                            </Reorder.Item>
                                        ))}
                                    </Reorder.Group>
                                    {(!homeGallery.items || homeGallery.items.length === 0) && (
                                        <p className="text-center text-gray-500 py-8 italic border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">Nessuna foto in galleria.</p>
                                    )}
                                </section>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">
                                {isAdding ? 'Aggiungi' : 'Modifica'} {editType === 'excavator' ? 'Macchina' : editType === 'service' ? 'Servizio' : 'Elemento'}
                            </h2>
                            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                <span className="material-icons-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {editType === 'excavator' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Modello</label>
                                            <input name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full p-2 bg-gray-50 dark:bg-gray-700 border-none rounded-lg dark:text-white" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Prezzo (€)</label>
                                            <input name="price" type="number" value={formData.price || ''} onChange={handleInputChange} className="w-full p-2 bg-gray-50 dark:bg-gray-700 border-none rounded-lg dark:text-white" required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Peso (Ton)</label>
                                            <input name="weight" type="number" step="0.1" value={formData.weight || ''} onChange={handleInputChange} className="w-full p-2 bg-gray-50 dark:bg-gray-700 border-none rounded-lg dark:text-white" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Ore Lavoro</label>
                                            <input name="hours" type="number" value={formData.hours || ''} onChange={handleInputChange} className="w-full p-2 bg-gray-50 dark:bg-gray-700 border-none rounded-lg dark:text-white" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Anno</label>
                                            <input name="year" type="number" value={formData.year || ''} onChange={handleInputChange} className="w-full p-2 bg-gray-50 dark:bg-gray-700 border-none rounded-lg dark:text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tipo Offerta</label>
                                        <select name="type" value={formData.type || 'sale'} onChange={handleInputChange} className="w-full p-2 bg-gray-50 dark:bg-gray-700 border-none rounded-lg dark:text-white">
                                            <option value="sale">Vendita</option>
                                            <option value="rent">Noleggio</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Matricola / ID</label>
                                        <input name="serialNumber" value={formData.serialNumber || ''} onChange={handleInputChange} className="w-full p-2 bg-gray-50 dark:bg-gray-700 border-none rounded-lg dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descrizione</label>
                                        <textarea name="description" value={formData.description || ''} onChange={handleInputChange} rows={3} className="w-full p-2 bg-gray-50 dark:bg-gray-700 border-none rounded-lg dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Caratteristiche (separati da virgola)</label>
                                        <input name="features" value={formData.features?.join(', ') || ''} onChange={handleFeaturesChange} className="w-full p-2 bg-gray-50 dark:bg-gray-700 border-none rounded-lg dark:text-white" placeholder="es. Aria condizionata, Cingoli gomma" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Immagini</label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {formData.images?.map((img: string, i: number) => (
                                                <div key={i} className="relative group">
                                                    <img src={img} alt="preview" className="w-20 h-20 object-cover rounded-lg" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newImages = formData.images.filter((_: any, idx: number) => idx !== i);
                                                            setFormData({ ...formData, images: newImages });
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <span className="material-icons-outlined text-xs">close</span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <ImageUploader
                                            onUpload={async (file) => {
                                                const url = await uploadImage(file, 'excavators');
                                                setFormData((prev: any) => ({
                                                    ...prev,
                                                    images: [...(prev.images || []), url]
                                                }));
                                            }}
                                            multiple
                                        />
                                    </div>
                                </div>
                            )}

                            {editType === 'gallery' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Titolo</label>
                                        <input name="title" value={formData.title || ''} onChange={handleInputChange} className="w-full p-2 bg-gray-50 dark:bg-gray-700 border-none rounded-lg dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Immagine</label>
                                        {formData.image && <img src={formData.image} alt="preview" className="w-full h-48 object-cover rounded-lg mb-2" />}
                                        <ImageUploader
                                            onUpload={async (file) => {
                                                const url = await uploadImage(file, 'gallery');
                                                setFormData((prev: any) => ({ ...prev, image: url }));
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                            {/* Similar forms for Services if needed */}

                            <button type="submit" className="w-full bg-amber-500 text-white py-3 rounded-lg font-bold hover:bg-amber-600 transition-colors">
                                Salva Modifiche
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
