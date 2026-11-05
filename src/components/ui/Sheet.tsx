import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/tokens';

interface Props {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

/** Bottom sheet for action lists and pickers. */
export function Sheet({ visible, onClose, children }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={[styles.backdrop, { backgroundColor: colors.overlay }]} onPress={onClose} />
      <View
        style={[
          styles.panel,
          { backgroundColor: colors.surface, paddingBottom: insets.bottom + spacing.lg },
        ]}
      >
        <View style={[styles.grab, { backgroundColor: colors.border }]} />
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1 },
  panel: {
    borderTopLeftRadius: radius.hero,
    borderTopRightRadius: radius.hero,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  grab: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, marginBottom: spacing.sm },
});
