import { useTranslation } from "react-i18next";

interface StatusCardProps {
  mode: string;
  isInstallable: boolean;
}

const StatusCard = ({ mode, isInstallable }: StatusCardProps) => {
  const { t, ready } = useTranslation();
  
  // 如果 i18n 还没准备好，显示加载状态
  if (!ready) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-gray-300 animate-pulse">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
          <div>
            <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Determine status card styling based on mode
  let cardClassName = "bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 ";
  let iconClassName = "material-icons text-3xl mr-3 ";
  let iconName = "";
  let statusText = "";
  let promptText = "";

  if (mode === "standalone") {
    cardClassName += "border-green-500";
    iconClassName += "text-green-500";
    iconName = "check_circle";
    statusText = `${t('current_mode')}: ${t('standalone_name')}`;
    promptText = t('status_standalone_running');
  } else if (mode === "minimal-ui") {
    cardClassName += "border-blue-500";
    iconClassName += "text-blue-500";
    iconName = "view_compact";
    statusText = `${t('current_mode')}: ${t('minimal_ui_name')}`;
    promptText = t('status_minimal_ui_prompt');
  } else if (mode === "fullscreen") {
    cardClassName += "border-blue-500";
    iconClassName += "text-blue-500";
    iconName = "fullscreen";
    statusText = `${t('current_mode')}: ${t('fullscreen_name')}`;
    promptText = t('status_fullscreen_running');
  } else {
    cardClassName += "border-amber-500";
    iconClassName += "text-amber-500";
    iconName = "public";
    statusText = `${t('current_mode')}: ${t('browser_name')}`;
    promptText = isInstallable 
      ? t('status_browser_installable') 
      : t('status_browser_not_installable');
  }

  return (
    <div className={cardClassName}>
      <div className="flex items-center mb-4">
        <span className={iconClassName}>{iconName}</span>
        <div>
          <h2 className="text-xl font-semibold text-dark">{statusText}</h2>
          <p className="text-gray-500">{promptText}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
