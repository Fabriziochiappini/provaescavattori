import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { db, storage } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { siteData as initialSiteData } from '../data/mockData';

export interface Excavator {
    id: string;
    name: string;
    description: string;
    weight: number; // Tonnes
    price: number; // Sale price or Daily rental
    condition: number; // 1-5 stars
    images: string[];
    features: string[];
    serialNumber: string;
    year?: number;
    hours?: number;
    type: 'sale' | 'rent';
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
    updateContact: (id: string, updated: ContactInfo) => Promise<void>;

    homeGallery: HomeGalleryData;
    updateHomeGallery: (data: HomeGalleryData) => Promise<void>;

    stats: Stats;
    incrementVisit: () => void;
    incrementFooterClick: () => void;

    uploadImage: (file: File, folder: string) => Promise<string>;
    deleteImage: (url: string) => Promise<void>;
    siteData: typeof initialSiteData;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [excavators, setExcavators] = useState<Excavator[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [contacts, setContacts] = useState<ContactInfo[]>([]);
    const [homeGallery, setHomeGallery] = useState<HomeGalleryData>({ title: '', subtitle: '', items: [] });
    const [stats, setStats] = useState<Stats>({ visits: 0, footerClicks: 0 });

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
    const updateContact = async (id: string, updated: ContactInfo) => {
        const { id: _, ...rest } = updated;
        await updateDoc(doc(db, 'contacts', id), rest as any);
    };

    // Home Gallery
    const updateHomeGallery = async (data: HomeGalleryData) => {
        await setDoc(doc(db, 'settings', 'home_gallery'), data);
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
            contacts, updateContact,
            homeGallery, updateHomeGallery,
            stats, incrementVisit, incrementFooterClick,
            uploadImage, deleteImage,
            siteData: initialSiteData
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
