import { useState } from "react";
import StatusCard from "@/components/StatusCard";
import DetectionCard from "@/components/DetectionCard";
import InfoCard from "@/components/InfoCard";
import { usePwaDetection } from "@/hooks/usePwaDetection";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const PWADetector = () => {
  const { t } = useTranslation();
  
  // 从URL路径中获取预期的display模式
  const [path] = useLocation();
  
  // 判断当前路径对应的显示模式
  let expectedMode = "standalone";
  if (path === "/standalone") {
    expectedMode = "standalone";
  } else if (path === "/minimal-ui") {
    expectedMode = "minimal-ui";
  } else if (path === "/fullscreen") {
    expectedMode = "fullscreen";
  } else if (path === "/browser") {
    expectedMode = "browser";
  } else if (path.startsWith("/pwa/")) {
    // 向下兼容旧路径
    const match = path.match(/\/pwa\/([a-z-]+)/);
    if (match) {
      expectedMode = match[1];
    }
  }
  
  console.log("当前路径:", path, "预期模式:", expectedMode);
  
  const { 
    displayModes, 
    currentMode, 
    isInstallable,
    isChecking,
    promptInstall,
    resetChecking,
    userAgent 
  } = usePwaDetection();
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle manual refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    // 重置检查状态
    resetChecking();
    // 动画效果
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="bg-gray-100 font-sans min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <div className="bg-blue-700 text-white">
        <div className="container mx-auto px-4 py-1">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/">
                <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-500 transition-colors flex items-center cursor-pointer whitespace-nowrap">
                  <span className="material-icons text-xs mr-1">home</span>
                  {t('back_to_home')}
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleRefresh}
                className={`bg-blue-600 text-white h-6 w-6 flex items-center justify-center rounded hover:bg-blue-500 transition-colors ${isRefreshing ? 'animate-spin' : ''}`} 
                aria-label="Refresh detection"
              >
                <span className="material-icons text-sm">refresh</span>
              </button>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <header className="bg-blue-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-center">
            <span className="material-icons mr-2">devices</span>
            <h1 className="text-xl font-semibold">{t('detector_title')}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow flex flex-col">
        {/* Manifest mode banner */}
        <div className={`mb-4 p-4 rounded-lg ${expectedMode === currentMode ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
          <div className="flex items-center">
            <span className="material-icons mr-2">{expectedMode === currentMode ? 'check_circle' : 'info'}</span>
            <h2 className="font-semibold">
              {t('expected_mode')}: <span className="font-bold">{expectedMode}</span>
            </h2>
          </div>
          {expectedMode !== currentMode && (
            <p className="mt-2 text-sm">
              {t('detector_mode_mismatch')}
            </p>
          )}
        </div>
        
        {/* Primary status card */}
        <StatusCard mode={currentMode} isInstallable={isInstallable} />

        {/* Detection details card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-dark mb-4 flex items-center">
            <span className="material-icons mr-2">info</span>
            {t('detector_subtitle')}
          </h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {displayModes.map(mode => (
              <DetectionCard 
                key={mode.name} 
                mode={mode} 
                isActive={mode.name === currentMode} 
              />
            ))}
          </div>
        </div>

        {/* Information card */}
        <InfoCard />
        
        {/* Spacer to push footer to bottom when content is short */}
        <div className="flex-grow"></div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>{t('detector_title')} | {t('device_info')}: <span className="text-gray-400 text-xs">{userAgent}</span></p>
        </div>
      </footer>

      {/* Install button for PWA installation - Hidden during checking */}
      {isInstallable && !isChecking && (
        <div className="fixed bottom-4 right-4">
          <button 
            onClick={promptInstall}
            className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 flex items-center"
          >
            <span className="material-icons mr-1">get_app</span>
            {t('install_pwa')}
          </button>
        </div>
      )}
    </div>
  );
};

export default PWADetector;