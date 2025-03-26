import { useTranslation } from "react-i18next";
import { HelpCircle } from "lucide-react";
import TechTermLink, { TECH_TERM_URLS } from "./TechTermLink";
import { ReactNode } from "react";

const InfoCard = () => {
  const { t } = useTranslation();
  
  // Helper function to wrap PWA with link
  const formatPWAText = (text: string): ReactNode => {
    return text.replace(/(PWA|Progressive Web App)(\s?\([^)]+\))?/g, (match, term) => {
      const url = term === 'PWA' ? TECH_TERM_URLS.PWA : TECH_TERM_URLS['Progressive Web App'];
      return `<techterm url="${url}">${match}</techterm>`;
    }).split(/<techterm url="([^"]+)">([^<]+)<\/techterm>/g).map((part, i) => {
      if (i % 3 === 0) return part;
      if (i % 3 === 1) return null; // URL part
      if (i % 3 === 2) {
        const url = text.split(/<techterm url="([^"]+)">([^<]+)<\/techterm>/g)[i-1];
        return <TechTermLink key={i} term={part} url={url}>{part}</TechTermLink>;
      }
      return null;
    });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-dark dark:text-white mb-4 flex items-center">
        <HelpCircle className="h-5 w-5 mr-2 dark:text-blue-400" />
        {t('about_pwa_modes')}
      </h2>
      <div className="prose dark:prose-invert text-gray-700 dark:text-gray-300">
        <p className="mb-3">{formatPWAText(t('pwa_different_modes'))}</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>
              {t('browser_name')} (<TechTermLink term="browser" url={TECH_TERM_URLS.browser}>browser</TechTermLink>)：
            </strong>
            {t('browser_description')}
          </li>
          <li>
            <strong>
              {t('minimal_ui_name')} (<TechTermLink term="minimal-ui" url={TECH_TERM_URLS['minimal-ui']}>minimal-ui</TechTermLink>)：
            </strong>
            {t('minimal_ui_description')}
          </li>
          <li>
            <strong>
              {t('standalone_name')} (<TechTermLink term="standalone" url={TECH_TERM_URLS.standalone}>standalone</TechTermLink>)：
            </strong>
            {t('standalone_description')}
          </li>
          <li>
            <strong>
              {t('fullscreen_name')} (<TechTermLink term="fullscreen" url={TECH_TERM_URLS.fullscreen}>fullscreen</TechTermLink>)：
            </strong>
            {t('fullscreen_description')}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InfoCard;
