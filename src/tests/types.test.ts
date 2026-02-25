import { describe, it, expect } from 'vitest';
import { Temple, TempleCulture, ChatMessage } from '../types';

describe('TempleCulture', () => {
  it('should have all expected cultures', () => {
    expect(TempleCulture.CHAM).toBe('Чамы (Индуизм)');
    expect(TempleCulture.CHINESE).toBe('Китай (Буддизм/Даосизм)');
    expect(TempleCulture.VIETNAMESE).toBe('Вьетнам (Традиции)');
    expect(TempleCulture.CAODAI).toBe('Каодай (Синтез религий)');
    expect(TempleCulture.HISTORY).toBe('История и наследие');
  });
});

describe('Temple', () => {
  it('should have required fields', () => {
    const temple: Temple = {
      id: 'test-id',
      name: 'Test Temple',
      russianName: 'Тестовый Храм',
      culture: TempleCulture.VIETNAMESE,
      description: 'Test description',
      history: 'Test history',
      location: { address: 'Test address' },
      imageUrl: 'https://example.com/image.jpg',
      highlights: ['Highlight 1', 'Highlight 2'],
      audioScript: 'Test audio script',
      duration: '30 мин',
      hasLunchBreak: false,
    };

    expect(temple.id).toBeDefined();
    expect(temple.name).toBeDefined();
    expect(temple.culture).toBeDefined();
    expect(temple.description).toBeDefined();
    expect(temple.history).toBeDefined();
    expect(temple.location).toBeDefined();
    expect(temple.imageUrl).toBeDefined();
    expect(temple.highlights).toBeDefined();
    expect(temple.audioScript).toBeDefined();
    expect(temple.duration).toBeDefined();
    expect(temple.hasLunchBreak).toBeDefined();
  });

  it('should allow optional fields', () => {
    const temple: Temple = {
      id: 'test-id',
      name: 'Test Temple',
      russianName: 'Тестовый Храм',
      culture: TempleCulture.CHAM,
      description: 'Test',
      history: 'Test',
      location: { address: 'Test' },
      imageUrl: 'https://example.com/image.jpg',
      highlights: [],
      audioScript: 'Test',
      duration: '60 мин',
      hasLunchBreak: true,
      openTime: '07:30',
      closeTime: '17:00',
      isNightActive: true,
    };

    expect(temple.openTime).toBe('07:30');
    expect(temple.closeTime).toBe('17:00');
    expect(temple.isNightActive).toBe(true);
  });
});

describe('ChatMessage', () => {
  it('should have valid roles', () => {
    const userMessage: ChatMessage = {
      role: 'user',
      text: 'Hello',
      timestamp: new Date(),
    };
    const modelMessage: ChatMessage = {
      role: 'model',
      text: 'Hi there',
      timestamp: new Date(),
    };

    expect(userMessage.role).toBe('user');
    expect(modelMessage.role).toBe('model');
    expect(['user', 'model']).toContain(userMessage.role);
  });
});
