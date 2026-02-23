import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../firebase';
import imageCompression from 'browser-image-compression';
import { getAllPhotos } from './pwaStorage';

interface MachineData {
    model: string;
    brand: string;
    type: 'sale' | 'rent' | 'rental';
    price: number;
    category: string;
    condition: 'NUOVO' | 'USATO' | 'OTTIME CONDIZIONI';
    rentalPrice?: string;
    description?: string;
    features?: string[];
    specs?: Record<string, string>;
}

export const uploadMachine = async (data: MachineData, orderedIds: string[]) => {
    const allPhotos = await getAllPhotos();
    const photosMap = new Map(allPhotos.map(p => [p.id, p]));

    const uploadedImages: string[] = [];

    // Process photos SEQUENTIALLY to avoid overwhelming mobile browsers
    for (const id of orderedIds) {
        const photo = photosMap.get(id);
        if (!photo) continue;

        const options = {
            maxSizeMB: 2,               // Reasonable for web delivery
            maxWidthOrHeight: 2048,     // Matches capture dimensions
            useWebWorker: true,
            initialQuality: 0.85        // Good quality, faster compression
        };

        try {
            const compressedFile = await imageCompression(photo.blob as File, options);

            const fileName = `machines/${Date.now()}_${id}.jpg`;
            const storageRef = ref(storage, fileName);

            await uploadBytes(storageRef, compressedFile);
            const url = await getDownloadURL(storageRef);
            uploadedImages.push(url);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }

    if (uploadedImages.length === 0 && orderedIds.length > 0) {
        throw new Error('Failed to upload any images');
    }

    // Map 'rental' to 'rent' for consistency in DB if needed
    const finalType = data.type === 'rental' ? 'rent' : data.type;

    // Create document in Firestore
    await addDoc(collection(db, 'excavators'), {
        name: `${data.brand} ${data.model}`,
        model: data.model,
        brand: data.brand,
        type: finalType,
        price: Number(data.price),
        images: uploadedImages,
        category: data.category || 'Generale',
        rentalPrice: data.rentalPrice || (finalType === 'rent' ? 'Contattaci per prezzo' : null),
        condition: data.condition || 'NUOVO',
        features: data.features || [],
        specs: data.specs || {},
        serialNumber: `PWA-${Date.now()}`,
        description: data.description || 'Inserito da App Mobile',
        year: new Date().getFullYear(),
        weight: 0,
        hours: 0,
        available: true,
        createdAt: Date.now(),
        powerType: data.powerType || 'DIESEL',
    });
};
