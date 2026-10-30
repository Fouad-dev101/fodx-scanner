// src/hooks/useTheme.ts

import { useColorScheme } from 'react-native';
import {
  DARK_COLORS,
  LIGHT_COLORS,
  type ColorScheme,
} from '../constants/theme';
import { useSettingsStore } from '../store/settingsStore';

export function useTheme(): {
  colors: ColorScheme;
  isDark: boolean;
  themeMode: 'light' | 'dark' | 'system';
} {
  const systemScheme = useColorScheme();
  const themeMode = useSettingsStore((s) => s.themeMode);

  const isDark =
    themeMode === 'dark' ||
    (themeMode === 'system' && systemScheme === 'dark');

  return {
    colors: isDark ? DARK_COLORS : LIGHT_COLORS,
    isDark,
    themeMode,
  };
}