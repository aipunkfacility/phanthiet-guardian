import { describe, it, expect } from 'vitest';
import { TEMPLES, APP_CONFIG } from '../constants';
import { TempleCulture } from '../types';

describe('TEMPLES', () => {
  it('should have at least one temple', () => {
    expect(TEMPLES.length).toBeGreaterThan(0);
  });

  it('should have valid temple data', () => {
    TEMPLES.forEach(temple => {
      expect(temple.id).toBeDefined();
      expect(temple.name).toBeDefined();
      expect(temple.culture).toBeDefined();
      expect(temple.description).toBeDefined();
      expect(temple.history).toBeDefined();
      expect(temple.location).toBeDefined();
      expect(temple.imageUrl).toBeDefined();
      expect(temple.duration).toBeDefined();
      expect(temple.hasLunchBreak).toBeDefined();
    });
  });

  it('should have unique ids', () => {
    const ids = TEMPLES.map(t => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have valid cultures', () => {
    const validCultures = Object.values(TempleCulture);
    TEMPLES.forEach(temple => {
      expect(validCultures).toContain(temple.culture);
    });
  });

  it('should have duration in minutes', () => {
    TEMPLES.forEach(temple => {
      const match = temple.duration.match(/(\d+)/);
      expect(match).toBeTruthy();
      const minutes = parseInt(match![1], 10);
      expect(minutes).toBeGreaterThan(0);
    });
  });
});

describe('TEMPLES entries', () => {
  it('should contain vanthuytu', () => {
    const temple = TEMPLES.find(t => t.id === 'vanthuytu');
    expect(temple).toBeDefined();
    expect(temple!.name).toContain('Ван Туй Ту');
  });

  it('should contain chuaong', () => {
    const temple = TEMPLES.find(t => t.id === 'chuaong');
    expect(temple).toBeDefined();
    expect(temple!.name).toContain('Гуань');
  });

  it('should contain posahinu', () => {
    const temple = TEMPLES.find(t => t.id === 'posahinu');
    expect(temple).toBeDefined();
    expect(temple!.name).toContain('Пошану');
  });

  it('should contain fishingvillage', () => {
    const temple = TEMPLES.find(t => t.id === 'fishingvillage');
    expect(temple).toBeDefined();
    expect(temple!.name).toContain('Рыбацкая');
  });
});

describe('APP_CONFIG', () => {
  it('should have title', () => {
    expect(APP_CONFIG.TITLE).toBeDefined();
    expect(typeof APP_CONFIG.TITLE).toBe('string');
  });

  it('should have subtitle', () => {
    expect(APP_CONFIG.SUBTITLE).toBeDefined();
    expect(typeof APP_CONFIG.SUBTITLE).toBe('string');
  });

  it('should have tripster URL', () => {
    expect(APP_CONFIG.TRIPSTER_URL).toBeDefined();
    expect(APP_CONFIG.TRIPSTER_URL).toContain('http');
  });
});
