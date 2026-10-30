// src/app/(tabs)/tools.tsx

import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

type Tool = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  stage: string;
};

const TOOLS: Tool[] = [
  {
    id: 'images-to-pdf',
    title: 'Images to PDF',
    description: 'Turn photos into a clean PDF document.',
    icon: 'images-outline',
    stage: 'Stage 3',
  },
  {
    id: 'merge-pdf',
    title: 'Merge PDF',
    description: 'Combine several PDFs into one file.',
    icon: 'git-merge-outline',
    stage: 'Stage 5',
  },
  {
    id: 'split-pdf',
    title: 'Split PDF',
    description: 'Extract page ranges into new PDFs.',
    icon: 'cut-outline',
    stage: 'Stage 5',
  },
  {
    id: 'rotate-pdf',
    title: 'Rotate PDF',
    description: 'Fix page orientation permanently.',
    icon: 'refresh-outline',
    stage: 'Stage 5',
  },
  {
    id: 'delete-pages',
    title: 'Delete PDF pages',
    description: 'Remove unwanted pages from a PDF.',
    icon: 'trash-outline',
    stage: 'Stage 5',
  },
  {
    id: 'compress-pdf',
    title: 'Compress PDF',
    description: 'Reduce file size while keeping readability.',
    icon: 'archive-outline',
    stage: 'Stage 5',
  },
  {
    id: 'ocr',
    title: 'Extract text (OCR)',
    description: 'Recognise French, English and Arabic text.',
    icon: 'text-outline',
    stage: 'Stage 6',
  },
];

export default function ToolsScreen() {
  const { colors } = useTheme();

  const handleToolPress = (tool: Tool) => {
    Alert.alert(
      `${tool.title} — ${tool.stage}`,
      'This tool is implemented in a later stage. The button is wired and ready; the PDF/OCR engine will be connected next.',
    );
  };

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Tools</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Essential PDF and document utilities. No internet required.
      </Text>

      <View style={styles.grid}>
        {TOOLS.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            onPress={() => handleToolPress(tool)}
            style={[
              styles.toolCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            accessibilityRole="button"
            accessibilityLabel={tool.title}
          >
            <View
              style={[
                styles.toolIconBox,
                { backgroundColor: colors.accent + '14' },
              ]}
            >
              <Ionicons name={tool.icon} size={22} color={colors.accent} />
            </View>
            <Text style={[styles.toolTitle, { color: colors.textPrimary }]}>
              {tool.title}
            </Text>
            <Text
              style={[styles.toolDescription, { color: colors.textSecondary }]}
              numberOfLines={3}
            >
              {tool.description}
            </Text>
            <Text style={[styles.toolStage, { color: colors.textMuted }]}>
              {tool.stage}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
    marginBottom: SPACING.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  toolCard: {
    width: '47%',
    borderRadius: RADIUS.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: SPACING.lg,
    minHeight: 160,
  },
  toolIconBox: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  toolTitle: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.xs,
  },
  toolDescription: {
    ...TYPOGRAPHY.caption,
    flex: 1,
  },
  toolStage: {
    ...TYPOGRAPHY.label,
    marginTop: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});