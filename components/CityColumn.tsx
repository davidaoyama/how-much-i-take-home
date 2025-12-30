'use client';

import { CityColumnProps } from '@/lib/types';
import { CITIES, getCityById } from '@/lib/cities';
import { formatCurrency, getMonthlyTakeHome, calculateAfterRent, formatPercentage } from '@/lib/utils';

export default function CityColumn({
  cityData,
  onCityChange,
  onRentToggle,
  onRemove,
  canRemove,
}: CityColumnProps) {
  const selectedCity = getCityById(cityData.cityId);
  const monthlyTakeHome = cityData.taxData ? getMonthlyTakeHome(cityData.taxData) : 0;
  const afterRent = selectedCity ? calculateAfterRent(monthlyTakeHome, selectedCity.avgRent) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      {/* Remove Button */}
      {canRemove && (
        <button
          onClick={onRemove}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Remove city"
        >
          ✕
        </button>
      )}

      {/* City Selector */}
      <div className="mb-6">
        <label htmlFor={`city-${cityData.cityId}`} className="block text-sm font-medium text-gray-700 mb-2">
          Select City
        </label>
        <select
          id={`city-${cityData.cityId}`}
          value={cityData.cityId}
          onChange={(e) => onCityChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={cityData.loading}
          aria-label="Select a city to compare"
        >
          <option value="">Select a city...</option>
          {CITIES.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}, {city.stateCode}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {cityData.loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-500">Calculating...</p>
        </div>
      )}

      {/* Error State */}
      {cityData.error && !cityData.loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 font-medium">Error</p>
          <p className="text-red-500 text-sm mt-1">{cityData.error}</p>
        </div>
      )}

      {/* Tax Breakdown */}
      {cityData.taxData && !cityData.loading && !cityData.error && (
        <>
          <div className="space-y-4 mb-6">
            {/* Federal Tax */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Federal Tax</span>
              <div className="text-right">
                <div className="font-medium">
                  {formatCurrency(cityData.taxData.federal_taxes_owed)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatPercentage(cityData.taxData.federal_effective_rate)}
                </div>
              </div>
            </div>

            {/* State Tax */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">State Tax</span>
              <div className="text-right">
                <div className="font-medium">
                  {formatCurrency(cityData.taxData.region_taxes_owed)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatPercentage(cityData.taxData.region_effective_rate)}
                </div>
              </div>
            </div>

            {/* FICA */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">FICA</span>
              <div className="text-right">
                <div className="font-medium">
                  {formatCurrency(cityData.taxData.fica_total)}
                </div>
                <div className="text-xs text-gray-500">
                  SS + Medicare
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-4">
              {/* Net Take-Home */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-semibold">Net Take-Home</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(cityData.taxData.income_after_tax)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(monthlyTakeHome)} / month
                  </div>
                </div>
              </div>

              {/* Effective Tax Rate */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Effective Tax Rate</span>
                <span className="text-gray-700 font-medium">
                  {formatPercentage(cityData.taxData.total_effective_tax_rate)}
                </span>
              </div>
            </div>
          </div>

          {/* Rent Toggle */}
          <div className="border-t border-gray-200 pt-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={cityData.includeRent}
                onChange={onRentToggle}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Include rent
              </span>
            </label>

            {/* After Rent Calculation */}
            {cityData.includeRent && selectedCity && (
              <div className="mt-4 bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Avg. Rent (1BR)</span>
                  <span className="font-medium text-gray-700">
                    {formatCurrency(selectedCity.avgRent)} / month
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-blue-100">
                  <span className="text-gray-700 font-semibold">After Rent</span>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${afterRent > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {formatCurrency(afterRent)} / month
                    </div>
                    {afterRent < 0 && (
                      <div className="text-xs text-red-500">
                        Rent exceeds take-home
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Empty State */}
      {!cityData.cityId && !cityData.loading && (
        <div className="text-center py-12 text-gray-400">
          <p>Select a city to see tax breakdown</p>
        </div>
      )}
    </div>
  );
}
