import { useTranslation } from "react-i18next";
import { HelpCircle } from "lucide-react";

// MDN display 模式链接地址
const DISPLAY_MODE_LINKS = {
  browser: "https://developer.mozilla.org/docs/Web/Manifest/display#browser",
  minimalUi: "https://developer.mozilla.org/docs/Web/Manifest/display#minimal-ui",
  standalone: "https://developer.mozilla.org/docs/Web/Manifest/display#standalone",
  fullscreen: "https://developer.mozilla.org/docs/Web/Manifest/display#fullscreen"
};

// 样式类
const linkClass = "text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-medium";

const InfoCard = () => {
  const { t, i18n } = useTranslation();
  
  // 根据当前语言获取正确的MDN链接
  const getLocalizedLink = (baseLink: string) => {
    const lang = i18n.language;
    if (lang === 'zh') return baseLink.replace('/docs/', '/zh-CN/docs/');
    if (lang === 'zh-TW') return baseLink.replace('/docs/', '/zh-TW/docs/');
    if (lang === 'ja') return baseLink.replace('/docs/', '/ja/docs/');
    if (lang === 'fr') return baseLink.replace('/docs/', '/fr/docs/');
    if (lang === 'de') return baseLink.replace('/docs/', '/de/docs/');
    if (lang === 'es') return baseLink.replace('/docs/', '/es/docs/');
    if (lang === 'pt') return baseLink.replace('/docs/', '/pt-BR/docs/');
    if (lang === 'ko') return baseLink.replace('/docs/', '/ko/docs/');
    return baseLink; // 默认英文
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-dark dark:text-white mb-4 flex items-center">
        <HelpCircle className="h-5 w-5 mr-2 dark:text-blue-400" />
        <span dangerouslySetInnerHTML={{ __html: t('about_pwa_modes') }}></span>
      </h2>
      <div className="prose dark:prose-invert text-gray-700 dark:text-gray-300">
        <p className="mb-3">{t('pwa_different_modes')}</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>{t('browser_name')} (
              <a href={getLocalizedLink(DISPLAY_MODE_LINKS.browser)} 
                 target="_blank" 
                 rel="noopener" 
                 className={linkClass}>browser</a>
            )：</strong>
            {t('browser_description')}
          </li>
          <li>
            <strong>{t('minimal_ui_name')} (
              <a href={getLocalizedLink(DISPLAY_MODE_LINKS.minimalUi)} 
                 target="_blank" 
                 rel="noopener" 
                 className={linkClass}>minimal-ui</a>
            )：</strong>
            {t('minimal_ui_description')}
          </li>
          <li>
            <strong>{t('standalone_name')} (
              <a href={getLocalizedLink(DISPLAY_MODE_LINKS.standalone)} 
                 target="_blank" 
                 rel="noopener" 
                 className={linkClass}>standalone</a>
            )：</strong>
            {t('standalone_description')}
          </li>
          <li>
            <strong>{t('fullscreen_name')} (
              <a href={getLocalizedLink(DISPLAY_MODE_LINKS.fullscreen)} 
                 target="_blank" 
                 rel="noopener" 
                 className={linkClass}>fullscreen</a>
            )：</strong>
            {t('fullscreen_description')}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InfoCard;
