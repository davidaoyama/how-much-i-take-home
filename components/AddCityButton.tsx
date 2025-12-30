'use client';

import { AddCityButtonProps } from '@/lib/types';

export default function AddCityButton({ onClick, disabled = false }: AddCityButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="neu-inset rounded-3xl p-6 neu-raised-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center min-h-[400px] border-2 border-[#2D3748]"
      aria-label="Add another city to compare"
    >
      <svg
        className="w-12 h-12 text-[#718096] mb-3 group-hover:text-[#4A90E2] transition-colors"
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
      <span className="text-[#718096] font-semibold">Add City to Compare</span>
      {disabled && (
        <span className="text-xs text-[#718096] mt-2 opacity-70">Maximum 3 cities</span>
      )}
    </button>
  );
}
