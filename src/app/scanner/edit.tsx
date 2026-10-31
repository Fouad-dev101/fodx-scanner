// src/app/scanner/edit.tsx
import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, 
  Alert, ActivityIndicator, Modal, TextInput, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImageManipulator from 'expo-image-manipulator';
import { useTheme } from '../../hooks/useTheme';
import { useScannerStore } from '../../store/scannerStore';
import { generatePdfFromPages } from '../../services/pdfService';

export default function PageEditorScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { pages, removePage, updatePage, clearSession } = useScannerStore();
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [documentName, setDocumentName] = useState('');

  const activePage = pages[activeIndex];

  if (!activePage) {
    router.replace('/scanner');
    return null;
  }

  const handleRotate = async (direction: 'left' | 'right') => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const degrees = direction === 'right' ? 90 : -90;
      const manipResult = await ImageManipulator.manipulateAsync(
        activePage.uri,
        [{ rotate: degrees }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      updatePage(activePage.id, { uri: manipResult.uri });
    } catch (error) {
      Alert.alert('Error', 'Failed to rotate image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = () => {
    removePage(activePage.id);
    if (pages.length === 1) {
      router.replace('/scanner');
    } else {
      setActiveIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleSavePdf = async () => {
    if (!documentName.trim()) {
      Alert.alert('Name Required', 'Please enter a name for your document.');
      return;
    }

    setIsSaving(true);
    try {
      await generatePdfFromPages(pages, documentName.trim());
      
      // Clear the session so the next scan starts fresh
      clearSession();
      setShowNameModal(false);
      
      // Navigate back to the Home tab
      router.replace('/(tabs)');
      Alert.alert('Success', 'Document saved to FODX library!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save PDF. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.replace('/scanner')}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Page {activeIndex + 1} of {pages.length}
        </Text>
        <TouchableOpacity style={styles.iconButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      {/* Main Image Area */}
      <View style={styles.imageContainer}>
        {isProcessing ? (
          <ActivityIndicator size="large" color={colors.accent} />
        ) : (
          <Image source={{ uri: activePage.uri }} style={styles.image} resizeMode="contain" />
        )}
      </View>

      {/* Bottom Tools Area */}
      <View style={[styles.bottomArea, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        
        {/* Thumbnails Strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnailList}>
          {pages.map((page, index) => (
            <TouchableOpacity
              key={page.id}
              onPress={() => setActiveIndex(index)}
              style={[styles.thumbnailContainer, activeIndex === index && { borderColor: colors.accent, borderWidth: 2 }]}
            >
              <Image source={{ uri: page.uri }} style={styles.thumbnail} />
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={[styles.addPageButton, { borderColor: colors.border }]} onPress={() => router.push('/scanner')}>
            <Ionicons name="add" size={24} color={colors.textMuted} />
          </TouchableOpacity>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolButton} onPress={() => handleRotate('left')}>
            <Ionicons name="arrow-undo" size={24} color={colors.textPrimary} />
            <Text style={[styles.toolText, { color: colors.textSecondary }]}>Rotate L</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolButton} onPress={() => handleRotate('right')}>
            <Ionicons name="arrow-redo" size={24} color={colors.textPrimary} />
            <Text style={[styles.toolText, { color: colors.textSecondary }]}>Rotate R</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: colors.accent }]}
            onPress={() => setShowNameModal(true)}
          >
            <Text style={styles.saveButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Naming Modal */}
      <Modal visible={showNameModal} transparent animationType="fade">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Save Document</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Give your document a name.
            </Text>
            
            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.background }]}
              placeholder="e.g. University Application"
              placeholderTextColor={colors.textMuted}
              value={documentName}
              onChangeText={setDocumentName}
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowNameModal(false)}
                disabled={isSaving}
              >
                <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.confirmButton, { backgroundColor: colors.accent }]} 
                onPress={handleSavePdf}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={{ color: '#FFF', fontWeight: '600' }}>Save PDF</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (Keep all your existing styles here) ...
  container: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  iconButton: { padding: 8 },
  title: { fontSize: 16, fontWeight: '600' },
  imageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  image: { width: '100%', height: '100%' },
  bottomArea: { borderTopWidth: 1, paddingBottom: 20 },
  thumbnailList: { padding: 12, gap: 12 },
  thumbnailContainer: { width: 60, height: 80, borderRadius: 6, overflow: 'hidden', borderWidth: 1, borderColor: 'transparent' },
  thumbnail: { width: '100%', height: '100%' },
  addPageButton: { width: 60, height: 80, borderRadius: 6, borderWidth: 1, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  toolbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 8 },
  toolButton: { alignItems: 'center', justifyContent: 'center', padding: 8 },
  toolText: { fontSize: 12, marginTop: 4, fontWeight: '500' },
  saveButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, gap: 8 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  modalSubtitle: { fontSize: 14, marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 24 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  confirmButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, minWidth: 100, alignItems: 'center' },
});