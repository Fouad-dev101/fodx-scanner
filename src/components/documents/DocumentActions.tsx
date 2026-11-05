import { useState } from 'react';
import { Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import { useTranslation } from 'react-i18next';
import { PromptDialog } from '@/components/ui/PromptDialog';
import { Sheet } from '@/components/ui/Sheet';
import { SheetAction } from '@/components/ui/SheetAction';
import { documentsRepository } from '@/database/documentsRepository';
import { documentService } from '@/features/documents/documentService';
import { useLibraryStore } from '@/store/libraryStore';
import type { DocumentRecord } from '@/types/document';
import { sanitizeName } from '@/utils/format';

interface Props {
  doc: DocumentRecord | null;
  onClose: () => void;
  /** Called after the document was deleted (e.g. to leave the detail screen). */
  onDeleted?: () => void;
}

export async function shareDocument(doc: DocumentRecord, t: (k: string) => string) {
  const uri = documentService.pdfUri(doc.pdfPath);
  if (!uri) {
    Alert.alert(t('common.error'), t('documents.missingFile'));
    return;
  }
  if (!(await Sharing.isAvailableAsync())) {
    Alert.alert(t('common.error'), t('documents.shareUnavailable'));
    return;
  }
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: doc.name, UTI: 'com.adobe.pdf' });
}

export function DocumentActions({ doc, onClose, onDeleted }: Props) {
  const { t } = useTranslation();
  const refresh = useLibraryStore((s) => s.refresh);
  const [renaming, setRenaming] = useState(false);

  if (!doc) return null;

  const confirmDelete = () => {
    onClose();
    Alert.alert(t('documents.deleteTitle'), t('documents.deleteBody', { name: doc.name }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await documentService.remove(doc.id);
            await refresh();
            onDeleted?.();
          } catch {
            Alert.alert(t('common.error'));
          }
        },
      },
    ]);
  };

  return (
    <>
      <Sheet visible={!renaming} onClose={onClose}>
        <SheetAction
          icon="share-2"
          label={t('common.share')}
          onPress={() => {
            onClose();
            shareDocument(doc, t as (k: string) => string).catch(() => Alert.alert(t('common.error')));
          }}
        />
        <SheetAction icon="edit-2" label={t('common.rename')} onPress={() => setRenaming(true)} />
        <SheetAction
          icon="star"
          label={doc.isFavorite ? t('documents.unfavorite') : t('documents.favorite')}
          onPress={async () => {
            await documentsRepository.setFavorite(doc.id, !doc.isFavorite);
            await refresh();
            onClose();
          }}
        />
        <SheetAction icon="trash-2" label={t('common.delete')} destructive onPress={confirmDelete} />
      </Sheet>
      <PromptDialog
        visible={renaming}
        title={t('documents.renameTitle')}
        initialValue={doc.name}
        onCancel={() => {
          setRenaming(false);
          onClose();
        }}
        onSubmit={async (value) => {
          const name = sanitizeName(value);
          if (name) {
            await documentsRepository.rename(doc.id, name);
            await refresh();
          }
          setRenaming(false);
          onClose();
        }}
      />
    </>
  );
}
