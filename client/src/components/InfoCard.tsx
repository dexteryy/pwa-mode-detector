import { useTranslation } from "react-i18next";
import { HelpCircle, ExternalLink } from "lucide-react";

// 技术术语及其链接
const technicalTermLinks = {
  PWA: "https://web.dev/progressive-web-apps/",
  "Web App Manifest": "https://developer.mozilla.org/en-US/docs/Web/Manifest",
  Manifest: "https://developer.mozilla.org/en-US/docs/Web/Manifest",
  display: "https://developer.mozilla.org/en-US/docs/Web/Manifest/display",
};

// 替换文本中的技术术语为链接
const linkifyTechnicalTerms = (text: string) => {
  if (!text) return text;
  
  let result = text;
  Object.entries(technicalTermLinks).forEach(([term, url]) => {
    // 使用正则表达式匹配整个单词
    const regex = new RegExp(`\\b${term}\\b`, 'g');
    result = result.replace(regex, `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 inline-flex items-center">${term}<ExternalLink class="h-3 w-3 ml-1" /></a>`);
  });
  
  return result;
};

const InfoCard = () => {
  const { t } = useTranslation();
  
  // 处理带有链接的文本
  const processedPwaDifferentModes = linkifyTechnicalTerms(t('pwa_different_modes'));
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-dark dark:text-white mb-4 flex items-center">
        <HelpCircle className="h-5 w-5 mr-2 dark:text-blue-400" />
        {t('about_pwa_modes')}
      </h2>
      <div className="prose dark:prose-invert text-gray-700 dark:text-gray-300">
        <p className="mb-3" dangerouslySetInnerHTML={{ __html: processedPwaDifferentModes }} />
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>{t('browser_name')} (browser)：</strong>{t('browser_description')}</li>
          <li><strong>{t('minimal_ui_name')} (minimal-ui)：</strong>{t('minimal_ui_description')}</li>
          <li><strong>{t('standalone_name')} (standalone)：</strong>{t('standalone_description')}</li>
          <li><strong>{t('fullscreen_name')} (fullscreen)：</strong>{t('fullscreen_description')}</li>
        </ul>
      </div>
    </div>
  );
};

export default InfoCard;
