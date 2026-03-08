import { useState } from 'react';
import { Temple } from '@/types';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Upload } from 'lucide-react';

interface TempleCardEditProps {
  temple: Temple;
  newImage?: string | null;
  onImageChange: (image: string | null) => void;
  onSave: (temple: Temple) => void;
}

export function TempleCardEdit({ 
  temple, 
  newImage, 
  onImageChange, 
  onSave 
}: TempleCardEditProps) {
  const [editData, setEditData] = useState({
    address: temple.location.address,
    name: temple.name,
    imageUrl: temple.imageUrl,
    audioScript: temple.audioScript,
    history: temple.history,
    duration: temple.duration,
    openTime: temple.openTime || "07:30",
    closeTime: temple.closeTime || "17:00",
    hasLunchBreak: temple.hasLunchBreak,
    isNightActive: temple.isNightActive || false
  });

  const handleSave = () => {
    onSave({
      ...temple,
      name: editData.name,
      imageUrl: newImage || editData.imageUrl,
      audioScript: editData.audioScript,
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
  };

  return (
    <>
      <div className="h-72 md:h-96 shrink-0 relative overflow-hidden group">
        <label className="cursor-pointer w-full h-full block">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  onImageChange(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }} 
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
        
        <div className="absolute bottom-6 left-6 text-white pr-10 w-full max-w-[85%]">
          <span className="px-3 py-1 bg-orange-600 rounded-full text-[10px] font-semibold uppercase tracking-[0.05em] mb-2 inline-block">
            {temple.culture}
          </span>
          <Input 
            placeholder="Название"
            className="bg-white/10 border-white/30 text-xl font-bold text-white placeholder:text-white/30"
            value={editData.name}
            onChange={(e) => setEditData({...editData, name: e.target.value})}
          />
        </div>
      </div>

      <div className="p-6 md:p-7 space-y-6 flex-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-semibold uppercase text-red-600 tracking-[0.05em]">
              Таймлайн
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-semibold text-[#6B7280]">Открытие</Label>
                <Input 
                  type="text" 
                  value={editData.openTime} 
                  onChange={(e) => setEditData({...editData, openTime: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-semibold text-[#6B7280]">Закрытие</Label>
                <Input 
                  type="text" 
                  value={editData.closeTime} 
                  onChange={(e) => setEditData({...editData, closeTime: e.target.value})} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-semibold text-[#6B7280]">Длительность</Label>
              <Input 
                type="text" 
                value={editData.duration} 
                onChange={(e) => setEditData({...editData, duration: e.target.value})} 
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={editData.hasLunchBreak} 
                  onChange={(e) => setEditData({...editData, hasLunchBreak: e.target.checked})} 
                  className="rounded text-orange-600" 
                />
                <span className="text-[12px] font-medium text-[#4B5563]">Обед</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={editData.isNightActive} 
                  onChange={(e) => setEditData({...editData, isNightActive: e.target.checked})} 
                  className="rounded text-orange-600" 
                />
                <span className="text-[12px] font-medium text-[#4B5563]">Красиво вечером</span>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#6B7280]">
              Локация
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label className="text-[10px] uppercase font-semibold text-[#6B7280]">Адрес</Label>
              <Input 
                type="text" 
                value={editData.address}
                onChange={(e) => setEditData({...editData, address: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-semibold text-[#6B7280]">Фото (URL)</Label>
              <Input 
                type="text" 
                value={editData.imageUrl} 
                onChange={(e) => setEditData({...editData, imageUrl: e.target.value})} 
              />
            </div>
            <Button onClick={handleSave} className="w-full">
              Сохранить изменения
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
