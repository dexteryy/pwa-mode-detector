import { useState, useEffect } from "react";
import StatusCard from "@/components/StatusCard";
import DetectionCard from "@/components/DetectionCard";
import InfoCard from "@/components/InfoCard";
import { usePwaDetection } from "@/hooks/usePwaDetection";
import { Link, useRoute } from "wouter";

const PWADetector = () => {
  // 从URL参数中获取预期的display模式
  const [, params] = useRoute("/pwa/:display");
  const expectedMode = params?.display || "standalone";
  
  const { 
    displayModes, 
    currentMode, 
    isInstallable,
    promptInstall,
    userAgent 
  } = usePwaDetection();
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle manual refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="bg-gray-100 font-sans min-h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="material-icons mr-2">devices</span>
            <h1 className="text-xl font-semibold">PWA Mode Detector</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="bg-white text-blue-600 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors flex items-center cursor-pointer">
                <span className="material-icons text-sm mr-1">home</span>
                返回首页
              </div>
            </Link>
            <button 
              onClick={handleRefresh}
              className={`bg-white text-blue-600 w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-50 transition-colors ${isRefreshing ? 'animate-spin' : ''}`} 
              aria-label="Refresh detection"
            >
              <span className="material-icons">refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Manifest mode banner */}
        <div className={`mb-4 p-4 rounded-lg ${expectedMode === currentMode ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
          <div className="flex items-center">
            <span className="material-icons mr-2">{expectedMode === currentMode ? 'check_circle' : 'info'}</span>
            <h2 className="font-semibold">
              当前 PWA 预期运行模式: <span className="font-bold">{expectedMode}</span>
            </h2>
          </div>
          {expectedMode !== currentMode && (
            <p className="mt-2 text-sm">
              检测到的实际运行模式与 manifest 中配置的不同。这可能是因为浏览器不支持该模式或者应用尚未安装。
            </p>
          )}
        </div>
        
        {/* Primary status card */}
        <StatusCard mode={currentMode} isInstallable={isInstallable} />

        {/* Detection details card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-dark mb-4 flex items-center">
            <span className="material-icons mr-2">info</span>
            检测详情
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
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>PWA Mode Detector | 检测环境：<span className="text-gray-400 text-xs">{userAgent}</span></p>
        </div>
      </footer>

      {/* Install button for PWA installation */}
      {isInstallable && (
        <div className="fixed bottom-4 right-4">
          <button 
            onClick={promptInstall}
            className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 flex items-center"
          >
            <span className="material-icons mr-1">get_app</span>
            安装应用
          </button>
        </div>
      )}
    </div>
  );
};

export default PWADetector;