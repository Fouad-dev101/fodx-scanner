import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScanError, scanner } from '@/services/scanning';
import { useScanSessionStore } from '@/store/scanSessionStore';

/** Opens the scanner, stores the pages, and moves to the review screen. */
export function useScanFlow() {
  const router = useRouter();
  const { t } = useTranslation();

  return useCallback(
    async (options: { append?: boolean } = {}) => {
      try {
        const result = await scanner.scan();
        if (result.status !== 'success') return;
        const store = useScanSessionStore.getState();
        if (options.append) {
          store.appendPages(result.pages);
        } else {
          store.setPages(result.pages);
          router.push('/scan/review');
        }
      } catch (error) {
        if (error instanceof ScanError && error.code === 'unavailable') {
          Alert.alert(t('scan.unavailableTitle'), t('scan.unavailableBody'));
        } else {
          Alert.alert(t('common.error'), error instanceof Error ? error.message : undefined);
        }
      }
    },
    [router, t],
  );
}
