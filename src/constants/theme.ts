// src/constants/theme.ts

export type ThemeMode = 'light' | 'dark' | 'system';

export type ColorScheme = {
  // Brand
  primary: string;
  primaryDark: string;
  accent: string;

  // Surfaces
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  // Semantic
  success: string;
  warning: string;
  error: string;

  // Overlays
  overlay: string;
  tabBarBackground: string;
};

export const LIGHT_COLORS: ColorScheme = {
  primary: '#0B1D3A',       // Deep navy
  primaryDark: '#071428',
  accent: '#2563EB',        // Electric blue

  background: '#F7F8FA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: '#E5E7EB',

  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',

  overlay: 'rgba(11, 29, 58, 0.45)',
  tabBarBackground: '#FFFFFF',
};

export const DARK_COLORS: ColorScheme = {
  primary: '#1E3A5F',       // Lighter navy for dark surfaces
  primaryDark: '#0B1D3A',
  accent: '#3B82F6',

  background: '#0A0F1C',
  surface: '#111827',
  surfaceElevated: '#1F2937',
  border: '#374151',

  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textMuted: '#6B7280',
  textInverse: '#0B1D3A',

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  overlay: 'rgba(0, 0, 0, 0.6)',
  tabBarBackground: '#111827',
};

/**
 * Spacing scale: 4-point system.
 * Use these instead of hardcoded margins/paddings.
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

/**
 * Typography scale. System font by default.
 * If you later add a custom font, update `fontFamily` here.
 */
export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
  bodyBold: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  captionMedium: { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
  label: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },
} as const;

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;