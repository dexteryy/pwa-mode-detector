import { useTranslation } from "react-i18next";
import { usePwaDetection } from "../hooks/usePwaDetection";
import TermText from "./TermText";
import { CheckCircle, Minimize, Maximize, Globe, Hourglass, Download, Ban, PackageOpen, X } from "lucide-react";

interface StatusCardProps {
  mode: string;
  isInstallable: boolean;
  expectedMode?: string;  // 预期模式，可选参数
}

const StatusCard = ({ mode, isInstallable, expectedMode }: StatusCardProps) => {
  const { t } = useTranslation();
  const { isChecking, promptInstall } = usePwaDetection();
  
  // 模式检测卡片样式
  let cardBorderColor = "border-amber-500";
  let iconColorClass = "text-amber-500";
  let ModeIcon = Globe;
  let modeStatusText = "";

  if (mode === "standalone") {
    cardBorderColor = "border-green-500";
    iconColorClass = "text-green-500";
    ModeIcon = CheckCircle;
    modeStatusText = `${t('current_mode')}: ${t('standalone_name')}`;
  } else if (mode === "minimal-ui") {
    cardBorderColor = "border-blue-500";
    iconColorClass = "text-blue-500";
    ModeIcon = Minimize;
    modeStatusText = `${t('current_mode')}: ${t('minimal_ui_name')}`;
  } else if (mode === "fullscreen") {
    cardBorderColor = "border-blue-500";
    iconColorClass = "text-blue-500";
    ModeIcon = Maximize;
    modeStatusText = `${t('current_mode')}: ${t('fullscreen_name')}`;
  } else {
    cardBorderColor = "border-amber-500";
    iconColorClass = "text-amber-500";
    ModeIcon = Globe;
    modeStatusText = `${t('current_mode')}: ${t('browser_name')}`;
  }

  // 确定安装不能的原因，仅在非检查状态时
  let installDisabledReason = "";
  
  if (!isInstallable && !isChecking) {
    // 如果预期模式为browser，提供特定的消息
    if (expectedMode === 'browser' || mode === 'browser') {
      installDisabledReason = t('install_disabled_manifest_browser');
    } else {
      // 其他模式（standalone、minimal-ui、fullscreen）显示浏览器不支持的消息
      installDisabledReason = t('install_disabled_browser_unsupported');
    }
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4 border-l-4 ${cardBorderColor}`}>
      <div className="flex flex-col space-y-4">
        {/* 当前模式部分 */}
        <div className="flex items-center">
          <ModeIcon className={`h-6 w-6 mr-3 ${iconColorClass}`} />
          <h2 className="text-xl font-semibold text-dark dark:text-white">{modeStatusText}</h2>
        </div>
        
        {/* 安装按钮部分 - 在所有模式下显示 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex-grow">
            {isChecking ? (
              <div className="flex items-center">
                <Hourglass className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
                <p className="text-blue-500 dark:text-blue-400">{t('status_browser_checking')}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center">
                  {isInstallable ? (
                    <PackageOpen className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                  ) : (
                    <Ban className="h-5 w-5 text-gray-500 mr-2" />
                  )}
                  <p className={
                    isInstallable 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  }>
                    {isInstallable ? t('can_be_installed') : t('not_installable')}
                  </p>
                </div>
                {!isInstallable && installDisabledReason && (
                  <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                    {expectedMode === 'browser' || mode === 'browser' ? (
                      <TermText textKey="install_disabled_manifest_browser" />
                    ) : (
                      <TermText textKey="install_disabled_browser_unsupported" />
                    )}
                  </p>
                )}
              </>
            )}
          </div>
          
          {/* 安装按钮 */}
          <div className="mt-4 sm:mt-0 w-full sm:w-auto">
            {isChecking ? (
              <button 
                disabled={true}
                className="flex items-center justify-center px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed transition-colors w-full sm:w-auto"
              >
                <Hourglass className="h-4 w-4 mr-1" />
                {t('checking')}
              </button>
            ) : (
              <>
                <button 
                  onClick={promptInstall}
                  disabled={!isInstallable}
                  className={`flex items-center justify-center px-4 py-2 rounded-lg ${
                    isInstallable
                      ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  } transition-colors w-full sm:w-auto`}
                >
                  <Download className="h-4 w-4 mr-1" />
                  {t('install_pwa')}
                </button>
                
                {/* 当安装不可用时，显示悬浮提示 */}
                {!isInstallable && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center sm:text-right">{t('install_button_disabled')}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;