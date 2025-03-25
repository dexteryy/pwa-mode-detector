import { useState, useEffect } from "react";
import StatusCard from "@/components/StatusCard";
import DetectionCard from "@/components/DetectionCard";
import InfoCard from "@/components/InfoCard";
import { usePwaDetection } from "@/hooks/usePwaDetection";

const Home = () => {
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
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="material-icons mr-2">devices</span>
            <h1 className="text-xl font-semibold">PWA Mode Detector</h1>
          </div>
          <button 
            onClick={handleRefresh}
            className={`bg-white text-primary p-2 rounded-full hover:bg-blue-50 transition-colors ${isRefreshing ? 'animate-spin' : ''}`} 
            aria-label="Refresh detection"
          >
            <span className="material-icons">refresh</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
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
      <footer className="bg-dark text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>PWA Mode Detector | 检测环境：<span className="text-gray-400 text-xs">{userAgent}</span></p>
        </div>
      </footer>

      {/* Install button for PWA installation */}
      {isInstallable && (
        <div className="fixed bottom-4 right-4">
          <button 
            onClick={promptInstall}
            className="bg-primary text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 flex items-center"
          >
            <span className="material-icons mr-1">get_app</span>
            安装应用
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
