import { useState, useEffect } from "react";

interface DisplayMode {
  name: string;
  displayName: string;
  description: string;
}

interface PwaDetection {
  displayModes: DisplayMode[];
  currentMode: string;
  isInstallable: boolean;
  promptInstall: () => void;
  userAgent: string;
}

export function usePwaDetection(): PwaDetection {
  // Define available display modes
  const displayModes: DisplayMode[] = [
    {
      name: "standalone",
      displayName: "独立窗口模式",
      description: "应用在没有浏览器界面的独立窗口中运行"
    },
    {
      name: "browser",
      displayName: "浏览器模式",
      description: "应用在常规浏览器标签页中运行"
    },
    {
      name: "minimal-ui",
      displayName: "最小界面模式", 
      description: "应用在带有最小浏览器控件的窗口中运行"
    },
    {
      name: "fullscreen",
      displayName: "全屏模式",
      description: "应用占据整个屏幕，没有任何浏览器界面"
    }
  ];

  // State for tracking current mode and installability
  const [currentMode, setCurrentMode] = useState<string>("browser");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [userAgent, setUserAgent] = useState<string>("");

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
    displayModes.forEach(mode => {
      const mediaQuery = window.matchMedia(`(display-mode: ${mode.name})`);
      
      // Modern browsers use addEventListener
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          checkDisplayMode();
        }
      };
      
      mediaQuery.addEventListener("change", handleChange);
      
      // Cleanup
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    });
    
    // Listen for beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent Chrome 67+ from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
    });
    
    // Hide install button after app is installed
    window.addEventListener("appinstalled", () => {
      setDeferredPrompt(null);
    });
    
    // Also check when visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        checkDisplayMode();
      }
    });
  }, []);

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

  return {
    displayModes,
    currentMode,
    isInstallable: !!deferredPrompt,
    promptInstall,
    userAgent
  };
}
