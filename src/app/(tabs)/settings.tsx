// src/app/(tabs)/settings.tsx

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Card } from '../../components/ui/Card';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { useSettingsStore } from '../../store/settingsStore';
import type { AppLanguage, ThemeMode } from '../../types';

const THEME_OPTIONS: { key: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'light', label: 'Light', icon: 'sunny-outline' },
  { key: 'dark', label: 'Dark', icon: 'moon-outline' },
  { key: 'system', label: 'System', icon: 'phone-portrait-outline' },
];

const LANGUAGE_OPTIONS: { key: AppLanguage; label: string }[] = [
  { key: 'en', label: 'English' },
  { key: 'fr', label: 'Français' },
  { key: 'ar', label: 'العربية' },
];

export default function SettingsScreen() {
  const { colors } = useTheme();
  const themeMode = useSettingsStore((s) => s.themeMode);
  const language = useSettingsStore((s) => s.language);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Settings</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Preferences for FODX Scanner. Your documents never leave this device.
      </Text>

      {/* Appearance */}
      <Text style={[styles.section, { color: colors.textPrimary }]}>
        Appearance
      </Text>
      <Card>
        <View style={styles.rowBetween}>
          <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>
            Theme
          </Text>
          <View style={styles.segmented}>
            {THEME_OPTIONS.map((option) => {
              const active = themeMode === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  onPress={() => setThemeMode(option.key)}
                  style={[
                    styles.segment,
                    {
                      backgroundColor: active ? colors.accent : 'transparent',
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Ionicons
                    name={option.icon}
                    size={16}
                    color={active ? '#FFFFFF' : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.segmentLabel,
                      { color: active ? '#FFFFFF' : colors.textSecondary },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Card>

      {/* Language */}
      <Text style={[styles.section, { color: colors.textPrimary }]}>
        Language
      </Text>
      <Card>
        <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>
          Interface language
        </Text>
        <Text style={[styles.helper, { color: colors.textSecondary }]}>
          Arabic interface support (RTL) is prepared for a future stage. Selecting
          Arabic now stores the preference.
        </Text>
        <View style={styles.languageRow}>
          {LANGUAGE_OPTIONS.map((option) => {
            const active = language === option.key;
            return (
              <TouchableOpacity
                key={option.key}
                onPress={() => setLanguage(option.key)}
                style={[
                  styles.languageChip,
                  {
                    borderColor: active ? colors.accent : colors.border,
                    backgroundColor: active ? colors.accent + '14' : 'transparent',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.languageLabel,
                    { color: active ? colors.accent : colors.textSecondary },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {/* Storage */}
      <Text style={[styles.section, { color: colors.textPrimary }]}>
        Storage
      </Text>
      <Card>
        <SettingRow icon="server-outline" label="Documents on device" value="0 files" />
        <Divider />
        <SettingRow icon="archive-outline" label="Space used" value="0 B" />
        <Divider />
        <SettingRow
          icon="trash-outline"
          label="Clear temporary files"
          value="Coming in Stage 7"
        />
      </Card>

      {/* Privacy & About */}
      <Text style={[styles.section, { color: colors.textPrimary }]}>
        Privacy & About
      </Text>
      <Card>
        <SettingRow
          icon="shield-checkmark-outline"
          label="Privacy"
          value="100% on-device"
        />
        <Divider />
        <SettingRow icon="information-circle-outline" label="Version" value="1.0.0" />
        <Divider />
        <SettingRow
          icon="sparkles-outline"
          label="Tagline"
          value="Scan. Organize. Simplify."
        />
      </Card>

      <Text style={[styles.footer, { color: colors.textMuted }]}>
        FODX Scanner · Built with privacy in mind
      </Text>
    </ScreenContainer>
  );
}

function SettingRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={18} color={colors.accent} />
        <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
          {label}
        </Text>
      </View>
      <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
        {value}
      </Text>
    </View>
  );
}

function Divider() {
  const { colors } = useTheme();
  return (
    <View style={[styles.divider, { backgroundColor: colors.border }]} />
  );
}

const styles = StyleSheet.create({
  title: {
    ...TYPOGRAPHY.h1,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.xl,
  },
  section: {
    ...TYPOGRAPHY.bodyBold,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    ...TYPOGRAPHY.bodyMedium,
  },
  helper: {
    ...TYPOGRAPHY.caption,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  segmented: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  segmentLabel: {
    ...TYPOGRAPHY.label,
    marginLeft: 4,
  },
  languageRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  languageChip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: StyleSheet.hairlineWidth,
  },
  languageLabel: {
    ...TYPOGRAPHY.captionMedium,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    ...TYPOGRAPHY.bodyMedium,
    marginLeft: SPACING.md,
  },
  settingValue: {
    ...TYPOGRAPHY.caption,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  footer: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    marginTop: SPACING.xxxl,
  },
});