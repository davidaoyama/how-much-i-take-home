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
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row gap-6 items-end">
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
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-lg text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
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
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-lg text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none bg-white"
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
