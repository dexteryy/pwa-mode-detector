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
  
  // Check if this is the entry page (not a valid PWA path)
  const isEntryPath = !forcedPathKey || 
                      forcedPathKey === 'default' || 
                      window.location.pathname === '/';
  
  // Simple detection for whether app is running in PWA mode - no storage
  const [hasBeenInstalled, setHasBeenInstalled] = useState<boolean>(() => {
    // Entry page should never show as installed
    if (isEntryPath) {
      return false;
    }
    
    // Default to false - we'll detect if we're running in PWA mode in the initial effect
    return false;
  });
  
  // Force checking state every time the path changes
  useEffect(() => {
    // Reset state
    setIsChecking(true);
    // Reset installable state
    setDeferredPrompt(null);

    // Delay completion of the check to ensure enough time to receive beforeinstallprompt event
    const timer = setTimeout(() => {
      setIsChecking(false);
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
    
    if (contextManifestInfo) {
      
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
              
            }
          });
        }
      } catch (e) {
        
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
        
      } else {
        // During detection process, save event but don't update UI immediately
        
        setTimeout(() => {
          setDeferredPrompt(e);
          
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
      
      
      
      // Instead of calling checkDisplayMode directly, just check if the mode has changed
      // This avoids duplicate state updates that can cause flickering
      setTimeout(() => {
        const newMode = getCurrentDisplayMode();
        if (newMode !== currentMode) {
          
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
  }, [displayModes, currentMode, hasBeenInstalled, forcedPathKey, manifestInfo]); 

  // Function to prompt installation
  const promptInstall = () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === "accepted") {
          
          
          // Update app state immediately after user accepts
          setHasBeenInstalled(true);
          
          // Even without the appinstalled event, we should manually 
          // update our state after successful installation - but we only need a single delayed check
          // Instead of multiple checks that might cause UI flickering
          setTimeout(() => {
            // Check the current mode before updating state
            const newMode = getCurrentDisplayMode();
            if (newMode !== currentMode) {
              
              checkDisplayMode();
            } else {
              
              // Even if the mode hasn't changed, update the hasBeenInstalled flag
              setHasBeenInstalled(true);
            }
          }, 1500); // Single check with a moderate delay
        } else {
          
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
    
    // Skip additional operations for the entry page
    if (isEntryPath) {
      
      
      // Complete check after delay
      setTimeout(() => {
        setIsChecking(false);
        
      }, 1000); // Shorter delay for entry page as we don't need to wait for installation events
      return;
    }
    
    // Detect if we need to clear installation state
    // This is important to handle browser address bar installations
    const currentDisplayMode = getCurrentDisplayMode();
    
    // Get current path-based mode for more accurate checking
    const currentPath = window.location.pathname;
    const pathBasedMode = 
      currentPath === '/standalone' ? 'standalone' :
      currentPath === '/minimal-ui' ? 'minimal-ui' :
      currentPath === '/fullscreen' ? 'fullscreen' :
      currentPath === '/browser' ? 'browser' : 
      'unknown';
    
    // Only continue processing for exact PWA paths that support installation
    const isSupportedPwaPath = ['standalone', 'minimal-ui', 'fullscreen'].includes(pathBasedMode);
    
    // Check if the manifest display mode matches the path
    const manifestDisplay = manifestInfo?.display || contextManifestInfo?.display;
    const hasPathMismatch = manifestDisplay && manifestDisplay !== pathBasedMode;
    
    // Reset installation state if:
    // 1. We're in browser mode but hasBeenInstalled is true (likely false state)
    // 2. There's a mismatch between manifest display and current path
    // 3. User explicitly wants a fresh installation check for supported path
    // 4. Any non-PWA path that shouldn't have installation state
    if ((currentDisplayMode === 'browser' && hasBeenInstalled) || 
        hasPathMismatch || 
        !isSupportedPwaPath || 
        pathBasedMode === 'browser') {
      
      // Just reset React state - no storage operations
      setHasBeenInstalled(false);
    }
    
    
    
    // Complete check after delay
    setTimeout(() => {
      setIsChecking(false);
      
    }, 3000); // Keep consistent with the detection time when path changes
  };

  // Determine the proper installation status
  const getInstallStatus = (): InstallStatus => {
    // Get current path-based mode using exact path matching
    const currentPath = window.location.pathname;
    const pathBasedMode = 
      currentPath === '/standalone' ? 'standalone' :
      currentPath === '/minimal-ui' ? 'minimal-ui' :
      currentPath === '/fullscreen' ? 'fullscreen' :
      currentPath === '/browser' ? 'browser' : 
      'unknown';
      
    // Log all states for debugging
    
    if (isChecking) {
      return 'checking';
    }
    
    // Case 1: Installable - browser supports installation and app can be installed
    // This is highest priority - if we have an install prompt, we're definitely installable
    if (deferredPrompt) {
      
      return 'installable';
    }
    
    // Case 2: Running as PWA - not in browser mode
    // If display mode is something other than browser, we're in a PWA
    if (currentMode !== 'browser') {
      
      return 'not-installable-already-pwa';
    }
    
    // Case 3: Manifest uses display:browser - HIGHEST PRIORITY FOR BROWSER PATH
    // This should always take precedence for browser display mode
    const isBrowserPath = pathBasedMode === 'browser';
    
    // Check manifest data (either from local state or context)
    const manifestDisplay = manifestInfo?.display || contextManifestInfo?.display;
    const isBrowserDisplayMode = manifestDisplay === 'browser' || isBrowserPath;
    
    // Debug the manifest display mode check
    
    if (isBrowserDisplayMode) {
      
      return 'not-installable-browser-mode';
    }
    
    // Check if we should trust hasBeenInstalled flag
    // Only trust it for well-known PWA paths with matching manifests
    const isKnownPwaPath = ['standalone', 'minimal-ui', 'fullscreen'].includes(pathBasedMode);
    const hasMatchingManifest = manifestDisplay === pathBasedMode;
    
    // Case 4: Already installed but running in browser
    // Only trust hasBeenInstalled if we have path+manifest match or strong indicators
    if (hasBeenInstalled && (isKnownPwaPath && (hasMatchingManifest || !manifestDisplay))) {
      
      return 'not-installable-already-installed';
    }
    
    // If hasBeenInstalled is true but manifest doesn't match path, we should check if we have an install prompt
    if (hasBeenInstalled && !hasMatchingManifest) {
      // The user may have cleared site data or this might be a false positive
      // We'll still allow installation if browser offers the prompt
      
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
