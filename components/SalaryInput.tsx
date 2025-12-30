'use client';

import { SalaryInputProps, FILING_STATUS_LABELS, FilingStatus } from '@/lib/types';
import { validateSalary } from '@/lib/utils';

export default function SalaryInput({
  salary,
  filingStatus,
  onSalaryChange,
  onFilingStatusChange,
}: SalaryInputProps) {
  const salaryError = salary > 0 ? validateSalary(salary) : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Salary Input */}
        <div>
          <label
            htmlFor="salary"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Annual Salary
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              id="salary"
              type="number"
              value={salary || ''}
              onChange={(e) => onSalaryChange(Number(e.target.value))}
              className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                salaryError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="100000"
              min="0"
              step="1000"
              aria-label="Annual salary"
              aria-describedby={salaryError ? 'salary-error' : undefined}
            />
          </div>
          {salaryError && (
            <p id="salary-error" className="text-red-500 text-sm mt-1">
              {salaryError}
            </p>
          )}
        </div>

        {/* Filing Status Dropdown */}
        <div>
          <label
            htmlFor="filingStatus"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Filing Status
          </label>
          <select
            id="filingStatus"
            value={filingStatus}
            onChange={(e) => onFilingStatusChange(e.target.value as FilingStatus)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Tax filing status"
          >
            {Object.entries(FILING_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
