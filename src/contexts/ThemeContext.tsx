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
    bg: '#eff2f7',
    surface: '#ffffff',
    surfaceSoft: '#f8fafc',
    surfaceStrong: '#e2e8f0',
    text: '#111827',
    muted: '#4b5563',
    brand: '#111827',
    brandSoft: '#2563eb',
    accent: '#d97706',
    danger: '#b91c1c',
    warn: '#c2410c',
    card: '#ffffff',
    border: 'rgba(79, 89, 109, 0.16)',
    shadow: 'rgba(15, 23, 42, 0.08)',
  },
  dark: {
    bg: '#0f172a',
    surface: '#1e293b',
    surfaceSoft: '#334155',
    surfaceStrong: '#475569',
    text: '#f1f5f9',
    muted: '#94a3b8',
    brand: '#60a5fa',
    brandSoft: '#3b82f6',
    accent: '#fbbf24',
    danger: '#ef4444',
    warn: '#f97316',
    card: '#1e293b',
    border: 'rgba(148, 163, 184, 0.2)',
    shadow: 'rgba(0, 0, 0, 0.3)',
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