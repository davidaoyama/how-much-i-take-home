/**
 * TypeScript type definitions for the Salary Take-Home Calculator
 */

// ============================================================================
// User Input Types
// ============================================================================

/**
 * Filing status options for tax calculation
 * Maps to API Ninjas filing_status parameter
 */
export type FilingStatus =
  | 'single'
  | 'married'
  | 'married_separate'
  | 'head_of_household';

// ============================================================================
// City Data Types
// ============================================================================

/**
 * City reference data with location and average rent
 */
export interface City {
  id: string;          // Unique identifier (e.g., 'nyc', 'sf')
  name: string;        // City name (e.g., 'New York')
  state: string;       // State name (e.g., 'New York')
  stateCode: string;   // State code for API (e.g., 'NY')
  avgRent: number;     // Average monthly rent for 1BR apartment
}

/**
 * Individual city comparison state
 * Represents one column in the UI
 */
export interface CityData {
  cityId: string;              // Selected city ID (empty string if not selected)
  taxData: TaxCalculation | null;  // Calculation results (null if not calculated)
  includeRent: boolean;        // Whether to show after-rent calculation
  loading: boolean;            // Loading state during API call
  error: string | null;        // Error message if calculation failed
}

// ============================================================================
// Tax Calculation Types (API Response)
// ============================================================================

/**
 * Tax calculation result from API Ninjas
 * Represents the complete tax breakdown for a given salary and location
 */
export interface TaxCalculation {
  country: string;                    // Always "United States"
  region: string;                     // State name
  income: number;                     // Annual gross income
  taxable_income: number;             // Income after standard deduction
  federal_effective_rate: number;     // Federal tax rate (decimal, e.g., 0.22 = 22%)
  federal_taxes_owed: number;         // Annual federal taxes
  fica_social_security: number;       // Annual Social Security tax
  fica_medicare: number;              // Annual Medicare tax
  fica_total: number;                 // Total FICA (Social Security + Medicare)
  region_effective_rate: number;      // State tax rate (decimal)
  region_taxes_owed: number;          // Annual state taxes
  total_taxes_owed: number;           // Total annual taxes (federal + state + FICA)
  income_after_tax: number;           // Annual take-home pay
  total_effective_tax_rate: number;   // Overall tax rate (decimal)
}

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * Request payload for tax calculation API
 */
export interface TaxCalculationRequest {
  salary: number;
  filingStatus: FilingStatus;
  stateCode: string;
}

/**
 * Response from tax calculation API
 */
export interface TaxCalculationResponse {
  data?: TaxCalculation;
  error?: string;
}

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * Props for SalaryInput component
 */
export interface SalaryInputProps {
  salary: number;
  filingStatus: FilingStatus;
  onSalaryChange: (salary: number) => void;
  onFilingStatusChange: (status: FilingStatus) => void;
}

/**
 * Props for CityColumn component
 */
export interface CityColumnProps {
  cityData: CityData;
  onCityChange: (cityId: string) => void;
  onRentToggle: () => void;
  onRemove: () => void;
  canRemove: boolean;  // Disable remove if only 1 city
}

/**
 * Props for AddCityButton component
 */
export interface AddCityButtonProps {
  onClick: () => void;
  disabled?: boolean;  // Disable if already at max cities (3)
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Filing status options for dropdown UI
 */
export interface FilingStatusOption {
  value: FilingStatus;
  label: string;
}

/**
 * Filing status display labels
 */
export const FILING_STATUS_LABELS: Record<FilingStatus, string> = {
  single: 'Single',
  married: 'Married Filing Jointly',
  married_separate: 'Married Filing Separately',
  head_of_household: 'Head of Household',
};
