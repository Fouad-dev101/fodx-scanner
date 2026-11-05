import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';
import { DocumentRow } from '@/components/documents/DocumentRow';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { FodxMark } from '@/components/ui/FodxMark';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { importImage, importPdf, imagesToPdf } from '@/features/documents/importActions';
import { useScanFlow } from '@/features/scanner/useScanFlow';
import { useLibraryStore } from '@/store/libraryStore';
import { useTheme } from '@/theme/ThemeProvider';
import { palette, radius, spacing } from '@/theme/tokens';
import { defaultScanDate, formatBytes } from '@/utils/format';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const scan = useScanFlow();
  const { documents, stats, refresh } = useLibraryStore();

  useFocusEffect(
    useCallback(() => {
      refresh().catch(() => {});
    }, [refresh]),
  );

  const open = (id: string | null) => {
    if (id) router.push(`/document/${id}`);
  };

  const quick: { icon: IconName; label: string; onPress?: () => void }[] = [
    { icon: 'file-plus', label: t('home.importPdf'), onPress: async () => open(await importPdf(t)) },
    { icon: 'image', label: t('home.importImage'), onPress: async () => open(await importImage(t)) },
    {
      icon: 'layers',
      label: t('home.createPdf'),
      onPress: async () => open(await imagesToPdf(t, t('scan.defaultName', { date: defaultScanDate(i18n.language) }))),
    },
    { icon: 'type', label: t('home.extractText') },
  ];

  return (
    <Screen>
      <View style={styles.header}>
        <FodxMark size={34} frame={colors.text} accent={colors.primary} />
        <View>
          <AppText variant="title">FODX Scanner</AppText>
          <AppText variant="caption" tone="muted">
            {t('home.tagline')}
          </AppText>
        </View>
      </View>

      <View style={[styles.hero, { backgroundColor: colors.brand }]}>
        <View style={styles.heroFrame} pointerEvents="none">
          <Svg width={150} height={150} viewBox="0 0 150 150" fill="none">
            <Path
              d="M10 50V22a12 12 0 0 1 12-12h28M100 10h28a12 12 0 0 1 12 12v28M140 100v28a12 12 0 0 1-12 12h-28M50 140H22a12 12 0 0 1-12-12v-28"
              stroke={palette.blue400}
              strokeWidth={5}
              strokeLinecap="round"
              strokeOpacity={0.55}
            />
          </Svg>
        </View>
        <AppText variant="headline" tone="onBrand">
          {t('home.heroTitle')}
        </AppText>
        <AppText tone="onBrand" style={styles.heroBody}>
          {t('home.heroBody')}
        </AppText>
        <Button label={t('home.scan')} icon="maximize" onPress={() => scan()} />
      </View>

      <View style={styles.section}>
        <AppText variant="title">{t('home.quick')}</AppText>
        <View style={styles.quickRow}>
          {quick.map((q) => {
            const disabled = !q.onPress;
            return (
              <Pressable
                key={q.label}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityState={{ disabled }}
                onPress={q.onPress}
                style={({ pressed }) => [
                  styles.quick,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  disabled && { opacity: 0.55 },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Icon name={q.icon} tone="primary" />
                <AppText variant="caption" style={styles.quickLabel} numberOfLines={2}>
                  {q.label}
                </AppText>
                {disabled ? (
                  <AppText variant="caption" tone="muted">
                    {t('common.soon')}
                  </AppText>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.stats, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Stat value={String(stats.totalDocuments)} label={t('home.statDocs')} />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Stat value={String(stats.totalPdfs)} label={t('home.statPdfs')} />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Stat value={formatBytes(stats.storageBytes, i18n.language)} label={t('home.statStorage')} />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <AppText variant="title">{t('home.recent')}</AppText>
          {documents.length > 0 ? (
            <Pressable onPress={() => router.push('/documents')} hitSlop={10}>
              <AppText tone="primary" variant="bodyStrong">
                {t('home.seeAll')}
              </AppText>
            </Pressable>
          ) : null}
        </View>
        {documents.length === 0 ? (
          <EmptyState title={t('home.emptyTitle')} body={t('home.emptyBody')} />
        ) : (
          documents.slice(0, 5).map((doc) => (
            <DocumentRow key={doc.id} doc={doc} onPress={() => router.push(`/document/${doc.id}`)} />
          ))
        )}
      </View>
    </Screen>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <AppText variant="stat">{value}</AppText>
      <AppText variant="caption" tone="muted">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  hero: { borderRadius: radius.hero, padding: spacing.xl, gap: spacing.md, overflow: 'hidden' },
  heroFrame: { position: 'absolute', top: -14, end: -14, opacity: 0.9 },
  heroBody: { opacity: 0.8, maxWidth: '78%', marginBottom: spacing.sm },
  section: { gap: spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quickRow: { flexDirection: 'row', gap: spacing.sm },
  quick: {
    flex: 1,
    minHeight: 92,
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  quickLabel: { flexShrink: 1 },
  stats: { flexDirection: 'row', borderRadius: radius.card, borderWidth: 1, paddingVertical: spacing.lg },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  divider: { width: 1 },
});
