import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import fr from './fr';
import ar from './ar';

export type LanguageCode = 'en' | 'fr' | 'ar';

export const LANGUAGES: { code: LanguageCode; label: string; rtl: boolean }[] = [
  { code: 'en', label: 'English', rtl: false },
  { code: 'fr', label: 'Français', rtl: false },
  { code: 'ar', label: 'العربية', rtl: true },
];

export const isRtl = (code: LanguageCode) => code === 'ar';

export async function initI18n(language: LanguageCode) {
  if (i18n.isInitialized) {
    await i18n.changeLanguage(language);
    return i18n;
  }
  await i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar },
    },
    lng: language,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    returnNull: false,
  });
  return i18n;
}

export default i18n;
