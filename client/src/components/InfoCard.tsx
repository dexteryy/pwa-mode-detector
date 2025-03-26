import { useTranslation } from "react-i18next";
import { HelpCircle } from "lucide-react";

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
