import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeType = 'azul-morado' | 'rosa-naranja' | 'azul-celeste' | 'verde-agua' | 'gris-oscuro' | 'rosa-rojo';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themeColors = {
  'azul-morado': {
    primary: '#6366f1', // indigo-500
    primaryHover: '#4f46e5', // indigo-600
    primaryTwo: '#a855f7', // purple-500
    primaryFaint: '#f3e8ff', // purple-100
  },
  'rosa-naranja': {
    primary: '#ec4899', // pink-500
    primaryHover: '#db2777', // pink-600
    primaryTwo: '#fb923c', // orange-400
    primaryFaint: '#fce7f3', // pink-100
  },
  'azul-celeste': {
    primary: '#3b82f6', // blue-500
    primaryHover: '#2563eb', // blue-600
    primaryTwo: '#22d3ee', // cyan-400
    primaryFaint: '#dbeafe', // blue-100
  },
  'verde-agua': {
    primary: '#34d399', // emerald-400
    primaryHover: '#10b981', // emerald-500
    primaryTwo: '#14b8a6', // teal-500
    primaryFaint: '#d1fae5', // emerald-100
  },
  'gris-oscuro': {
    primary: '#1f2937', // gray-800
    primaryHover: '#111827', // gray-900
    primaryTwo: '#4b5563', // gray-600
    primaryFaint: '#f3f4f6', // gray-100
  },
  'rosa-rojo': {
    primary: '#f43f5e', // rose-500
    primaryHover: '#e11d48', // rose-600
    primaryTwo: '#ef4444', // red-500
    primaryFaint: '#ffe4e6', // rose-100
  },
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>('azul-morado');

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('app-theme', newTheme);
    applyTheme(newTheme);
  };

  const applyTheme = (themeType: ThemeType) => {
    const colors = themeColors[themeType];
    const root = document.documentElement;
    
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-hover', colors.primaryHover);
    root.style.setProperty('--color-primarytwo', colors.primaryTwo);
    root.style.setProperty('--color-primaryfaint', colors.primaryFaint);
  };

  useEffect(() => {
    // Intentar cargar tema guardado
    const savedTheme = localStorage.getItem('app-theme') as ThemeType;
    if (savedTheme && themeColors[savedTheme]) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('azul-morado');
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
