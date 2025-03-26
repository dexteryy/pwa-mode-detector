import { useTranslation } from "react-i18next";
import { usePwaDetection, InstallStatus } from "../hooks/usePwaDetection";
import { CheckCircle, Minimize, Maximize, Globe, Hourglass, Download, Ban, PackageOpen, X, MonitorSmartphone, CircleOff } from "lucide-react";

interface StatusCardProps {
  mode: string;
  isInstallable: boolean;
  expectedMode?: string;  // Expected mode, optional parameter
}

const StatusCard = ({ mode, isInstallable, expectedMode }: StatusCardProps) => {
  const { t } = useTranslation();
  const { isChecking, promptInstall, installStatus } = usePwaDetection();
  
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
  let InstallIcon = isInstallable ? PackageOpen : Ban;
  let installTextClass = isInstallable ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400';
  let installStatusText = isInstallable ? t('can_be_installed') : t('not_installable');
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
        installDisabledReason = t('install_disabled_manifest_browser');
        break;
        
      case 'not-installable-already-pwa':
        InstallIcon = CheckCircle;
        installTextClass = 'text-blue-500 dark:text-blue-400';
        installDisabledReason = t('install_disabled_already_pwa');
        break;
        
      case 'not-installable-already-installed':
        InstallIcon = MonitorSmartphone;
        installTextClass = 'text-purple-500 dark:text-purple-400';
        installDisabledReason = t('install_disabled_already_installed');
        break;
        
      case 'not-installable-browser-unsupported':
        InstallIcon = CircleOff;
        installTextClass = 'text-gray-500 dark:text-gray-400';
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
                  {isInstallable ? (
                    <PackageOpen className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                  ) : (
                    <Ban className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
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