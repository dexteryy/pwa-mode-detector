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

// 存储在localStorage中的键名
const LANGUAGE_STORAGE_KEY = 'pwa-detector-language';

// 支持的语言列表
const SUPPORTED_LANGUAGES = ['en', 'zh', 'zh-TW', 'ja', 'de', 'fr', 'es', 'pt', 'ko'];

// 获取用户的首选语言
function getInitialLanguage(): string {
  // 1. 首先检查localStorage中是否有存储的语言选择
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (storedLanguage && SUPPORTED_LANGUAGES.includes(storedLanguage)) {
    return storedLanguage;
  }
  
  // 2. 如果没有存储的语言，检查浏览器/系统语言
  const browserLanguages = navigator.languages || [navigator.language];
  
  // 检查特定语言代码
  for (const lang of browserLanguages) {
    const lowerLang = lang.toLowerCase();
    
    // 检查日语
    if (lowerLang === 'ja' || lowerLang === 'ja-jp') {
      return 'ja';
    }
    
    // 检查韩语
    if (lowerLang === 'ko' || lowerLang === 'ko-kr') {
      return 'ko';
    }
    
    // 检查德语
    if (lowerLang === 'de' || lowerLang.startsWith('de-')) {
      return 'de';
    }
    
    // 检查法语
    if (lowerLang === 'fr' || lowerLang.startsWith('fr-')) {
      return 'fr';
    }
    
    // 检查西班牙语
    if (lowerLang === 'es' || lowerLang.startsWith('es-')) {
      return 'es';
    }
    
    // 检查葡萄牙语
    if (lowerLang === 'pt' || lowerLang.startsWith('pt-')) {
      return 'pt';
    }
    
    // 检查繁体中文 (zh-TW, zh-HK 等)
    if (lowerLang === 'zh-tw' || lowerLang === 'zh-hk') {
      return 'zh-TW';
    }
    
    // 检查简体中文 (zh-CN, zh-SG 等)
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
  'technical_description',
  'pwa_different_modes',
  'browser_mode_info'
];

// 为所有语言资源添加链接
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