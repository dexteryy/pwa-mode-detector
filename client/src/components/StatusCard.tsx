import { useTranslation } from "react-i18next";
import { usePwaDetection, InstallStatus } from "../hooks/usePwaDetection";
import { CheckCircle, Minimize, Maximize, Globe, Hourglass, Download, Ban, PackageOpen, X, MonitorSmartphone, CircleOff, AlertTriangle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { ManifestContext } from "../App";

interface StatusCardProps {
  mode: string;
  isInstallable: boolean;
  expectedMode?: string;  // Expected mode, optional parameter
}

const StatusCard = ({ mode, isInstallable: propIsInstallable, expectedMode }: StatusCardProps) => {
  const { t } = useTranslation();
  const { isChecking, promptInstall, installStatus } = usePwaDetection();
  const { manifestInfo, manifestUrl } = useContext(ManifestContext);
  const [multipleManifests, setMultipleManifests] = useState(false);
  
  // 检查是否有多个manifest同时加载
  useEffect(() => {
    const manifestLinks = document.querySelectorAll('link[rel="manifest"]');
    setMultipleManifests(manifestLinks.length > 1);
    
    if (manifestLinks.length > 1) {
      console.warn('[StatusCard] Multiple manifest links detected:', manifestLinks.length);
      Array.from(manifestLinks).forEach((link, index) => {
        console.warn(`[StatusCard] Manifest ${index + 1}:`, link.getAttribute('href'));
      });
    }
  }, []);
  
  // Directly derive installable status from installStatus instead of using local state to avoid UI flickering
  // This is a computed value, not state, to prevent flickering
  const isInstallable = !isChecking && installStatus === 'installable';
  
  // Mode detection card styling
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

  // Determine installation status icon and message
  let InstallIcon = PackageOpen;
  let installTextClass = 'text-green-600 dark:text-green-400';
  let installStatusText = t('can_be_installed');
  let installDisabledReason = "";
  
  if (!isChecking) {
    // Handle different installation status cases
    switch (installStatus) {
      case 'installable':
        InstallIcon = PackageOpen;
        installTextClass = 'text-green-600 dark:text-green-400';
        installStatusText = t('can_be_installed');
        break;
        
      case 'not-installable-browser-mode':
        InstallIcon = Globe;
        installTextClass = 'text-orange-500 dark:text-orange-400';
        installStatusText = t('not_installable');
        installDisabledReason = t('install_disabled_manifest_browser');
        break;
        
      case 'not-installable-already-pwa':
        InstallIcon = CheckCircle;
        installTextClass = 'text-blue-500 dark:text-blue-400';
        installStatusText = t('not_installable');
        installDisabledReason = t('install_disabled_already_pwa');
        break;
        
      case 'not-installable-already-installed':
        InstallIcon = MonitorSmartphone;
        installTextClass = 'text-purple-500 dark:text-purple-400';
        installStatusText = t('not_installable');
        installDisabledReason = t('install_disabled_already_installed');
        break;
        
      case 'not-installable-browser-unsupported':
        InstallIcon = CircleOff;
        installTextClass = 'text-gray-500 dark:text-gray-400';
        installStatusText = t('not_installable');
        installDisabledReason = t('install_disabled_browser_unsupported');
        break;
        
      case 'checking':
        InstallIcon = Hourglass;
        installTextClass = 'text-blue-500 dark:text-blue-400';
        installStatusText = t('checking');
        break;
    }
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4 border-l-4 ${cardBorderColor}`}>
      <div className="flex flex-col space-y-4">
        {/* Current mode section */}
        <div className="flex items-center">
          <ModeIcon className={`h-6 w-6 mr-3 ${iconColorClass}`} />
          <h2 className="text-xl font-semibold text-dark dark:text-white">{modeStatusText}</h2>
        </div>
        
        {/* 显示清单检测警告 */}
        {multipleManifests && (
          <div className="flex items-start mt-2 bg-amber-50 dark:bg-amber-900/30 p-3 rounded-md">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-700 dark:text-amber-400 font-medium">多个清单问题</p>
              <p className="text-amber-600 dark:text-amber-300 text-sm mt-1">
                检测到多个manifest清单同时加载，可能导致安装状态检测错误。请尝试刷新页面或清除浏览器缓存。
              </p>
            </div>
          </div>
        )}
        
        {/* Manifest debug information - only shown when there's a manifest */}
        {manifestInfo && manifestUrl && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            <p>当前清单: {manifestInfo.display || "未知"} 模式 ({manifestUrl.split('?')[0]})</p>
          </div>
        )}
        
        {/* Install button section - shown in all modes */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex-grow overflow-hidden pr-4">
            {isChecking ? (
              <div className="flex items-center">
                <Hourglass className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0" />
                <p className="text-blue-500 dark:text-blue-400">{t('status_browser_checking')}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center">
                  <InstallIcon className={`h-5 w-5 ${installTextClass} mr-2 flex-shrink-0`} />
                  <p className={installTextClass}>
                    {installStatusText}
                  </p>
                </div>
                {installDisabledReason && (
                  <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">{installDisabledReason}</p>
                )}
              </>
            )}
          </div>
          
          {/* Install button */}
          <div className="mt-4 sm:mt-0 w-full sm:w-auto sm:flex-shrink-0">
            {isChecking ? (
              <button 
                disabled={true}
                className="flex items-center justify-center px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed transition-colors w-full sm:w-auto whitespace-nowrap"
              >
                <Hourglass className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">{t('checking')}</span>
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
                  } transition-colors w-full sm:w-auto whitespace-nowrap min-w-[140px]`}
                >
                  <Download className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{t('install_pwa')}</span>
                </button>
                
                {/* Show tooltip when installation is not available */}
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