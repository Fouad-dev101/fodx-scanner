// src/components/ui/ScreenContainer.tsx

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SPACING } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  /** Disable horizontal padding for full-bleed screens. */
  noPadding?: boolean;
}

export function ScreenContainer({
  children,
  scrollable = true,
  noPadding = false,
}: ScreenContainerProps) {
  const { colors } = useTheme();

  const padding = noPadding ? 0 : SPACING.xl;

  if (scrollable) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { padding }]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={[styles.staticContent, { padding }]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxl * 2,
  },
  staticContent: {
    flex: 1,
  },
});