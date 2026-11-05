import { useEffect, useState } from 'react';
import { I18nManager, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { reloadAppAsync } from 'expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getDb } from '@/database/db';
import { initI18n, isRtl } from '@/localization';
import { useLibraryStore } from '@/store/libraryStore';
import { useSettingsStore } from '@/store/settingsStore';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';

SplashScreen.preventAutoHideAsync().catch(() => {});

type BootState = 'loading' | 'ready' | 'restarting' | 'error';

function Navigator() {
  const { colors, isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="scan/review" options={{ presentation: 'modal', title: '' }} />
        <Stack.Screen name="document/[id]" options={{ title: '' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [boot, setBoot] = useState<BootState>('loading');

  const start = async () => {
    setBoot('loading');
    try {
      await getDb();
      await useSettingsStore.getState().load();
      const { language } = useSettingsStore.getState();
      await initI18n(language);

      // Layout direction is a native setting: changing it needs one restart.
      I18nManager.allowRTL(true);
      if (I18nManager.isRTL !== isRtl(language)) {
        I18nManager.forceRTL(isRtl(language));
        setBoot('restarting');
        await reloadAppAsync();
        return;
      }
      await useLibraryStore.getState().refresh();
      setBoot('ready');
    } catch {
      setBoot('error');
    } finally {
      SplashScreen.hideAsync().catch(() => {});
    }
  };

  useEffect(() => {
    start();
  }, []);

  if (boot === 'ready') {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <Navigator />
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  if (boot === 'error') {
    // Plain styling on purpose: theme and i18n may be the thing that failed.
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 16, backgroundColor: '#0B1D3A' }}>
        <AppText variant="title" tone="onBrand">
          FODX Scanner could not start
        </AppText>
        <AppText tone="onBrand">
          Your documents are safe. Close the app and open it again. If this keeps happening, free some
          storage space and retry.
        </AppText>
        <Button label="Retry" onPress={start} />
      </View>
    );
  }

  return <View style={{ flex: 1, backgroundColor: '#0B1D3A' }} />;
}
