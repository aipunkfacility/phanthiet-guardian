import { useState, useEffect, useCallback } from 'react';
import { MAX_PHOTOS, getPhotos, savePhotos, compressImage } from '@/utils/db';

interface TempleGalleryProps {
  templeId: string;
  userPhotos: string[];
  onPhotosChange: (photos: string[]) => void;
  readOnly?: boolean;
}

export function TempleGallery({ templeId, userPhotos, onPhotosChange, readOnly }: TempleGalleryProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const photos = await getPhotos(templeId);
        if (photos && photos.length > 0) {
          onPhotosChange(photos);
        }
      } catch (error) {
        console.error('Failed to load photos:', error);
      }
    };
    loadPhotos();
  }, [templeId, onPhotosChange]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || readOnly) return;

    if (userPhotos.length >= MAX_PHOTOS) {
      alert(`Максимум ${MAX_PHOTOS} фото на храм`);
      return;
    }

    setIsLoading(true);
    try {
      for (const file of Array.from(files)) {
        if (userPhotos.length >= MAX_PHOTOS) break;
        
        try {
          const base64 = await compressImage(file);
          const updated = [...userPhotos, base64];
          await savePhotos(templeId, updated);
          onPhotosChange(updated);
        } catch (err) {
          console.error('Compression failed:', err);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [userPhotos, templeId, onPhotosChange, readOnly]);

  const removePhoto = useCallback(async (index: number) => {
    if (readOnly) return;
    
    const updated = userPhotos.filter((_, i) => i !== index);
    await savePhotos(templeId, updated);
    onPhotosChange(updated);
  }, [userPhotos, templeId, onPhotosChange, readOnly]);

  return (
    <>
      <section>
        <h4 className="text-[12px] font-semibold uppercase tracking-[0.05em] text-orange-600 mb-2 flex items-center gap-2">
          <span className="w-6 h-px bg-orange-600"></span>
          История места
        </h4>
        <p className="text-[#4B5563] leading-[1.625] text-sm md:text-base whitespace-pre-wrap">
          {/* This would come from temple data */}
        </p>
      </section>

      <section className="flex-1">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.05em] text-orange-600 mb-1 flex items-center gap-2">
              <span className="w-6 h-px bg-orange-600"></span>
              Мой альбом
            </h4>
            <p className="text-[11px] text-[#6B7280] font-medium">Ваши кадры из поездки</p>
          </div>
          {!readOnly && (
            <label className="cursor-pointer bg-white border border-[#E5E7EB] hover:border-orange-500 text-[#4B5563] px-4 py-2 rounded-full text-[12px] font-medium transition-colors flex items-center gap-2">
              Добавить
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileUpload}
                disabled={isLoading}
              />
            </label>
          )}
        </div>

        {userPhotos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {userPhotos.map((photo, idx) => (
              <div key={idx} className="relative aspect-square group rounded-2xl overflow-hidden shadow-sm border border-[#F3F4F6]">
                <img 
                  src={photo} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                  alt="User memory" 
                />
                {!readOnly && (
                  <button 
                    onClick={() => removePhoto(idx)} 
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-[#F3F4F6] rounded-3xl py-16 md:py-20 text-center">
            <div className="text-4xl mb-3 opacity-20">📷</div>
            <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider">
              {isLoading ? 'Загрузка...' : 'Здесь пока пусто'}
            </p>
          </div>
        )}
      </section>
    </>
  );
}
