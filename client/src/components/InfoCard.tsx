import React from "react";
import { useTranslation } from "react-i18next";
import { HelpCircle } from "lucide-react";

const InfoCard = () => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-dark dark:text-white mb-4 flex items-center">
        <HelpCircle className="h-5 w-5 mr-2 dark:text-blue-400" />
        {t('about_pwa_modes')}
      </h2>
      <div className="prose dark:prose-invert text-gray-700 dark:text-gray-300">
        <p className="mb-3">
          {t('pwa_different_modes').split('Progressive Web Apps').map((part, i) => (
            i === 0 ? (
              <React.Fragment key={i}>
                {part}
                <a 
                  href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Progressive Web Apps
                </a>
              </React.Fragment>
            ) : part
          ))}
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>{t('browser_name')} (<a 
              href="https://developer.mozilla.org/en-US/docs/Web/Manifest/display#browser" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >browser</a>)：</strong>
            {t('browser_description')}
          </li>
          <li>
            <strong>{t('minimal_ui_name')} (<a 
              href="https://developer.mozilla.org/en-US/docs/Web/Manifest/display#minimal-ui" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >minimal-ui</a>)：</strong>
            {t('minimal_ui_description')}
          </li>
          <li>
            <strong>{t('standalone_name')} (<a 
              href="https://developer.mozilla.org/en-US/docs/Web/Manifest/display#standalone" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >standalone</a>)：</strong>
            {t('standalone_description')}
          </li>
          <li>
            <strong>{t('fullscreen_name')} (<a 
              href="https://developer.mozilla.org/en-US/docs/Web/Manifest/display#fullscreen" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >fullscreen</a>)：</strong>
            {t('fullscreen_description')}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InfoCard;
