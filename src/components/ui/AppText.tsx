import { Text, type TextProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography, type TypographyVariant } from '@/theme/tokens';

export type Tone = 'text' | 'muted' | 'primary' | 'danger' | 'success' | 'onBrand' | 'onPrimary';

interface Props extends TextProps {
  variant?: TypographyVariant;
  tone?: Tone;
}

export function AppText({ variant = 'body', tone = 'text', style, ...rest }: Props) {
  const { colors } = useTheme();
  const color = {
    text: colors.text,
    muted: colors.textMuted,
    primary: colors.primary,
    danger: colors.danger,
    success: colors.success,
    onBrand: colors.onBrand,
    onPrimary: colors.onPrimary,
  }[tone];
  return <Text {...rest} style={[typography[variant], { color }, style]} />;
}
