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
    <div className="bg-white rounded-xl p-6 relative shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Remove Button */}
      {canRemove && (
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white hover:bg-red-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-600 transition-all shadow-sm"
          aria-label="Remove city"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* City Selector */}
      <select
        value={cityData.cityId}
        onChange={(e) => onCityChange(e.target.value)}
        className="w-full sm:w-80 pl-3 pr-8 py-3 border-2 border-gray-200 rounded-lg mb-6 font-semibold text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none bg-white"
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
            <div className="flex justify-between text-sm py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Federal Tax</span>
              <span className="font-semibold text-gray-900 tabular-nums">{formatCurrency(cityData.taxData.federalTax)}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">State Tax</span>
              <span className="font-semibold text-gray-900 tabular-nums">{formatCurrency(cityData.taxData.stateTax)}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Social Security</span>
              <span className="font-semibold text-gray-900 tabular-nums">{formatCurrency(cityData.taxData.socialSecurityTax)}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Medicare</span>
              <span className="font-semibold text-gray-900 tabular-nums">{formatCurrency(cityData.taxData.medicareTax)}</span>
            </div>

            <div className="mt-6 bg-green-50 border border-green-100 rounded-lg p-4">
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-bold text-gray-900">Net Take-Home</span>
                <span className="text-3xl font-bold text-green-600 tabular-nums">
                  {formatCurrency(cityData.taxData.netIncome)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Effective Rate: {(cityData.taxData.effectiveTaxRate * 100).toFixed(1)}%</span>
                <span className="tabular-nums">{formatCurrency(cityData.taxData.monthlyNetIncome)} / month</span>
              </div>
            </div>
          </div>

          {/* Rent Toggle */}
          <div className="border-t border-gray-200 pt-4">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={cityData.includeRent}
                onChange={onRentToggle}
                className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="ml-3 text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                Include average rent
              </span>
            </label>

            {cityData.includeRent && selectedCity && (
              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-3 pb-3 border-b border-blue-200">
                  <span className="text-gray-700 font-medium">Avg. Rent (1BR)</span>
                  <span className="font-semibold text-gray-900 tabular-nums">
                    {formatCurrency(selectedCity.avgRent)} / month
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-gray-900">After Rent</span>
                  <span className={`text-2xl font-bold tabular-nums ${afterRentAnnual >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatCurrency(afterRentAnnual)}
                  </span>
                </div>
                <div className="flex justify-end text-sm text-gray-600">
                  <span className="tabular-nums">{formatCurrency(afterRentMonthly)} / month</span>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-500">Select a city to see tax breakdown</p>
        </div>
      )}
    </div>
  );
}