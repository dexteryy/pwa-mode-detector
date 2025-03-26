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
  
  // 默认使用英语
  return 'en';
}

// 需要添加链接的文本键
const KEYS_WITH_LINKS = [
  'pwa_display_mode_description',
  'technical_description'
];

// 为所有语言资源添加链接
console.log("准备为以下键添加链接:", KEYS_WITH_LINKS);
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
console.log("链接处理完成");

// 初始化i18next
i18n
  .use(initReactI18next) // 将i18n传递给react-i18next
  .init({
    resources,
    lng: getInitialLanguage(), // 根据用户偏好设置默认语言
    fallbackLng: 'en', // 回退语言
    interpolation: {
      escapeValue: false // 不转义HTML内容
    }
  });

export const changeLanguage = (language: string) => {
  // 改变语言
  i18n.changeLanguage(language);
  
  // 将用户选择保存到localStorage
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
};

export default i18n;