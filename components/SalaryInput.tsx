'use client';

import { FilingStatus, FILING_STATUS_LABELS } from '@/lib/types';

interface SalaryInputProps {
  salary: number;
  filingStatus: FilingStatus;
  onSalaryChange: (salary: number) => void;
  onFilingStatusChange: (status: FilingStatus) => void;
}

export default function SalaryInput({
  salary,
  filingStatus,
  onSalaryChange,
  onFilingStatusChange,
}: SalaryInputProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Salary Input */}
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Annual Salary
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-gray-500 text-lg">$</span>
            <input
              type="number"
              value={salary || ''}
              onChange={(e) => onSalaryChange(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              placeholder="100000"
              min="0"
              step="1000"
            />
          </div>
        </div>

        {/* Filing Status */}
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Filing Status
          </label>
          <select
            value={filingStatus}
            onChange={(e) => onFilingStatusChange(e.target.value as FilingStatus)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
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
