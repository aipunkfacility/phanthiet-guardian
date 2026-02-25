import imageCompression from 'browser-image-compression';

const DB_NAME = 'phanthiet-guardian';
const STORE_NAME = 'user_photos';

export const MAX_WIDTH = 800;
export const MAX_SIZE_MB = 0.5;
export const MAX_PHOTOS = 10;

export const compressImage = async (file: File): Promise<string> => {
  const options = {
    maxWidthOrHeight: MAX_WIDTH,
    maxSizeMB: MAX_SIZE_MB,
    useWebWorker: true,
  };
  const compressed = await imageCompression(file, options);
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(compressed);
  });
};

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'templeId' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };
  });
};

export const savePhotos = async (
  templeId: string,
  photos: string[]
): Promise<void> => {
  if (photos.length > MAX_PHOTOS) {
    console.warn(`Max ${MAX_PHOTOS} photos per temple`);
    photos = photos.slice(-MAX_PHOTOS);
  }
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ templeId, photos, updatedAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const getPhotos = async (templeId: string): Promise<string[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(templeId);
    request.onsuccess = () => resolve(request.result?.photos || []);
    request.onerror = () => reject(request.error);
  });
};

export const deletePhotos = async (templeId: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(templeId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const migrateFromLocalStorage = async (
  templeIds: string[]
): Promise<void> => {
  const migrated: string[] = [];
  for (const id of templeIds) {
    const key = `user_photos_${id}`;
    const localData = localStorage.getItem(key);
    if (localData) {
      try {
        const photos = JSON.parse(localData) as string[];
        if (photos.length > 0) {
          await savePhotos(id, photos);
          migrated.push(id);
          localStorage.removeItem(key);
        }
      } catch (e) {
        console.error(`Failed to migrate photos for ${id}:`, e);
      }
    }
  }
  if (migrated.length > 0) {
    console.log(`Migrated photos for temples: ${migrated.join(', ')}`);
  }
};
