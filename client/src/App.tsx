import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import PWADetector from "@/pages/PWADetector";
import Entry from "@/pages/Entry";
import { useEffect, createContext, useState, ReactNode } from "react";

// Interface for manifest data
export interface WebAppManifest {
  name?: string;
  short_name?: string;
  start_url?: string;
  display?: string;
  background_color?: string;
  theme_color?: string;
  description?: string;
  icons?: Array<{
    src: string;
    sizes: string;
    type?: string;
    purpose?: string;
  }>;
  id?: string;
  scope?: string;
  [key: string]: any;  // Allow other possible properties
}

// Create context for manifest info
export interface ManifestContextType {
  manifestInfo: WebAppManifest | null;
  manifestUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export const ManifestContext = createContext<ManifestContextType>({
  manifestInfo: null,
  manifestUrl: null,
  isLoading: false,
  error: null
});

// Dynamically set manifest based on path parameters
function ManifestHandler({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [manifestInfo, setManifestInfo] = useState<WebAppManifest | null>(null);
  const [manifestUrl, setManifestUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Set meta tag to disable caching, ensuring manifest updates promptly
    let noCacheMeta = document.querySelector('meta[http-equiv="Cache-Control"]');
    if (!noCacheMeta) {
      noCacheMeta = document.createElement('meta');
      noCacheMeta.setAttribute('http-equiv', 'Cache-Control');
      document.head.appendChild(noCacheMeta);
    }
    noCacheMeta.setAttribute('content', 'no-cache, no-store, must-revalidate');
    
    // Reset state
    setManifestInfo(null);
    setManifestUrl(null);
    setError(null);
    
    // First remove all existing manifest links to ensure no duplicate manifests
    const existingLinks = document.querySelectorAll('link[rel="manifest"]');
    existingLinks.forEach(link => link.parentNode?.removeChild(link));
    
    // For entry page ('/') or any unspecified pages, don't add any manifest and exit early
    if (location === '/' || 
        (!location.startsWith('/standalone') && 
         !location.startsWith('/minimal-ui') && 
         !location.startsWith('/fullscreen') && 
         !location.startsWith('/browser') && 
         !location.startsWith('/pwa/'))) {
      console.log('[ManifestHandler] Root or unknown path detected, no manifest added');
      return;
    }
    
    // Add timestamp to prevent caching issues
    const timestamp = new Date().getTime();
    let url: string | null = null;
    
    // Determine correct manifest URL based on path
    if (location.startsWith('/standalone')) {
      url = `/manifests/standalone.json?v=${timestamp}`;
    } 
    else if (location.startsWith('/minimal-ui')) {
      url = `/manifests/minimal-ui.json?v=${timestamp}`;
    }
    else if (location.startsWith('/fullscreen')) {
      url = `/manifests/fullscreen.json?v=${timestamp}`;
    }
    else if (location.startsWith('/browser')) {
      url = `/manifests/browser.json?v=${timestamp}`;
      console.log("[ManifestHandler] Browser mode manifest path detected");
    }
    else if (location.startsWith('/pwa/')) {
      url = `/manifest.json?v=${timestamp}`;
    }
    
    // If we have a valid URL, create the link tag and fetch manifest data
    if (url) {
      setIsLoading(true);
      setManifestUrl(url);
      
      // Create new manifest link for PWA pages
      const newLink = document.createElement('link');
      newLink.rel = 'manifest';
      newLink.href = url;
      document.head.appendChild(newLink);
      console.log(`[ManifestHandler] Setting manifest to: ${url}`);
      
      // Fetch the manifest content
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch manifest: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('[ManifestHandler] Manifest data loaded', data);
          setManifestInfo(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('[ManifestHandler] Error loading manifest:', err);
          setError(err.message || 'Unknown error loading manifest');
          setIsLoading(false);
        });
    }
    
    // Also clean up all manifest links when component unmounts
    return () => {
      const links = document.querySelectorAll('link[rel="manifest"]');
      links.forEach(link => link.parentNode?.removeChild(link));
    };
  }, [location]);
  
  // Provide context value
  const contextValue: ManifestContextType = {
    manifestInfo,
    manifestUrl,
    isLoading,
    error
  };
  
  return (
    <ManifestContext.Provider value={contextValue}>
      {children}
    </ManifestContext.Provider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Entry} />
      <Route path="/standalone" component={PWADetector} />
      <Route path="/minimal-ui" component={PWADetector} />
      <Route path="/fullscreen" component={PWADetector} />
      <Route path="/browser" component={PWADetector} />
      <Route path="/pwa/:display" component={PWADetector} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ManifestHandler>
        <Router />
        <Toaster />
      </ManifestHandler>
    </QueryClientProvider>
  );
}

export default App;
