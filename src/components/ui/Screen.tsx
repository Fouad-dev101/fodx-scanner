import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/tokens';

interface Props {
  children: ReactNode;
  scroll?: boolean;
  /** Edges to inset. Screens under a native header should drop 'top'. */
  edges?: ('top' | 'bottom')[];
}

export function Screen({ children, scroll = true, edges = ['top'] }: Props) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.background }]} edges={edges}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, styles.pad]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pad: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl * 2, gap: spacing.xl },
});
