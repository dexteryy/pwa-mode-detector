import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import zh from './locales/zh';
import zhTW from './locales/zh-TW';
import ja from './locales/ja';
import de from './locales/de';
import fr from './locales/fr';
import es from './locales/es';
import pt from './locales/pt';
import ko from './locales/ko';
import { addLinksToI18nResources } from '../lib/linkTerms';

// Key name for storage in localStorage
const LANGUAGE_STORAGE_KEY = 'pwa-detector-language';

// List of supported languages
const SUPPORTED_LANGUAGES = ['en', 'zh', 'zh-TW', 'ja', 'de', 'fr', 'es', 'pt', 'ko'];

// Get user's preferred language
function getInitialLanguage(): string {
  // 1. First check if there's a stored language preference in localStorage
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (storedLanguage && SUPPORTED_LANGUAGES.includes(storedLanguage)) {
    return storedLanguage;
  }
  
  // 2. If no stored language, check browser/system language
  const browserLanguages = navigator.languages || [navigator.language];
  
  // Check for specific language codes
  for (const lang of browserLanguages) {
    const lowerLang = lang.toLowerCase();
    
    // Check Japanese
    if (lowerLang === 'ja' || lowerLang === 'ja-jp') {
      return 'ja';
    }
    
    // Check Korean
    if (lowerLang === 'ko' || lowerLang === 'ko-kr') {
      return 'ko';
    }
    
    // Check German
    if (lowerLang === 'de' || lowerLang.startsWith('de-')) {
      return 'de';
    }
    
    // Check French
    if (lowerLang === 'fr' || lowerLang.startsWith('fr-')) {
      return 'fr';
    }
    
    // Check Spanish
    if (lowerLang === 'es' || lowerLang.startsWith('es-')) {
      return 'es';
    }
    
    // Check Portuguese
    if (lowerLang === 'pt' || lowerLang.startsWith('pt-')) {
      return 'pt';
    }
    
    // Check Traditional Chinese (zh-TW, zh-HK, etc.)
    if (lowerLang === 'zh-tw' || lowerLang === 'zh-hk') {
      return 'zh-TW';
    }
    
    // Check Simplified Chinese (zh-CN, zh-SG, etc.)
    if (lowerLang.startsWith('zh')) {
      return 'zh';
    }
  }
  
  // Default to English
  return 'en';
}

// Text keys that need links added
const KEYS_WITH_LINKS = [
  'pwa_display_mode_description',
  'technical_description'
];

// Add links to all language resources
console.log("Preparing to add links to the following keys:", KEYS_WITH_LINKS);
const resources = addLinksToI18nResources(
  {
    en: {
      translation: en
    },
    zh: {
      translation: zh
    },
    'zh-TW': {
      translation: zhTW
    },
    ja: {
      translation: ja
    },
    de: {
      translation: de
    },
    fr: {
      translation: fr
    },
    es: {
      translation: es
    },
    pt: {
      translation: pt
    },
    ko: {
      translation: ko
    }
  },
  KEYS_WITH_LINKS
);
console.log("Link processing completed");

// Initialize i18next
i18n
  .use(initReactI18next) // Pass i18n to react-i18next
  .init({
    resources,
    lng: getInitialLanguage(), // Set default language based on user preference
    fallbackLng: 'en', // Fallback language
    interpolation: {
      escapeValue: false // Don't escape HTML content
    }
  });

export const changeLanguage = (language: string) => {
  // Change language
  i18n.changeLanguage(language);
  
  // Save user choice to localStorage
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
};

export default i18n;