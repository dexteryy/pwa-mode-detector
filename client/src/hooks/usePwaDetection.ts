import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";

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

export function usePwaDetection(): PwaDetection {
  const { t } = useTranslation();
  // 获取当前路由位置，用于监听路由变化
  const [location] = useLocation();
  
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
  const [hasCompletedInitialCheck, setHasCompletedInitialCheck] = useState<boolean>(false);
  // 存储上一个路径，用于检测路由变化
  const [previousPath, setPreviousPath] = useState<string>(location);

  // Detect the current display mode
  const checkDisplayMode = useCallback(() => {
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
  }, [displayModes]);

  // Function to manually reset the checking state (for use with refresh button)
  const resetChecking = useCallback(() => {
    // 重置所有检查状态
    setIsChecking(true);
    setHasCompletedInitialCheck(false);
    
    // 延迟后完成检查
    setTimeout(() => {
      setHasCompletedInitialCheck(true);
      setIsChecking(false);
    }, 1000); // 使用与初始化相同的时间
  }, []);

  // Function to prompt installation
  const promptInstall = useCallback(() => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        // Clear the saved prompt
        setDeferredPrompt(null);
      });
    }
  }, [deferredPrompt]);

  // 添加路由变化监听，当路由变化时重置检查状态
  useEffect(() => {
    // 只有当路径实际变化且是在PWA页面间变化时才重置
    if (location !== previousPath && 
        location.match(/^\/(standalone|minimal-ui|fullscreen|browser|pwa\/)/) && 
        previousPath.match(/^\/(standalone|minimal-ui|fullscreen|browser|pwa\/)/)) {
      console.log(`路由从 ${previousPath} 变为 ${location}，重置检查状态`);
      
      // 缓存安装状态，避免频繁跳转间的闪烁问题
      const cachedDeferredPrompt = deferredPrompt;
      
      // 如果已经有安装提示存在，使用更快的重置流程
      if (cachedDeferredPrompt) {
        // 简短的检查状态，但仍然显示"检查中"
        setIsChecking(true);
        setTimeout(() => {
          setDeferredPrompt(cachedDeferredPrompt);
          setIsChecking(false);
        }, 300); // 更短的超时时间，只是为了视觉提示
      } else {
        // 完整的重置流程
        resetChecking();
      }
    }
    
    // 更新先前路径
    setPreviousPath(location);
  }, [location, previousPath, deferredPrompt, resetChecking]);

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
    
    // 设置为检查状态，并等待延迟完成初始检查
    const checkingTimer = setTimeout(() => {
      // 初始检查完成后，设置检查状态为false
      setHasCompletedInitialCheck(true);
      setIsChecking(false);
    }, 1000); // 减少初始检查时间，以提高用户体验
    
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67+ from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      
      // 如果初始检查已完成，则可以立即设置isChecking为false
      if (hasCompletedInitialCheck) {
        setIsChecking(false);
      }
      // 如果初始检查未完成，让定时器继续执行
    };
    
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    
    // Hide install button after app is installed
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
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
      clearTimeout(checkingTimer);
      mediaQueries.forEach((mediaQuery, index) => {
        mediaQuery.removeEventListener("change", handlers[index]);
      });
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [displayModes, hasCompletedInitialCheck, checkDisplayMode]); // Add displayModes, hasCompletedInitialCheck, and checkDisplayMode as dependencies

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
