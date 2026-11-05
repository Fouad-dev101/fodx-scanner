import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { I18nManager } from 'react-native';
import Constants from 'expo-constants';
import { reloadAppAsync } from 'expo';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { FodxMark } from '@/components/ui/FodxMark';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { LANGUAGES, initI18n, isRtl, type LanguageCode } from '@/localization';
import { clearTemporaryFiles } from '@/services/filesystem/storage';
import { useLibraryStore } from '@/store/libraryStore';
import { useSettingsStore, type ThemePreference } from '@/store/settingsStore';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/tokens';
import { formatBytes } from '@/utils/format';

const THEMES: { key: ThemePreference; label: string }[] = [
  { key: 'system', label: 'settings.themeSystem' },
  { key: 'light', label: 'settings.themeLight' },
  { key: 'dark', label: 'settings.themeDark' },
];

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const { theme, language, setTheme, setLanguage } = useSettingsStore();
  const storageBytes = useLibraryStore((s) => s.stats.storageBytes);

  const changeLanguage = async (code: LanguageCode) => {
    if (code === language) return;
    await setLanguage(code);
    if (I18nManager.isRTL !== isRtl(code)) {
      // Direction changes only apply after a restart.
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(isRtl(code));
      Alert.alert(t('settings.language'), t('settings.languageRestart'), [
        { text: t('common.done'), onPress: () => reloadAppAsync() },
      ]);
      return;
    }
    await initI18n(code);
  };

  const clearTemp = () => {
    clearTemporaryFiles();
    Alert.alert(t('settings.clearTemp'), t('settings.clearTempDone'));
  };

  return (
    <Screen>
      <AppText variant="headline">{t('settings.title')}</AppText>

      <Section title={t('settings.appearance')}>
        <AppText variant="caption" tone="muted">
          {t('settings.theme')}
        </AppText>
        <View style={styles.segment}>
          {THEMES.map((item) => {
            const selected = item.key === theme;
            return (
              <Pressable
                key={item.key}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setTheme(item.key)}
                style={[
                  styles.segmentItem,
                  { backgroundColor: selected ? colors.primary : colors.surfaceAlt },
                ]}
              >
                <AppText variant="bodyStrong" tone={selected ? 'onPrimary' : 'text'}>
                  {t(item.label)}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </Section>

      <Section title={t('settings.language')}>
        {LANGUAGES.map((lang) => (
          <Pressable
            key={lang.code}
            accessibilityRole="button"
            accessibilityState={{ selected: lang.code === language }}
            onPress={() => changeLanguage(lang.code)}
            style={styles.langRow}
          >
            <AppText style={styles.flex}>{lang.label}</AppText>
            {lang.code === language ? <Icon name="check" tone="primary" /> : null}
          </Pressable>
        ))}
      </Section>

      <Section title={t('settings.storage')}>
        <View style={styles.langRow}>
          <AppText style={styles.flex}>{t('settings.storageUsed')}</AppText>
          <AppText tone="muted">{formatBytes(storageBytes, i18n.language)}</AppText>
        </View>
        <Button label={t('settings.clearTemp')} variant="secondary" icon="trash" onPress={clearTemp} />
      </Section>

      <Section title={t('settings.privacy')}>
        <AppText tone="muted">{t('settings.privacyBody')}</AppText>
      </Section>

      <Section title={t('settings.about')}>
        <View style={styles.about}>
          <FodxMark size={40} frame={colors.text} accent={colors.primary} />
          <View style={styles.flex}>
            <AppText variant="bodyStrong">FODX Scanner</AppText>
            <AppText variant="caption" tone="muted">
              {t('settings.version')} {Constants.expoConfig?.version ?? '1.0.0'}
            </AppText>
          </View>
        </View>
        <AppText tone="muted">{t('settings.aboutBody')}</AppText>
      </Section>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <AppText variant="title">{title}</AppText>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  section: { gap: spacing.sm },
  card: { borderRadius: radius.card, borderWidth: 1, padding: spacing.lg, gap: spacing.md },
  segment: { flexDirection: 'row', gap: spacing.sm },
  segmentItem: {
    flex: 1,
    minHeight: 42,
    borderRadius: radius.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langRow: { flexDirection: 'row', alignItems: 'center', minHeight: 40, gap: spacing.md },
  about: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
