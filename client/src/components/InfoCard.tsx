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
  const { t } = useTranslation();
  
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
              <a href={DISPLAY_MODE_LINKS.browser} 
                 target="_blank" 
                 rel="noopener" 
                 className={linkClass}>browser</a>
            )：</strong>
            {t('browser_description')}
          </li>
          <li>
            <strong>{t('minimal_ui_name')} (
              <a href={DISPLAY_MODE_LINKS.minimalUi} 
                 target="_blank" 
                 rel="noopener" 
                 className={linkClass}>minimal-ui</a>
            )：</strong>
            {t('minimal_ui_description')}
          </li>
          <li>
            <strong>{t('standalone_name')} (
              <a href={DISPLAY_MODE_LINKS.standalone} 
                 target="_blank" 
                 rel="noopener" 
                 className={linkClass}>standalone</a>
            )：</strong>
            {t('standalone_description')}
          </li>
          <li>
            <strong>{t('fullscreen_name')} (
              <a href={DISPLAY_MODE_LINKS.fullscreen} 
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
