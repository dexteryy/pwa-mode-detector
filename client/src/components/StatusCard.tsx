import { useTranslation } from "react-i18next";
import { usePwaDetection } from "../hooks/usePwaDetection";

interface StatusCardProps {
  mode: string;
  isInstallable: boolean;
}

const StatusCard = ({ mode, isInstallable }: StatusCardProps) => {
  const { t } = useTranslation();
  const { isChecking } = usePwaDetection();
  
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
    iconName = isChecking ? "hourglass_empty" : "public";
    statusText = `${t('current_mode')}: ${t('browser_name')}`;
    
    if (isChecking) {
      promptText = t('status_browser_checking');
    } else {
      promptText = isInstallable 
        ? t('status_browser_installable') 
        : t('status_browser_not_installable');
    }
  }

  // 添加 browser 模式的额外信息，但在检查中不显示
  const showBrowserModeInfo = mode === 'browser' && !isChecking;

  return (
    <div className={cardClassName}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
        <span className={iconClassName + "mb-2 sm:mb-0"}>{iconName}</span>
        <div>
          <h2 className="text-xl font-semibold text-dark">{statusText}</h2>
          <p className="text-gray-500">{promptText}</p>
          {showBrowserModeInfo && (
            <p className="text-amber-600 mt-2 text-sm border-t border-amber-200 pt-2">{t('browser_mode_info')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
