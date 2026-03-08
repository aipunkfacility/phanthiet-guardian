import { PlanContext, ScheduleItem } from '@/types';
import { Temple } from '@/types';

export function getPlanContext(): PlanContext {
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;

  if (currentHour >= 18) {
    return {
      mode: 'tomorrow',
      label: 'План на завтра',
      startH: 8,
      startM: 30,
      desc: 'Начнем завтра в 8:30, когда храмы открыты. Вечером лучше отдыхать.',
    };
  }
  if (currentHour < 10) {
    return {
      mode: 'morning',
      label: 'Свежий старт',
      startH: 9,
      startM: 0,
      desc: 'Начнем в 9:00, когда все храмы открыты. Идеальное время для осмотра.',
    };
  }
  return {
    mode: 'now',
    label: 'Маршрут "Сейчас"',
    startH: now.getHours(),
    startM: now.getMinutes(),
    desc: 'Составляем маршрут с учетом текущего времени. Успеем посетить основные храмы.',
  };
}

export function calculateSchedule(temples: Temple[]): ScheduleItem[] {
  const context = getPlanContext();
  const startTime = new Date();
  startTime.setHours(context.startH, context.startM, 0, 0);

  return temples.map((temple, index) => {
    const arrivalTime = new Date(startTime.getTime() + index * 45 * 60000);
    const duration = 30; // 30 минут на каждый храм
    const departureTime = new Date(arrivalTime.getTime() + duration * 60000);

    return {
      temple,
      arrivalTime,
      duration,
      departureTime,
      isSunset: isSunsetTime(arrivalTime),
    };
  });
}

export function isSunsetTime(time: Date): boolean {
  const sunsetHour = 18; // 18:00
  const sunsetStart = new Date(time);
  sunsetStart.setHours(sunsetHour, 0, 0, 0);
  const sunsetEnd = new Date(time);
  sunsetEnd.setHours(sunsetHour + 1, 0, 0, 0);

  return time >= sunsetStart && time <= sunsetEnd;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} мин`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} ч и ${remainingMinutes} мин`;
}