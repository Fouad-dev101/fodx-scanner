/**
 * FODX design tokens. Kept free of app code so they can move into a shared
 * FODX UI package when a second product exists.
 */
export const palette = {
  navy950: '#050E1F',
  navy900: '#071329',
  navy800: '#0B1D3A',
  navy700: '#12294F',
  navy600: '#1B3A6B',
  blue600: '#1F5FE0',
  blue500: '#2F6BFF',
  blue400: '#5B8CFF',
  blue100: '#E3ECFF',
  gray50: '#F5F7FA',
  gray100: '#EDF1F6',
  gray200: '#E2E8F0',
  gray400: '#94A3B8',
  gray500: '#64748B',
  white: '#FFFFFF',
  red500: '#E5484D',
  green500: '#2FB67C',
} as const;

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  onPrimary: string;
  primarySoft: string;
  brand: string;
  onBrand: string;
  danger: string;
  success: string;
  overlay: string;
}

export const lightColors: ThemeColors = {
  background: palette.gray50,
  surface: palette.white,
  surfaceAlt: palette.gray100,
  border: palette.gray200,
  text: palette.navy800,
  textMuted: palette.gray500,
  primary: palette.blue500,
  onPrimary: palette.white,
  primarySoft: palette.blue100,
  brand: palette.navy800,
  onBrand: palette.white,
  danger: palette.red500,
  success: palette.green500,
  overlay: 'rgba(5,14,31,0.5)',
};

export const darkColors: ThemeColors = {
  background: palette.navy900,
  surface: '#0E2142',
  surfaceAlt: '#14294F',
  border: '#1D3560',
  text: '#EEF3FB',
  textMuted: '#8EA0BD',
  primary: '#3D78FF',
  onPrimary: palette.white,
  primarySoft: '#16305F',
  brand: palette.navy800,
  onBrand: palette.white,
  danger: '#FF6369',
  success: '#3CC48B',
  overlay: 'rgba(0,0,0,0.6)',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

/** Radii differ by role on purpose: controls are tighter than surfaces. */
export const radius = { control: 10, card: 14, hero: 22, pill: 999 } as const;

export const typography = {
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
  title: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  headline: { fontSize: 24, lineHeight: 30, fontWeight: '700' },
  stat: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
} as const;

export type TypographyVariant = keyof typeof typography;
