
import React, { useState, useEffect } from 'react';
import { Temple } from '../types';
import AudioGuidePlayer from './AudioGuidePlayer';
import { savePhotos, getPhotos, compressImage, MAX_PHOTOS, migrateFromLocalStorage } from '../utils/db';
import { TEMPLES } from '../constants';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { X, Upload } from 'lucide-react';

interface TempleCardProps {
  temple: Temple;
  onClose: () => void;
  onSave?: (updated: Temple) => void;
}

const TempleCard: React.FC<TempleCardProps> = ({ temple, onClose, onSave }) => {
  const [userPhotos, setUserPhotos] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [newImage, setNewImage] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    address: temple.location.address,
    name: temple.name,
    imageUrl: temple.imageUrl,
    audioScript: temple.audioScript,
    description: temple.description,
    history: temple.history,
    duration: temple.duration,
    openTime: temple.openTime || "07:30",
    closeTime: temple.closeTime || "17:00",
    hasLunchBreak: temple.hasLunchBreak,
    isNightActive: temple.isNightActive || false
  });
  
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const templeIds = TEMPLES.map(t => t.id);
        await migrateFromLocalStorage(templeIds);
        const photos = await getPhotos(temple.id);
        setUserPhotos(photos);
      } catch (err) {
        console.error('Failed to load photos:', err);
      }
    };
    loadPhotos();
  }, [temple.id]);

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...temple,
        name: editData.name,
        imageUrl: editData.imageUrl,
        audioScript: editData.audioScript,
        description: editData.description,
        history: editData.history,
        duration: editData.duration,
        openTime: editData.openTime,
        closeTime: editData.closeTime,
        hasLunchBreak: editData.hasLunchBreak,
        isNightActive: editData.isNightActive,
        location: {
          address: editData.address
        }
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editData.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (userPhotos.length >= MAX_PHOTOS) {
      alert(`Максимум ${MAX_PHOTOS} фото на храм`);
      return;
    }

    for (const file of Array.from(files) as File[]) {
      if (userPhotos.length >= MAX_PHOTOS) break;
      try {
        const base64 = await compressImage(file);
        setUserPhotos(prev => {
          const updated = [...prev, base64];
          savePhotos(temple.id, updated);
          return updated;
        });
      } catch (err) {
        console.error('Compression failed:', err);
      }
    }
  };

  const removePhoto = (index: number) => {
    const updated = userPhotos.filter((_, i) => i !== index);
    setUserPhotos(updated);
    savePhotos(temple.id, updated);
  };

  const handleTempleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const base64 = await compressImage(file);
      setNewImage(base64);
      setEditData({ ...editData, imageUrl: base64 });
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };

  const currentAddress = onSave ? editData.address : temple.location.address;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentAddress)}`;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-4 bg-black/90 backdrop-blur-xl">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 z-[170] text-white hover:bg-white/20 cursor-pointer"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </Button>

      <div className="bg-white w-full h-full md:max-w-6xl md:h-auto md:max-h-[92vh] overflow-y-auto md:rounded-3xl shadow-2xl relative custom-scrollbar overflow-x-hidden">
        
        <div className="grid lg:grid-cols-5 gap-0 h-full">
          {/* Left Column: Media & Core Info */}
          <div className="lg:col-span-2 bg-stone-50 border-r border-[#F3F4F6] flex flex-col">
            <div className="h-72 md:h-96 shrink-0 relative overflow-hidden group">
              {onSave ? (
                <label className="cursor-pointer w-full h-full block">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleTempleImageUpload} 
                  />
                  <img 
                    src={newImage || editData.imageUrl} 
                    alt={temple.name} 
                    className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium text-gray-900">
                      <Upload className="w-4 h-4" />
                      Заменить фото
                    </div>
                  </div>
                </label>
              ) : (
                <img 
                  src={temple.imageUrl} 
                  alt={temple.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=No+Image';
                  }}
                />
              )}
              
              <div className="absolute bottom-6 left-6 text-white pr-10 w-full max-w-[85%]">
                <span className="px-3 py-1 bg-orange-600 rounded-full text-[10px] font-semibold uppercase tracking-[0.05em] mb-2 inline-block">
                  {temple.culture}
                </span>
                {onSave ? (
                  <div className="space-y-2">
                    <Input 
                      placeholder="Название"
                      className="bg-white/10 border-white/30 text-xl font-bold text-white placeholder:text-white/30"
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                    />
                  </div>
                ) : (
                  <h2 className="text-[22px] font-extrabold leading-tight text-white drop-shadow-md">{temple.name}</h2>
                )}
              </div>
            </div>
            
            <div className="p-6 md:p-7 space-y-6 flex-1">
              {onSave ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xs font-semibold uppercase text-red-600 tracking-[0.05em]">Таймлайн</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-semibold text-[#6B7280]">Открытие</Label>
                        <Input type="text" value={editData.openTime} onChange={(e) => setEditData({...editData, openTime: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-semibold text-[#6B7280]">Закрытие</Label>
                        <Input type="text" value={editData.closeTime} onChange={(e) => setEditData({...editData, closeTime: e.target.value})} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-semibold text-[#6B7280]">Длительность</Label>
                      <Input type="text" value={editData.duration} onChange={(e) => setEditData({...editData, duration: e.target.value})} />
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editData.hasLunchBreak} onChange={(e) => setEditData({...editData, hasLunchBreak: e.target.checked})} className="rounded text-orange-600" />
                        <span className="text-[12px] font-medium text-[#4B5563]">Обед</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editData.isNightActive} onChange={(e) => setEditData({...editData, isNightActive: e.target.checked})} className="rounded text-orange-600" />
                        <span className="text-[12px] font-medium text-[#4B5563]">Красиво вечером</span>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="bg-stone-900 rounded-2xl overflow-hidden shadow-xl border border-white/5">
                  <AudioGuidePlayer title="Слушать Хранителя" text={temple.audioScript} />
                </div>
              )}

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#6B7280]">Локация</CardTitle>
                  <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-[10px] font-semibold text-orange-600 uppercase h-auto p-0">
                    {copied ? 'Готово' : 'Копировать'}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {onSave ? (
                    <div className="space-y-3">
                      <Textarea 
                        className="resize-none"
                        value={editData.address}
                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                      />
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-semibold text-[#6B7280]">Фото (URL)</Label>
                        <Input type="text" value={editData.imageUrl} onChange={(e) => setEditData({...editData, imageUrl: e.target.value})} />
                      </div>
                      <Button onClick={handleSave} className="w-full">
                        Сохранить изменения
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-[#4B5563] leading-relaxed">{temple.location.address}</p>
                      <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="w-full flex justify-center items-center gap-3 bg-[#111827] text-white px-6 py-3.5 rounded-xl text-[12px] font-semibold uppercase tracking-wide hover:bg-orange-600 transition-colors cursor-pointer">
                        Открыть в Картах
                      </a>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column: History & Gallery */}
          <div className="lg:col-span-3 p-7 space-y-8 bg-white flex flex-col">
            <section>
              <h4 className="text-[12px] font-semibold uppercase tracking-[0.05em] text-orange-600 mb-2 flex items-center gap-2">
                <span className="w-6 h-px bg-orange-600"></span>
                История места
              </h4>
              {onSave ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold uppercase text-[#6B7280]">Скрипт гида</label>
                    <textarea 
                      className="w-full bg-stone-50 border border-[#E5E7EB] p-4 rounded-xl text-sm leading-relaxed h-24 resize-none"
                      value={editData.audioScript}
                      onChange={(e) => setEditData({...editData, audioScript: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold uppercase text-[#6B7280]">Описание</label>
                    <textarea 
                      className="w-full bg-stone-50 border border-[#E5E7EB] p-4 rounded-xl text-sm leading-[1.625] h-64 resize-none"
                      value={editData.history}
                      onChange={(e) => setEditData({...editData, history: e.target.value})}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-[#4B5563] leading-[1.625] text-sm md:text-base whitespace-pre-wrap">{temple.history}</p>
              )}
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
                {!onSave && (
                  <label className="cursor-pointer bg-white border border-[#E5E7EB] hover:border-orange-500 text-[#4B5563] px-4 py-2 rounded-full text-[12px] font-medium transition-colors flex items-center gap-2">
                    Добавить
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                )}
              </div>

              {userPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                  {userPhotos.map((photo, idx) => (
                    <div key={idx} className="relative aspect-square group rounded-2xl overflow-hidden shadow-sm border border-[#F3F4F6]">
                      <img src={photo} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt="User memory" />
                      {!onSave && (
                        <button onClick={() => removePhoto(idx)} className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#F3F4F6] rounded-3xl py-16 md:py-20 text-center">
                  <div className="text-4xl mb-3 opacity-20">📷</div>
                  <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider">Здесь пока пусто</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempleCard;
