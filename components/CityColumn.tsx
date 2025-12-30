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
    <div className="bg-white rounded-xl shadow-lg p-6 relative">
      {/* Remove Button */}
      {canRemove && (
        <button
          onClick={onRemove}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remove city"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* City Selector */}
      <select
        value={cityData.cityId}
        onChange={(e) => onCityChange(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none mb-6 font-medium"
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
              <span className="text-gray-600">Federal Tax</span>
              <span className="font-semibold">{formatCurrency(cityData.taxData.federalTax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">State Tax</span>
              <span className="font-semibold">{formatCurrency(cityData.taxData.stateTax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Social Security</span>
              <span className="font-semibold">{formatCurrency(cityData.taxData.socialSecurityTax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Medicare</span>
              <span className="font-semibold">{formatCurrency(cityData.taxData.medicareTax)}</span>
            </div>

            <div className="border-t-2 pt-3 mt-4">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-semibold text-gray-900">Net Take-Home</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(cityData.taxData.netIncome)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Effective Rate: {(cityData.taxData.effectiveTaxRate * 100).toFixed(1)}%</span>
                <span>{formatCurrency(cityData.taxData.monthlyNetIncome)} / month</span>
              </div>
            </div>
          </div>

          {/* Rent Toggle */}
          <div className="border-t-2 pt-4">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={cityData.includeRent}
                onChange={onRentToggle}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-semibold text-gray-700 group-hover:text-blue-600">
                Include average rent
              </span>
            </label>

            {cityData.includeRent && selectedCity && (
              <div className="mt-4 bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700">Avg. Rent (1BR)</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(selectedCity.avgRent)} / month
                  </span>
                </div>
                <div className="border-t border-blue-200 pt-2 mt-2">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-semibold text-gray-900">After Rent</span>
                    <span className={`text-2xl font-bold ${afterRentAnnual >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {formatCurrency(afterRentAnnual)}
                    </span>
                  </div>
                  <div className="flex justify-end text-sm text-gray-500">
                    <span>{formatCurrency(afterRentMonthly)} / month</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm">Select a city to see breakdown</p>
        </div>
      )}
    </div>
  );
}
