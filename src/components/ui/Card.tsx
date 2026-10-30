// src/components/ui/Card.tsx

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  /** Remove internal padding for full-bleed cards. */
  noPadding?: boolean;
}

export function Card({ children, style, noPadding = false }: CardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          padding: noPadding ? 0 : SPACING.lg,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: StyleSheet.hairlineWidth,
    ...SHADOWS.card,
  },
});