import { useTranslation } from "react-i18next";

const InfoCard = () => {
  const { t, ready } = useTranslation();
  
  // 如果 i18n 还没准备好，显示加载状态
  if (!ready) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="flex items-center mb-4">
          <div className="w-6 h-6 bg-gray-200 rounded-full mr-2"></div>
          <div className="h-5 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-dark mb-4 flex items-center">
        <span className="material-icons mr-2">help_outline</span>
        {t('about_pwa_modes')}
      </h2>
      <div className="prose text-gray-700">
        <p className="mb-3">{t('pwa_different_modes')}</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>{t('standalone_name')} (standalone)：</strong>{t('standalone_description')}</li>
          <li><strong>{t('browser_name')} (browser)：</strong>{t('browser_description')}</li>
          <li><strong>{t('minimal_ui_name')} (minimal-ui)：</strong>{t('minimal_ui_description')}</li>
          <li><strong>{t('fullscreen_name')} (fullscreen)：</strong>{t('fullscreen_description')}</li>
        </ul>
      </div>
    </div>
  );
};

export default InfoCard;
