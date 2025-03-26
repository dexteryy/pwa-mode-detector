import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import zh from './locales/zh';

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
    lng: 'en', // 默认语言
    fallbackLng: 'en', // 回退语言
    interpolation: {
      escapeValue: false // 不转义HTML内容
    }
  });

export const changeLanguage = (language: string) => {
  i18n.changeLanguage(language);
};

export default i18n;