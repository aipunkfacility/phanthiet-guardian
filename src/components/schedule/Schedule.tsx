import { Temple } from '@/types';
import { useSchedule } from '@/hooks/useSchedule';
import { Timeline } from './Timeline';
import { SunsetIndicator } from './SunsetIndicator';

interface ScheduleProps {
  temples: Temple[];
}

export function Schedule({ temples }: ScheduleProps) {
  const { schedule } = useSchedule(temples);

  return (
    <>
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 mb-6 border-b border-stone-200 pb-4">Таймлайн</h3>
      
      {temples.length > 0 ? (
        <>
          <Timeline schedule={schedule} />
          
          <SunsetIndicator />
          
          <div className="mt-6 pt-6 border-t border-stone-200">
            <div className="flex items-center gap-3 text-indigo-600">
              <span className="text-xl font-bold">17:15</span>
              <span className="text-[10px] uppercase font-medium tracking-wider leading-none">Закат</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>Нет храмов</p>
        </div>
      )}
    </>
  );
}
