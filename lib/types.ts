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
  cityId: string;                              // Selected city ID (empty string if not selected)
  taxData: TaxCalculationResult | null;        // Calculation results (null if not calculated)
  includeRent: boolean;                        // Whether to show after-rent calculation
}

// ============================================================================
// Tax Calculation Types (Local Calculation)
// ============================================================================

/**
 * Tax calculation result from local tax engine
 * Represents the complete tax breakdown for a given salary and location
 */
export interface TaxCalculationResult {
  grossIncome: number;           // Annual gross income
  federalTax: number;            // Annual federal taxes
  stateTax: number;              // Annual state taxes
  socialSecurityTax: number;     // Annual Social Security tax
  medicareTax: number;           // Annual Medicare tax
  ficaTotal: number;             // Total FICA (Social Security + Medicare)
  totalTax: number;              // Total annual taxes (federal + state + FICA)
  netIncome: number;             // Annual take-home pay
  effectiveTaxRate: number;      // Overall tax rate (decimal)
  monthlyNetIncome: number;      // Monthly take-home pay
}

// Keep old type for backward compatibility (deprecated)
export type TaxCalculation = TaxCalculationResult;

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
