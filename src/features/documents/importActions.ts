import { Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import type { TFunction } from 'i18next';
import { documentService, InsufficientStorageError, InvalidPdfError } from './documentService';
import { useLibraryStore } from '@/store/libraryStore';
import { sanitizeName } from '@/utils/format';

const baseName = (fileName: string) => sanitizeName(fileName.replace(/\.[^.]+$/, '')) || 'Document';

function reportError(t: TFunction, error: unknown) {
  if (error instanceof InvalidPdfError) {
    Alert.alert(t('common.error'), t('import.invalidPdf'));
  } else if (error instanceof InsufficientStorageError) {
    Alert.alert(t('common.error'), t('scan.saveFailed'));
  } else {
    Alert.alert(t('common.error'), t('import.failed'));
  }
}

/** Returns the new document id, or null if cancelled or failed (the user has been told). */
export async function importPdf(t: TFunction): Promise<string | null> {
  try {
    const picked = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (picked.canceled || picked.assets.length === 0) return null;
    const asset = picked.assets[0];
    const id = await documentService.importPdf(baseName(asset.name), asset.uri);
    await useLibraryStore.getState().refresh();
    return id;
  } catch (error) {
    reportError(t, error);
    return null;
  }
}

async function pickImages(multiple: boolean) {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: multiple,
    selectionLimit: multiple ? 30 : 1,
    quality: 1,
    orderedSelection: multiple,
  });
  return result.canceled ? [] : result.assets;
}

/** One image becomes a one-page PDF document. */
export async function importImage(t: TFunction): Promise<string | null> {
  try {
    const assets = await pickImages(false);
    if (assets.length === 0) return null;
    const asset = assets[0];
    const id = await documentService.saveImages(baseName(asset.fileName ?? 'Image'), [asset.uri], 'image');
    await useLibraryStore.getState().refresh();
    return id;
  } catch (error) {
    reportError(t, error);
    return null;
  }
}

/** Several images, in the order they were selected, become one PDF. */
export async function imagesToPdf(t: TFunction, name: string): Promise<string | null> {
  try {
    const assets = await pickImages(true);
    if (assets.length === 0) return null;
    const id = await documentService.saveImages(name, assets.map((a) => a.uri), 'image');
    await useLibraryStore.getState().refresh();
    return id;
  } catch (error) {
    reportError(t, error);
    return null;
  }
}
