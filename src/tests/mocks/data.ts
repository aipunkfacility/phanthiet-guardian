import { Temple, TempleCulture, ChatMessage } from '../../types';

export const mockTemple: Temple = {
  id: 'test-temple',
  name: 'Тестовый храм',
  russianName: 'Test Temple',
  culture: TempleCulture.VIETNAMESE,
  description: 'Описание тестового храма',
  history: 'История тестового храма',
  location: { address: 'Test Address 123, Phan Thiet' },
  imageUrl: '/test-image.jpg',
  highlights: ['Особенность 1', 'Особенность 2'],
  audioScript: 'Тестовый аудио скрипт',
  duration: '30 мин',
  hasLunchBreak: true,
  openTime: '07:30',
  closeTime: '17:00',
  isNightActive: false,
};

export const mockTemples: Temple[] = [
  mockTemple,
  {
    ...mockTemple,
    id: 'test-temple-2',
    name: 'Второй храм',
    isNightActive: true,
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    role: 'model',
    text: 'Привет! Я Хранитель историй.',
    timestamp: new Date('2026-01-01T10:00:00'),
  },
  {
    role: 'user',
    text: 'Расскажи о храме Ван Туй Ту',
    timestamp: new Date('2026-01-01T10:01:00'),
  },
  {
    role: 'model',
    text: 'Храм Ван Туй Ту — это главная святыня рыбаков...',
    timestamp: new Date('2026-01-01T10:02:00'),
  },
];

export const mockGeminiResponse = 'Это тестовый ответ от Gemini API';
export const mockAudioBase64 = 'AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQ==';
