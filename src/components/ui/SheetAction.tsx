import { Pressable, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { spacing } from '@/theme/tokens';

interface Props {
  label: string;
  icon: IconName;
  onPress: () => void;
  destructive?: boolean;
  selected?: boolean;
}

export function SheetAction({ label, icon, onPress, destructive, selected }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}
    >
      <Icon name={icon} tone={destructive ? 'danger' : selected ? 'primary' : 'text'} />
      <AppText tone={destructive ? 'danger' : selected ? 'primary' : 'text'} style={styles.label}>
        {label}
      </AppText>
      {selected ? <Icon name="check" tone="primary" /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, minHeight: 48 },
  label: { flex: 1 },
});
