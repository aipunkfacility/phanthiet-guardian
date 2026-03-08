import { ScheduleItem } from '@/hooks/useSchedule';

interface TimelineProps {
  schedule: ScheduleItem[];
}

export function Timeline({ schedule }: TimelineProps) {
  if (schedule.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {schedule.map((item, index) => (
        <TimelineItem key={item.temple.id} item={item} index={index} />
      ))}
    </div>
  );
}

function TimelineItem({ item, index }: { item: ScheduleItem; index: number }) {
  const arrivalTime = formatTime(item.arrivalTime);
  const duration = parseInt(item.temple.duration) || 30;
  
  const arrivalDec = item.arrivalTime.getHours() + item.arrivalTime.getMinutes() / 60;
  const openH = item.temple.openTime ? parseFloat(item.temple.openTime.split(':')[0]) + parseFloat(item.temple.openTime.split(':')[1])/60 : 7.5;
  const closeH = item.temple.closeTime ? parseFloat(item.temple.closeTime.split(':')[0]) + parseFloat(item.temple.closeTime.split(':')[1])/60 : 17;
  
  const isLunch = item.temple.hasLunchBreak && (arrivalDec >= 11.5 && arrivalDec < 13.5);
  const isClosed = (arrivalDec < openH || arrivalDec >= closeH) && !item.temple.isNightActive;
  const isGolden = item.temple.isNightActive && arrivalDec >= 16.75 && arrivalDec <= 18.5;

  const dotColor = isLunch ? 'bg-amber-500' : 
    isClosed ? 'bg-stone-400' : 
    isGolden ? 'bg-indigo-500 scale-110 shadow-indigo-500/30 shadow-lg' : 
    'bg-orange-600';

  const textColor = isGolden ? 'text-indigo-500' : 
    isClosed ? 'text-stone-400' : 
    'text-stone-500';

  return (
    <div 
      key={item.temple.id} 
      className={`flex gap-4 relative transition-all duration-300 ${isClosed ? 'opacity-40' : 'opacity-100'}`}
    >
      {index !== 0 && <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-stone-200"></div>}
      
      <div className={`w-5 h-5 rounded-full shrink-0 z-10 border-3 border-white shadow-sm flex items-center justify-center transition-all ${dotColor}`}>
        {isClosed ? null : <span className="w-2 h-2 bg-white rounded-full"></span>}
      </div>

      <div className="flex-1 min-w-0 pb-3">
        <div className="flex justify-between items-baseline gap-2">
          <span className={`text-xs font-semibold tabular-nums ${textColor}`}>
            {arrivalTime}
          </span>
          {isLunch && <span className="text-[10px] font-medium text-amber-600 uppercase">Обед</span>}
          {isGolden && <span className="text-[9px] font-semibold text-indigo-500 uppercase tracking-tight">Магия</span>}
        </div>
        <h5 className={`text-xs font-medium truncate leading-tight mt-0.5 ${isClosed ? 'text-stone-400' : 'text-stone-700'}`}>
          {item.temple.name}
        </h5>
      </div>
    </div>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
