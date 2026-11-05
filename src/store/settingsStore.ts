import { create } from 'zustand';
import { documentsRepository } from '@/database/documentsRepository';
import type { LanguageCode } from '@/localization';

export type ThemePreference = 'system' | 'light' | 'dark';

interface SettingsState {
  ready: boolean;
  theme: ThemePreference;
  language: LanguageCode;
  load: () => Promise<void>;
  setTheme: (theme: ThemePreference) => Promise<void>;
  setLanguage: (language: LanguageCode) => Promise<void>;
}

const isTheme = (v: string | null): v is ThemePreference =>
  v === 'system' || v === 'light' || v === 'dark';
const isLanguage = (v: string | null): v is LanguageCode => v === 'en' || v === 'fr' || v === 'ar';

export const useSettingsStore = create<SettingsState>((set) => ({
  ready: false,
  theme: 'system',
  language: 'en',
  async load() {
    const [theme, language] = await Promise.all([
      documentsRepository.getSetting('theme'),
      documentsRepository.getSetting('language'),
    ]);
    set({
      ready: true,
      theme: isTheme(theme) ? theme : 'system',
      language: isLanguage(language) ? language : 'en',
    });
  },
  async setTheme(theme) {
    set({ theme });
    await documentsRepository.setSetting('theme', theme);
  },
  async setLanguage(language) {
    set({ language });
    await documentsRepository.setSetting('language', language);
  },
}));
