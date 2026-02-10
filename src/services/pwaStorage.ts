import { openDB, DBSchema } from 'idb';

interface PWADB extends DBSchema {
    photos: {
        key: string;
        value: {
            id: string;
            blob: Blob;
            timestamp: number;
        };
    };
}

const dbPromise = openDB<PWADB>('conte-pwa-db', 1, {
    upgrade(db) {
        db.createObjectStore('photos', { keyPath: 'id' });
    },
});

export const savePhoto = async (id: string, blob: Blob) => {
    const db = await dbPromise;
    await db.put('photos', { id, blob, timestamp: Date.now() });
};

export const getAllPhotos = async () => {
    const db = await dbPromise;
    return db.getAll('photos');
};

export const deletePhoto = async (id: string) => {
    const db = await dbPromise;
    await db.delete('photos', id);
};

export const clearPhotos = async () => {
    const db = await dbPromise;
    await db.clear('photos');
};
