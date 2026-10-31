// src/app/(tabs)/index.tsx

import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { formatBytes, getGreeting } from '../../utils/format';

const QUICK_ACTIONS: {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}[] = [
  { id: 'pdf', label: 'Import PDF', icon: 'document-outline', route: '/tools' },
  { id: 'image', label: 'Import Image', icon: 'image-outline', route: '/tools' },
  { id: 'create', label: 'Create PDF', icon: 'add-circle-outline', route: '/tools' },
  { id: 'ocr', label: 'Extract Text', icon: 'text-outline', route: '/tools' },
];

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const handleScan = () => {
    router.push('/scanner');
  };

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            {getGreeting()}
          </Text>
          <Text style={[styles.brand, { color: colors.textPrimary }]}>
            FODX Scanner
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.profileCircle,
            { backgroundColor: colors.surfaceElevated },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          onPress={() => router.push('/(tabs)/settings')}
        >
          <Ionicons name="person" size={20} color={colors.accent} />
        </TouchableOpacity>
      </View>

      {/* Primary scan CTA */}
      <Card style={styles.scanCard}>
        <View style={styles.scanCardTop}>
          <View
            style={[styles.scanIconBox, { backgroundColor: colors.accent + '18' }]}
          >
            <Ionicons name="scan" size={28} color={colors.accent} />
          </View>
          <Text style={[styles.scanTitle, { color: colors.textPrimary }]}>
            Scan a document
          </Text>
          <Text style={[styles.scanSubtitle, { color: colors.textSecondary }]}>
            Point your camera at any paper document. We will handle the rest.
          </Text>
        </View>
        <Button label="Scan Document" onPress={handleScan} />
      </Card>

      {/* Quick actions */}
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        Quick actions
      </Text>
      <View style={styles.quickGrid}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[
              styles.quickItem,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => router.push(action.route as never)}
            accessibilityRole="button"
            accessibilityLabel={action.label}
          >
            <Ionicons name={action.icon} size={22} color={colors.accent} />
            <Text
              style={[styles.quickLabel, { color: colors.textPrimary }]}
              numberOfLines={2}
            >
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats */}
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        Your library
      </Text>
      <View style={styles.statsRow}>
        <StatCard icon="documents-outline" value="0" label="Documents" />
        <StatCard icon="document-text-outline" value="0" label="PDFs" />
        <StatCard icon="server-outline" value={formatBytes(0)} label="Storage" />
      </View>

      {/* Recent documents / empty state */}
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        Recent documents
      </Text>
      <Card noPadding>
        <EmptyState
          icon="document-text-outline"
          title="No documents yet"
          description="Scan a paper document or import a PDF to get started. Everything stays on your device."
          actionLabel="Scan your first document"
          onAction={handleScan}
        />
      </Card>
    </ScreenContainer>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Ionicons name={icon} size={18} color={colors.accent} />
      <Text style={[styles.statValue, { color: colors.textPrimary }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  greeting: {
    ...TYPOGRAPHY.caption,
  },
  brand: {
    ...TYPOGRAPHY.h2,
    marginTop: 2,
  },
  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanCard: {
    marginBottom: SPACING.xl,
  },
  scanCardTop: {
    marginBottom: SPACING.lg,
  },
  scanIconBox: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  scanTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.xs,
  },
  scanSubtitle: {
    ...TYPOGRAPHY.caption,
    lineHeight: 20,
  },
  sectionTitle: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  quickItem: {
    width: '47%',
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: SPACING.lg,
    alignItems: 'flex-start',
  },
  quickLabel: {
    ...TYPOGRAPHY.captionMedium,
    marginTop: SPACING.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: SPACING.md,
    alignItems: 'flex-start',
  },
  statValue: {
    ...TYPOGRAPHY.h3,
    marginTop: SPACING.sm,
  },
  statLabel: {
    ...TYPOGRAPHY.label,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});