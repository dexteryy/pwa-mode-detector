import { useTranslation } from "react-i18next";
import { usePwaDetection } from "../hooks/usePwaDetection";

interface StatusCardProps {
  mode: string;
  isInstallable: boolean;
}

const StatusCard = ({ mode, isInstallable }: StatusCardProps) => {
  const { t } = useTranslation();
  const { isChecking, promptInstall } = usePwaDetection();
  
  // 第一部分：模式检测卡片样式
  let modeCardClassName = "bg-white rounded-lg shadow-md p-6 mb-4 border-l-4 ";
  let modeIconClassName = "material-icons text-3xl mr-3 ";
  let modeIconName = "";
  let modeStatusText = "";
  let modePromptText = "";

  if (mode === "standalone") {
    modeCardClassName += "border-green-500";
    modeIconClassName += "text-green-500";
    modeIconName = "check_circle";
    modeStatusText = `${t('current_mode')}: ${t('standalone_name')}`;
    modePromptText = t('status_standalone_running');
  } else if (mode === "minimal-ui") {
    modeCardClassName += "border-blue-500";
    modeIconClassName += "text-blue-500";
    modeIconName = "view_compact";
    modeStatusText = `${t('current_mode')}: ${t('minimal_ui_name')}`;
    modePromptText = t('status_minimal_ui_prompt');
  } else if (mode === "fullscreen") {
    modeCardClassName += "border-blue-500";
    modeIconClassName += "text-blue-500";
    modeIconName = "fullscreen";
    modeStatusText = `${t('current_mode')}: ${t('fullscreen_name')}`;
    modePromptText = t('status_fullscreen_running');
  } else {
    modeCardClassName += "border-amber-500";
    modeIconClassName += "text-amber-500";
    modeIconName = "public";
    modeStatusText = `${t('current_mode')}: ${t('browser_name')}`;
    modePromptText = t('status_browser_running');
  }

  // 第二部分：安装能力检测卡片
  // 只在浏览器模式下显示安装能力卡片
  const showInstallCard = mode === 'browser';
  
  // 确定安装不能的原因
  let installDisabledReason = "";
  if (mode === 'browser' && !isInstallable && !isChecking) {
    // 如果是因为manifest配置为browser，提供特定的消息
    const manifestDisplayIsBrowser = true; // 由于我们在browser模式下，这个条件成立
    if (manifestDisplayIsBrowser) {
      installDisabledReason = t('install_disabled_manifest_browser');
    } else {
      installDisabledReason = t('install_disabled_browser_unsupported');
    }
  }

  return (
    <>
      {/* 第一部分：当前模式卡片 */}
      <div className={modeCardClassName}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <span className={modeIconClassName + "mb-2 sm:mb-0"}>{modeIconName}</span>
          <div>
            <h2 className="text-xl font-semibold text-dark">{modeStatusText}</h2>
            <p className="text-gray-500">{modePromptText}</p>
            {mode === 'browser' && (
              <p className="text-amber-600 mt-2 text-sm border-t border-amber-200 pt-2">{t('browser_mode_info')}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* 第二部分：安装能力检测卡片 - 仅在browser模式下显示 */}
      {showInstallCard && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-purple-500">
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
            <span className={`material-icons text-3xl mr-3 mb-2 sm:mb-0 ${isChecking ? 'text-blue-500' : (isInstallable ? 'text-green-500' : 'text-gray-500')}`}>
              {isChecking ? 'hourglass_empty' : (isInstallable ? 'system_update' : 'block')}
            </span>
            <div className="flex-grow">
              <h2 className="text-xl font-semibold text-dark">{t('install_capability_title')}</h2>
              {isChecking ? (
                <p className="text-blue-500">{t('status_browser_checking')}</p>
              ) : (
                <>
                  <p className={isInstallable ? 'text-green-600' : 'text-gray-500'}>
                    {isInstallable ? t('status_browser_installable') : t('status_browser_not_installable')}
                  </p>
                  {!isInstallable && installDisabledReason && (
                    <p className="text-gray-600 mt-2 text-sm border-t border-gray-200 pt-2">{installDisabledReason}</p>
                  )}
                </>
              )}
            </div>
            
            {/* 安装按钮 */}
            <div className="mt-4 sm:mt-0 w-full sm:w-auto">
              <button 
                onClick={promptInstall}
                disabled={!isInstallable || isChecking}
                className={`flex items-center justify-center px-4 py-2 rounded-lg ${
                  isInstallable && !isChecking
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } transition-colors w-full sm:w-auto`}
              >
                <span className="material-icons text-sm mr-1">get_app</span>
                {t('install_pwa')}
              </button>
              
              {/* 当安装不可用时，显示悬浮提示 */}
              {!isInstallable && !isChecking && (
                <p className="text-xs text-gray-500 mt-1 text-center sm:text-right">{t('install_button_disabled')}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StatusCard;
