import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, type ThemeColors } from './tokens';
import { useSettingsStore } from '@/store/settingsStore';

interface ThemeValue {
  colors: ThemeColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeValue>({ colors: lightColors, isDark: false });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const preference = useSettingsStore((s) => s.theme);
  const isDark = preference === 'system' ? system === 'dark' : preference === 'dark';
  const value = useMemo<ThemeValue>(
    () => ({ colors: isDark ? darkColors : lightColors, isDark }),
    [isDark],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
