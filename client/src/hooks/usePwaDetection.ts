import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

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
  const [hasBeenInstalled, setHasBeenInstalled] = useState<boolean>(false);

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

  // Global cache for manifests (using module scope to maintain across hook calls)
  const manifestCache: Map<string, any> = (() => {
    // Module-scoped variable maintains state between renders
    if (!(window as any).__manifestCache) {
      (window as any).__manifestCache = new Map<string, any>();
      console.log('[usePwaDetection] Creating global manifest cache');
    }
    return (window as any).__manifestCache;
  })();
  
  // Fetch manifest information - with caching to avoid multiple requests
  useEffect(() => {
    const fetchManifest = async () => {
      try {
        // Try to fetch the manifest
        const manifestLinks = document.querySelectorAll('link[rel="manifest"]');
        if (manifestLinks.length > 0) {
          const manifestUrl = manifestLinks[0].getAttribute('href');
          if (manifestUrl) {
            // Check if we've already loaded this manifest URL in this session
            if (manifestCache.has(manifestUrl)) {
              console.log(`[usePwaDetection] Using cached manifest data for ${manifestUrl}`);
              setManifestInfo(manifestCache.get(manifestUrl));
              return;
            }
            
            // Load manifest once per URL
            console.log(`[usePwaDetection] Fetching manifest from ${manifestUrl}`);
            const response = await fetch(manifestUrl);
            const data = await response.json();
            
            // Cache the result
            manifestCache.set(manifestUrl, data);
            
            // Update state
            setManifestInfo(data);
            console.log(`[usePwaDetection] Manifest loaded from ${manifestUrl}:`, data);
          }
        }
      } catch (error) {
        console.error(`[usePwaDetection] Error loading manifest:`, error);
        setManifestInfo(null);
      }
    };

    fetchManifest();
    
    // No cleanup needed for the cache as it's kept via window global
  }, [forcedPathKey]); // Reload manifest only when path changes

  // Set up event listeners for display mode changes
  useEffect(() => {
    // Set user agent
    setUserAgent(navigator.userAgent);
    
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
      
      // Clear the periodic check interval
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [displayModes]); // Only depends on displayModes

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
    console.log(`[usePwaDetection] Manual refresh: starting new detection`);
    
    // Complete check after delay
    setTimeout(() => {
      setIsChecking(false);
      console.log(`[usePwaDetection] Manual refresh: detection complete`);
    }, 3000); // Keep consistent with the detection time when path changes
  };

  // Determine the proper installation status
  const getInstallStatus = (): InstallStatus => {
    if (isChecking) {
      return 'checking';
    }
    
    // Case 1: Installable - browser supports installation and app can be installed
    if (deferredPrompt) {
      return 'installable';
    }
    
    // Case 2: Running as PWA - not in browser mode
    if (currentMode !== 'browser') {
      return 'not-installable-already-pwa';
    }
    
    // Case 3: Manifest uses display:browser
    if (manifestInfo && manifestInfo.display === 'browser') {
      return 'not-installable-browser-mode';
    }
    
    // Case 4: Already installed but running in browser
    if (hasBeenInstalled) {
      return 'not-installable-already-installed';
    }
    
    // Case 5: Browser doesn't support installation (default fallback)
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
