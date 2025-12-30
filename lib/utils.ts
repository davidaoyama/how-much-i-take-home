/**
 * Utility functions for the Salary Take-Home Calculator
 */

import { TaxCalculation } from './types';

/**
 * Format a number as US currency
 * @param amount - Number to format
 * @param showCents - Whether to show cents (default: false)
 * @returns Formatted currency string (e.g., "$100,000")
 */
export function formatCurrency(amount: number, showCents = false): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(amount);
}

/**
 * Calculate monthly take-home pay from annual tax data
 * @param taxData - Tax calculation result
 * @returns Monthly take-home amount
 */
export function getMonthlyTakeHome(taxData: TaxCalculation): number {
  return taxData.income_after_tax / 12;
}

/**
 * Calculate take-home pay after rent
 * @param monthlyTakeHome - Monthly take-home pay
 * @param monthlyRent - Monthly rent amount
 * @returns Amount remaining after rent
 */
export function calculateAfterRent(
  monthlyTakeHome: number,
  monthlyRent: number
): number {
  return monthlyTakeHome - monthlyRent;
}

/**
 * Format a percentage value
 * @param rate - Decimal rate (e.g., 0.22 for 22%)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string (e.g., "22.0%")
 */
export function formatPercentage(rate: number, decimals = 1): string {
  return `${(rate * 100).toFixed(decimals)}%`;
}

/**
 * Validate salary input
 * @param salary - Salary to validate
 * @returns Error message if invalid, null if valid
 */
export function validateSalary(salary: number): string | null {
  if (isNaN(salary)) {
    return 'Please enter a valid number';
  }
  if (salary <= 0) {
    return 'Salary must be greater than $0';
  }
  if (salary > 100000000) {
    return 'Salary must be less than $100,000,000';
  }
  return null;
}

/**
 * Calculate what percentage of income goes to rent
 * @param monthlyRent - Monthly rent amount
 * @param monthlyTakeHome - Monthly take-home pay
 * @returns Percentage as decimal (e.g., 0.35 for 35%)
 */
export function getRentPercentage(
  monthlyRent: number,
  monthlyTakeHome: number
): number {
  if (monthlyTakeHome === 0) return 0;
  return monthlyRent / monthlyTakeHome;
}

/**
 * Check if rent is affordable (< 30% of take-home is recommended)
 * @param monthlyRent - Monthly rent amount
 * @param monthlyTakeHome - Monthly take-home pay
 * @returns true if rent is <= 30% of take-home
 */
export function isRentAffordable(
  monthlyRent: number,
  monthlyTakeHome: number
): boolean {
  return getRentPercentage(monthlyRent, monthlyTakeHome) <= 0.3;
}

/**
 * Format time remaining for rate limit
 * @param seconds - Seconds remaining
 * @returns Formatted string (e.g., "1m 30s" or "45s")
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return '0s';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
}

/**
 * Debounce function for input handling
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
