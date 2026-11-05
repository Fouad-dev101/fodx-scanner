import { Feather } from '@expo/vector-icons';
import { I18nManager } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import type { Tone } from './AppText';

export type IconName = React.ComponentProps<typeof Feather>['name'];

interface Props {
  name: IconName;
  size?: number;
  tone?: Tone;
  /** Mirror horizontally in RTL (arrows, chevrons). */
  directional?: boolean;
}

export function Icon({ name, size = 20, tone = 'text', directional }: Props) {
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
  return (
    <Feather
      name={name}
      size={size}
      color={color}
      style={directional && I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
    />
  );
}
