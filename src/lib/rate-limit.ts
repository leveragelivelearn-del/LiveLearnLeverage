import { LRUCache } from 'lru-cache'

interface RateLimitOptions {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max unique tokens per interval
}

export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  })

  return {
    check: async (token: string, limit: number) => {
      const now = Date.now()
      const timestamps = tokenCache.get(token) || []
      
      // Filter timestamps within the interval
      const validTimestamps = timestamps.filter((timestamp) => 
        now - timestamp < options.interval
      )
      
      if (validTimestamps.length >= limit) {
        return true // Rate limited
      }
      
      validTimestamps.push(now)
      tokenCache.set(token, validTimestamps)
      return false // Not rate limited
    },
  }
}