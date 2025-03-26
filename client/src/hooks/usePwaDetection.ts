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
  
  // Each path should have its own installation state
  // forcedPathKey represents the display mode path being used
  const localStorageKey = `pwa-installed-state-${forcedPathKey || 'default'}`;
  
  // Use an improved installation state approach that combines localStorage (for persistence) 
  // with sessionStorage (for tab-specific overrides)
  const sessionStorageKey = `pwa-installed-state-session-${forcedPathKey || 'default'}`;
  
  const [hasBeenInstalled, setHasBeenInstalled] = useState<boolean>(() => {
    try {
      // First check if we have a session-specific override
      const sessionState = sessionStorage.getItem(sessionStorageKey);
      if (sessionState !== null) {
        const isInstalledSession = sessionState === 'true';
        console.log(`[usePwaDetection] Using session-specific installation state for "${forcedPathKey}": ${isInstalledSession}`);
        return isInstalledSession;
      }
      
      // Otherwise fall back to the shared localStorage state
      const storedState = localStorage.getItem(localStorageKey);
      const isInstalled = storedState === 'true';
      console.log(`[usePwaDetection] Loaded installation state for path "${forcedPathKey}" from localStorage: ${isInstalled}`);
      return isInstalled;
    } catch (e) {
      console.error('[usePwaDetection] Error reading installation state:', e);
      return false;
    }
  });

  // Update both storage types whenever hasBeenInstalled changes
  useEffect(() => {
    try {
      // First update the tab-specific state
      sessionStorage.setItem(sessionStorageKey, hasBeenInstalled ? 'true' : 'false');
      console.log(`[usePwaDetection] Updated session storage state for "${forcedPathKey}": ${hasBeenInstalled}`);
      
      // Then update the shared state 
      localStorage.setItem(localStorageKey, hasBeenInstalled ? 'true' : 'false');
      console.log(`[usePwaDetection] Updated localStorage state for "${forcedPathKey}": ${hasBeenInstalled}`);
    } catch (e) {
      console.error('[usePwaDetection] Error saving installation state:', e);
    }
  }, [hasBeenInstalled, localStorageKey, sessionStorageKey, forcedPathKey]);
  
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
  }, [displayModes, currentMode, hasBeenInstalled, localStorageKey, forcedPathKey, manifestInfo]); // Depends on displayModes, current mode, installed state, manifest and path

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
    
    // Detect if we need to clear installation state
    // This is important to handle browser address bar installations
    // If we're running in browser mode but still have hasBeenInstalled=true,
    // allow a manual refresh to clear that state so we can detect fresh again
    const currentDisplayMode = getCurrentDisplayMode();
    if (currentDisplayMode === 'browser' && hasBeenInstalled) {
      try {
        // Clear stored state to allow re-detection
        localStorage.removeItem(localStorageKey);
        setHasBeenInstalled(false);
        console.log(`[usePwaDetection] Manual refresh: cleared installation state for path "${forcedPathKey}"`);
        
      } catch (e) {
        console.error('[usePwaDetection] Error clearing installation state:', e);
      }
    }
    
    console.log(`[usePwaDetection] Manual refresh: starting new detection`);
    
    // Complete check after delay
    setTimeout(() => {
      setIsChecking(false);
      console.log(`[usePwaDetection] Manual refresh: detection complete`);
    }, 3000); // Keep consistent with the detection time when path changes
  };

  // Determine the proper installation status
  const getInstallStatus = (): InstallStatus => {
    // Log all states for debugging
    console.log('[usePwaDetection] Status check', {
      isChecking,
      deferredPrompt: !!deferredPrompt,
      currentMode,
      manifestInfo,
      contextManifestInfo,
      hasBeenInstalled,
      location: window.location.pathname,
      forcedPathKey
    });
    
    if (isChecking) {
      return 'checking';
    }
    
    // Case 1: First always prioritize display:browser in manifests
    // This ensures browser display mode is always correctly detected regardless of other state
    const isBrowserPath = window.location.pathname === '/browser' || 
                         window.location.pathname.startsWith('/browser/');
    
    const isBrowserDisplayMode = (manifestInfo && manifestInfo.display === 'browser') || 
                               (contextManifestInfo && contextManifestInfo.display === 'browser') ||
                               isBrowserPath || // Also check path as a fallback
                               forcedPathKey === 'browser'; // Check explicit forced path
    
    // Debug the manifest display mode check
    console.log('[usePwaDetection] Browser display check:', {
      isBrowserDisplayMode,
      isBrowserPath,
      manifestDisplay: manifestInfo?.display,
      contextManifestDisplay: contextManifestInfo?.display,
      pathname: window.location.pathname,
      forcedPathKey
    });
    
    if (isBrowserDisplayMode) {
      console.log('[usePwaDetection] Status: not-installable-browser-mode (display:browser detected)');
      return 'not-installable-browser-mode';
    }
    
    // Case 2: Installable - browser supports installation and app can be installed
    // PROMOTE THIS CHECK to second priority - it means we have a fresh prompt
    if (deferredPrompt) {
      console.log('[usePwaDetection] Status: installable - prompt available');
      return 'installable';
    }
    
    // Case 3: Running as PWA - not in browser mode
    if (currentMode !== 'browser') {
      console.log('[usePwaDetection] Status: not-installable-already-pwa (running in PWA mode)');
      return 'not-installable-already-pwa';
    }
    
    // Case 4: Already installed but running in browser
    // This now only applies if we HAVEN'T detected browser display mode
    // and we're actually running in browser mode
    if (hasBeenInstalled) {
      // Double check if the local storage might have been shared between paths incorrectly
      // by checking if the key is specifically for this path
      const checkIsSessionStorage = sessionStorage.getItem(sessionStorageKey) === 'true';
      
      // Only trust this state if explicitly set in the current session or if path matches
      if (checkIsSessionStorage || forcedPathKey === localStorageKey.split('-').pop()) {
        console.log('[usePwaDetection] Status: not-installable-already-installed (reliable state)');
        return 'not-installable-already-installed';
      } else {
        // We have a shared localStorage value but it might be from another path
        // and we don't have a session override, so we're less confident
        console.log('[usePwaDetection] Ignoring potentially incorrect cross-path installation state');
        // Fall through to final case
      }
    }
    
    // Case 5: Browser doesn't support installation (default fallback)
    console.log('[usePwaDetection] Status: not-installable-browser-unsupported (fallback)');
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
