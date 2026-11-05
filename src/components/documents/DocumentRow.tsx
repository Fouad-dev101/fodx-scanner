import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { exists, uriOf } from '@/services/filesystem/storage';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/tokens';
import type { DocumentRecord } from '@/types/document';
import { formatBytes, formatDate } from '@/utils/format';

interface Props {
  doc: DocumentRecord;
  onPress: () => void;
  onMore?: () => void;
}

export function DocumentRow({ doc, onPress, onMore }: Props) {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const hasThumb = exists(doc.thumbnailPath);
  const typeLabel = doc.kind === 'image' ? 'JPG' : 'PDF';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && { opacity: 0.8 },
      ]}
    >
      <View style={[styles.thumb, { backgroundColor: colors.surfaceAlt }]}>
        {hasThumb && doc.thumbnailPath ? (
          <Image source={{ uri: uriOf(doc.thumbnailPath) }} style={styles.thumbImage} resizeMode="cover" />
        ) : (
          <Icon name="file-text" tone="muted" size={22} />
        )}
      </View>
      <View style={styles.meta}>
        <AppText variant="bodyStrong" numberOfLines={1}>
          {doc.name}
        </AppText>
        <AppText variant="caption" tone="muted" numberOfLines={1}>
          {formatDate(doc.createdAt, i18n.language)} · {t('common.pages', { count: doc.pageCount })} ·{' '}
          {formatBytes(doc.fileSize, i18n.language)}
        </AppText>
        <AppText variant="caption" tone="primary">
          {typeLabel}
        </AppText>
      </View>
      {doc.isFavorite ? <Icon name="star" size={16} tone="primary" /> : null}
      {onMore ? (
        <Pressable accessibilityLabel={t('common.share')} hitSlop={12} onPress={onMore} style={styles.more}>
          <Icon name="more-vertical" tone="muted" />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
  },
  thumb: {
    width: 52,
    height: 64,
    borderRadius: radius.control - 4,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImage: { width: '100%', height: '100%' },
  meta: { flex: 1, gap: 2 },
  more: { padding: spacing.xs },
});
