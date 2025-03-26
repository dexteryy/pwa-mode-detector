import { useTranslation } from "react-i18next";
import { usePwaDetection } from "../hooks/usePwaDetection";

interface StatusCardProps {
  mode: string;
  isInstallable: boolean;
  isChecking?: boolean;
}

const StatusCard = ({ mode, isInstallable, isChecking = false }: StatusCardProps) => {
  const { t } = useTranslation();
  const { promptInstall } = usePwaDetection(); // 不再从 hook 获取 isChecking，而是接受为属性
  
  // 模式检测卡片样式
  let cardBorderColor = "border-amber-500";
  let modeIconClassName = "material-icons text-3xl mr-3 ";
  let modeIconName = "";
  let modeStatusText = "";

  if (mode === "standalone") {
    cardBorderColor = "border-green-500";
    modeIconClassName += "text-green-500";
    modeIconName = "check_circle";
    modeStatusText = `${t('current_mode')}: ${t('standalone_name')}`;
  } else if (mode === "minimal-ui") {
    cardBorderColor = "border-blue-500";
    modeIconClassName += "text-blue-500";
    modeIconName = "view_compact";
    modeStatusText = `${t('current_mode')}: ${t('minimal_ui_name')}`;
  } else if (mode === "fullscreen") {
    cardBorderColor = "border-blue-500";
    modeIconClassName += "text-blue-500";
    modeIconName = "fullscreen";
    modeStatusText = `${t('current_mode')}: ${t('fullscreen_name')}`;
  } else {
    cardBorderColor = "border-amber-500";
    modeIconClassName += "text-amber-500";
    modeIconName = "public";
    modeStatusText = `${t('current_mode')}: ${t('browser_name')}`;
  }

  // 确定安装状态和原因
  let installDisabledReason = "";
  let statusText = "";
  let statusIcon = "";
  let statusColor = "";
  
  if (isChecking) {
    // 检测中
    statusText = t('status_browser_checking');
    statusIcon = "hourglass_empty";
    statusColor = "text-blue-500";
  } else if (isInstallable) {
    // 可安装
    statusText = t('can_be_installed');
    statusIcon = "system_update";
    statusColor = "text-green-500";
  } else if (mode === 'browser') {
    // 不可安装，且在浏览器模式
    statusText = t('not_installable');
    statusIcon = "block";
    statusColor = "text-gray-500";
    
    // 确定具体原因
    const manifestDisplayIsBrowser = true; // 由于我们在browser模式下，这个条件成立
    if (manifestDisplayIsBrowser) {
      installDisabledReason = t('install_disabled_manifest_browser');
    } else {
      installDisabledReason = t('install_disabled_browser_unsupported');
    }
  } else {
    // 其他模式
    statusText = t('already_installed');
    statusIcon = "check_circle";
    statusColor = "text-green-500";
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 mb-4 border-l-4 ${cardBorderColor}`}>
      <div className="flex flex-col space-y-4">
        {/* 当前模式部分 */}
        <div className="flex items-center">
          <span className={modeIconClassName + "mb-0"}>{modeIconName}</span>
          <h2 className="text-xl font-semibold text-dark">{modeStatusText}</h2>
        </div>
        
        {/* 安装按钮部分 - 仅在browser模式下显示 */}
        {mode === 'browser' && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex-grow">
              <div className="flex items-center">
                <span className={`material-icons mr-2 ${statusColor}`}>
                  {statusIcon}
                </span>
                <p className={statusColor}>
                  {statusText}
                </p>
              </div>
              {!isInstallable && !isChecking && installDisabledReason && (
                <p className="text-gray-600 mt-2 text-sm">{installDisabledReason}</p>
              )}
              {isChecking && (
                <p className="text-blue-600 mt-2 text-sm animate-pulse">
                  {t('status_detecting')}
                </p>
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
        )}
      </div>
    </div>
  );
};

export default StatusCard;
