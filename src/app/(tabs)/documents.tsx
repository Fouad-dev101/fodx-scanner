import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DocumentActions } from '@/components/documents/DocumentActions';
import { DocumentRow } from '@/components/documents/DocumentRow';
import { AppText } from '@/components/ui/AppText';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { Sheet } from '@/components/ui/Sheet';
import { SheetAction } from '@/components/ui/SheetAction';
import { useLibraryStore } from '@/store/libraryStore';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/tokens';
import type { DocumentRecord, FilterKey, SortKey } from '@/types/document';

const WEEK = 7 * 24 * 60 * 60 * 1000;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'documents.filterAll' },
  { key: 'pdf', label: 'documents.filterPdf' },
  { key: 'images', label: 'documents.filterImages' },
  { key: 'favorites', label: 'documents.filterFavorites' },
  { key: 'recent', label: 'documents.filterRecent' },
];

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'newest', label: 'documents.sortNewest' },
  { key: 'oldest', label: 'documents.sortOldest' },
  { key: 'az', label: 'documents.sortAZ' },
  { key: 'za', label: 'documents.sortZA' },
  { key: 'largest', label: 'documents.sortLargest' },
  { key: 'smallest', label: 'documents.sortSmallest' },
];

function applyFilter(docs: DocumentRecord[], filter: FilterKey): DocumentRecord[] {
  switch (filter) {
    case 'pdf':
      return docs.filter((d) => d.kind === 'pdf' || d.kind === 'scan');
    case 'images':
      return docs.filter((d) => d.kind === 'image');
    case 'favorites':
      return docs.filter((d) => d.isFavorite);
    case 'recent': {
      const since = Date.now() - WEEK;
      return docs.filter((d) => d.createdAt >= since);
    }
    default:
      return docs;
  }
}

function applySort(docs: DocumentRecord[], sort: SortKey, locale: string): DocumentRecord[] {
  const copy = [...docs];
  const byName = (a: DocumentRecord, b: DocumentRecord) => a.name.localeCompare(b.name, locale);
  switch (sort) {
    case 'oldest':
      return copy.sort((a, b) => a.createdAt - b.createdAt);
    case 'az':
      return copy.sort(byName);
    case 'za':
      return copy.sort((a, b) => byName(b, a));
    case 'largest':
      return copy.sort((a, b) => b.fileSize - a.fileSize);
    case 'smallest':
      return copy.sort((a, b) => a.fileSize - b.fileSize);
    default:
      return copy.sort((a, b) => b.createdAt - a.createdAt);
  }
}

export default function DocumentsScreen() {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { documents, refresh, loaded } = useLibraryStore();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [sort, setSort] = useState<SortKey>('newest');
  const [sortOpen, setSortOpen] = useState(false);
  const [active, setActive] = useState<DocumentRecord | null>(null);

  useFocusEffect(
    useCallback(() => {
      refresh().catch(() => {});
    }, [refresh]),
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const searched = q ? documents.filter((d) => d.name.toLowerCase().includes(q)) : documents;
    return applySort(applyFilter(searched, filter), sort, i18n.language);
  }, [documents, query, filter, sort, i18n.language]);

  // Keep the open action sheet in sync after rename/favorite changes.
  const activeDoc = active ? (documents.find((d) => d.id === active.id) ?? null) : null;

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.top}>
        <View style={styles.titleRow}>
          <AppText variant="headline">{t('documents.title')}</AppText>
          <Pressable
            accessibilityLabel={t('documents.sort')}
            accessibilityRole="button"
            onPress={() => setSortOpen(true)}
            hitSlop={10}
            style={[styles.sortBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
          >
            <Icon name="sliders" size={18} />
          </Pressable>
        </View>
        <View style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Icon name="search" tone="muted" size={18} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('documents.search')}
            placeholderTextColor={colors.textMuted}
            style={[styles.searchInput, { color: colors.text }]}
            returnKeyType="search"
            autoCorrect={false}
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} hitSlop={10}>
              <Icon name="x" tone="muted" size={18} />
            </Pressable>
          ) : null}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {FILTERS.map((f) => {
            const selected = f.key === filter;
            return (
              <Pressable
                key={f.key}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setFilter(f.key)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selected ? colors.primary : colors.surface,
                    borderColor: selected ? colors.primary : colors.border,
                  },
                ]}
              >
                <AppText variant="caption" tone={selected ? 'onPrimary' : 'text'}>
                  {t(f.label)}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={visible}
        keyExtractor={(d) => d.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        renderItem={({ item }) => (
          <DocumentRow
            doc={item}
            onPress={() => router.push(`/document/${item.id}`)}
            onMore={() => setActive(item)}
          />
        )}
        ListEmptyComponent={
          loaded ? (
            <EmptyState
              title={t('documents.emptyTitle')}
              body={documents.length === 0 ? t('documents.emptyBody') : t('documents.noResults')}
            />
          ) : undefined
        }
        keyboardShouldPersistTaps="handled"
      />

      <Sheet visible={sortOpen} onClose={() => setSortOpen(false)}>
        {SORTS.map((s) => (
          <SheetAction
            key={s.key}
            icon="arrow-down"
            label={t(s.label)}
            selected={s.key === sort}
            onPress={() => {
              setSort(s.key);
              setSortOpen(false);
            }}
          />
        ))}
      </Sheet>

      <DocumentActions doc={activeDoc} onClose={() => setActive(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  top: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.md },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sortBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.control,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.control,
    borderWidth: 1,
    minHeight: 46,
  },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: spacing.sm },
  chips: { gap: spacing.sm, paddingVertical: spacing.xs },
  chip: { paddingHorizontal: spacing.md, paddingVertical: 7, borderRadius: radius.pill, borderWidth: 1 },
  list: { padding: spacing.lg, paddingBottom: spacing.xxl * 2 },
});
