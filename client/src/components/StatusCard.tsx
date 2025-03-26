import { useTranslation } from "react-i18next";
import { usePwaDetection } from "../hooks/usePwaDetection";

interface StatusCardProps {
  mode: string;
  isInstallable: boolean;
}

const StatusCard = ({ mode, isInstallable }: StatusCardProps) => {
  const { t } = useTranslation();
  const { isChecking, promptInstall } = usePwaDetection();
  
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

  // 确定安装不能的原因
  let installDisabledReason = "";
  if (!isInstallable && !isChecking) {
    if (mode === 'browser') {
      // 浏览器模式的manifest配置为browser，这是不支持安装的
      installDisabledReason = t('install_disabled_manifest_browser');
    } else {
      // 对于其他模式，如果不可安装就是浏览器的问题
      installDisabledReason = t('install_disabled_browser_unsupported');
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 mb-4 border-l-4 ${cardBorderColor}`}>
      <div className="flex flex-col space-y-4">
        {/* 当前模式部分 */}
        <div className="flex items-center">
          <span className={modeIconClassName + "mb-0"}>{modeIconName}</span>
          <h2 className="text-xl font-semibold text-dark">{modeStatusText}</h2>
        </div>
        
        {/* 安装按钮部分 - 所有模式下都显示 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex-grow">
            {isChecking ? (
              <div className="flex items-center">
                <span className="material-icons text-blue-500 mr-2">hourglass_empty</span>
                <p className="text-blue-500">{t('status_browser_checking')}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center">
                  <span className={`material-icons mr-2 ${isInstallable ? 'text-green-500' : 'text-gray-500'}`}>
                    {isInstallable ? 'system_update' : 'block'}
                  </span>
                  <p className={isInstallable ? 'text-green-600' : 'text-gray-500'}>
                    {isInstallable ? t('can_be_installed') : t('not_installable')}
                  </p>
                </div>
                {!isInstallable && installDisabledReason && (
                  <p className="text-gray-600 mt-2 text-sm">{installDisabledReason}</p>
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
    </div>
  );
};

export default StatusCard;
