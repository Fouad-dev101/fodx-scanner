import { useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { DocumentActions, shareDocument } from '@/components/documents/DocumentActions';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { documentsRepository } from '@/database/documentsRepository';
import { exists, uriOf } from '@/services/filesystem/storage';
import { useLibraryStore } from '@/store/libraryStore';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/tokens';
import type { DocumentRecord, PageRecord } from '@/types/document';
import { formatBytes, formatDateTime } from '@/utils/format';

const PAGE_WIDTH = Dimensions.get('window').width - spacing.lg * 2;

export default function DocumentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const library = useLibraryStore((s) => s.documents);
  const [doc, setDoc] = useState<DocumentRecord | null>(null);
  const [pages, setPages] = useState<PageRecord[]>([]);
  const [index, setIndex] = useState(0);
  const [menu, setMenu] = useState(false);
  const [missing, setMissing] = useState(false);

  const load = useCallback(async () => {
    const record = await documentsRepository.get(id);
    setDoc(record);
    if (record) {
      setPages(await documentsRepository.pages(record.id));
      setMissing(!exists(record.pdfPath));
    }
  }, [id]);

  // Reload when the library changes (rename / favorite from the action sheet).
  useEffect(() => {
    load().catch(() => {});
  }, [load, library]);

  if (!doc) {
    return (
      <Screen scroll={false}>
        <EmptyState title={t('common.error')} body={t('documents.missingFile')} />
      </Screen>
    );
  }

  const rows: [string, string][] = [
    [t('documents.type'), doc.kind === 'image' ? 'JPG → PDF' : 'PDF'],
    [t('documents.size'), formatBytes(doc.fileSize, i18n.language)],
    [t('documents.pages'), String(doc.pageCount)],
    [t('documents.created'), formatDateTime(doc.createdAt, i18n.language)],
    [t('documents.modified'), formatDateTime(doc.updatedAt, i18n.language)],
    [t('documents.ocr'), doc.ocrStatus === 'done' ? t('common.done') : t('documents.ocrNone')],
  ];

  return (
    <Screen scroll edges={['bottom']}>
      <Stack.Screen options={{ title: doc.name }} />

      {pages.length > 0 ? (
        <View style={styles.viewer}>
          <FlatList
            data={pages}
            keyExtractor={(p) => p.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / PAGE_WIDTH))}
            renderItem={({ item }) => (
              <View style={[styles.page, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {exists(item.imagePath) ? (
                  <Image source={{ uri: uriOf(item.imagePath) }} style={styles.pageImage} resizeMode="contain" />
                ) : (
                  <AppText tone="muted">{t('documents.missingFile')}</AppText>
                )}
              </View>
            )}
          />
          <AppText variant="caption" tone="muted" style={styles.indicator}>
            {index + 1} / {pages.length}
          </AppText>
        </View>
      ) : (
        <AppText tone="muted">{t('documents.previewUnavailable')}</AppText>
      )}

      {missing ? <AppText tone="danger">{t('documents.missingFile')}</AppText> : null}

      <View style={styles.actions}>
        <Button
          label={t('common.share')}
          icon="share-2"
          disabled={missing}
          onPress={() => shareDocument(doc, t as (k: string) => string).catch(() => {})}
        />
        <Button label={t('common.more')} icon="more-horizontal" variant="secondary" onPress={() => setMenu(true)} />
      </View>

      <View style={styles.details}>
        <AppText variant="title">{t('documents.details')}</AppText>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {rows.map(([label, value]) => (
            <View key={label} style={styles.detailRow}>
              <AppText tone="muted" style={styles.detailLabel}>
                {label}
              </AppText>
              <AppText style={styles.detailValue}>{value}</AppText>
            </View>
          ))}
        </View>
      </View>

      <DocumentActions
        doc={menu ? doc : null}
        onClose={() => setMenu(false)}
        onDeleted={() => router.back()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  viewer: { gap: spacing.sm },
  page: {
    width: PAGE_WIDTH,
    aspectRatio: 0.72,
    borderRadius: radius.card,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageImage: { width: '100%', height: '100%' },
  indicator: { textAlign: 'center' },
  actions: { gap: spacing.sm },
  details: { gap: spacing.sm },
  card: { borderRadius: radius.card, borderWidth: 1, padding: spacing.lg, gap: spacing.md },
  detailRow: { flexDirection: 'row', gap: spacing.md },
  detailLabel: { width: 110 },
  detailValue: { flex: 1 },
});
