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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [userAgent, setUserAgent] = useState<string>("");
  const [isChecking, setIsChecking] = useState<boolean>(true);
  // 添加一个明确的安装状态，与deferredPrompt分开
  const [installabilityDetermined, setInstallabilityDetermined] = useState<boolean>(false);

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
    
    // 重置检测状态
    setIsChecking(true);
    setInstallabilityDetermined(false);
    setDeferredPrompt(null); // 确保重置 deferredPrompt，重新检查安装能力
    
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
    
    console.log("初始化 PWA 检测 - 开始监听 beforeinstallprompt 事件");
    
    // 添加一个定时器以确保installability状态最终会被确定
    // 当 manifest 使用 Blob URL 时，我们需要给更长的时间让浏览器处理
    const installabilityTimer = setTimeout(() => {
      if (!installabilityDetermined) {
        console.log("检测超时 - 尚未触发 beforeinstallprompt 事件");
        setInstallabilityDetermined(true);
        setIsChecking(false);
      }
    }, 3000); // 增加到3秒，给Blob URL更多处理时间
    
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67+ from automatically showing the prompt
      e.preventDefault();
      console.log("捕获到 beforeinstallprompt 事件 - 应用可安装");
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setInstallabilityDetermined(true);
      setIsChecking(false); // End checking when we know the result
    };
    
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    
    // 检测 manifest 链接的变化
    const checkManifestLink = () => {
      const manifestLink = document.querySelector('link[rel="manifest"]');
      if (manifestLink) {
        console.log("检测到 manifest 链接:", (manifestLink as HTMLLinkElement).href);
      } else {
        console.log("未找到 manifest 链接元素");
      }
    };
    
    // 延迟一点执行 manifest 检查
    setTimeout(checkManifestLink, 500);
    
    // Hide install button after app is installed
    const handleAppInstalled = () => {
      console.log("应用安装成功 - appinstalled 事件触发");
      setDeferredPrompt(null);
    };
    
    window.addEventListener("appinstalled", handleAppInstalled);
    
    // Also check when visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkDisplayMode();
        // 当页面重新变为可见时，重新检查 manifest
        checkManifestLink();
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Cleanup
    return () => {
      clearTimeout(installabilityTimer);
      mediaQueries.forEach((mediaQuery, index) => {
        mediaQuery.removeEventListener("change", handlers[index]);
      });
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [displayModes]); // 移除 installabilityDetermined 依赖，避免相互影响

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
        // Clear the saved prompt
        setDeferredPrompt(null);
      });
    }
  };
  
  // Function to manually reset the checking state (for use with refresh button)
  const resetChecking = () => {
    console.log("手动重置 PWA 检测状态...");
    setIsChecking(true);
    setInstallabilityDetermined(false); // 重置installability状态
    setDeferredPrompt(null); // 重置 deferredPrompt，彻底重新检测
    
    // 重新给一些时间让beforeinstallprompt事件可能触发
    // 使用更长的超时时间，与初始化一致
    setTimeout(() => {
      if (!installabilityDetermined) {
        console.log("重置检测超时 - 尚未触发 beforeinstallprompt 事件");
        setInstallabilityDetermined(true);
        setIsChecking(false);
      }
    }, 3000);
    
    // 检测 manifest 链接
    setTimeout(() => {
      const manifestLink = document.querySelector('link[rel="manifest"]');
      if (manifestLink) {
        console.log("重置后检测到 manifest 链接:", (manifestLink as HTMLLinkElement).href);
      } else {
        console.log("重置后未找到 manifest 链接元素");
      }
    }, 500);
  };

  // 只有在确定了安装状态后，才返回实际的installable值
  // 如果仍在检查中，默认返回false
  const isInstallable = installabilityDetermined ? !!deferredPrompt : false;

  return {
    displayModes,
    currentMode,
    isInstallable,
    isChecking,
    promptInstall,
    resetChecking,
    userAgent
  };
}
