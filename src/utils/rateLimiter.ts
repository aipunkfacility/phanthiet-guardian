interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RequestRecord {
  timestamp: number;
  count: number;
}

class RateLimiter {
  private requests: Map<string, RequestRecord> = new Map();
  
  constructor(private config: RateLimitConfig) {}

  canProceed(key: string): boolean {
    const now = Date.now();
    const record = this.requests.get(key);
    
    if (!record) {
      this.requests.set(key, { timestamp: now, count: 1 });
      return true;
    }

    const windowElapsed = now - record.timestamp > this.config.windowMs;
    
    if (windowElapsed) {
      this.requests.set(key, { timestamp: now, count: 1 });
      return true;
    }

    if (record.count < this.config.maxRequests) {
      record.count++;
      return true;
    }

    return false;
  }

  getRemainingTime(key: string): number {
    const record = this.requests.get(key);
    if (!record) return 0;
    
    const elapsed = Date.now() - record.timestamp;
    return Math.max(0, this.config.windowMs - elapsed);
  }

  clear(): void {
    this.requests.clear();
  }
}

// Singleton instances для разных API
export const geminiRateLimiter = new RateLimiter({
  maxRequests: 10,  // 10 запросов
  windowMs: 60000,  // в минуту
});

export const audioRateLimiter = new RateLimiter({
  maxRequests: 5,   // 5 запросов
  windowMs: 300000, // в 5 минут
});

export default RateLimiter;
