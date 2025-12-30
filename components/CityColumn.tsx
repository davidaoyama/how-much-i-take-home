'use client';

import { CityData } from '@/lib/types';
import { CITIES } from '@/lib/cities';
import { formatCurrency } from '@/lib/utils';

interface CityColumnProps {
  cityData: CityData;
  onCityChange: (cityId: string) => void;
  onRentToggle: () => void;
  onRemove: () => void;
  canRemove: boolean;
}

export default function CityColumn({
  cityData,
  onCityChange,
  onRentToggle,
  onRemove,
  canRemove,
}: CityColumnProps) {
  const selectedCity = CITIES.find((c) => c.id === cityData.cityId);
  const afterRentMonthly = cityData.taxData && selectedCity
    ? cityData.taxData.monthlyNetIncome - selectedCity.avgRent
    : 0;
  const afterRentAnnual = afterRentMonthly * 12;

  return (
    <div className="neu-raised rounded-3xl p-6 relative border-2 border-[#2D3748]">
      {/* Remove Button */}
      {canRemove && (
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 w-7 h-7 rounded-full neu-button flex items-center justify-center text-[#718096] hover:text-[#E53E3E] transition-colors border border-[#2D3748]"
          aria-label="Remove city"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* City Selector */}
      <select
        value={cityData.cityId}
        onChange={(e) => onCityChange(e.target.value)}
        className="w-full px-4 py-3 neu-input rounded-xl mb-6 font-semibold text-[#2D3748] border-2 border-transparent"
      >
        <option value="">Select a city...</option>
        {CITIES.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}, {city.state}
          </option>
        ))}
      </select>

      {/* Tax Breakdown */}
      {cityData.taxData ? (
        <>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-[#718096] font-medium">Federal Tax</span>
              <span className="font-semibold text-[#2D3748]">{formatCurrency(cityData.taxData.federalTax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#718096] font-medium">State Tax</span>
              <span className="font-semibold text-[#2D3748]">{formatCurrency(cityData.taxData.stateTax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#718096] font-medium">Social Security</span>
              <span className="font-semibold text-[#2D3748]">{formatCurrency(cityData.taxData.socialSecurityTax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#718096] font-medium">Medicare</span>
              <span className="font-semibold text-[#2D3748]">{formatCurrency(cityData.taxData.medicareTax)}</span>
            </div>

            <div className="border-t border-[#cbd5e0] pt-4 mt-4">
              <div className="neu-raised rounded-2xl p-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-[#2D3748]">Net Take-Home</span>
                  <span className="text-2xl font-bold text-[#48BB78]">
                    {formatCurrency(cityData.taxData.netIncome)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-[#718096]">
                  <span>Effective Rate: {(cityData.taxData.effectiveTaxRate * 100).toFixed(1)}%</span>
                  <span>{formatCurrency(cityData.taxData.monthlyNetIncome)} / month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rent Toggle */}
          <div className="border-t border-[#cbd5e0] pt-4">
            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={cityData.includeRent}
                  onChange={onRentToggle}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 rounded neu-inset peer-checked:neu-raised transition-all flex items-center justify-center">
                  {cityData.includeRent && (
                    <svg className="w-3 h-3 text-[#4A90E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="ml-3 text-sm font-semibold text-[#2D3748] group-hover:text-[#4A90E2] transition-colors">
                Include average rent
              </span>
            </label>

            {cityData.includeRent && selectedCity && (
              <div className="mt-4 neu-inset rounded-2xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#718096] font-medium">Avg. Rent (1BR)</span>
                  <span className="font-semibold text-[#2D3748]">
                    {formatCurrency(selectedCity.avgRent)} / month
                  </span>
                </div>
                <div className="border-t border-[#cbd5e0] pt-2 mt-2">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-[#2D3748]">After Rent</span>
                    <span className={`text-2xl font-bold ${afterRentAnnual >= 0 ? 'text-[#4A90E2]' : 'text-[#E53E3E]'}`}>
                      {formatCurrency(afterRentAnnual)}
                    </span>
                  </div>
                  <div className="flex justify-end text-sm text-[#718096]">
                    <span>{formatCurrency(afterRentMonthly)} / month</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-[#718096]">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm font-medium">Select a city to see breakdown</p>
        </div>
      )}
    </div>
  );
}
