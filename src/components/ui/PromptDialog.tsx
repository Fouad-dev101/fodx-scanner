import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { Button } from './Button';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/tokens';

interface Props {
  visible: boolean;
  title: string;
  initialValue: string;
  onCancel: () => void;
  onSubmit: (value: string) => void;
}

export function PromptDialog({ visible, title, initialValue, onCancel, onSubmit }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    if (visible) setValue(initialValue);
  }, [visible, initialValue]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.backdrop, { backgroundColor: colors.overlay }]}
      >
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <AppText variant="title">{title}</AppText>
          <TextInput
            value={value}
            onChangeText={setValue}
            autoFocus
            selectTextOnFocus
            maxLength={80}
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.border, backgroundColor: colors.surfaceAlt },
            ]}
            placeholderTextColor={colors.textMuted}
          />
          <View style={styles.actions}>
            <View style={styles.flex}>
              <Button label={t('common.cancel')} variant="secondary" onPress={onCancel} />
            </View>
            <View style={styles.flex}>
              <Button label={t('common.save')} disabled={value.trim().length === 0} onPress={() => onSubmit(value)} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'center', padding: spacing.xl },
  card: { borderRadius: radius.hero, padding: spacing.xl, gap: spacing.lg },
  input: {
    borderWidth: 1,
    borderRadius: radius.control,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    fontSize: 16,
  },
  actions: { flexDirection: 'row', gap: spacing.md },
  flex: { flex: 1 },
});
