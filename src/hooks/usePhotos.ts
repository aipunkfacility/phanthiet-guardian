import { useState, useEffect, useCallback } from 'react';
import { MAX_PHOTOS } from '@/utils/db';
import { compressImage } from '@/utils/db';

export function usePhotos(templeId: string) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const loaded = await getPhotos(templeId);
        setPhotos(loaded || []);
      } catch (error) {
        console.error('Failed to load photos for temple:', templeId, error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPhotos();
  }, [templeId]);

  const addPhoto = useCallback(async (file: File) => {
    if (photos.length >= MAX_PHOTOS) {
      throw new Error('Maximum number of photos reached');
    }

    setIsLoading(true);
    try {
      const compressed = await compressImage(file);
      const updated = [...photos, compressed];
      await savePhotos(templeId, updated);
      setPhotos(updated);
    } catch (error) {
      console.error('Failed to add photo:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [photos, templeId]);

  const removePhoto = useCallback(async (index: number) => {
    if (index < 0 || index >= photos.length) return;

    setIsLoading(true);
    try {
      const updated = photos.filter((_, i) => i !== index);
      await savePhotos(templeId, updated);
      setPhotos(updated);
    } catch (error) {
      console.error('Failed to remove photo:', error);
    } finally {
      setIsLoading(false);
    }
  }, [photos, templeId]);

  const clearPhotos = useCallback(async () => {
    setIsLoading(true);
    try {
      await deletePhotos(templeId);
      setPhotos([]);
    } catch (error) {
      console.error('Failed to clear photos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [templeId]);

  const hasPhotos = photos.length > 0;

  return {
    photos,
    isLoading,
    addPhoto,
    removePhoto,
    clearPhotos,
    hasPhotos,
  };
}

async function getPhotos(templeId: string): Promise<string[] | null> {
  try {
    const db = await import('./../utils/db');
    return await db.getPhotos(templeId);
  } catch (error) {
    console.error('getPhotos error:', error);
    return null;
  }
}

async function savePhotos(templeId: string, photos: string[]): Promise<void> {
  try {
    const db = await import('./../utils/db');
    await db.savePhotos(templeId, photos);
  } catch (error) {
    console.error('savePhotos error:', error);
    throw error;
  }
}

async function deletePhotos(templeId: string): Promise<void> {
  try {
    const db = await import('./../utils/db');
    await db.deletePhotos(templeId);
  } catch (error) {
    console.error('deletePhotos error:', error);
    throw error;
  }
}

export function usePhotoUpload(templeId: string) {
  const { addPhoto } = usePhotos(templeId);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    if (file.type.indexOf('image/') !== 0) {
      setUploadError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be under 5MB');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      await addPhoto(file);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [addPhoto]);

  return {
    uploading,
    uploadError,
    handleFileUpload,
  };
}

export function usePhotoGallery(templeId: string) {
  const { photos, removePhoto, clearPhotos } = usePhotos(templeId);
  const [selectedPhoto, setSelectedPhoto] = useState(-1);

  const selectPhoto = useCallback((index: number) => {
    setSelectedPhoto(index);
  }, []);

  const closePhoto = useCallback(() => {
    setSelectedPhoto(-1);
  }, []);

  return {
    photos,
    selectedPhoto,
    selectPhoto,
    closePhoto,
    removePhoto,
    clearPhotos,
  };
}