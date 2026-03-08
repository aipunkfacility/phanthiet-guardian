import { useState, useEffect, useCallback } from 'react';
import { Temple, PlanContext, ScheduleItem } from '@/types';
import { calculateSchedule, getPlanContext, formatTime } from '@/utils/scheduleCalculations';

export type { PlanContext, ScheduleItem };

export function useSchedule(temples: Temple[]) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [context, setContext] = useState(getPlanContext());
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  // Обновляем контекст каждые 5 минут
  useEffect(() => {
    const interval = setInterval(() => {
      const newContext = getPlanContext();
      setContext(newContext);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Обновляем расписание при изменении храмов или времени
  useEffect(() => {
    const newSchedule = calculateSchedule(temples);
    setSchedule(newSchedule);
  }, [temples, context]);

  const buildGoogleMapsRoute = useCallback(() => {
    if (temples.length === 0) return;
    
    const origin = 'Phan Thiet, Vietnam';
    const waypoints = temples.map(temple => temple.name).join('|&#124;');
    const destination = temples[temples.length - 1].name;
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&waypoints=${encodeURIComponent(waypoints)}&travelmode=walking`;
    
    window.open(url, '_maps');
  }, [temples]);

  const getEstimatedTime = useCallback((index: number) => {
    if (index < 0 || index >= schedule.length) return null;
    const item = schedule[index];
    return {
      arrival: formatTime(item.arrivalTime),
      departure: formatTime(item.departureTime),
      duration: formatDuration(item.duration),
    };
  }, [schedule]);

  const isTempleOpen = useCallback((temple: Temple, time: Date) => {
    // Упрощенная логика: открыто с 8:00 до 18:00
    const hour = time.getHours();
    return hour >= 8 && hour < 18;
  }, []);

  return {
    context,
    schedule,
    buildGoogleMapsRoute,
    getEstimatedTime,
    isTempleOpen,
  };
}

export function usePlanContext() {
  const [context, setContext] = useState(getPlanContext());

  // Обновляем контекст каждые 5 минут
  useEffect(() => {
    const interval = setInterval(() => {
      setContext(getPlanContext());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return context;
}

export function useScheduleTimer() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return currentTime;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} мин`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} ч и ${remainingMinutes} мин`;
}