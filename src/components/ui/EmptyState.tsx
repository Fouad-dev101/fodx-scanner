import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { FodxMark } from './FodxMark';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/tokens';

export function EmptyState({ title, body }: { title: string; body: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <FodxMark size={56} frame={colors.border} accent={colors.textMuted} />
      <AppText variant="title" style={styles.center}>
        {title}
      </AppText>
      <AppText tone="muted" style={styles.center}>
        {body}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl, paddingHorizontal: spacing.xl },
  center: { textAlign: 'center' },
});
