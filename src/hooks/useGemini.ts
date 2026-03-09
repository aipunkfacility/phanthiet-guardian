import { useState, useCallback, useRef } from 'react';
import { getGeminiGuideResponse } from '@/services/gemini';
import { geminiRateLimiter } from '@/utils/rateLimiter';

export interface UseGeminiReturn {
  getResponse: (message: string) => Promise<string>;
  clearCache: () => void;
  isLoading: boolean;
  error: Error | null;
  rateLimited: boolean;
  remainingTime: number;
  clearError: () => void;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export function useGemini(): UseGeminiReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const cacheRef = useRef<Map<string, string>>(new Map());

  const getResponse = useCallback(async (message: string): Promise<string> => {
    const sessionKey = 'gemini-chat';
    
    if (!geminiRateLimiter.canProceed(sessionKey)) {
      const remaining = geminiRateLimiter.getRemainingTime(sessionKey);
      setRateLimited(true);
      setRemainingTime(remaining);
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(remaining / 1000)} seconds.`);
    }

    const cacheKey = message;
    if (cacheRef.current.has(cacheKey)) {
      return cacheRef.current.get(cacheKey)!;
    }

    setIsLoading(true);
    setError(null);
    setRateLimited(false);

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

  const clearError = useCallback(() => {
    setError(null);
    setRateLimited(false);
  }, []);

  return {
    getResponse,
    clearCache,
    isLoading,
    error,
    rateLimited,
    remainingTime,
    clearError,
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export function useGeminiChat() {
  const { getResponse, clearCache, isLoading, error, rateLimited, remainingTime, clearError } = useGemini();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      role: 'user',
      text: content,
    };

    setMessages(prev => [...prev, userMessage]);
    clearError();

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
        text: rateLimited ? `Слишком много запросов. Попробуйте через ${Math.ceil(remainingTime / 1000)} секунд.` : 'Извините, произошла ошибка. Попробуйте ещё раз.',
      };
      setMessages(prev => [...prev, errorMessage]);
      throw err;
    }
  }, [getResponse, clearError, rateLimited, remainingTime]);

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
    rateLimited,
    remainingTime,
  };
}
