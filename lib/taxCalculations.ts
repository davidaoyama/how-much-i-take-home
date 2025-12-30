// 2025 Federal and State Tax Calculations

export type FilingStatus = 'single' | 'married' | 'married_separate' | 'head_of_household';

// ============================================================================
// 401(K) RETIREMENT CONTRIBUTION CONSTANTS 2025
// ============================================================================

const CONTRIBUTION_401K_LIMIT_2025 = 23500;
const CONTRIBUTION_401K_CATCHUP_2025 = 7500; // Age 50+ (not implemented yet)

// Employer match presets
const MATCH_PRESETS: Record<string, { matchPercent: number; capPercent: number }> = {
  '50_6': { matchPercent: 0.5, capPercent: 0.06 },
  '100_3': { matchPercent: 1.0, capPercent: 0.03 },
  '100_4': { matchPercent: 1.0, capPercent: 0.04 },
  '100_5': { matchPercent: 1.0, capPercent: 0.05 },
};

export interface RetirementContribution {
  employeePercent: number;
  employeeAmount: number;
  employerMatchType: 'none' | '50_6' | '100_3' | '100_4' | '100_5' | 'custom';
  employerMatchPercent?: number;
  employerMatchCap?: number;
  employerMatchAmount: number;
  totalContribution: number;
}

// ============================================================================
// FEDERAL TAX BRACKETS 2025
// ============================================================================

interface TaxBracket {
  rate: number;
  min: number;
  max: number;
}

const FEDERAL_BRACKETS_2025: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { rate: 0.10, min: 0, max: 11925 },
    { rate: 0.12, min: 11925, max: 48475 },
    { rate: 0.22, min: 48475, max: 103350 },
    { rate: 0.24, min: 103350, max: 197300 },
    { rate: 0.32, min: 197300, max: 250525 },
    { rate: 0.35, min: 250525, max: 626350 },
    { rate: 0.37, min: 626350, max: Infinity },
  ],
  married: [
    { rate: 0.10, min: 0, max: 23850 },
    { rate: 0.12, min: 23850, max: 96950 },
    { rate: 0.22, min: 96950, max: 206700 },
    { rate: 0.24, min: 206700, max: 394600 },
    { rate: 0.32, min: 394600, max: 501050 },
    { rate: 0.35, min: 501050, max: 751600 },
    { rate: 0.37, min: 751600, max: Infinity },
  ],
  married_separate: [
    { rate: 0.10, min: 0, max: 11925 },
    { rate: 0.12, min: 11925, max: 48475 },
    { rate: 0.22, min: 48475, max: 103350 },
    { rate: 0.24, min: 103350, max: 197300 },
    { rate: 0.32, min: 197300, max: 250525 },
    { rate: 0.35, min: 250525, max: 375800 },
    { rate: 0.37, min: 375800, max: Infinity },
  ],
  head_of_household: [
    { rate: 0.10, min: 0, max: 17000 },
    { rate: 0.12, min: 17000, max: 64850 },
    { rate: 0.22, min: 64850, max: 103350 },
    { rate: 0.24, min: 103350, max: 197300 },
    { rate: 0.32, min: 197300, max: 250500 },
    { rate: 0.35, min: 250500, max: 626350 },
    { rate: 0.37, min: 626350, max: Infinity },
  ],
};

// ============================================================================
// STATE TAX RATES (Simplified - flat rates or progressive)
// ============================================================================

interface StateInfo {
  name: string;
  type: 'flat' | 'progressive' | 'none';
  rate?: number;
  brackets?: TaxBracket[];
}

const STATE_TAX_INFO: Record<string, StateInfo> = {
  AL: { name: 'Alabama', type: 'progressive', brackets: [
    { rate: 0.02, min: 0, max: 500 },
    { rate: 0.04, min: 500, max: 3000 },
    { rate: 0.05, min: 3000, max: Infinity },
  ]},
  AK: { name: 'Alaska', type: 'none' },
  AZ: { name: 'Arizona', type: 'flat', rate: 0.025 },
  AR: { name: 'Arkansas', type: 'progressive', brackets: [
    { rate: 0.02, min: 0, max: 5000 },
    { rate: 0.04, min: 5000, max: 10000 },
    { rate: 0.044, min: 10000, max: Infinity },
  ]},
  CA: { name: 'California', type: 'progressive', brackets: [
    { rate: 0.01, min: 0, max: 10412 },
    { rate: 0.02, min: 10412, max: 24684 },
    { rate: 0.04, min: 24684, max: 38959 },
    { rate: 0.06, min: 38959, max: 54081 },
    { rate: 0.08, min: 54081, max: 68350 },
    { rate: 0.093, min: 68350, max: 349137 },
    { rate: 0.103, min: 349137, max: 418961 },
    { rate: 0.113, min: 418961, max: 698271 },
    { rate: 0.123, min: 698271, max: Infinity },
  ]},
  CO: { name: 'Colorado', type: 'flat', rate: 0.044 },
  CT: { name: 'Connecticut', type: 'progressive', brackets: [
    { rate: 0.03, min: 0, max: 10000 },
    { rate: 0.05, min: 10000, max: 50000 },
    { rate: 0.055, min: 50000, max: 100000 },
    { rate: 0.06, min: 100000, max: 200000 },
    { rate: 0.065, min: 200000, max: 250000 },
    { rate: 0.069, min: 250000, max: 500000 },
    { rate: 0.0699, min: 500000, max: Infinity },
  ]},
  DE: { name: 'Delaware', type: 'progressive', brackets: [
    { rate: 0.022, min: 0, max: 5000 },
    { rate: 0.039, min: 5000, max: 10000 },
    { rate: 0.048, min: 10000, max: 20000 },
    { rate: 0.052, min: 20000, max: 25000 },
    { rate: 0.0555, min: 25000, max: 60000 },
    { rate: 0.066, min: 60000, max: Infinity },
  ]},
  FL: { name: 'Florida', type: 'none' },
  GA: { name: 'Georgia', type: 'progressive', brackets: [
    { rate: 0.01, min: 0, max: 750 },
    { rate: 0.02, min: 750, max: 2250 },
    { rate: 0.03, min: 2250, max: 3750 },
    { rate: 0.04, min: 3750, max: 5250 },
    { rate: 0.05, min: 5250, max: 7000 },
    { rate: 0.0575, min: 7000, max: Infinity },
  ]},
  HI: { name: 'Hawaii', type: 'progressive', brackets: [
    { rate: 0.014, min: 0, max: 2400 },
    { rate: 0.032, min: 2400, max: 4800 },
    { rate: 0.055, min: 4800, max: 9600 },
    { rate: 0.064, min: 9600, max: 14400 },
    { rate: 0.068, min: 14400, max: 19200 },
    { rate: 0.072, min: 19200, max: 24000 },
    { rate: 0.076, min: 24000, max: 36000 },
    { rate: 0.079, min: 36000, max: 48000 },
    { rate: 0.0825, min: 48000, max: 150000 },
    { rate: 0.09, min: 150000, max: 175000 },
    { rate: 0.10, min: 175000, max: 200000 },
    { rate: 0.11, min: 200000, max: Infinity },
  ]},
  ID: { name: 'Idaho', type: 'flat', rate: 0.058 },
  IL: { name: 'Illinois', type: 'flat', rate: 0.0495 },
  IN: { name: 'Indiana', type: 'flat', rate: 0.031 },
  IA: { name: 'Iowa', type: 'flat', rate: 0.038 },
  KS: { name: 'Kansas', type: 'progressive', brackets: [
    { rate: 0.031, min: 0, max: 15000 },
    { rate: 0.0525, min: 15000, max: 30000 },
    { rate: 0.057, min: 30000, max: Infinity },
  ]},
  KY: { name: 'Kentucky', type: 'flat', rate: 0.04 },
  LA: { name: 'Louisiana', type: 'progressive', brackets: [
    { rate: 0.0185, min: 0, max: 12500 },
    { rate: 0.035, min: 12500, max: 50000 },
    { rate: 0.0425, min: 50000, max: Infinity },
  ]},
  ME: { name: 'Maine', type: 'progressive', brackets: [
    { rate: 0.058, min: 0, max: 24500 },
    { rate: 0.0675, min: 24500, max: 58050 },
    { rate: 0.0715, min: 58050, max: Infinity },
  ]},
  MD: { name: 'Maryland', type: 'progressive', brackets: [
    { rate: 0.02, min: 0, max: 1000 },
    { rate: 0.03, min: 1000, max: 2000 },
    { rate: 0.04, min: 2000, max: 3000 },
    { rate: 0.0475, min: 3000, max: 100000 },
    { rate: 0.05, min: 100000, max: 125000 },
    { rate: 0.0525, min: 125000, max: 150000 },
    { rate: 0.055, min: 150000, max: 250000 },
    { rate: 0.0575, min: 250000, max: Infinity },
  ]},
  MA: { name: 'Massachusetts', type: 'flat', rate: 0.05 },
  MI: { name: 'Michigan', type: 'flat', rate: 0.0405 },
  MN: { name: 'Minnesota', type: 'progressive', brackets: [
    { rate: 0.0535, min: 0, max: 31690 },
    { rate: 0.068, min: 31690, max: 104090 },
    { rate: 0.0785, min: 104090, max: 195160 },
    { rate: 0.0985, min: 195160, max: Infinity },
  ]},
  MS: { name: 'Mississippi', type: 'flat', rate: 0.05 },
  MO: { name: 'Missouri', type: 'progressive', brackets: [
    { rate: 0.015, min: 0, max: 1207 },
    { rate: 0.02, min: 1207, max: 2414 },
    { rate: 0.025, min: 2414, max: 3621 },
    { rate: 0.03, min: 3621, max: 4828 },
    { rate: 0.035, min: 4828, max: 6035 },
    { rate: 0.04, min: 6035, max: 7242 },
    { rate: 0.045, min: 7242, max: 8449 },
    { rate: 0.0495, min: 8449, max: Infinity },
  ]},
  MT: { name: 'Montana', type: 'progressive', brackets: [
    { rate: 0.0471, min: 0, max: 21600 },
    { rate: 0.0571, min: 21600, max: Infinity },
  ]},
  NE: { name: 'Nebraska', type: 'progressive', brackets: [
    { rate: 0.0246, min: 0, max: 3700 },
    { rate: 0.0351, min: 3700, max: 22170 },
    { rate: 0.0501, min: 22170, max: 35730 },
    { rate: 0.0664, min: 35730, max: Infinity },
  ]},
  NV: { name: 'Nevada', type: 'none' },
  NH: { name: 'New Hampshire', type: 'none' },
  NJ: { name: 'New Jersey', type: 'progressive', brackets: [
    { rate: 0.014, min: 0, max: 20000 },
    { rate: 0.0175, min: 20000, max: 35000 },
    { rate: 0.035, min: 35000, max: 40000 },
    { rate: 0.05525, min: 40000, max: 75000 },
    { rate: 0.0637, min: 75000, max: 500000 },
    { rate: 0.0897, min: 500000, max: 1000000 },
    { rate: 0.1075, min: 1000000, max: Infinity },
  ]},
  NM: { name: 'New Mexico', type: 'progressive', brackets: [
    { rate: 0.017, min: 0, max: 5500 },
    { rate: 0.032, min: 5500, max: 11000 },
    { rate: 0.047, min: 11000, max: 16000 },
    { rate: 0.049, min: 16000, max: 210000 },
    { rate: 0.059, min: 210000, max: Infinity },
  ]},
  NY: { name: 'New York', type: 'progressive', brackets: [
    { rate: 0.04, min: 0, max: 8500 },
    { rate: 0.045, min: 8500, max: 11700 },
    { rate: 0.0525, min: 11700, max: 13900 },
    { rate: 0.055, min: 13900, max: 80650 },
    { rate: 0.06, min: 80650, max: 215400 },
    { rate: 0.0685, min: 215400, max: 1077550 },
    { rate: 0.0965, min: 1077550, max: 5000000 },
    { rate: 0.103, min: 5000000, max: 25000000 },
    { rate: 0.109, min: 25000000, max: Infinity },
  ]},
  NC: { name: 'North Carolina', type: 'flat', rate: 0.0449 },
  ND: { name: 'North Dakota', type: 'flat', rate: 0.0275 },
  OH: { name: 'Ohio', type: 'progressive', brackets: [
    { rate: 0.0, min: 0, max: 26050 },
    { rate: 0.02765, min: 26050, max: 100000 },
    { rate: 0.03226, min: 100000, max: 115300 },
    { rate: 0.03688, min: 115300, max: Infinity },
  ]},
  OK: { name: 'Oklahoma', type: 'progressive', brackets: [
    { rate: 0.0025, min: 0, max: 1000 },
    { rate: 0.0075, min: 1000, max: 2500 },
    { rate: 0.0175, min: 2500, max: 3750 },
    { rate: 0.0275, min: 3750, max: 4900 },
    { rate: 0.0375, min: 4900, max: 7200 },
    { rate: 0.0475, min: 7200, max: Infinity },
  ]},
  OR: { name: 'Oregon', type: 'progressive', brackets: [
    { rate: 0.0475, min: 0, max: 4300 },
    { rate: 0.0675, min: 4300, max: 10750 },
    { rate: 0.0875, min: 10750, max: 125000 },
    { rate: 0.099, min: 125000, max: Infinity },
  ]},
  PA: { name: 'Pennsylvania', type: 'flat', rate: 0.0307 },
  RI: { name: 'Rhode Island', type: 'progressive', brackets: [
    { rate: 0.0375, min: 0, max: 77450 },
    { rate: 0.0475, min: 77450, max: 176050 },
    { rate: 0.0599, min: 176050, max: Infinity },
  ]},
  SC: { name: 'South Carolina', type: 'progressive', brackets: [
    { rate: 0.0, min: 0, max: 3460 },
    { rate: 0.03, min: 3460, max: 17330 },
    { rate: 0.064, min: 17330, max: Infinity },
  ]},
  SD: { name: 'South Dakota', type: 'none' },
  TN: { name: 'Tennessee', type: 'none' },
  TX: { name: 'Texas', type: 'none' },
  UT: { name: 'Utah', type: 'flat', rate: 0.0465 },
  VT: { name: 'Vermont', type: 'progressive', brackets: [
    { rate: 0.0335, min: 0, max: 45400 },
    { rate: 0.066, min: 45400, max: 110050 },
    { rate: 0.076, min: 110050, max: 229550 },
    { rate: 0.0875, min: 229550, max: Infinity },
  ]},
  VA: { name: 'Virginia', type: 'progressive', brackets: [
    { rate: 0.02, min: 0, max: 3000 },
    { rate: 0.03, min: 3000, max: 5000 },
    { rate: 0.05, min: 5000, max: 17000 },
    { rate: 0.0575, min: 17000, max: Infinity },
  ]},
  WA: { name: 'Washington', type: 'none' },
  WV: { name: 'West Virginia', type: 'progressive', brackets: [
    { rate: 0.0236, min: 0, max: 10000 },
    { rate: 0.0315, min: 10000, max: 25000 },
    { rate: 0.0354, min: 25000, max: 40000 },
    { rate: 0.0472, min: 40000, max: 60000 },
    { rate: 0.0512, min: 60000, max: Infinity },
  ]},
  WI: { name: 'Wisconsin', type: 'progressive', brackets: [
    { rate: 0.0354, min: 0, max: 13810 },
    { rate: 0.0465, min: 13810, max: 27630 },
    { rate: 0.0627, min: 27630, max: 304170 },
    { rate: 0.0765, min: 304170, max: Infinity },
  ]},
  WY: { name: 'Wyoming', type: 'none' },
  DC: { name: 'District of Columbia', type: 'progressive', brackets: [
    { rate: 0.04, min: 0, max: 10000 },
    { rate: 0.06, min: 10000, max: 40000 },
    { rate: 0.065, min: 40000, max: 60000 },
    { rate: 0.085, min: 60000, max: 250000 },
    { rate: 0.0925, min: 250000, max: 500000 },
    { rate: 0.0975, min: 500000, max: 1000000 },
    { rate: 0.1075, min: 1000000, max: Infinity },
  ]},
};

// ============================================================================
// FICA (Social Security + Medicare) 2025
// ============================================================================

const SOCIAL_SECURITY_TAX_RATE = 0.062;
const SOCIAL_SECURITY_WAGE_BASE = 176100;
const MEDICARE_TAX_RATE = 0.0145;
const MEDICARE_ADDITIONAL_RATE = 0.009;
const MEDICARE_ADDITIONAL_THRESHOLD = {
  single: 200000,
  married: 250000,
  married_separate: 125000,
  head_of_household: 200000,
};

// ============================================================================
// 401(K) CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate 401(k) employee contribution and employer match
 */
function calculate401kContribution(
  salary: number,
  employeePercent: number,
  matchType: string,
  customMatchPercent?: number,
  customMatchCap?: number
): RetirementContribution {
  // Employee contribution (capped at annual limit)
  const employeeAmount = Math.min(
    salary * (employeePercent / 100),
    CONTRIBUTION_401K_LIMIT_2025
  );

  // Employer match calculation
  let employerMatchAmount = 0;

  if (matchType === 'none') {
    employerMatchAmount = 0;
  } else if (matchType === 'custom' && customMatchPercent !== undefined && customMatchCap !== undefined) {
    const maxMatch = salary * (customMatchCap / 100);
    employerMatchAmount = Math.min(
      employeeAmount * (customMatchPercent / 100),
      maxMatch
    );
  } else if (MATCH_PRESETS[matchType]) {
    const preset = MATCH_PRESETS[matchType];
    const maxMatch = salary * preset.capPercent;
    const employeeContributionUpToCap = Math.min(employeeAmount, maxMatch);
    employerMatchAmount = employeeContributionUpToCap * preset.matchPercent;
  }

  return {
    employeePercent,
    employeeAmount: Math.round(employeeAmount),
    employerMatchType: matchType as 'none' | '50_6' | '100_3' | '100_4' | '100_5' | 'custom',
    employerMatchPercent: customMatchPercent,
    employerMatchCap: customMatchCap,
    employerMatchAmount: Math.round(employerMatchAmount),
    totalContribution: Math.round(employeeAmount + employerMatchAmount),
  };
}

// ============================================================================
// TAX CALCULATION FUNCTIONS
// ============================================================================

function calculateBracketTax(income: number, brackets: TaxBracket[]): number {
  let tax = 0;

  for (const bracket of brackets) {
    if (income <= bracket.min) break;

    const taxableInBracket = Math.min(income, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;

    if (income <= bracket.max) break;
  }

  return tax;
}

function calculateFederalTax(income: number, filingStatus: FilingStatus): number {
  return calculateBracketTax(income, FEDERAL_BRACKETS_2025[filingStatus]);
}

function calculateStateTax(income: number, stateCode: string): number {
  const stateInfo = STATE_TAX_INFO[stateCode];
  if (!stateInfo) return 0;

  if (stateInfo.type === 'none') {
    return 0;
  }

  if (stateInfo.type === 'flat') {
    return income * (stateInfo.rate || 0);
  }

  if (stateInfo.type === 'progressive' && stateInfo.brackets) {
    return calculateBracketTax(income, stateInfo.brackets);
  }

  return 0;
}

function calculateFICA(income: number, filingStatus: FilingStatus): {
  socialSecurity: number;
  medicare: number;
  total: number;
} {
  const socialSecurity = Math.min(income, SOCIAL_SECURITY_WAGE_BASE) * SOCIAL_SECURITY_TAX_RATE;

  let medicare = income * MEDICARE_TAX_RATE;

  const additionalThreshold = MEDICARE_ADDITIONAL_THRESHOLD[filingStatus];
  if (income > additionalThreshold) {
    medicare += (income - additionalThreshold) * MEDICARE_ADDITIONAL_RATE;
  }

  return {
    socialSecurity,
    medicare,
    total: socialSecurity + medicare,
  };
}

// ============================================================================
// MAIN CALCULATION FUNCTION
// ============================================================================

export interface TaxCalculationResult {
  grossIncome: number;
  contribution401k?: RetirementContribution;
  taxableIncome: number;
  federalTax: number;
  stateTax: number;
  socialSecurityTax: number;
  medicareTax: number;
  ficaTotal: number;
  totalTax: number;
  netIncome: number;
  netIncomeAfter401k: number;
  effectiveTaxRate: number;
  monthlyNetIncome: number;
}

export function calculateTakeHomePay(
  annualSalary: number,
  filingStatus: FilingStatus,
  stateCode: string,
  retirement401k?: {
    employeePercent: number;
    matchType: string;
    customMatchPercent?: number;
    customMatchCap?: number;
  }
): TaxCalculationResult {
  // Calculate 401(k) if provided
  let contribution401k: RetirementContribution | undefined;
  let taxableIncome = annualSalary;

  if (retirement401k && retirement401k.employeePercent > 0) {
    contribution401k = calculate401kContribution(
      annualSalary,
      retirement401k.employeePercent,
      retirement401k.matchType,
      retirement401k.customMatchPercent,
      retirement401k.customMatchCap
    );

    // Reduce taxable income by employee contribution (pre-tax)
    taxableIncome = annualSalary - contribution401k.employeeAmount;
  }

  // Calculate taxes on reduced income
  const federalTax = calculateFederalTax(taxableIncome, filingStatus);
  const stateTax = calculateStateTax(taxableIncome, stateCode);
  const fica = calculateFICA(annualSalary, filingStatus); // FICA on gross, not reduced

  const totalTax = federalTax + stateTax + fica.total;
  const netIncome = annualSalary - totalTax;
  const netIncomeAfter401k = contribution401k
    ? netIncome - contribution401k.employeeAmount
    : netIncome;

  return {
    grossIncome: annualSalary,
    contribution401k,
    taxableIncome: Math.round(taxableIncome),
    federalTax: Math.round(federalTax),
    stateTax: Math.round(stateTax),
    socialSecurityTax: Math.round(fica.socialSecurity),
    medicareTax: Math.round(fica.medicare),
    ficaTotal: Math.round(fica.total),
    totalTax: Math.round(totalTax),
    netIncome: Math.round(netIncome),
    netIncomeAfter401k: Math.round(netIncomeAfter401k),
    effectiveTaxRate: totalTax / annualSalary,
    monthlyNetIncome: Math.round(netIncomeAfter401k / 12),
  };
}

export function getStateName(stateCode: string): string {
  return STATE_TAX_INFO[stateCode]?.name || stateCode;
}
