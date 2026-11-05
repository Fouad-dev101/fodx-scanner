import { useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { documentService } from '@/features/documents/documentService';
import { useScanFlow } from '@/features/scanner/useScanFlow';
import type { PageSize } from '@/services/pdf/buildPdf';
import { useLibraryStore } from '@/store/libraryStore';
import { useScanSessionStore } from '@/store/scanSessionStore';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/tokens';
import { defaultScanDate, sanitizeName } from '@/utils/format';

const SIZES: { key: PageSize; label: string }[] = [
  { key: 'a4', label: 'A4' },
  { key: 'letter', label: 'Letter' },
  { key: 'original', label: 'Original' },
];

export default function ScanReviewScreen() {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const scan = useScanFlow();
  const { pages, removePage, clear } = useScanSessionStore();
  const refresh = useLibraryStore((s) => s.refresh);
  const defaultName = useMemo(
    () => t('scan.defaultName', { date: defaultScanDate(i18n.language) }),
    [t, i18n.language],
  );
  const [name, setName] = useState(defaultName);
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (saving || pages.length === 0) return;
    setSaving(true);
    try {
      const id = await documentService.saveScan(sanitizeName(name) || defaultName, pages, pageSize);
      await refresh();
      clear();
      router.replace(`/document/${id}`);
    } catch {
      Alert.alert(t('common.error'), t('scan.saveFailed'));
      setSaving(false);
    }
  };

  return (
    <Screen edges={['bottom']}>
      <AppText variant="headline">{t('scan.reviewTitle')}</AppText>

      <View style={styles.field}>
        <AppText variant="caption" tone="muted">
          {t('scan.nameLabel')}
        </AppText>
        <TextInput
          value={name}
          onChangeText={setName}
          maxLength={80}
          style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
        />
      </View>

      {pages.length === 0 ? (
        <EmptyState title={t('scan.reviewTitle')} body={t('scan.noPages')} />
      ) : (
        <View style={styles.grid}>
          {pages.map((uri, index) => (
            <View key={uri} style={[styles.page, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <Image source={{ uri }} style={styles.pageImage} resizeMode="contain" />
              <View style={[styles.badge, { backgroundColor: colors.brand }]}>
                <AppText variant="caption" tone="onBrand">
                  {index + 1}
                </AppText>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('scan.removePage')}
                onPress={() => removePage(index)}
                hitSlop={8}
                style={[styles.remove, { backgroundColor: colors.brand }]}
              >
                <Icon name="x" size={14} tone="onBrand" />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      <View style={styles.field}>
        <AppText variant="caption" tone="muted">
          PDF
        </AppText>
        <ScrollView horizontal contentContainerStyle={styles.sizes} showsHorizontalScrollIndicator={false}>
          {SIZES.map((s) => {
            const selected = s.key === pageSize;
            return (
              <Pressable
                key={s.key}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setPageSize(s.key)}
                style={[
                  styles.sizeChip,
                  {
                    backgroundColor: selected ? colors.primary : colors.surface,
                    borderColor: selected ? colors.primary : colors.border,
                  },
                ]}
              >
                <AppText variant="caption" tone={selected ? 'onPrimary' : 'text'}>
                  {s.label}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.actions}>
        <Button
          label={t('scan.addPages')}
          icon="plus"
          variant="secondary"
          disabled={saving}
          onPress={() => scan({ append: true })}
        />
        <Button
          label={saving ? t('scan.saving') : t('scan.saveAsPdf')}
          icon="check"
          loading={saving}
          disabled={pages.length === 0}
          onPress={save}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  field: { gap: spacing.xs },
  input: {
    borderWidth: 1,
    borderRadius: radius.control,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    fontSize: 16,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  page: {
    width: '47%',
    aspectRatio: 0.72,
    borderRadius: radius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
  pageImage: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute',
    start: spacing.sm,
    bottom: spacing.sm,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remove: {
    position: 'absolute',
    end: spacing.sm,
    top: spacing.sm,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizes: { gap: spacing.sm },
  sizeChip: { paddingHorizontal: spacing.lg, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1 },
  actions: { gap: spacing.sm },
});
