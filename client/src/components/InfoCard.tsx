import { useTranslation } from "react-i18next";
import IconWithFallback from "./IconWithFallback";

const InfoCard = () => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-dark mb-4 flex items-center">
        <div className="w-6 h-6 mr-2 flex items-center justify-center">
          <IconWithFallback name="help_outline" size="md" />
        </div>
        {t('about_pwa_modes')}
      </h2>
      <div className="prose text-gray-700">
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
