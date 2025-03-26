import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ManifestContext } from "../App";

interface DisplayMode {
  name: string;
  displayName: string;
  description: string;
}

// Define installation status types to differentiate between the 4 cases
export type InstallStatus = 
  | 'installable'              // Can be installed
  | 'not-installable-browser-mode'    // Manifest uses display:browser
  | 'not-installable-already-pwa'     // Already running as PWA
  | 'not-installable-already-installed' // Already installed but running in browser
  | 'not-installable-browser-unsupported' // Browser doesn't support installation
  | 'checking';                // Still checking

interface PwaDetection {
  displayModes: DisplayMode[];
  currentMode: string;
  isInstallable: boolean;
  isChecking: boolean;
  installStatus: InstallStatus;
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
  const [manifestInfo, setManifestInfo] = useState<{display?: string} | null>(null);
  
  // 确定当前路径是否为入口页面（'/'）
  const isEntryPage = !forcedPathKey || forcedPathKey === '/';
  
  // 每个标签页使用独立的会话ID，避免跨标签页干扰
  const [sessionId] = useState(() => 
    `session-${Math.random().toString(36).substring(2, 10)}-${Date.now()}`
  );
  
  // 创建特定于此页面和会话的键，避免不同标签页互相干扰
  // 标记为"可信"的键仅在确认安装成功后使用
  const sessionStorageKey = isEntryPage 
    ? 'pwa-no-install-entry-page' 
    : `pwa-session-state-${forcedPathKey || 'default'}-${sessionId}`;
    
  const trustedStorageKey = isEntryPage
    ? 'pwa-no-install-entry-page'
    : `pwa-installed-state-${forcedPathKey || 'default'}`;
  
  // 从本地存储加载安装状态，确保会话间一致性
  const [hasBeenInstalled, setHasBeenInstalled] = useState<boolean>(() => {
    // 入口页永远不应该被标记为已安装
    if (isEntryPage) {
      console.log('[usePwaDetection] Entry page detected, ignoring installation state');
      return false;
    }
    
    try {
      // 先尝试读取可信的全局安装状态（由已成功安装的页面设置）
      const trustedState = localStorage.getItem(trustedStorageKey);
      
      // 如果找到可信状态并且是已安装，优先使用它
      if (trustedState === 'true') {
        console.log(`[usePwaDetection] Found trusted installation record for path "${forcedPathKey}"`);
        return true;
      }
      
      // 默认情况：未安装
      // 注意：不再从localStorage加载可能不可信的false状态
      console.log(`[usePwaDetection] No trusted installation record found for path "${forcedPathKey}", assuming not installed`);
      return false;
    } catch (e) {
      console.error('[usePwaDetection] Error reading installation state from localStorage:', e);
      return false;
    }
  });

  // 仅当确认安装完成时，才将状态写入localStorage
  // 这样可以避免错误地将"未安装"状态传播到其他标签页
  useEffect(() => {
    // 入口页面不应该存储任何安装状态
    if (isEntryPage) {
      // 尝试清除可能存在的入口页安装状态
      try {
        localStorage.removeItem('pwa-installed-state-/');
        localStorage.removeItem('pwa-installed-state-default');
        console.log('[usePwaDetection] Prevented setting installation state for entry page');
      } catch (e) {
        console.error('[usePwaDetection] Error cleaning entry page localStorage:', e);
      }
      return;
    }
    
    // 仅当状态为"已安装"时，才写入可信全局存储
    // 这确保只有真正已安装的状态才会传播到其他标签页
    if (hasBeenInstalled) {
      try {
        localStorage.setItem(trustedStorageKey, 'true');
        console.log(`[usePwaDetection] Updated trusted installation state for path "${forcedPathKey}": true`);
      } catch (e) {
        console.error('[usePwaDetection] Error saving trusted installation state:', e);
      }
    }
    
    // 无论状态如何，总是更新当前会话的状态（这不会影响其他标签页）
    try {
      sessionStorage.setItem(sessionStorageKey, hasBeenInstalled ? 'true' : 'false');
      console.log(`[usePwaDetection] Updated session installation state: ${hasBeenInstalled} (${sessionId})`);
    } catch (e) {
      console.error('[usePwaDetection] Error saving session installation state:', e);
    }
  }, [hasBeenInstalled, trustedStorageKey, sessionStorageKey, forcedPathKey, isEntryPage, sessionId]);
  
  // Force checking state every time the path changes
  useEffect(() => {
    // Reset state
    setIsChecking(true);
    // Reset installable state
    setDeferredPrompt(null);
    console.log(`[usePwaDetection] Path change: ${forcedPathKey}, starting new detection`);

    // Delay completion of the check to ensure enough time to receive beforeinstallprompt event
    const timer = setTimeout(() => {
      setIsChecking(false);
      console.log(`[usePwaDetection] Detection complete: ${forcedPathKey}`);
    }, 3000); // Increased to 3 seconds to give browser more time to trigger installation events

    return () => clearTimeout(timer);
  }, [forcedPathKey]); // Depends on forcedPathKey to ensure detection resets when path changes

  // Helper function to get current mode without updating state
  const getCurrentDisplayMode = () => {
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
    
    return detectedMode;
  };
  
  // Detect the current display mode and update state
  const checkDisplayMode = () => {
    const detectedMode = getCurrentDisplayMode();
    setCurrentMode(detectedMode);
  };

  // Use ManifestContext to access manifest data
  const { manifestInfo: contextManifestInfo } = useContext(ManifestContext);
  
  // Update our local state when context changes
  useEffect(() => {
    console.log(`[usePwaDetection] Context manifest:`, contextManifestInfo);
    if (contextManifestInfo) {
      console.log(`[usePwaDetection] Updated manifest info from context:`, contextManifestInfo);
      // Force a refresh of the manifest info state
      setManifestInfo(contextManifestInfo);
    }
  }, [contextManifestInfo]);

  // Set up event listeners for display mode changes
  useEffect(() => {
    // Set user agent
    setUserAgent(navigator.userAgent);
    
    // Add a special handler for browser refresh after installation
    // This is important for catching installations from browser UI buttons
    const detectIfNewlyInstalled = () => {
      // If we're not in the browser mode and weren't previously installed,
      // then we must have just been installed from the browser UI
      const detectedMode = getCurrentDisplayMode();
      if (detectedMode !== 'browser' && !hasBeenInstalled) {
        console.log(`[usePwaDetection] Detected installation from browser UI, current mode: ${detectedMode}`);
        setHasBeenInstalled(true);
        
        // Also update the current mode immediately
        if (detectedMode !== currentMode) {
          setCurrentMode(detectedMode);
        }
      }
    };
    
    // Run this check immediately
    detectIfNewlyInstalled();
    
    // Also set up a short interval to check specifically for browser UI installations
    // This is more aggressive than our normal interval but only runs for a short time after load
    const quickCheckIntervalId = setInterval(detectIfNewlyInstalled, 1000);
    setTimeout(() => {
      clearInterval(quickCheckIntervalId);
    }, 5000); // Only check aggressively for the first 5 seconds
    
    // Initial check
    checkDisplayMode();
    
    // Check if the app has been installed previously
    if (window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: minimal-ui)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        (window.navigator as any).standalone === true) {
      // Already running as PWA
      setHasBeenInstalled(true);
    } else {
      // Try to detect if already installed by checking app installed state
      try {
        if ('getInstalledRelatedApps' in navigator) {
          // @ts-ignore: TypeScript doesn't know about getInstalledRelatedApps yet
          navigator.getInstalledRelatedApps().then((relatedApps: any[]) => {
            if (relatedApps.length > 0) {
              setHasBeenInstalled(true);
              console.log(`[usePwaDetection] Found this app is already installed:`, relatedApps);
            }
          });
        }
      } catch (e) {
        console.log('[usePwaDetection] Error checking installed apps:', e);
      }
    }
    
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
          if (mode.name !== 'browser') {
            setHasBeenInstalled(true);
          }
        }
      };
      
      handlers.push(handleChange);
      mediaQuery.addEventListener("change", handleChange);
    });
    
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67+ from automatically showing the prompt
      e.preventDefault();
      
      // Only update installation status after detection completes to avoid UI flickering
      if (!isChecking) {
        setDeferredPrompt(e);
        console.log(`[usePwaDetection] Received install prompt event and updating status immediately`);
      } else {
        // During detection process, save event but don't update UI immediately
        console.log(`[usePwaDetection] Received install prompt event, but detection not complete yet, storing event`);
        setTimeout(() => {
          setDeferredPrompt(e);
          console.log(`[usePwaDetection] Updating installation status after detection complete`);
        }, 100); // Slight delay to ensure state changes after detection completes
      }
    };
    
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    
    // Hide install button and update state after app is installed
    const handleAppInstalled = () => {
      // Clear the installation prompt
      setDeferredPrompt(null);
      // Set installed flag
      setHasBeenInstalled(true);
      
      console.log(`[usePwaDetection] App has been installed, updated installed status flag`);
      
      // Instead of calling checkDisplayMode directly, just check if the mode has changed
      // This avoids duplicate state updates that can cause flickering
      setTimeout(() => {
        const newMode = getCurrentDisplayMode();
        if (newMode !== currentMode) {
          console.log(`[usePwaDetection] Display mode changed in appinstalled event from ${currentMode} to ${newMode}`);
          checkDisplayMode();
        }
      }, 1000);
    };
    
    window.addEventListener("appinstalled", handleAppInstalled);
    
    // Also add a timer to periodically check display mode while the app is running, but at a slower rate
    // to avoid causing UI flickering
    const intervalId = setInterval(() => {
      // Only check if the app is visible
      if (document.visibilityState === "visible") {
        // Check the current mode before updating state to avoid unnecessary renders
        const currentDisplayMode = getCurrentDisplayMode();
        if (currentDisplayMode !== currentMode) {
          console.log(`[usePwaDetection] Display mode changed from ${currentMode} to ${currentDisplayMode}, updating`);
          checkDisplayMode();
        }
      }
    }, 10000); // Reduced frequency - check every 10 seconds
    
    // Note: We're using the getCurrentDisplayMode function defined outside this useEffect
    
    // Also check when visibility changes, but avoid unnecessary state updates
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Check if the mode has actually changed before updating state
        const newMode = getCurrentDisplayMode();
        if (newMode !== currentMode) {
          console.log(`[usePwaDetection] Display mode changed after visibility change: ${currentMode} -> ${newMode}`);
          checkDisplayMode();
        }
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
      
      // Clear all interval timers
      if (intervalId) {
        clearInterval(intervalId);
      }
      
      // Also clear the quick check interval if it's still running
      if (quickCheckIntervalId) {
        clearInterval(quickCheckIntervalId);
      }
    };
  }, [displayModes, currentMode, hasBeenInstalled, trustedStorageKey, sessionStorageKey, forcedPathKey, manifestInfo, sessionId]); // Depends on displayModes, current mode, installed state, keys, manifest and path

  // Function to prompt installation
  const promptInstall = () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === "accepted") {
          console.log("[usePwaDetection] User accepted installation prompt");
          
          // Update app state immediately after user accepts
          setHasBeenInstalled(true);
          
          // Even without the appinstalled event, we should manually 
          // update our state after successful installation - but we only need a single delayed check
          // Instead of multiple checks that might cause UI flickering
          setTimeout(() => {
            // Check the current mode before updating state
            const newMode = getCurrentDisplayMode();
            if (newMode !== currentMode) {
              console.log(`[usePwaDetection] Display mode changed after install from ${currentMode} to ${newMode}`);
              checkDisplayMode();
            } else {
              console.log("[usePwaDetection] Post-install mode unchanged, setting installed flag");
              // Even if the mode hasn't changed, update the hasBeenInstalled flag
              setHasBeenInstalled(true);
            }
          }, 1500); // Single check with a moderate delay
        } else {
          console.log("[usePwaDetection] User dismissed installation prompt");
        }
        // Clear the saved prompt
        setDeferredPrompt(null);
      });
    }
  };
  
  // Function to manually reset the checking state (for use with refresh button)
  const resetChecking = () => {
    // Set to checking state
    setIsChecking(true);
    // Reset installable state
    setDeferredPrompt(null);
    
    // 检测是否需要清除安装状态
    // 这对于处理浏览器地址栏安装至关重要
    // 如果在浏览器模式中运行但hasBeenInstalled=true，
    // 允许手动刷新以清除该状态，以便重新检测
    const currentDisplayMode = getCurrentDisplayMode();
    if (currentDisplayMode === 'browser' && hasBeenInstalled) {
      try {
        // 清除所有存储状态以允许重新检测
        localStorage.removeItem(trustedStorageKey);
        sessionStorage.removeItem(sessionStorageKey);
        setHasBeenInstalled(false);
        console.log(`[usePwaDetection] Manual refresh: cleared all installation states for path "${forcedPathKey}"`);
        
      } catch (e) {
        console.error('[usePwaDetection] Error clearing installation states:', e);
      }
    }
    
    console.log(`[usePwaDetection] Manual refresh: starting new detection`);
    
    // Complete check after delay
    setTimeout(() => {
      setIsChecking(false);
      console.log(`[usePwaDetection] Manual refresh: detection complete`);
    }, 3000); // Keep consistent with the detection time when path changes
  };

  // 确定正确的安装状态
  const getInstallStatus = (): InstallStatus => {
    // 记录所有状态以进行调试
    console.log('[usePwaDetection] Status check', {
      isChecking,
      deferredPrompt: !!deferredPrompt,
      currentMode,
      manifestInfo,
      contextManifestInfo,
      hasBeenInstalled,
      location: window.location.pathname,
      trustedStorageKey,
      sessionStorageKey,
      sessionId
    });
    
    if (isChecking) {
      return 'checking';
    }
    
    // ======= 检测优先级重新排序 =======
    // 优先进行manifest和路径检查，然后才是已安装状态和显示模式
    
    // Case 1: 检查manifest是否为browser模式（最高优先级）
    // 对/browser路径也进行特殊处理
    const isBrowserPath = window.location.pathname === '/browser' || 
                          window.location.pathname.startsWith('/browser/');
    
    // 从当前页面的manifest和路径来判断
    const isBrowserDisplayMode = (manifestInfo && manifestInfo.display === 'browser') || 
                                (contextManifestInfo && contextManifestInfo.display === 'browser') ||
                                isBrowserPath;
    
    // Debug the manifest display mode check
    console.log('[usePwaDetection] Display mode & path check:', {
      isBrowserDisplayMode,
      isBrowserPath,
      manifestDisplay: manifestInfo?.display,
      contextManifestDisplay: contextManifestInfo?.display,
      pathname: window.location.pathname
    });
    
    if (isBrowserDisplayMode) {
      console.log('[usePwaDetection] Status: not-installable-browser-mode (display:browser in manifest or browser path)');
      return 'not-installable-browser-mode';
    }
    
    // Case 2: 检查应用是否可安装（次高优先级）
    // 如果有安装提示事件，说明应用肯定是可安装的
    if (deferredPrompt) {
      console.log('[usePwaDetection] Status: installable - install prompt available');
      return 'installable';
    }
    
    // Case 3: 检查是否已在PWA模式下运行
    // 通过匹配media query直接检测当前的显示模式，不依赖状态变量
    if (window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: minimal-ui)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        (window.navigator as any).standalone === true) {
      console.log('[usePwaDetection] Status: not-installable-already-pwa - detected via media query');
      return 'not-installable-already-pwa';
    }
    
    // 只有当当前确实在浏览器模式下时，才使用存储的安装状态标志
    if (currentMode === 'browser') {
      try {
        // 直接重新读取可信的全局存储，确保使用最新状态
        const freshTrustedState = localStorage.getItem(trustedStorageKey);
        const freshlyCheckedInstalled = freshTrustedState === 'true';
        
        console.log(`[usePwaDetection] Fresh trusted storage check: ${freshlyCheckedInstalled} (${sessionId})`);
        
        // Case 4: 已安装但在浏览器中运行
        if (freshlyCheckedInstalled) {
          console.log('[usePwaDetection] Status: not-installable-already-installed - from fresh trusted storage check');
          return 'not-installable-already-installed';
        }
      } catch (e) {
        console.error('[usePwaDetection] Error checking fresh installation state:', e);
      }
    }
    
    // Case 5: 浏览器不支持安装（默认情况）
    console.log('[usePwaDetection] Status: not-installable-browser-unsupported - default case');
    return 'not-installable-browser-unsupported';
  };

  // Calculate current installation status
  const installStatus = getInstallStatus();

  // Compute proper isInstallable flag based on installStatus
  const getIsInstallable = (): boolean => {
    // Only 'installable' status should return true
    return installStatus === 'installable';
  };

  return {
    displayModes,
    currentMode,
    // When detecting, don't return installation status to avoid UI flickering
    isInstallable: isChecking ? false : getIsInstallable(),
    isChecking,
    installStatus,
    promptInstall,
    resetChecking,
    userAgent
  };
}
