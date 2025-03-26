import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface DisplayMode {
  name: string;
  displayName: string;
  description: string;
}

interface PwaDetection {
  displayModes: DisplayMode[];
  currentMode: string;
  isInstallable: boolean;
  isChecking: boolean;
  promptInstall: () => void;
  resetChecking: () => void;
  userAgent: string;
}

export function usePwaDetection(forcedPathKey?: string): PwaDetection {
  const { t } = useTranslation();
  
  // Define available display modes with i18n
  const displayModes: DisplayMode[] = [
    {
      name: "browser",
      displayName: t('browser_name'),
      description: t('browser_description')
    },
    {
      name: "minimal-ui",
      displayName: t('minimal_ui_name'), 
      description: t('minimal_ui_description')
    },
    {
      name: "standalone",
      displayName: t('standalone_name'),
      description: t('standalone_description')
    },
    {
      name: "fullscreen",
      displayName: t('fullscreen_name'),
      description: t('fullscreen_description')
    }
  ];

  // State for tracking current mode and installability
  const [currentMode, setCurrentMode] = useState<string>("browser");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [userAgent, setUserAgent] = useState<string>("");
  const [isChecking, setIsChecking] = useState<boolean>(true);

  // 每次路径变化时，强制设置为检查中状态
  useEffect(() => {
    // 重置状态
    setIsChecking(true);
    // 重置installable状态
    setDeferredPrompt(null);
    console.log(`[usePwaDetection] 路径变化: ${forcedPathKey}, 开始新检测`);

    // 延迟完成检查的时间，确保有足够时间接收beforeinstallprompt事件
    const timer = setTimeout(() => {
      setIsChecking(false);
      console.log(`[usePwaDetection] 检测完成: ${forcedPathKey}`);
    }, 3000); // 增加到3秒，给浏览器更多时间触发安装事件

    return () => clearTimeout(timer);
  }, [forcedPathKey]); // 依赖 forcedPathKey，确保路径变化时重新检测

  // Detect the current display mode
  const checkDisplayMode = () => {
    // Default to browser mode
    let detectedMode = "browser";
    
    // Check each display mode
    for (const mode of displayModes) {
      const isActive = window.matchMedia(`(display-mode: ${mode.name})`).matches;
      
      // Special case for iOS standalone mode
      const isIOSStandalone = 
        mode.name === "standalone" && 
        (window.navigator as any).standalone === true;
        
      if (isActive || isIOSStandalone) {
        detectedMode = mode.name;
        break; // Use the first matching mode
      }
    }
    
    setCurrentMode(detectedMode);
  };

  // Set up event listeners for display mode changes
  useEffect(() => {
    // Set user agent
    setUserAgent(navigator.userAgent);
    
    // Initial check
    checkDisplayMode();
    
    // Listen for changes in each display mode
    const mediaQueries: MediaQueryList[] = [];
    const handlers: ((e: MediaQueryListEvent) => void)[] = [];
    
    displayModes.forEach((mode, index) => {
      const mediaQuery = window.matchMedia(`(display-mode: ${mode.name})`);
      mediaQueries.push(mediaQuery);
      
      // Modern browsers use addEventListener
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          checkDisplayMode();
        }
      };
      
      handlers.push(handleChange);
      mediaQuery.addEventListener("change", handleChange);
    });
    
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67+ from automatically showing the prompt
      e.preventDefault();
      
      // 只在检测完成后更新安装状态，避免显示闪烁
      if (!isChecking) {
        setDeferredPrompt(e);
        console.log(`[usePwaDetection] 收到安装提示事件并立即更新状态`);
      } else {
        // 在检测过程中接收到事件，保存但不立即更新界面
        console.log(`[usePwaDetection] 收到安装提示事件，但检测尚未完成，暂存事件`);
        setTimeout(() => {
          setDeferredPrompt(e);
          console.log(`[usePwaDetection] 检测完成后更新安装状态`);
        }, 100); // 延迟一点更新，确保状态变化在检测完成后
      }
    };
    
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    
    // Hide install button after app is installed
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      console.log(`[usePwaDetection] 应用已安装`);
    };
    
    window.addEventListener("appinstalled", handleAppInstalled);
    
    // Also check when visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkDisplayMode();
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Cleanup
    return () => {
      mediaQueries.forEach((mediaQuery, index) => {
        mediaQuery.removeEventListener("change", handlers[index]);
      });
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [displayModes]); // 只依赖 displayModes

  // Function to prompt installation
  const promptInstall = () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === "accepted") {
          console.log("[usePwaDetection] 用户接受安装提示");
        } else {
          console.log("[usePwaDetection] 用户取消安装提示");
        }
        // Clear the saved prompt
        setDeferredPrompt(null);
      });
    }
  };
  
  // Function to manually reset the checking state (for use with refresh button)
  const resetChecking = () => {
    // 设置为检查中状态
    setIsChecking(true);
    // 重置installable状态
    setDeferredPrompt(null);
    console.log(`[usePwaDetection] 手动刷新: 开始新检测`);
    
    // 延迟后完成检查
    setTimeout(() => {
      setIsChecking(false);
      console.log(`[usePwaDetection] 手动刷新: 检测完成`);
    }, 3000); // 保持与路径变化时的检测时间一致
  };

  return {
    displayModes,
    currentMode,
    // 当检测中时，不返回安装状态，避免闪烁
    isInstallable: isChecking ? false : !!deferredPrompt,
    isChecking,
    promptInstall,
    resetChecking,
    userAgent
  };
}
