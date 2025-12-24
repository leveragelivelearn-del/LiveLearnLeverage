interface RateLimitOptions {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval?: number // Max unique tokens per interval
}

export function rateLimit(options: RateLimitOptions) {
  // Use a native Map instead of external LRUCache to avoid type errors
  const tokenCache = new Map<string, number[]>()

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

      // Simple cleanup: If cache grows too large, clear it to prevent memory leaks
      // (This mimics the 'max' behavior of LRU Cache simply)
      if (tokenCache.size > (options.uniqueTokenPerInterval || 500)) {
        tokenCache.clear() 
      }

      return false // Not rate limited
    },
  }
}