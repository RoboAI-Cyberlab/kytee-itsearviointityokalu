import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useAppStore } from './store/appStore';

// Dynamically load translations based on language and namespace
const loadResources = async (lng: string, ns: string) => {
  try {
    const response = await fetch(`/locales/${lng}/${ns}.json`);
    if (!response.ok) {
      console.warn(`Failed to load ${lng}/${ns}.json`);
      return {};
    }
    return await response.json();
  } catch (error) {
    console.warn(`Error loading ${lng}/${ns}.json:`, error);
    return {};
  }
};

// Initialize i18next with custom backend. Resolves when the translations are loaded.
export const i18nReady = i18next
  .use(initReactI18next)
  .use({
    type: 'backend',
    read: async (language: string, namespace: string, callback: (err: Error | null, data?: any) => void) => {
      try {
        const data = await loadResources(language, namespace);
        callback(null, data);
      } catch (error) {
        callback(error as Error);
      }
    },
  })
  .init({
    lng: useAppStore.getState().language || 'fi',
    fallbackLng: 'fi',
    supportedLngs: ['fi', 'en', 'sv'],
    preload: ['fi'], // Preload Finnish translations for faster initial load

    ns: ['common', 'validation', 'forms', 'pages', 'report', 'navigation'],
    defaultNS: 'common',

    debug: import.meta.env.DEV,
    showSupportNotice: false,

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: true,
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

// Two-way sync: i18next -> appStore
i18next.on('languageChanged', (lng) => {
  const currentLang = useAppStore.getState().language;
  if (currentLang !== lng) {
    useAppStore.getState().setLanguage(lng);
  }
});

// Two-way sync: appStore -> i18next
useAppStore.subscribe((state) => {
  if (state.language !== i18next.language) {
    i18next.changeLanguage(state.language);
  }
});

export default i18next;
