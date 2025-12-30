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
    <div className="neu-raised rounded-3xl p-8 border-2 border-[#2D3748]">
      <div className="flex flex-col md:flex-row gap-6 items-end">
        {/* Salary Input */}
        <div className="flex-1">
          <label className="block text-sm font-semibold text-[#2D3748] mb-3">
            Annual Salary
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-[#718096] text-lg font-medium">$</span>
            <input
              type="number"
              value={salary || ''}
              onChange={(e) => onSalaryChange(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-3 neu-input rounded-xl text-lg text-[#2D3748] font-medium border-2 border-transparent"
              placeholder="100000"
              min="0"
              step="1000"
            />
          </div>
        </div>

        {/* Filing Status */}
        <div className="flex-1">
          <label className="block text-sm font-semibold text-[#2D3748] mb-3">
            Filing Status
          </label>
          <select
            value={filingStatus}
            onChange={(e) => onFilingStatusChange(e.target.value as FilingStatus)}
            className="w-full px-4 py-3 neu-input rounded-xl text-lg text-[#2D3748] font-medium border-2 border-transparent"
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
