import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../firebase';
import imageCompression from 'browser-image-compression';
import { getAllPhotos } from './pwaStorage';

interface MachineData {
    model: string;
    brand: string;
    type: 'sale' | 'rental';
    price: number;
}

export const uploadMachine = async (data: MachineData, orderedIds: string[]) => {
    const allPhotos = await getAllPhotos();
    const photosMap = new Map(allPhotos.map(p => [p.id, p]));

    const uploadPromises = orderedIds.map(async (id, index) => {
        const photo = photosMap.get(id);
        if (!photo) return null;

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        };

        try {
            // Compress the image
            const compressedFile = await imageCompression(photo.blob as File, options);

            const fileName = `machines/${Date.now()}_${id}.jpg`;
            const storageRef = ref(storage, fileName);

            await uploadBytes(storageRef, compressedFile);
            const url = await getDownloadURL(storageRef);

            return { url, index };
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    });

    const uploadedImages = (await Promise.all(uploadPromises))
        .filter((img): img is { url: string; index: number } => img !== null)
        .sort((a, b) => a.index - b.index)
        .map(img => img.url);

    if (uploadedImages.length === 0 && orderedIds.length > 0) {
        throw new Error('Failed to upload any images');
    }

    // Create document in Firestore
    // Note: 'machines' is the collection name used in other parts of the app?
    // I should check consistent naming, but 'machines' or 'vehicles' is likely.
    // The user request mentions "nuovo documento su Firestore", doesn't specify collection.
    // I'll assume 'vehicles' as per previous context or check later. 
    // Wait, I should check existing code.
    // I'll stick with 'vehicles' as it's more common in this context, or maybe 'products'.
    // Let me check 'src/services' for existing upload logic if possible or just use 'vehicles'.
    // Actually, I'll use 'machines' providing I can change it easily.
    // Let's quickly check 'src/services' content references in next step or use 'vehicles' which is generic.
    // Actually, I'll search for collection usage in 'src' to be sure.

    await addDoc(collection(db, 'excavators'), {
        name: `${data.brand} ${data.model}`,
        model: data.model, // Keep model for reference even if not in main interface
        brand: data.brand,
        type: data.type === 'rental' ? 'rent' : data.type, // Map 'rental' to 'rent'
        price: Number(data.price),
        images: uploadedImages,
        category: 'Mini Escavatori', // Default for PWA uploads for now
        // Optional fields filling
        rentalPrice: data.type === 'rental' ? 'Contattaci per prezzo' : null,
        condition: 5, // Default to new/excellent
        features: [],
        serialNumber: `PWA-${Date.now()}`, // Generate a temporary serial
        description: 'Inserito da App Mobile',
        year: new Date().getFullYear(),
        weight: 0,
        hours: 0,
        available: true,
        createdAt: serverTimestamp(),
    });
};
