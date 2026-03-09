import { useState, useEffect, useCallback } from 'react';
import { Temple } from '@/types';
import { TEMPLES } from '@/constants';

export function useTempleData() {
  const [temples, setTemples] = useState<Temple[]>(() => {
    try {
      const saved = localStorage.getItem('phanthiet-temples');
      return saved ? JSON.parse(saved) : TEMPLES;
    } catch (error) {
      console.warn('Failed to load temples from localStorage, using defaults', error);
      return TEMPLES;
    }
  });

  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Сохранение при изменении
  useEffect(() => {
    try {
      localStorage.setItem('phanthiet-temples', JSON.stringify(temples));
    } catch (error) {
      console.warn('Failed to save temples to localStorage', error);
    }
  }, [temples]);

  const updateTemple = useCallback((id: string, updates: Partial<Temple>) => {
    setTemples(prev => prev.map(temple => temple.id === id ? { ...temple, ...updates } : temple));
  }, []);

  const selectTemple = useCallback((temple: Temple | null) => {
    setSelectedTemple(temple);
  }, []);

  const importTemples = useCallback((newTemples: Temple[]) => {
    setIsLoading(true);
    setError(null);
    try {
      setTemples(newTemples);
    } catch (error) {
      setError('Failed to import temples');
      console.error('Import error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exportTemples = useCallback(() => {
    return temples;
  }, [temples]);

  return {
    temples,
    selectedTemple,
    selectTemple,
    updateTemple,
    importTemples,
    exportTemples,
    isLoading,
    error,
  };
}