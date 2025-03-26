import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en';
import zhTranslation from './locales/zh';

// 获取浏览器语言
const getBrowserLanguage = (): string => {
  const language = navigator.language || (navigator as any).userLanguage;
  return language.split('-')[0]; // 获取主语言部分，例如 'zh-CN' -> 'zh'
};

// 获取存储的语言设置或使用浏览器语言
const getInitialLanguage = (): string => {
  if (typeof window === 'undefined') return 'en'; // SSR检查
  
  const storedLanguage = localStorage.getItem('language');
  if (storedLanguage) return storedLanguage;

  const browserLanguage = getBrowserLanguage();
  return browserLanguage === 'zh' ? 'zh' : 'en'; // 如果是中文则返回中文，否则默认英文
};

// 初始化i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      zh: {
        translation: zhTranslation
      }
    },
    lng: typeof window !== 'undefined' ? getInitialLanguage() : 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// 公开语言切换函数
export const changeLanguage = (language: string) => {
  i18n.changeLanguage(language);
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', language);
  }
};

export default i18n;