'use client';

import { useState, useEffect } from 'react';
import { FilingStatus, FILING_STATUS_LABELS } from '@/lib/types';
import { useTheme } from '@/lib/themeContext';

interface SalaryInputProps {
  salary: number;
  filingStatus: FilingStatus;
  onSalaryChange: (salary: number) => void;
  onFilingStatusChange: (status: FilingStatus) => void;
  on401kChange: (data: { employeePercent: number; matchType: string; customMatchPercent?: number; customMatchCap?: number } | undefined) => void;
}

export default function SalaryInput({
  salary,
  filingStatus,
  onSalaryChange,
  onFilingStatusChange,
  on401kChange,
}: SalaryInputProps) {
  const { colors } = useTheme();
  const [show401k, setShow401k] = useState(false);
  const [contribution401kPercent, setContribution401kPercent] = useState(0);
  const [matchType, setMatchType] = useState<'none' | '50_6' | '100_3' | '100_4' | '100_5' | 'custom'>('none');
  const [customMatchPercent, setCustomMatchPercent] = useState(0);
  const [customMatchCap, setCustomMatchCap] = useState(0);
  const [is401kActive, setIs401kActive] = useState(false);

  // Auto-update when 401k values change while active
  useEffect(() => {
    if (is401kActive && contribution401kPercent > 0) {
      on401kChange({
        employeePercent: contribution401kPercent,
        matchType: matchType,
        customMatchPercent: matchType === 'custom' ? customMatchPercent : undefined,
        customMatchCap: matchType === 'custom' ? customMatchCap : undefined,
      });
    }
  }, [contribution401kPercent, matchType, customMatchPercent, customMatchCap, is401kActive, on401kChange]);

  const calculateContribution = () => {
    return Math.min((salary * contribution401kPercent) / 100, 23500).toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  const calculateEmployerMatch = () => {
    const employeeContribution = Math.min((salary * contribution401kPercent) / 100, 23500);

    if (matchType === 'none') return 0;

    const presets: Record<string, { matchPercent: number; capPercent: number }> = {
      '50_6': { matchPercent: 0.5, capPercent: 0.06 },
      '100_3': { matchPercent: 1.0, capPercent: 0.03 },
      '100_4': { matchPercent: 1.0, capPercent: 0.04 },
      '100_5': { matchPercent: 1.0, capPercent: 0.05 },
    };

    if (matchType === 'custom') {
      const maxMatch = salary * (customMatchCap / 100);
      return Math.min(employeeContribution * (customMatchPercent / 100), maxMatch);
    } else if (presets[matchType]) {
      const preset = presets[matchType];
      const maxMatch = salary * preset.capPercent;
      const employeeContributionUpToCap = Math.min(employeeContribution, maxMatch);
      return employeeContributionUpToCap * preset.matchPercent;
    }

    return 0;
  };

  const handleToggle401k = () => {
    const newActiveState = !is401kActive;
    setIs401kActive(newActiveState);

    if (!newActiveState || contribution401kPercent === 0) {
      // If deactivating or no contribution set, clear 401k
      on401kChange(undefined);
    } else {
      // If activating, send current 401k data
      on401kChange({
        employeePercent: contribution401kPercent,
        matchType: matchType,
        customMatchPercent: matchType === 'custom' ? customMatchPercent : undefined,
        customMatchCap: matchType === 'custom' ? customMatchCap : undefined,
      });
    }
  };
  return (
    <div className="bg-white rounded-xl p-3 sm:p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row gap-3 sm:gap-6 md:items-end">
        {/* Salary Input */}
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Annual Salary
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-base sm:text-lg text-gray-500">$</span>
            <input
              type="number"
              value={salary || ''}
              onChange={(e) => onSalaryChange(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-base sm:text-lg text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
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
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base sm:text-lg text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none bg-white"
          >
            {Object.entries(FILING_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 401(k) Section */}
      <div className="col-span-1 md:col-span-2 mt-6">
        <button
          onClick={() => setShow401k(!show401k)}
          type="button"
          className={`flex items-center ${colors.accent} hover:opacity-80 font-semibold transition-colors`}
        >
          <span className="mr-2">{show401k ? '−' : '+'}</span>
          401(k) Retirement Contributions (Optional)
        </button>

        {show401k && (
          <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
            {/* Employee Contribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your 401(k) Contribution
                </label>
                <div className="flex gap-2 items-center flex-wrap">
                  <input
                    type="number"
                    value={contribution401kPercent || ''}
                    onChange={(e) => setContribution401kPercent(Number(e.target.value))}
                    className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none"
                    min="0"
                    max="100"
                  />
                  <span className="text-gray-600">% of salary</span>
                  {salary > 0 && contribution401kPercent > 0 && (
                    <span className="text-gray-500">
                      (${calculateContribution()} / year)
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  2025 limit: $23,500
                </p>
              </div>

              {/* Employer Match */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Employer Match
                </label>
                <select
                  value={matchType}
                  onChange={(e) => setMatchType(e.target.value as typeof matchType)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none bg-white"
                >
                  <option value="none">No match</option>
                  <option value="50_6">50% match up to 6%</option>
                  <option value="100_3">100% match up to 3%</option>
                  <option value="100_4">100% match up to 4%</option>
                  <option value="100_5">100% match up to 5%</option>
                  <option value="custom">Custom...</option>
                </select>

                {matchType === 'custom' && (
                  <div className="mt-2 flex gap-2 items-center flex-wrap">
                    <input
                      type="number"
                      value={customMatchPercent || ''}
                      onChange={(e) => setCustomMatchPercent(Number(e.target.value))}
                      placeholder="Match %"
                      className="w-40 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none"
                      min="0"
                      max="200"
                    />
                    <span className="text-gray-600">% up to</span>
                    <input
                      type="number"
                      value={customMatchCap || ''}
                      onChange={(e) => setCustomMatchCap(Number(e.target.value))}
                      placeholder="Cap %"
                      className="w-40 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none"
                      min="0"
                      max="100"
                    />
                    <span className="text-gray-600">%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            {salary > 0 && contribution401kPercent > 0 && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 block mb-1">Your Contribution</span>
                    <p className="font-semibold text-gray-900">${calculateContribution()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 block mb-1">Employer Match</span>
                    <p className="font-semibold text-green-600">
                      ${calculateEmployerMatch().toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 block mb-1">Total to 401(k)</span>
                    <p className="font-semibold text-blue-600">
                      ${(Math.min((salary * contribution401kPercent) / 100, 23500) + calculateEmployerMatch()).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Toggle Button */}
            <div className="mt-4">
              <button
                onClick={handleToggle401k}
                disabled={contribution401kPercent === 0}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  is401kActive
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : `${colors.primary} ${colors.primaryHover} text-white disabled:bg-gray-300 disabled:cursor-not-allowed`
                }`}
              >
                {is401kActive ? 'Remove Contribution' : 'Add Contribution'}
              </button>
              {contribution401kPercent === 0 && !is401kActive && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Enter a contribution percentage to activate
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
