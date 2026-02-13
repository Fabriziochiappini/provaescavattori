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
    model?: string; // Added model
    category?: string; // Added category
    description: string;
    weight: number; // Tonnes
    price: number; // Sale price
    rentalPrice?: string; // Daily rental price text
    condition: number; // 1-5 stars
    images: string[];
    features: string[];
    serialNumber: string;
    year?: number;
    hours?: number;
    type: 'sale' | 'rent' | 'both'; // Added 'both'
    available?: boolean;
}

export interface Service {
    id: string;
    title: string;
    description: string;
    image: string;
}

export interface ContactInfo {
    id: string;
    icon: string;
    label: string;
    value: string;
    href?: string;
    sub: string;
}

export interface GalleryItem {
    id: string;
    title: string;
    subtitle: string;
    image: string;
}

export interface HomeGalleryData {
    title: string;
    subtitle: string;
    items: GalleryItem[];
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

    stats: Stats;
    incrementVisit: () => void;
    incrementFooterClick: () => void;

    uploadImage: (file: File, folder: string) => Promise<string>;
    deleteImage: (url: string) => Promise<void>;
    siteData: typeof initialSiteData;

    brandsBanner: BrandsBannerData;
    updateBrandsBanner: (data: BrandsBannerData) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [excavators, setExcavators] = useState<Excavator[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [contacts, setContacts] = useState<ContactInfo[]>([]);
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
            // Check excavators
            if (excavators.length === 0 && initialSiteData.excavators.length > 0) {
                console.log("Seeding excavators...");
                for (const item of initialSiteData.excavators) {
                    const { id, ...rest } = item;
                    await addDoc(collection(db, 'excavators'), rest);
                }
            }

            // Seed default contacts if empty
            if (contacts.length === 0) {
                console.log("Seeding default contacts...");
                const defaultContacts = [
                    { icon: 'phone', label: 'Telefono', value: '+39 0823 982162', sub: 'LUN - VEN: 08:30 - 18:30', href: 'tel:+390823982162' },
                    { icon: 'email', label: 'Email', value: 'info@contegroup.com', sub: 'Rispondiamo entro 24h', href: 'mailto:info@contegroup.com' },
                    { icon: 'place', label: 'Sede Centrale', value: 'SP330, 24, 81016 Pietravairano (CE)', sub: 'Sede Legale e Operativa', href: 'https://maps.app.goo.gl/uXvV7yXWzQZ' },
                    { icon: 'schedule', label: 'Orari', value: '08:00 - 18:30', sub: 'Sabato: 08:00 - 13:00' }
                ];
                for (const c of defaultContacts) {
                    await addDoc(collection(db, 'contacts'), c);
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
        await addDoc(collection(db, 'contacts'), rest);
    };
    const updateContact = async (id: string, updated: ContactInfo) => {
        const { id: _, ...rest } = updated;
        await updateDoc(doc(db, 'contacts', id), rest as any);
    };
    const deleteContact = async (id: string) => {
        await deleteDoc(doc(db, 'contacts', id));
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
            services, addService, updateService, deleteService,
            contacts, addContact, updateContact, deleteContact,
            homeGallery, updateHomeGallery,
            stats, incrementVisit, incrementFooterClick,
            uploadImage, deleteImage,
            siteData: initialSiteData,
            brandsBanner,
            updateBrandsBanner
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
