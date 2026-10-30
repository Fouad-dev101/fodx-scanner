// src/store/settingsStore.ts

import { create } from 'zustand';
import type { AppLanguage, ThemeMode } from '../types';

interface SettingsState {
  themeMode: ThemeMode;
  language: AppLanguage;
  isHydrated: boolean;

  setThemeMode: (mode: ThemeMode) => void;
  setLanguage: (lang: AppLanguage) => void;
  setHydrated: (hydrated: boolean) => void;
}

/**
 * Stage 1 store: in-memory only.
 * Stage 4 will add persistence via expo-sqlite (SETTINGS table).
 * We deliberately avoid AsyncStorage here because the spec requires SQLite
 * as the single source of truth.
 */
export const useSettingsStore = create<SettingsState>((set) => ({
  themeMode: 'system',
  language: 'en',
  isHydrated: false,

  setThemeMode: (themeMode) => set({ themeMode }),
  setLanguage: (language) => set({ language }),
  setHydrated: (isHydrated) => set({ isHydrated }),
}));