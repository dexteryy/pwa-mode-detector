import { useState, useEffect } from "react";
import StatusCard from "@/components/StatusCard";
import DetectionCard from "@/components/DetectionCard";
import InfoCard from "@/components/InfoCard";
import ManifestViewer from "@/components/ManifestViewer";
import TermText from "@/components/TermText";
import { usePwaDetection } from "@/hooks/usePwaDetection";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { ArrowLeft, RefreshCw, Smartphone, CheckCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { processTerms } from "@/lib/termLinks";

const PWADetector = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
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
  
  // 将当前路径作为强制刷新的key传递给hook
  const { 
    displayModes, 
    currentMode, 
    isInstallable,
    isChecking,
    promptInstall,
    resetChecking,
    userAgent 
  } = usePwaDetection(path); // 传递当前路径作为key，确保路径变化时重新检测
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  // PWADetector 中不再需要动态管理 manifest，这部分功能已由 App.tsx 中的 ManifestHandler 处理
  // 保留注释作为提醒，这里曾经有动态添加 manifest 的逻辑，现在已经集中到 ManifestHandler 组件中

  // Handle manual refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // 显示正在刷新的提示消息
    toast({
      title: t('refreshing'),
      description: t('refresh_process'),
      duration: 5000,
    });
    
    // 重置检查状态
    resetChecking();
    
    // 动画效果
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 font-sans min-h-screen flex flex-col">
      {/* Integrated App Header - Native UI Style */}
      <header className="bg-blue-500 dark:bg-blue-800 text-white">
        {/* Top navigation bar - subtle style for native UI integration */}
        <div className="border-b border-blue-400/30 dark:border-blue-700/40">
          <div className="flex items-center justify-between px-2">
            <Link href="/">
              <div className="text-white h-10 px-2 flex items-center cursor-pointer whitespace-nowrap hover:bg-blue-400/20 dark:hover:bg-blue-700/30 rounded-md transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{t('back_to_home')}</span>
              </div>
            </Link>
            <div className="flex items-center">
              <button 
                onClick={handleRefresh}
                className={`text-white h-10 w-10 flex items-center justify-center hover:bg-blue-400/20 dark:hover:bg-blue-700/30 rounded-md transition-colors ${isRefreshing ? 'animate-spin' : ''}`} 
                aria-label="Refresh detection"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <LanguageSwitcher className="h-10" />
            </div>
          </div>
        </div>
        
        {/* Title area */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <Smartphone className="h-5 w-5 mr-2" />
            <h1 className="text-xl font-semibold">{t('detector_title')}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow flex flex-col">
        <div className="max-w-3xl mx-auto w-full">
          {/* Manifest mode banner */}
          <div className={`mb-4 p-4 rounded-lg ${
            expectedMode === currentMode 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' 
              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200'
          }`}>
            <div className="flex items-center">
              {expectedMode === currentMode ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <Info className="h-5 w-5 mr-2" />
              )}
              <h2 className="font-semibold">
                {t('expected_mode')}: <span className="font-bold">{processTerms(expectedMode)}</span>
              </h2>
            </div>
            {expectedMode !== currentMode && (
              <p className="mt-2 text-sm">
                {t('detector_mode_mismatch')}
              </p>
            )}
          </div>
          
          {/* Primary status card */}
          <StatusCard mode={currentMode} isInstallable={isInstallable} expectedMode={expectedMode} />
  
          {/* Detection details card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-dark dark:text-white mb-4 flex items-center">
              <Info className="h-5 w-5 mr-2" />
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
  
          {/* Manifest viewer card */}
          <ManifestViewer />
          
          {/* Information card */}
          <InfoCard />
          
          {/* Spacer to push footer to bottom when content is short */}
          <div className="flex-grow"></div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-950 text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>{t('detector_title')} | {t('device_info')}: <span className="text-gray-400 dark:text-gray-500 text-xs">{userAgent}</span></p>
        </div>
      </footer>
    </div>
  );
};

export default PWADetector;