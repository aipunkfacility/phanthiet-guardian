import { useState } from 'react';
import { Temple } from '@/types';
import { TempleCardView } from './TempleCardView';
import { TempleCardEdit } from './TempleCardEdit';
import { TempleGallery } from './TempleGallery';
import { Button } from '@/ui/button';
import { X } from 'lucide-react';

interface TempleCardProps {
  temple: Temple;
  onClose: () => void;
  onSave?: ((temple: Temple) => void) | undefined;
}

export function TempleCard({ temple, onClose, onSave }: TempleCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [userPhotos, setUserPhotos] = useState<string[]>([]);
  const [newImage, setNewImage] = useState<string | null>(null);

  const handleSave = (updatedTemple: Temple) => {
    onSave?.(updatedTemple);
    setIsEditing(false);
  };

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
          <div className="lg:col-span-2 bg-stone-50 border-r border-[#F3F4F6] flex flex-col">
            {isEditing && onSave ? (
              <TempleCardEdit
                temple={temple}
                newImage={newImage}
                onImageChange={setNewImage}
                onSave={handleSave}
              />
            ) : (
              <TempleCardView
                temple={temple}
                newImage={newImage}
                onEdit={onSave ? () => setIsEditing(true) : undefined}
              />
            )}
          </div>

          <div className="lg:col-span-3 p-7 space-y-8 bg-white flex flex-col">
            <TempleGallery
              templeId={temple.id}
              userPhotos={userPhotos}
              onPhotosChange={setUserPhotos}
              readOnly={!onSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
