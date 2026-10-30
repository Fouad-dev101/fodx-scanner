// src/app/(tabs)/documents.tsx

import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { EmptyState } from '../../components/ui/EmptyState';
import { Card } from '../../components/ui/Card';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

const FILTERS = ['All', 'PDF', 'Images', 'Favorites'] as const;
type Filter = (typeof FILTERS)[number];

export default function DocumentsScreen() {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  const isSearching = useMemo(() => query.trim().length > 0, [query]);

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Documents
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Your scanned and imported files, organised locally.
      </Text>

      {/* Search */}
      <View
        style={[
          styles.searchBox,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search documents..."
          placeholderTextColor={colors.textMuted}
          style={[styles.searchInput, { color: colors.textPrimary }]}
          returnKeyType="search"
          accessibilityLabel="Search documents"
        />
        {query.length > 0 ? (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((filter) => {
          const active = filter === activeFilter;
          return (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: active ? colors.accent : colors.surface,
                  borderColor: active ? colors.accent : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  { color: active ? '#FFFFFF' : colors.textSecondary },
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Empty state */}
      <Card noPadding style={styles.emptyCard}>
        <EmptyState
          icon={isSearching ? 'search-outline' : 'folder-open-outline'}
          title={isSearching ? 'No matching documents' : 'Your library is empty'}
          description={
            isSearching
              ? `Nothing matched “${query.trim()}”. Try a different name.`
              : 'Documents you scan or import will appear here. Use the Home tab to scan your first page.'
          }
        />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...TYPOGRAPHY.h1,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.lg,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    marginBottom: SPACING.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    ...TYPOGRAPHY.body,
  },
  filterRow: {
    gap: SPACING.sm,
    paddingBottom: SPACING.lg,
  },
  filterChip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: StyleSheet.hairlineWidth,
  },
  filterLabel: {
    ...TYPOGRAPHY.captionMedium,
  },
  emptyCard: {
    marginTop: SPACING.sm,
  },
});