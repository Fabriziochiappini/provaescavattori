import React, { useState, useEffect } from 'react';
import { useData, type Excavator, type Service, type ContactInfo, type SpecCategory } from '../context/DataContext';
import ImageUploader from '../components/ImageUploader';
import MachineForm from '../components/admin/MachineForm';
import BrandsManager from '../components/admin/BrandsManager';
import SpecCategoriesManager from '../components/admin/SpecCategoriesManager';
import MachineCategoriesManager from '../components/admin/MachineCategoriesManager';
import FloatingAdminNav from '../components/admin/FloatingAdminNav';
import { Reorder } from 'framer-motion';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { LayoutDashboard, Briefcase, Phone, Image as ImageIcon, Award, Menu, X, LogOut, Download, Plus, Settings, FolderTree } from 'lucide-react';

const Admin: React.FC = () => {
    const {
        excavators, addExcavator, updateExcavator, deleteExcavator,
        services, addService, updateService, deleteService,
        contacts, addContact, updateContact, deleteContact,
        homeGallery, updateHomeGallery,
        uploadImage, deleteImage
    } = useData();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // PWA Install Hook
    const { install: installPWA, canInstall, isInstalled } = usePWAInstall();

    // Check auth state on mount
    useEffect(() => {
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
                setIsAuthenticated(true);
            }
        };
        checkAuth();
    }, []);

    const [activeTab, setActiveTab] = useState<'excavators' | 'services' | 'contacts' | 'gallery' | 'brands' | 'specs' | 'categories'>('excavators');

    const adminTabs = [
        { id: 'excavators', label: 'Parco', icon: LayoutDashboard },
        { id: 'categories', label: 'Categorie', icon: FolderTree },
        { id: 'specs', label: 'Specifiche', icon: Settings },
        { id: 'services', label: 'Servizi', icon: Briefcase },
        { id: 'gallery', label: 'Galleria', icon: ImageIcon },
        { id: 'brands', label: 'Marchi', icon: Award },
        { id: 'contacts', label: 'Contatti', icon: Phone },
    ];

    // CMS State
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [editType, setEditType] = useState<'excavator' | 'service' | 'contact' | 'gallery' | null>(null);

    // Form State
    const [formData, setFormData] = useState<any>({});
    const [galleryHeader, setGalleryHeader] = useState({ title: '', subtitle: '' });

    useEffect(() => {
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
        } else if (type === 'contact') {
            setFormData({
                id: '', // Will be generated on save or if empty handled by addContact
                label: '',
                value: '',
                sub: '',
                icon: 'phone',
                href: ''
            });
        }
    };

    const handleDelete = async (id: string, type: 'excavator' | 'service' | 'gallery' | 'contact') => {
        if (window.confirm('Sei sicuro di voler cancellare questo elemento?')) {
            if (type === 'excavator') {
                const item = excavators.find(r => r.id === id);
                if (item && item.images) {
                    for (const imgUrl of item.images) {
                        try { await deleteImage(imgUrl); } catch (e) { console.error(e); }
                    }
                }
                await deleteExcavator(id);
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
            else if (type === 'contact') {
                await deleteContact(id);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editType === 'excavator') {
            return;
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
            if (isAdding) {
                const id = formData.label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_');
                await addContact({ ...formData, id } as ContactInfo);
            } else {
                await updateContact(editingItem.id, formData as ContactInfo);
            }
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
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-4">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700">
                    <h1 className="text-3xl font-black mb-8 text-amber-500 uppercase tracking-tighter italic">Admin Access</h1>
                    <form onSubmit={handleLogin} className="space-y-4 text-left">
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Amministratore"
                                className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white mb-4 transition-all outline-none"
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white transition-all outline-none"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm font-bold text-center bg-red-50 py-2 rounded-xl">{error}</p>}
                        <div className="flex flex-col gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-amber-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-600 transition-all flex justify-center items-center shadow-lg shadow-amber-500/30 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
                            >
                                {isLoading ? (
                                    <Menu className="animate-spin" />
                                ) : (
                                    "Entra nel Pannello"
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    if (!email || !password) {
                                        setError('Inserisci email e password per registrarti');
                                        return;
                                    }
                                    try {
                                        setIsLoading(true);
                                        const { auth } = await import('../firebase');
                                        const { createUserWithEmailAndPassword } = await import('firebase/auth');
                                        await createUserWithEmailAndPassword(auth, email, password);
                                    } catch (err: any) {
                                        console.error(err);
                                        setError('Errore registrazione: ' + err.message);
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }}
                                disabled={isLoading}
                                className="w-full bg-zinc-100 text-zinc-600 py-3 rounded-2xl font-bold hover:bg-zinc-200 transition-all text-xs"
                            >
                                REGISTRAZIONE ADMIN
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16 pb-8 bg-[#f8fafc] text-gray-900">
            {/* Desktop Navigation */}
            <FloatingAdminNav
                activeTab={activeTab}
                onTabChange={(tab) => { setActiveTab(tab); resetForm(); }}
                tabs={adminTabs}
            />

            {/* Mobile Header Menu */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-[110] flex items-center justify-between px-4 sm:hidden">
                <h1 className="text-xl font-black text-amber-500 uppercase italic">Admin</h1>
                <div className="flex items-center gap-2">
                    {canInstall && !isInstalled && (
                        <button onClick={installPWA} className="p-3 text-amber-500 bg-amber-50 rounded-xl active:scale-95 transition-all">
                            <Download size={20} />
                        </button>
                    )}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-3 text-gray-500 bg-gray-50 rounded-xl active:scale-95 transition-all"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] sm:hidden pt-16">
                    <div className="bg-white p-6 rounded-b-[40px] shadow-2xl space-y-2 animate-in slide-in-from-top duration-300">
                        <p className="text-[10px] uppercase font-black text-gray-400 px-3 mb-2 tracking-widest">
                            Navigazione
                        </p>
                        {adminTabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => { setActiveTab(tab.id as any); resetForm(); setIsMobileMenuOpen(false); }}
                                    className={`w-full flex items-center gap-4 p-4 rounded-3xl font-bold transition-all ${activeTab === tab.id ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-gray-600 active:bg-gray-100'
                                        }`}
                                >
                                    <Icon size={20} className={activeTab === tab.id ? 'text-white' : 'text-gray-400'} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                        <div className="pt-4 mt-4 border-t border-gray-100 flex gap-2">
                            <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex-1 p-4 bg-red-50 text-red-500 rounded-[28px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-all">
                                <LogOut size={20} /> Esci
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="hidden sm:block">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
                            Pannello <span className="text-amber-500 underline decoration-4 decoration-amber-500/10">Controllo</span>
                        </h1>
                        <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-[10px]">Gestione Contenuti</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white shadow-xl shadow-slate-200/50 border border-slate-100 rounded-2xl text-slate-600 hover:text-red-500 font-black tracking-widest text-[10px] uppercase transition-all active:scale-95"
                    >
                        <LogOut size={14} /> Logout
                    </button>
                </div>

                {!isAdding && !editingItem ? (
                    <div className="space-y-10">
                        {activeTab === 'excavators' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">Parco Macchine</h2>
                                    <button
                                        onClick={() => startAdd('excavator')}
                                        className="bg-amber-500 text-white w-12 h-12 sm:w-auto sm:h-auto sm:px-6 sm:py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-600 flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/30 active:scale-95"
                                    >
                                        <Plus size={20} className="sm:hidden" />
                                        <span className="hidden sm:inline">+AGGIUNGI</span>
                                    </button>
                                </div>
                                <div className="grid gap-4">
                                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-100/50 rounded-2xl font-black text-[9px] uppercase text-slate-400 tracking-widest">
                                        <div className="col-span-1 text-center">Preview</div>
                                        <div className="col-span-3">Modello</div>
                                        <div className="col-span-2 text-center">Marca</div>
                                        <div className="col-span-2 text-center">Valore</div>
                                        <div className="col-span-1 text-center">Tipo</div>
                                        <div className="col-span-1 text-center">Stato</div>
                                        <div className="col-span-2 text-right px-4">Azioni</div>
                                    </div>
                                    {excavators.map(excavator => (
                                        <div key={excavator.id} className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 p-4 sm:p-5 bg-white rounded-[24px] shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-slate-200/30 transition-all items-start md:items-center group">
                                            <div className="flex items-center gap-4 w-full md:contents">
                                                <div className="md:col-span-1 shrink-0">
                                                    <img
                                                        src={excavator.images?.[0] || 'https://via.placeholder.com/150'}
                                                        alt={excavator.name}
                                                        className="w-20 h-20 md:w-14 md:h-14 object-cover rounded-2xl bg-slate-50 border border-slate-100 shadow-sm"
                                                    />
                                                </div>

                                                <div className="md:col-span-3">
                                                    <h3 className="font-black text-slate-900 text-lg md:text-base leading-tight group-hover:text-amber-500 transition-colors uppercase italic">{excavator.name}</h3>
                                                    <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">ID: {excavator.id}</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-y-3 w-full md:contents">
                                                <div className="md:col-span-2 text-center">
                                                    <span className="md:hidden text-[10px] font-black uppercase text-slate-300 block mb-1">Marca</span>
                                                    <span className="font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-xl text-sm uppercase">{excavator.brand || '-'}</span>
                                                </div>

                                                <div className="md:col-span-2 text-center">
                                                    <span className="md:hidden text-[10px] font-black uppercase text-slate-300 block mb-1">Prezzo</span>
                                                    <span className="font-black text-slate-900 text-base md:text-sm italic">
                                                        {excavator.type === 'rent' ? excavator.rentalPrice : `€ ${excavator.price?.toLocaleString()}`}
                                                    </span>
                                                </div>

                                                <div className="md:col-span-1 text-center">
                                                    <span className="md:hidden text-[10px] font-black uppercase text-slate-300 block mb-1">Categoria</span>
                                                    <span className={`text-[10px] tracking-widest px-3 py-1 rounded-full font-black ${excavator.type === 'sale' ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'}`}>
                                                        {excavator.type === 'sale' ? 'VENDITA' : 'NOLEGGIO'}
                                                    </span>
                                                </div>

                                                <div className="md:col-span-1 text-center flex flex-col items-center">
                                                    <span className="md:hidden text-[10px] font-black uppercase text-slate-300 block mb-1">Status</span>
                                                    <div className={`w-3 h-3 rounded-full shadow-sm ${excavator.available !== false ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} title={excavator.available !== false ? 'Disponibile' : 'Non disponibile'}></div>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 flex justify-end gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                                                <button onClick={() => startEdit(excavator, 'excavator')} className="flex-1 md:flex-none p-3 text-sky-500 bg-sky-50 hover:bg-sky-100 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2">
                                                    <X size={18} className="rotate-45" /> <span className="md:hidden font-bold">Modifica</span>
                                                </button>
                                                <button onClick={() => handleDelete(excavator.id, 'excavator')} className="flex-1 md:flex-none p-3 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2">
                                                    <LogOut size={18} /> <span className="md:hidden font-bold">Elimina</span>
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
                                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">Servizi Aziendali</h2>
                                    <button
                                        onClick={() => startAdd('service')}
                                        className="bg-amber-500 text-white w-12 h-12 sm:w-auto sm:h-auto sm:px-6 sm:py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-600 flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/30 active:scale-95"
                                    >
                                        <Plus size={20} className="sm:hidden" />
                                        <span className="hidden sm:inline">+AGGIUNGI</span>
                                    </button>
                                </div>
                                <div className="grid gap-4">
                                    {services.map(attr => (
                                        <div key={attr.id} className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-4 group">
                                            <img src={attr.image} alt={attr.title} className="w-full sm:w-20 h-32 sm:h-20 object-cover rounded-xl shadow-sm border border-slate-100" />
                                            <div className="flex-grow text-center sm:text-left">
                                                <h3 className="font-black text-xl italic uppercase text-slate-900 group-hover:text-amber-500 transition-colors">{attr.title}</h3>
                                                <p className="text-sm font-medium text-slate-400 mt-2 line-clamp-2 leading-relaxed">{attr.description}</p>
                                            </div>
                                            <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                                                <button onClick={() => startEdit(attr, 'service')} className="flex-1 sm:flex-none p-4 text-sky-500 bg-sky-50 hover:bg-sky-100 rounded-[24px] active:scale-95 transition-all flex justify-center">
                                                    <Menu size={20} />
                                                </button>
                                                <button onClick={() => handleDelete(attr.id, 'service')} className="flex-1 sm:flex-none p-4 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-[24px] active:scale-95 transition-all flex justify-center">
                                                    <LogOut size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'contacts' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-800 italic underline decoration-4 decoration-amber-500/10">Gestione Contatti</h2>
                                    <button
                                        onClick={() => startAdd('contact')}
                                        className="bg-amber-500 text-white w-12 h-12 sm:w-auto sm:h-auto sm:px-6 sm:py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-600 flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/30 active:scale-95"
                                    >
                                        <Plus size={20} className="sm:hidden" />
                                        <span className="hidden sm:inline">+AGGIUNGI</span>
                                    </button>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {contacts.map(contact => (
                                        <div key={contact.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-start gap-4 relative group overflow-hidden">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-all duration-700"></div>
                                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 shadow-sm border border-amber-500/10">
                                                <span className="material-icons-outlined text-2xl">{contact.icon}</span>
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{contact.label}</p>
                                                <h3 className="text-xl font-black text-slate-900 break-all leading-tight italic">{contact.value}</h3>
                                                <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity uppercase">{contact.sub}</p>
                                            </div>
                                            <div className="absolute bottom-6 right-6 flex gap-2">
                                                <button onClick={() => startEdit(contact, 'contact')} className="p-3 text-sky-500 bg-sky-50 hover:bg-sky-100 rounded-xl active:scale-95 transition-all flex justify-center">
                                                    <Menu size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(contact.id, 'contact')} className="p-3 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl active:scale-95 transition-all flex justify-center">
                                                    <LogOut size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'gallery' && (
                            <div className="space-y-6">
                                <section className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">Galleria Foto</h2>
                                        <button
                                            onClick={() => startAdd('gallery' as any)}
                                            className="bg-amber-500 text-white w-12 h-12 sm:w-auto sm:h-auto sm:px-6 sm:py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-600 flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/30 active:scale-95"
                                        >
                                            <Plus size={20} className="sm:hidden" />
                                            <span className="hidden sm:inline">+AGGIUNGI</span>
                                        </button>
                                    </div>

                                    <Reorder.Group axis="y" values={homeGallery.items || []} onReorder={(newOrder) => updateHomeGallery({ ...homeGallery, items: newOrder })} className="grid gap-4">
                                        {homeGallery.items?.map(item => (
                                            <Reorder.Item key={item.id} value={item} className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-4 cursor-move group">
                                                <div className="relative shrink-0 w-full sm:w-24 h-40 sm:h-24 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                                                </div>
                                                <div className="flex-grow pointer-events-none text-center sm:text-left w-full">
                                                    <h3 className="font-black text-xl italic uppercase text-slate-900">{item.title}</h3>
                                                    <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest opacity-70">{item.subtitle}</p>
                                                </div>
                                                <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                                                    <button onClick={(e) => { e.stopPropagation(); startEdit(item, 'gallery'); }} className="flex-1 sm:flex-none p-4 text-sky-500 bg-sky-50 hover:bg-sky-100 rounded-[24px] active:scale-95 transition-all flex justify-center">
                                                        <Menu size={20} />
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id, 'gallery'); }} className="flex-1 sm:flex-none p-4 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-[24px] active:scale-95 transition-all flex justify-center">
                                                        <LogOut size={20} />
                                                    </button>
                                                </div>
                                            </Reorder.Item>
                                        ))}
                                    </Reorder.Group>
                                    {(!homeGallery.items || homeGallery.items.length === 0) && (
                                        <div className="text-center py-20 bg-slate-50/50 rounded-[40px] border-4 border-dashed border-slate-100">
                                            <ImageIcon size={48} className="mx-auto text-slate-200 mb-4" />
                                            <p className="text-slate-400 font-bold uppercase tracking-widest">Nessuna foto presente</p>
                                        </div>
                                    )}
                                </section>
                            </div>
                        )}

                        {activeTab === 'brands' && (
                            <BrandsManager />
                        )}

                        {activeTab === 'specs' && (
                            <SpecCategoriesManager />
                        )}

                        {activeTab === 'categories' && (
                            <MachineCategoriesManager />
                        )}
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-[32px] shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 uppercase italic">
                                    {isAdding ? 'Crea' : 'Aggiorna'} <span className="text-amber-500">{editType === 'excavator' ? 'Macchina' : editType === 'service' ? 'Servizio' : editType === 'contact' ? 'Contatto' : 'Elemento'}</span>
                                </h2>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Dati archiviati in cloud</p>
                            </div>
                            <button onClick={resetForm} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-600 active:scale-90 transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        {editType === 'excavator' ? (
                            <MachineForm
                                initialData={isAdding ? null : editingItem}
                                onCancel={resetForm}
                                onSave={async (data) => {
                                    if (isAdding) {
                                        await addExcavator(data);
                                    } else {
                                        await updateExcavator(editingItem.id, data);
                                    }
                                    resetForm();
                                }}
                            />
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {editType === 'gallery' && (
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest px-1">Titolo Gallery</label>
                                                <input
                                                    name="title"
                                                    value={formData.title || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full p-5 bg-slate-50 border-none rounded-3xl text-slate-900 font-bold focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest px-1">Sottotitolo / Info</label>
                                                <input
                                                    name="subtitle"
                                                    value={formData.subtitle || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full p-5 bg-slate-50 border-none rounded-3xl text-slate-900 font-bold focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest px-1">Sorgente Immagine</label>
                                            <div className="relative rounded-[32px] overflow-hidden border-2 border-dashed border-slate-200 p-2 group">
                                                {formData.image ? (
                                                    <img src={formData.image} alt="preview" className="w-full h-48 object-cover rounded-[24px] shadow-sm" />
                                                ) : (
                                                    <div className="h-48 flex flex-col items-center justify-center bg-slate-50 text-slate-300 rounded-[24px]">
                                                        <ImageIcon size={40} className="mb-2" />
                                                        <span className="text-[10px] font-black uppercase tracking-tighter">No Preview</span>
                                                    </div>
                                                )}
                                                <div className="mt-4 px-2 pb-2">
                                                    <ImageUploader
                                                        onUpload={async (file) => {
                                                            const url = await uploadImage(file, 'gallery');
                                                            setFormData((prev: any) => ({ ...prev, image: url }));
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {editType === 'contact' && (
                                    <div className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest px-1">Etichetta (es. Telefono)</label>
                                                <input
                                                    name="label"
                                                    value={formData.label || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
                                                    placeholder="es. Telefono"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest px-1">Valore (es. +39...)</label>
                                                <input
                                                    name="value"
                                                    value={formData.value || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
                                                    placeholder="es. +39 0823..."
                                                />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest px-1">Sottotitolo (es. Orari)</label>
                                                <input
                                                    name="sub"
                                                    value={formData.sub || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
                                                    placeholder="es. Lun - Ven: 08:30 - 18:30"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest px-1">Link (href) (es. tel:..., https://...)</label>
                                                <input
                                                    name="href"
                                                    value={formData.href || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
                                                    placeholder="es. tel:+390823982162"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest px-1">Icona (Material Icon name: phone, email, place, schedule)</label>
                                            <input
                                                name="icon"
                                                value={formData.icon || ''}
                                                onChange={handleInputChange}
                                                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
                                                placeholder="es. phone"
                                            />
                                        </div>
                                    </div>
                                )}

                                <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl active:scale-[0.98] mt-4">
                                    Pubblica Modifiche
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
