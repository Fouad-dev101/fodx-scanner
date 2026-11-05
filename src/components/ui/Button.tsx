import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppText, type Tone } from './AppText';
import { Icon, type IconName } from './Icon';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/tokens';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function Button({ label, onPress, variant = 'primary', icon, loading, disabled, fullWidth = true }: Props) {
  const { colors } = useTheme();
  const palette = {
    primary: { bg: colors.primary, fg: 'onPrimary' as Tone, border: colors.primary },
    secondary: { bg: colors.surface, fg: 'text' as Tone, border: colors.border },
    danger: { bg: colors.danger, fg: 'onPrimary' as Tone, border: colors.danger },
    ghost: { bg: 'transparent', fg: 'primary' as Tone, border: 'transparent' },
  }[variant];
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={() => {
        if (variant === 'primary') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: palette.bg, borderColor: palette.border },
        fullWidth && styles.full,
        inactive && { opacity: 0.5 },
        pressed && { opacity: 0.85, transform: [{ scale: 0.985 }] },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? colors.primary : colors.onPrimary} />
      ) : (
        <View style={styles.row}>
          {icon ? <Icon name={icon} size={18} tone={palette.fg} /> : null}
          <AppText variant="bodyStrong" tone={palette.fg}>
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.control,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  full: { alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
