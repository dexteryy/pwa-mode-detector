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

// 使用全局状态避免多次检测
let globalCheckState = {
  deferredPrompt: null as any,
  isChecking: true,
  hasCompletedInitialCheck: false,
  // 状态更新时的回调
  listeners: [] as Function[]
};

// 注册状态变化监听器
function registerStateChangeListener(listener: Function) {
  globalCheckState.listeners.push(listener);
  return () => {
    globalCheckState.listeners = globalCheckState.listeners.filter(l => l !== listener);
  };
}

// 更新全局状态 - 导出以便 ManifestHandler 能使用
export function updateGlobalState(updates: Partial<typeof globalCheckState>) {
  Object.assign(globalCheckState, updates);
  // 通知所有监听器
  globalCheckState.listeners.forEach(listener => listener());
}

export function usePwaDetection(): PwaDetection {
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
  const [userAgent, setUserAgent] = useState<string>("");
  // 将状态连接到全局状态
  const [deferredPrompt, setDeferredPrompt] = useState<any>(globalCheckState.deferredPrompt);
  const [isChecking, setIsChecking] = useState<boolean>(globalCheckState.isChecking);
  const [hasCompletedInitialCheck, setHasCompletedInitialCheck] = useState<boolean>(
    globalCheckState.hasCompletedInitialCheck
  );

  // 监听全局状态变化
  useEffect(() => {
    const unregister = registerStateChangeListener(() => {
      setDeferredPrompt(globalCheckState.deferredPrompt);
      setIsChecking(globalCheckState.isChecking);
      setHasCompletedInitialCheck(globalCheckState.hasCompletedInitialCheck);
    });
    
    return unregister;
  }, []);

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

  // 路径变化监听逻辑已经转移到 ManifestHandler 组件
  // 移除这里的重复逻辑，避免重复重置检查状态

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
    
    // 总是启动一个检查定时器，确保每个新页面都有正确的检查状态
    const checkingTimer = setTimeout(() => {
      // 初始检查完成后，更新全局状态
      updateGlobalState({
        hasCompletedInitialCheck: true,
        isChecking: false
      });
    }, 2000); // 增加时间确保安装状态可以被正确确定
    
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67+ from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      updateGlobalState({ deferredPrompt: e });
      
      // 如果初始检查已完成，则可以立即设置isChecking为false
      if (globalCheckState.hasCompletedInitialCheck) {
        updateGlobalState({ isChecking: false });
      }
      // 如果初始检查未完成，让定时器继续执行
    };
    
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    
    // Hide install button after app is installed
    const handleAppInstalled = () => {
      updateGlobalState({ deferredPrompt: null });
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
      if (checkingTimer) clearTimeout(checkingTimer);
      mediaQueries.forEach((mediaQuery, index) => {
        mediaQuery.removeEventListener("change", handlers[index]);
      });
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [displayModes]); // 只依赖 displayModes，不再依赖 hasCompletedInitialCheck

  // Function to prompt installation
  const promptInstall = () => {
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
        // Clear the saved prompt in global state
        updateGlobalState({ deferredPrompt: null });
      });
    }
  };
  
  // Function to manually reset the checking state (for use with refresh button)
  const resetChecking = () => {
    // 重置全局检查状态
    updateGlobalState({
      isChecking: true,
      hasCompletedInitialCheck: false
    });
    
    // 延迟后完成检查
    setTimeout(() => {
      updateGlobalState({
        hasCompletedInitialCheck: true,
        isChecking: false
      });
    }, 2000);
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
