import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import zh from './locales/zh';

// 存储在localStorage中的键名
const LANGUAGE_STORAGE_KEY = 'pwa-detector-language';

// 获取用户的首选语言
function getInitialLanguage(): string {
  // 1. 首先检查localStorage中是否有存储的语言选择
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (storedLanguage && ['en', 'zh'].includes(storedLanguage)) {
    return storedLanguage;
  }
  
  // 2. 如果没有存储的语言，检查浏览器/系统语言
  const browserLanguages = navigator.languages || [navigator.language];
  
  // 检查是否有中文语言代码 (zh, zh-CN, zh-TW, zh-HK 等)
  const hasChinese = browserLanguages.some(lang => 
    lang.toLowerCase().startsWith('zh')
  );
  
  return hasChinese ? 'zh' : 'en';
}

// 初始化i18next
i18n
  .use(initReactI18next) // 将i18n传递给react-i18next
  .init({
    resources: {
      en: {
        translation: en
      },
      zh: {
        translation: zh
      }
    },
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