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
    <main className="min-h-screen bg-[#e0e5ec] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#2D3748] mb-2 tracking-tight">
            how much i take home?
          </h1>
          <p className="text-[#718096] font-medium">
            see how much you really make 👀
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
              className="w-full neu-button font-bold py-3 px-6 rounded-3xl text-lg h-[60px] text-[#4A90E2] border-2 border-[#2D3748]"
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

        <footer className="mt-12 text-center text-sm text-[#718096]">
          <p>Based on 2025 federal and state tax brackets. Estimates only. Will update in 2026...</p>
        </footer>
      </div>
    </main>
  );
}
