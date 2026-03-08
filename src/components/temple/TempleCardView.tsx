import { Temple } from '@/types';
import AudioGuidePlayer from '../AudioGuidePlayer';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';

interface TempleCardViewProps {
  temple: Temple;
  newImage?: string | null;
  onEdit?: (() => void) | undefined;
}

export function TempleCardView({ temple, newImage, onEdit }: TempleCardViewProps) {
  const currentAddress = temple.location.address;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentAddress)}`;

  return (
    <>
      <div className="h-72 md:h-96 shrink-0 relative overflow-hidden group">
        <img 
          src={newImage || temple.imageUrl} 
          alt={temple.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=No+Image';
          }}
        />
        
        <div className="absolute bottom-6 left-6 text-white pr-10 w-full max-w-[85%]">
          <span className="px-3 py-1 bg-orange-600 rounded-full text-[10px] font-semibold uppercase tracking-[0.05em] mb-2 inline-block">
            {temple.culture}
          </span>
          <h2 className="text-[22px] font-extrabold leading-tight text-white drop-shadow-md">
            {temple.name}
          </h2>
        </div>
      </div>

      <div className="p-6 md:p-7 space-y-6 flex-1">
        <div className="bg-stone-900 rounded-2xl overflow-hidden shadow-xl border border-white/5">
          <AudioGuidePlayer title="Слушать Хранителя" text={temple.audioScript} />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#6B7280]">
              Локация
            </CardTitle>
            {onEdit && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onEdit}
                className="text-[10px] font-semibold text-orange-600 uppercase h-auto p-0"
              >
                Редактировать
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#4B5563] leading-relaxed">{temple.location.address}</p>
            <a 
              href={googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full flex justify-center items-center gap-3 bg-[#111827] text-white px-6 py-3.5 rounded-xl text-[12px] font-semibold uppercase tracking-wide hover:bg-orange-600 transition-colors cursor-pointer"
            >
              Открыть в Картах
            </a>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
