import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { db, storage } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { siteData as initialSiteData } from '../data/mockData';

export interface Excavator {
    id: string;
    name: string;
    brand: string;
    model?: string;
    category?: string;
    description: string;
    weight: number;
    price: number;
    rentalPrice?: string;
    condition: 'NUOVO' | 'USATO' | 'OTTIME CONDIZIONI';
    images: string[];
    features: string[];
    serialNumber: string;
    year?: number;
    hours?: number;
    type: 'sale' | 'rent' | 'both';
    available?: boolean;
    powerType?: 'Elettrico' | 'Termico'; // Added powerType
    specs?: Record<string, string>; // Added dynamic specs
    imageUrl?: string;
}

export interface SpecCategory {
    id: string;
    name: string;
    order: number;
}

export interface MachineCategory {
    id: string;
    name: string;
}

export interface Service {
    id: string;
    title: string;
    description: string;
    image: string;
    bulletPoints?: string[];
    showInHome?: boolean;
}

export interface ContactInfo {
    id: string;
    icon: string;
    label: string;
    value: string;
    href?: string;
    sub: string;
}

export interface Gallery {
    id: string;
    title: string;
    description: string;
    images: string[];
    showInHome: boolean;
    createdAt?: number;
}

export interface HomeGalleryData {
    title: string;
    subtitle: string;
    items: Gallery[];
}

export interface Stats {
    visits: number;
    footerClicks: number;
}

export interface BrandLogo {
    id: string;
    image: string;
}

export interface BrandsBannerData {
    logos: BrandLogo[];
    mode: 'dynamic' | 'fixed';
    speed: 'slow' | 'medium' | 'fast';
    position: 'after_hero' | 'before_footer';
    active: boolean;
}

interface DataContextType {
    excavators: Excavator[];
    addExcavator: (excavator: Excavator) => Promise<void>;
    updateExcavator: (id: string, updated: Excavator) => Promise<void>;
    deleteExcavator: (id: string) => Promise<void>;

    specCategories: SpecCategory[];
    addSpecCategory: (cat: SpecCategory) => Promise<void>;
    updateSpecCategory: (id: string, updated: SpecCategory) => Promise<void>;
    deleteSpecCategory: (id: string) => Promise<void>;

    machineCategories: MachineCategory[];
    addMachineCategory: (cat: MachineCategory) => Promise<void>;
    updateMachineCategory: (id: string, updated: MachineCategory) => Promise<void>;
    deleteMachineCategory: (id: string) => Promise<void>;

    services: Service[];
    addService: (service: Service) => Promise<void>;
    updateService: (id: string, updated: Service) => Promise<void>;
    deleteService: (id: string) => Promise<void>;

    contacts: ContactInfo[];
    addContact: (contact: ContactInfo) => Promise<void>;
    updateContact: (id: string, updated: ContactInfo) => Promise<void>;
    deleteContact: (id: string) => Promise<void>;

    homeGallery: HomeGalleryData;
    updateHomeGallery: (data: HomeGalleryData) => Promise<void>;

    galleries: Gallery[];
    addGallery: (gallery: Gallery) => Promise<void>;
    updateGallery: (id: string, updated: Gallery) => Promise<void>;
    deleteGallery: (id: string) => Promise<void>;

    stats: Stats;
    incrementVisit: () => void;
    incrementFooterClick: () => void;

    uploadImage: (file: File, folder: string) => Promise<string>;
    deleteImage: (url: string) => Promise<void>;
    siteData: typeof initialSiteData;

    brandsBanner: BrandsBannerData;
    updateBrandsBanner: (data: BrandsBannerData) => Promise<void>;
    refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [excavators, setExcavators] = useState<Excavator[]>([]);
    const [specCategories, setSpecCategories] = useState<SpecCategory[]>([]);
    const [machineCategories, setMachineCategories] = useState<MachineCategory[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [contacts, setContacts] = useState<ContactInfo[]>([]);
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [homeGallery, setHomeGallery] = useState<HomeGalleryData>({ title: '', subtitle: '', items: [] });
    const [stats, setStats] = useState<Stats>({ visits: 0, footerClicks: 0 });
    const [brandsBanner, setBrandsBanner] = useState<BrandsBannerData>({
        logos: [],
        mode: 'dynamic',
        speed: 'medium',
        position: 'after_hero',
        active: true
    });

    // Seeding Logic: If database is empty, seed with mock data
    useEffect(() => {
        const seedData = async () => {
            // Check excavators - Use fixed IDs from mock data to prevent duplicates
            if (excavators.length === 0 && initialSiteData.excavators.length > 0) {
                console.log("Seeding excavators...");
                for (const item of initialSiteData.excavators) {
                    const { id, ...rest } = item;
                    const seedId = id || `seed_${rest.name.replace(/\s+/g, '_').toLowerCase()}`;
                    await setDoc(doc(db, 'excavators', seedId), rest);
                }
            }

            // Seed default spec categories if empty
            if (specCategories.length === 0) {
                console.log("Seeding spec categories...");
                const defaultCats = [
                    { name: 'Portata (kg)', order: 1 },
                    { name: 'Carico (kg)', order: 2 },
                    { name: 'Altezza Sollevamento (mm)', order: 3 }
                ];
                for (const cat of defaultCats) {
                    const catId = `spec_${cat.order}`;
                    await setDoc(doc(db, 'spec_categories', catId), cat);
                }
            }

            // Seed default machine categories if empty
            if (machineCategories.length === 0) {
                console.log("Seeding machine categories...");
                const defaultMachineCats = [
                    { name: 'Mini Escavatori' },
                    { name: 'Escavatori Cingolati' },
                    { name: 'Piattaforme Aeree' },
                    { name: 'Gru' },
                    { name: 'Sollevatori Telescopici' }
                ];
                let idx = 1;
                for (const cat of defaultMachineCats) {
                    const catId = `cat_${idx}`;
                    await setDoc(doc(db, 'categories', catId), cat);
                    idx++;
                }
            }

            // Seed default contacts if empty
            if (contacts.length === 0) {
                console.log("Seeding default contacts...");
                const defaultContacts = [
                    { id: 'phone_1', icon: 'phone', label: 'Telefono', value: '+39 0823 982162', sub: 'LUN - VEN: 08:30 - 18:30', href: 'tel:+390823982162' },
                    { id: 'email_1', icon: 'email', label: 'Email', value: 'info@contegroup.com', sub: 'Rispondiamo entro 24h', href: 'mailto:info@contegroup.com' },
                    { id: 'place_1', icon: 'place', label: 'Sede Centrale', value: 'SP330, 24, 81016 Pietravairano (CE)', sub: 'Sede Legale e Operativa', href: 'https://maps.app.goo.gl/uXvV7yXWzQZ' },
                    { id: 'schedule_1', icon: 'schedule', label: 'Orari', value: '08:00 - 18:30', sub: 'Sabato: 08:00 - 13:00' }
                ];
                for (const c of defaultContacts) {
                    const { id, ...rest } = c;
                    await setDoc(doc(db, 'contacts', id), rest);
                }
            }

            // Seed default gallery if empty
            if (homeGallery.items.length === 0) {
                console.log("Seeding default gallery...");
                await setDoc(doc(db, 'settings', 'home_gallery'), {
                    title: 'Il nostro Parco Macchine',
                    subtitle: 'Eccellenza e potenza per ogni cantiere',
                    items: [
                        { id: '1', title: 'Scavo Fondamenta', subtitle: 'Utilizzo Caterpillar 320', image: 'https://picsum.photos/seed/ex1/1200/800' },
                        { id: '2', title: 'Terrazzamento', subtitle: 'Precisione con Bobcat E19', image: 'https://picsum.photos/seed/ex2/1200/800' }
                    ]
                });
            }
        };

        // Run seed check after a short delay to allow snapshots to initialize
        if (excavators.length === 0 && services.length === 0) {
            const timer = setTimeout(seedData, 3000);
            return () => clearTimeout(timer);
        }
    }, [excavators.length, services.length, contacts.length, homeGallery.items.length]);

    // Real-time Listeners
    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'excavators'), (snap) => {
            const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Excavator));
            setExcavators(data);
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'spec_categories'), (snap) => {
            const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SpecCategory))
                .sort((a, b) => a.order - b.order);
            setSpecCategories(data);
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'categories'), (snap) => {
            const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MachineCategory));
            setMachineCategories(data);
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'services'), (snap) => {
            const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
            setServices(data);
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'contacts'), (snap) => {
            const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactInfo));
            setContacts(data);
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'settings', 'home_gallery'), (snap) => {
            if (snap.exists()) {
                setHomeGallery(snap.data() as HomeGalleryData);
            }
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'galleries'), (snap) => {
            const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Gallery));
            setGalleries(data);
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'settings', 'brands_banner'), (snap) => {
            if (snap.exists()) {
                setBrandsBanner(snap.data() as BrandsBannerData);
            }
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'stats', 'global'), (snap) => {
            if (snap.exists()) {
                setStats(snap.data() as Stats);
            } else {
                setDoc(doc(db, 'stats', 'global'), { visits: 0, footerClicks: 0 });
            }
        });
        return () => unsub();
    }, []);

    // CRUD Operations - EXCAVATORS
    const addExcavator = async (item: Excavator) => {
        const { id, ...rest } = item;
        await addDoc(collection(db, 'excavators'), rest);
    };
    const updateExcavator = async (id: string, updated: Excavator) => {
        const { id: _, ...rest } = updated;
        await updateDoc(doc(db, 'excavators', id), rest as any);
    };
    const deleteExcavator = async (id: string) => {
        await deleteDoc(doc(db, 'excavators', id));
    };

    // CRUD Operations - SPEC CATEGORIES
    const addSpecCategory = async (cat: SpecCategory) => {
        const { id, ...rest } = cat;
        await addDoc(collection(db, 'spec_categories'), rest);
    };
    const updateSpecCategory = async (id: string, updated: SpecCategory) => {
        const { id: _, ...rest } = updated;
        await updateDoc(doc(db, 'spec_categories', id), rest as any);
    };
    const deleteSpecCategory = async (id: string) => {
        await deleteDoc(doc(db, 'spec_categories', id));
    };

    // CRUD Operations - MACHINE CATEGORIES
    const addMachineCategory = async (cat: MachineCategory) => {
        const { id, ...rest } = cat;
        await addDoc(collection(db, 'categories'), rest);
    };
    const updateMachineCategory = async (id: string, updated: MachineCategory) => {
        const { id: _, ...rest } = updated;
        await updateDoc(doc(db, 'categories', id), rest as any);
    };
    const deleteMachineCategory = async (id: string) => {
        await deleteDoc(doc(db, 'categories', id));
    };

    // CRUD Operations - SERVICES
    const addService = async (item: Service) => {
        const { id, ...rest } = item;
        await addDoc(collection(db, 'services'), rest);
    };
    const updateService = async (id: string, updated: Service) => {
        const { id: _, ...rest } = updated;
        await updateDoc(doc(db, 'services', id), rest as any);
    };
    const deleteService = async (id: string) => {
        await deleteDoc(doc(db, 'services', id));
    };

    // CRUD Operations - CONTACTS
    const addContact = async (item: ContactInfo) => {
        const { id, ...rest } = item;
        // If an ID is provided (e.g. from the form), use it with setDoc to prevent duplicates if user clicks multiple times
        if (id && id.length > 5) {
            await setDoc(doc(db, 'contacts', id), rest);
        } else {
            await addDoc(collection(db, 'contacts'), rest);
        }
    };
    const updateContact = async (id: string, updated: ContactInfo) => {
        const { id: _, ...rest } = updated;
        await updateDoc(doc(db, 'contacts', id), rest as any);
    };
    const deleteContact = async (id: string) => {
        await deleteDoc(doc(db, 'contacts', id));
    };

    // Galleries
    const addGallery = async (item: Gallery) => {
        const { id, ...rest } = item;
        await addDoc(collection(db, 'galleries'), { ...rest, createdAt: Date.now() });
    };
    const updateGallery = async (id: string, updated: Gallery) => {
        const { id: _, ...rest } = updated;
        await updateDoc(doc(db, 'galleries', id), rest as any);
    };
    const deleteGallery = async (id: string) => {
        await deleteDoc(doc(db, 'galleries', id));
    };

    // Home Gallery
    const updateHomeGallery = async (data: HomeGalleryData) => {
        await setDoc(doc(db, 'settings', 'home_gallery'), data);
    };

    // Brands Banner
    const updateBrandsBanner = async (data: BrandsBannerData) => {
        await setDoc(doc(db, 'settings', 'brands_banner'), data);
    };

    // Stats
    const incrementVisit = async () => {
        const sessionKey = 'contegroup_visit_' + new Date().toDateString();
        if (!sessionStorage.getItem(sessionKey)) {
            sessionStorage.setItem(sessionKey, 'true');
            await setDoc(doc(db, 'stats', 'global'), { visits: increment(1) }, { merge: true });
        }
    };

    const incrementFooterClick = async () => {
        await setDoc(doc(db, 'stats', 'global'), { footerClicks: increment(1) }, { merge: true });
    };

    // Images
    const uploadImage = async (file: File, folder: string) => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: 'image/webp'
        };

        try {
            const compressedFile = await imageCompression(file, options);
            const timestamp = Date.now();
            const storageRef = ref(storage, `${folder}/${timestamp}_${compressedFile.name}`);
            await uploadBytes(storageRef, compressedFile);
            return await getDownloadURL(storageRef);
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
        }
    };

    const deleteImage = async (url: string) => {
        if (!url || !url.includes('firebasestorage')) return;
        try {
            const storageRef = ref(storage, url);
            await deleteObject(storageRef);
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    return (
        <DataContext.Provider value={{
            excavators, addExcavator, updateExcavator, deleteExcavator,
            specCategories, addSpecCategory, updateSpecCategory, deleteSpecCategory,
            machineCategories, addMachineCategory, updateMachineCategory, deleteMachineCategory,
            services, addService, updateService, deleteService,
            contacts, addContact, updateContact, deleteContact,
            galleries, addGallery, updateGallery, deleteGallery,
            homeGallery, updateHomeGallery,
            stats, incrementVisit, incrementFooterClick,
            uploadImage, deleteImage,
            siteData: initialSiteData,
            brandsBanner,
            updateBrandsBanner,
            refreshData: () => {
                // Force a re-render or re-fetch if needed, though onSnapshot handles it
                console.log("Refreshing data...");
            }
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
