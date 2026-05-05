import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeColors {
  bg: string;
  surface: string;
  surfaceSoft: string;
  surfaceStrong: string;
  text: string;
  muted: string;
  brand: string;
  brandSoft: string;
  accent: string;
  danger: string;
  warn: string;
  card: string;
  border: string;
  shadow: string;
}

export const themes: Record<Theme, ThemeColors> = {
  light: {
    bg: '#f8fafc',
    surface: '#ffffff',
    surfaceSoft: '#f1f5f9',
    surfaceStrong: '#e2e8f0',
    text: '#111827',
    muted: '#64748b',
    brand: '#2563eb',
    brandSoft: '#60a5fa',
    accent: '#d97706',
    danger: '#b91c1c',
    warn: '#c2410c',
    card: '#ffffff',
    border: '#e5e7eb',
    shadow: 'rgba(37, 99, 235, 0.08)',
  },
  dark: {
    bg: '#111827',
    surface: '#1e293b',
    surfaceSoft: '#22304a',
    surfaceStrong: '#334155',
    text: '#f1f5f9',
    muted: '#94a3b8',
    brand: '#60a5fa',
    brandSoft: '#2563eb',
    accent: '#fbbf24',
    danger: '#ef4444',
    warn: '#f97316',
    card: '#1e293b',
    border: '#334155',
    shadow: 'rgba(37, 99, 235, 0.18)',
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('politech-theme') as Theme;
    return savedTheme || 'light';
  });

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('politech-theme', newTheme);
      return newTheme;
    });
  };

  const colors = themes[theme];

  useEffect(() => {
    // Apply theme to CSS custom properties
    const root = document.documentElement;
    Object.entries(colors).forEach(([property, value]) => {
      root.style.setProperty(`--${property}`, value);
    });

    // Update color-scheme for better browser integration
    root.style.colorScheme = theme;

    // Set data-theme attribute for CSS selectors
    root.setAttribute('data-theme', theme);
  }, [theme, colors]);

  const value = {
    theme,
    toggleTheme,
    colors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}