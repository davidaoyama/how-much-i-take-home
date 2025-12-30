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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            how much i take home?
          </h1>
          <p className="text-gray-600">
            see how much you really make 👀
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end mb-8">
          <div className="flex-1">
            <SalaryInput
              salary={salary}
              filingStatus={filingStatus}
              onSalaryChange={setSalary}
              onFilingStatusChange={setFilingStatus}
            />
          </div>
          <div className="md:w-48">
            <button
              onClick={handleCalculate}
              disabled={!canCalculate}
              className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md text-lg h-[60px]"
            >
              Calculate
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        <footer className="mt-12 text-center text-sm text-gray-600">
          <p>Based on 2025 federal and state tax brackets. Estimates only. Will update in 2026...</p>
        </footer>
      </div>
    </main>
  );
}
