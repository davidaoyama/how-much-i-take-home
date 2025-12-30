'use client';

import { useTheme, Theme } from '@/lib/themeContext';

export default function ThemePicker() {
  const { theme, setTheme } = useTheme();

  const themes: { value: Theme; label: string; colors: string }[] = [
    { value: 'default', label: 'Default', colors: 'bg-blue-500' },
    { value: 'usc', label: 'USC', colors: 'bg-gradient-to-r from-rose-500 to-amber-400' },
    { value: 'green', label: 'Green', colors: 'bg-emerald-500' },
  ];

  return (
    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex gap-1.5">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`w-4 h-4 rounded-full ${t.colors} transition-all ${
            theme === t.value
              ? 'ring-2 ring-gray-900 ring-offset-1 scale-110'
              : 'hover:scale-105 opacity-70 hover:opacity-100'
          }`}
          title={t.label}
          aria-label={`Switch to ${t.label} theme`}
        />
      ))}
    </div>
  );
}
