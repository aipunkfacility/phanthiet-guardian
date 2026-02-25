
import React, { useState, useEffect } from 'react';
import { Temple } from '../types';
import AudioGuidePlayer from './AudioGuidePlayer';
import { savePhotos, getPhotos, compressImage, MAX_PHOTOS, migrateFromLocalStorage } from '../utils/db';
import { TEMPLES } from '../constants';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { X, MapPin, Clock, Camera, Trash2, Play, Pause } from 'lucide-react';

interface TempleCardProps {
  temple: Temple;
  onClose: () => void;
  onSave?: (updated: Temple) => void;
}

const TempleCard: React.FC<TempleCardProps> = ({ temple, onClose, onSave }) => {
  const [userPhotos, setUserPhotos] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
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

  const currentAddress = onSave ? editData.address : temple.location.address;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentAddress)}`;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-4 bg-black/90 backdrop-blur-xl">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 z-[170] text-white hover:bg-white/20"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </Button>

      <div className="bg-white w-full h-full md:max-w-6xl md:h-auto md:max-h-[92vh] overflow-y-auto md:rounded-[2.5rem] shadow-2xl relative custom-scrollbar overflow-x-hidden">
        
        <div className="grid lg:grid-cols-5 gap-0 h-full">
          {/* Left Column: Media & Core Info */}
          <div className="lg:col-span-2 bg-stone-50 border-r border-stone-100 flex flex-col">
            <div className="h-72 md:h-96 shrink-0 relative overflow-hidden">
              <img 
                src={onSave ? editData.imageUrl : temple.imageUrl} 
                alt={temple.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Error';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 text-white pr-10 w-full max-w-[85%]">
                <span className="px-3 py-1 bg-orange-600 rounded-full text-[9px] font-bold uppercase tracking-wider mb-2 inline-block shadow-lg">
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
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight drop-shadow-lg">{temple.name}</h2>
                )}
              </div>
            </div>
            
            <div className="p-6 md:p-8 space-y-6 flex-1">
              {onSave ? (
                <section className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-red-600 tracking-widest">Таймлайн</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-stone-400">Открытие</label>
                      <input type="text" className="w-full bg-stone-50 p-2 rounded border text-xs" value={editData.openTime} onChange={(e) => setEditData({...editData, openTime: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-stone-400">Закрытие</label>
                      <input type="text" className="w-full bg-stone-50 p-2 rounded border text-xs" value={editData.closeTime} onChange={(e) => setEditData({...editData, closeTime: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-stone-400">Длительность</label>
                    <input type="text" className="w-full bg-stone-50 p-2 rounded border text-xs" value={editData.duration} onChange={(e) => setEditData({...editData, duration: e.target.value})} />
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editData.hasLunchBreak} onChange={(e) => setEditData({...editData, hasLunchBreak: e.target.checked})} className="rounded text-red-600" />
                      <span className="text-[10px] font-bold text-stone-600">Обед</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editData.isNightActive} onChange={(e) => setEditData({...editData, isNightActive: e.target.checked})} className="rounded text-red-600" />
                      <span className="text-[10px] font-bold text-stone-600">Красиво вечером</span>
                    </label>
                  </div>
                </section>
              ) : (
                <div className="bg-stone-900 rounded-2xl overflow-hidden shadow-xl border border-white/5">
                  <AudioGuidePlayer title="Слушать Хранителя" text={temple.audioScript} />
                </div>
              )}

              <section className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-bold uppercase text-stone-400 tracking-widest">Локация</h4>
                  <button onClick={copyToClipboard} className="text-[9px] font-black text-orange-600 uppercase hover:underline">
                    {copied ? 'Готово' : 'Копировать'}
                  </button>
                </div>

                {onSave ? (
                  <div className="space-y-3">
                    <textarea 
                      className="w-full bg-stone-100 p-3 rounded-lg text-xs font-medium focus:ring-1 focus:ring-red-500 outline-none h-16 resize-none"
                      value={editData.address}
                      onChange={(e) => setEditData({...editData, address: e.target.value})}
                    />
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-stone-400">Фото (URL)</label>
                      <input type="text" className="w-full bg-stone-50 p-2 rounded border text-[10px]" value={editData.imageUrl} onChange={(e) => setEditData({...editData, imageUrl: e.target.value})} />
                    </div>
                    <button onClick={handleSave} className="w-full bg-stone-900 text-white py-3.5 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg text-[10px] uppercase tracking-widest">
                      Сохранить изменения
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-xs md:text-sm text-stone-700 font-medium leading-snug">{temple.location.address}</p>
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="w-full flex justify-center items-center gap-3 bg-stone-900 text-white px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg">
                      Открыть в Картах
                    </a>
                  </>
                )}
              </section>
            </div>
          </div>

          {/* Right Column: History & Gallery */}
          <div className="lg:col-span-3 p-6 md:p-12 space-y-12 bg-white flex flex-col">
            <section>
              <h4 className="text-xs md:text-sm font-black uppercase text-orange-800 mb-4 flex items-center gap-2 tracking-widest">
                <span className="w-6 md:w-8 h-px bg-orange-800"></span>
                История места
              </h4>
              {onSave ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-stone-400">Скрипт гида</label>
                    <textarea 
                      className="w-full bg-stone-50 border p-4 rounded-xl text-xs italic font-serif h-24 resize-none"
                      value={editData.audioScript}
                      onChange={(e) => setEditData({...editData, audioScript: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-stone-400">Описание</label>
                    <textarea 
                      className="w-full bg-stone-50 border p-4 rounded-xl text-stone-700 leading-relaxed text-sm h-64 resize-none font-serif"
                      value={editData.history}
                      onChange={(e) => setEditData({...editData, history: e.target.value})}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-stone-700 leading-relaxed text-sm md:text-lg whitespace-pre-wrap font-serif italic">{temple.history}</p>
              )}
            </section>

            <section className="flex-1">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h4 className="text-xs md:text-sm font-black uppercase text-orange-800 mb-1 flex items-center gap-2 tracking-widest">
                    <span className="w-6 md:w-8 h-px bg-orange-800"></span>
                    Мой альбом
                  </h4>
                  <p className="text-[10px] text-stone-400 font-bold uppercase">Ваши кадры из поездки</p>
                </div>
                {!onSave && (
                  <label className="cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                    Добавить
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                )}
              </div>

              {userPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                  {userPhotos.map((photo, idx) => (
                    <div key={idx} className="relative aspect-square group rounded-2xl overflow-hidden shadow-sm border border-stone-100">
                      <img src={photo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="User memory" />
                      {!onSave && (
                        <button onClick={() => removePhoto(idx)} className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-stone-100 rounded-[2rem] py-16 md:py-24 text-center">
                  <div className="text-5xl mb-4 opacity-10 grayscale">📸</div>
                  <p className="text-stone-300 text-xs font-black uppercase tracking-widest">Здесь пусто</p>
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
