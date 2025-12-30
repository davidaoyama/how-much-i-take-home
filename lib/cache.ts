/**
 * Local storage caching utility for tax calculation results
 * Caches results by salary, filing status, and state code
 */

import { TaxCalculation, FilingStatus } from './types';

export interface CacheEntry {
  data: TaxCalculation;
  timestamp: number;
}

export interface CacheConfig {
  maxAge: number; // Maximum age in milliseconds
  maxEntries: number; // Maximum number of cached entries
}

const DEFAULT_CONFIG: CacheConfig = {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  maxEntries: 100, // Store up to 100 calculations
};

class TaxCalculationCache {
  private config: CacheConfig;
  private readonly storageKey = 'salary_calculator_cache';

  constructor(config: CacheConfig = DEFAULT_CONFIG) {
    this.config = config;
  }

  /**
   * Generate a unique cache key from calculation parameters
   */
  private getCacheKey(
    salary: number,
    filingStatus: FilingStatus,
    stateCode: string
  ): string {
    return `${salary}_${filingStatus}_${stateCode}`;
  }

  /**
   * Get cached result if available and not expired
   */
  get(
    salary: number,
    filingStatus: FilingStatus,
    stateCode: string
  ): TaxCalculation | null {
    if (typeof window === 'undefined') return null;

    try {
      const cache = this.loadCache();
      const key = this.getCacheKey(salary, filingStatus, stateCode);
      const entry = cache[key];

      if (!entry) return null;

      // Check if entry is expired
      const now = Date.now();
      const age = now - entry.timestamp;

      if (age > this.config.maxAge) {
        // Entry expired, remove it
        delete cache[key];
        this.saveCache(cache);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.warn('Failed to read from cache:', error);
      return null;
    }
  }

  /**
   * Store a calculation result in cache
   */
  set(
    salary: number,
    filingStatus: FilingStatus,
    stateCode: string,
    data: TaxCalculation
  ): void {
    if (typeof window === 'undefined') return;

    try {
      const cache = this.loadCache();
      const key = this.getCacheKey(salary, filingStatus, stateCode);

      // Add new entry
      cache[key] = {
        data,
        timestamp: Date.now(),
      };

      // Enforce max entries limit (LRU eviction)
      const entries = Object.entries(cache);
      if (entries.length > this.config.maxEntries) {
        // Sort by timestamp (oldest first)
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

        // Remove oldest entries until we're under the limit
        const toRemove = entries.length - this.config.maxEntries;
        for (let i = 0; i < toRemove; i++) {
          delete cache[entries[i][0]];
        }
      }

      this.saveCache(cache);
    } catch (error) {
      console.warn('Failed to write to cache:', error);
    }
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  /**
   * Remove expired entries from cache
   */
  prune(): void {
    if (typeof window === 'undefined') return;

    try {
      const cache = this.loadCache();
      const now = Date.now();
      let hasChanges = false;

      for (const [key, entry] of Object.entries(cache)) {
        const age = now - entry.timestamp;
        if (age > this.config.maxAge) {
          delete cache[key];
          hasChanges = true;
        }
      }

      if (hasChanges) {
        this.saveCache(cache);
      }
    } catch (error) {
      console.warn('Failed to prune cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    totalEntries: number;
    oldestEntry: number | null;
    newestEntry: number | null;
  } {
    if (typeof window === 'undefined') {
      return { totalEntries: 0, oldestEntry: null, newestEntry: null };
    }

    try {
      const cache = this.loadCache();
      const entries = Object.values(cache);

      if (entries.length === 0) {
        return { totalEntries: 0, oldestEntry: null, newestEntry: null };
      }

      const timestamps = entries.map((e) => e.timestamp);
      return {
        totalEntries: entries.length,
        oldestEntry: Math.min(...timestamps),
        newestEntry: Math.max(...timestamps),
      };
    } catch (error) {
      console.warn('Failed to get cache stats:', error);
      return { totalEntries: 0, oldestEntry: null, newestEntry: null };
    }
  }

  /**
   * Load cache from localStorage
   */
  private loadCache(): Record<string, CacheEntry> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return {};

      const cache = JSON.parse(stored);
      return cache || {};
    } catch (error) {
      console.warn('Failed to parse cache:', error);
      return {};
    }
  }

  /**
   * Save cache to localStorage
   */
  private saveCache(cache: Record<string, CacheEntry>): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(cache));
    } catch (error) {
      console.warn('Failed to save cache:', error);
    }
  }
}

// Singleton instance
let cacheInstance: TaxCalculationCache | null = null;

export function getCache(config?: CacheConfig): TaxCalculationCache {
  if (!cacheInstance) {
    cacheInstance = new TaxCalculationCache(config);
  }
  return cacheInstance;
}

/**
 * Convenience function to get cached result
 */
export function getCachedResult(
  salary: number,
  filingStatus: FilingStatus,
  stateCode: string
): TaxCalculation | null {
  return getCache().get(salary, filingStatus, stateCode);
}

/**
 * Convenience function to cache a result
 */
export function cacheResult(
  salary: number,
  filingStatus: FilingStatus,
  stateCode: string,
  data: TaxCalculation
): void {
  getCache().set(salary, filingStatus, stateCode, data);
}
