'use client';

import { useState, useEffect } from 'react';
import { FilingStatus, CityData } from '@/lib/types';
import { CITIES } from '@/lib/cities';
import { calculateTakeHomePay } from '@/lib/taxCalculations';
import SalaryInput from '@/components/SalaryInput';
import CityColumn from '@/components/CityColumn';
import AddCityButton from '@/components/AddCityButton';

export default function Home() {
  const [salary, setSalary] = useState<number>(0);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [retirement401k, setRetirement401k] = useState<{
    employeePercent: number;
    matchType: string;
    customMatchPercent?: number;
    customMatchCap?: number;
  } | undefined>(undefined);
  const [cityColumns, setCityColumns] = useState<CityData[]>([
    { cityId: '', taxData: null, includeRent: false }
  ]);

  // Recalculate all cities when salary, filingStatus, or retirement401k changes
  useEffect(() => {
    setCityColumns(prev =>
      prev.map(col => {
        if (!col.cityId) return col;

        const city = CITIES.find(c => c.id === col.cityId);
        if (!city) return col;

        // If salary is 0, clear tax data but keep the city selected
        if (salary === 0) {
          return { ...col, taxData: null };
        }

        const taxData = calculateTakeHomePay(salary, filingStatus, city.stateCode, retirement401k);
        return { ...col, taxData };
      })
    );
  }, [salary, filingStatus, retirement401k]);

  const handleCityChange = (index: number, cityId: string) => {
    setCityColumns(prev => {
      const newCols = [...prev];

      // If salary is entered and we're selecting a city, auto-calculate
      if (cityId && salary > 0) {
        const city = CITIES.find(c => c.id === cityId);
        if (city) {
          const taxData = calculateTakeHomePay(salary, filingStatus, city.stateCode, retirement401k);
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

        <div className="mb-8">
          <SalaryInput
            salary={salary}
            filingStatus={filingStatus}
            onSalaryChange={setSalary}
            onFilingStatusChange={setFilingStatus}
            on401kChange={setRetirement401k}
          />
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
