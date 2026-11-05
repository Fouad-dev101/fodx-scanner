import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { importPdf, imagesToPdf } from '@/features/documents/importActions';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/tokens';
import { defaultScanDate } from '@/utils/format';

export default function ToolsScreen() {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const open = (id: string | null) => {
    if (id) router.push(`/document/${id}`);
  };

  const available: { icon: IconName; title: string; body: string; onPress: () => void }[] = [
    {
      icon: 'layers',
      title: t('tools.imagesToPdf'),
      body: t('tools.imagesToPdfBody'),
      onPress: async () => open(await imagesToPdf(t, t('scan.defaultName', { date: defaultScanDate(i18n.language) }))),
    },
    {
      icon: 'file-plus',
      title: t('tools.importPdf'),
      body: t('tools.importPdfBody'),
      onPress: async () => open(await importPdf(t)),
    },
  ];
  const upcoming: { icon: IconName; title: string }[] = [
    { icon: 'git-merge', title: t('tools.merge') },
    { icon: 'scissors', title: t('tools.split') },
    { icon: 'minimize-2', title: t('tools.compress') },
    { icon: 'rotate-cw', title: t('tools.rotate') },
    { icon: 'move', title: t('tools.reorder') },
    { icon: 'copy', title: t('tools.extractPages') },
    { icon: 'type', title: t('tools.extractText') },
  ];

  return (
    <Screen>
      <AppText variant="headline">{t('tools.title')}</AppText>
      <View style={styles.list}>
        {available.map((item) => (
          <Pressable
            key={item.title}
            accessibilityRole="button"
            onPress={item.onPress}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
              pressed && { opacity: 0.8 },
            ]}
          >
            <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
              <Icon name={item.icon} tone="primary" />
            </View>
            <View style={styles.flex}>
              <AppText variant="bodyStrong">{item.title}</AppText>
              <AppText variant="caption" tone="muted">
                {item.body}
              </AppText>
            </View>
            <Icon name="chevron-right" tone="muted" directional />
          </Pressable>
        ))}
      </View>

      <View style={styles.list}>
        <AppText variant="caption" tone="muted">
          {t('tools.comingSoon')}
        </AppText>
        {upcoming.map((item) => (
          <View
            key={item.title}
            style={[styles.card, styles.disabled, { backgroundColor: colors.surface, borderColor: colors.border }]}
            accessibilityState={{ disabled: true }}
          >
            <View style={[styles.iconWrap, { backgroundColor: colors.surfaceAlt }]}>
              <Icon name={item.icon} tone="muted" />
            </View>
            <AppText style={styles.flex} tone="muted">
              {item.title}
            </AppText>
            <AppText variant="caption" tone="muted">
              {t('common.soon')}
            </AppText>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
  },
  disabled: { opacity: 0.6 },
  iconWrap: { width: 40, height: 40, borderRadius: radius.control, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
});
