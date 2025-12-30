'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Theme = 'default' | 'usc' | 'green';

interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  accent: string;
  accentLight: string;
  background: string;
}

const themes: Record<Theme, ThemeColors> = {
  default: {
    primary: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-700',
    primaryLight: 'bg-blue-50',
    accent: 'text-blue-600',
    accentLight: 'border-blue-200',
    background: 'from-gray-50 to-blue-50',
  },
  usc: {
    primary: 'bg-rose-500',
    primaryHover: 'hover:bg-rose-600',
    primaryLight: 'bg-amber-50',
    accent: 'text-rose-500',
    accentLight: 'border-amber-200',
    background: 'from-gray-50 to-amber-50',
  },
  green: {
    primary: 'bg-emerald-600',
    primaryHover: 'hover:bg-emerald-700',
    primaryLight: 'bg-emerald-50',
    accent: 'text-emerald-600',
    accentLight: 'border-emerald-200',
    background: 'from-gray-50 to-emerald-50',
  },
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('default');

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
