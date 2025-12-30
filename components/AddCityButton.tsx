'use client';

import { AddCityButtonProps } from '@/lib/types';

export default function AddCityButton({ onClick, disabled = false }: AddCityButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 flex flex-col items-center justify-center min-h-[400px]"
      aria-label="Add another city to compare"
    >
      <svg
        className="w-12 h-12 text-gray-400 mb-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      <span className="text-gray-500 font-medium">Add City to Compare</span>
      {disabled && (
        <span className="text-xs text-gray-400 mt-2">Maximum 3 cities</span>
      )}
    </button>
  );
}
