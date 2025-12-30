'use client';

import { useState } from 'react';
import { FilingStatus, CityData } from '@/lib/types';
import { CITIES } from '@/lib/cities';
import { calculateTakeHomePay } from '@/lib/taxCalculations';
import SalaryInput from '@/components/SalaryInput';
import CityColumn from '@/components/CityColumn';
import AddCityButton from '@/components/AddCityButton';

export default function Home() {
  const [salary, setSalary] = useState<number>(0);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [cityColumns, setCityColumns] = useState<CityData[]>([
    { cityId: '', taxData: null, includeRent: false }
  ]);

  const handleCalculate = () => {
    setCityColumns(prev =>
      prev.map(col => {
        if (!col.cityId) return col;

        const city = CITIES.find(c => c.id === col.cityId);
        if (!city) return col;

        const taxData = calculateTakeHomePay(salary, filingStatus, city.stateCode);
        return { ...col, taxData };
      })
    );
  };

  const handleCityChange = (index: number, cityId: string) => {
    setCityColumns(prev => {
      const newCols = [...prev];

      // If salary is entered and we're selecting a city, auto-calculate
      if (cityId && salary > 0) {
        const city = CITIES.find(c => c.id === cityId);
        if (city) {
          const taxData = calculateTakeHomePay(salary, filingStatus, city.stateCode);
          newCols[index] = { ...newCols[index], cityId, taxData };
          return newCols;
        }
      }

      newCols[index] = { ...newCols[index], cityId, taxData: null };
      return newCols;
    });
  };

  const handleRentToggle = (index: number) => {
    setCityColumns(prev => {
      const newCols = [...prev];
      newCols[index] = { ...newCols[index], includeRent: !newCols[index].includeRent };
      return newCols;
    });
  };

  const handleRemoveCity = (index: number) => {
    setCityColumns(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddCity = () => {
    if (cityColumns.length < 3) {
      setCityColumns(prev => [...prev, { cityId: '', taxData: null, includeRent: false }]);
    }
  };

  const canCalculate = salary > 0 && cityColumns.some(c => c.cityId);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-6 sm:py-8 md:py-12 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
            how much i take home
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            see how much you really make
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
          <div className="flex-1 w-full">
            <SalaryInput
              salary={salary}
              filingStatus={filingStatus}
              onSalaryChange={setSalary}
              onFilingStatusChange={setFilingStatus}
            />
          </div>
          <div className="md:w-48 w-full">
            <button
              onClick={handleCalculate}
              disabled={!canCalculate}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3.5 px-6 rounded-lg transition-colors h-[60px] text-lg shadow-sm disabled:cursor-not-allowed"
            >
              Calculate
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {cityColumns.map((col, index) => (
            <CityColumn
              key={index}
              cityData={col}
              onCityChange={(cityId) => handleCityChange(index, cityId)}
              onRentToggle={() => handleRentToggle(index)}
              onRemove={() => handleRemoveCity(index)}
              canRemove={cityColumns.length > 1}
            />
          ))}

          {cityColumns.length < 3 && (
            <AddCityButton onClick={handleAddCity} />
          )}
        </div>

        <footer className="mt-12 sm:mt-16 text-center space-y-2 px-4">
          <p className="text-xs sm:text-sm text-gray-600">
            based on 2025 federal and state tax brackets, for estimation purposes only
          </p>
          <p className="text-xs text-gray-500">
            not real financial advice, just wanted to see if i'd be rich lol - david
          </p>
        </footer>
      </div>
    </main>
  );
}
