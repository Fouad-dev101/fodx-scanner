import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Icon, type IconName } from '@/components/ui/Icon';
import { useTheme } from '@/theme/ThemeProvider';

const tab = (name: IconName) =>
  function TabIcon({ focused }: { focused: boolean }) {
    return <Icon name={name} size={22} tone={focused ? 'primary' : 'muted'} />;
  };

export default function TabsLayout() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('tabs.home'), tabBarIcon: tab('home') }} />
      <Tabs.Screen name="documents" options={{ title: t('tabs.documents'), tabBarIcon: tab('folder') }} />
      <Tabs.Screen name="tools" options={{ title: t('tabs.tools'), tabBarIcon: tab('tool') }} />
      <Tabs.Screen name="settings" options={{ title: t('tabs.settings'), tabBarIcon: tab('settings') }} />
    </Tabs>
  );
}
