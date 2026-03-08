import { useState, useCallback, useRef } from 'react';
import { getGeminiGuideResponse } from '@/services/gemini';

export interface UseGeminiReturn {
  getResponse: (message: string) => Promise<string>;
  clearCache: () => void;
  isLoading: boolean;
  error: Error | null;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export function useGemini(): UseGeminiReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<Map<string, string>>(new Map());

  const getResponse = useCallback(async (message: string): Promise<string> => {
    const cacheKey = message;

    if (cacheRef.current.has(cacheKey)) {
      return cacheRef.current.get(cacheKey)!;
    }

    setIsLoading(true);
    setError(null);

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await getGeminiGuideResponse(message);
        
        cacheRef.current.set(cacheKey, response);
        
        setIsLoading(false);
        return response;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.warn(`Gemini request failed (attempt ${attempt + 1}/${MAX_RETRIES}):`, lastError.message);
        
        if (attempt < MAX_RETRIES - 1) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (attempt + 1)));
        }
      }
    }

    setError(lastError);
    setIsLoading(false);
    throw lastError;
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    getResponse,
    clearCache,
    isLoading,
    error,
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export function useGeminiChat() {
  const { getResponse, clearCache, isLoading, error } = useGemini();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      role: 'user',
      text: content,
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await getResponse(content);
      const assistantMessage: ChatMessage = {
        role: 'model',
        text: response,
      };
      setMessages(prev => [...prev, assistantMessage]);
      return response;
    } catch (err) {
      const errorMessage: ChatMessage = {
        role: 'model',
        text: 'Извините, произошла ошибка. Попробуйте ещё раз.',
      };
      setMessages(prev => [...prev, errorMessage]);
      throw err;
    }
  }, [getResponse]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    clearCache();
  }, [clearCache]);

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading,
    error,
  };
}
