import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import PWADetector from "@/pages/PWADetector";
import Entry from "@/pages/Entry";
import { useEffect, createContext, useState, useRef, ReactNode } from "react";

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
  const [currentManifestPath, setCurrentManifestPath] = useState<string | null>(null);
  
  // Use useRef to track manifest request status, preventing duplicate requests
  const manifestRequested = useRef<Record<string, boolean>>({});
  
  // Cleanup when component mounts and unmounts
  useEffect(() => {
    // Remove meta tags that might prevent caching
    const noCacheMeta = document.querySelector('meta[http-equiv="Cache-Control"]');
    if (noCacheMeta) {
      noCacheMeta.parentNode?.removeChild(noCacheMeta);
    }
    
    // Cleanup function - executes when component unmounts
    return () => {
      const links = document.querySelectorAll('link[rel="manifest"]');
      links.forEach(link => link.parentNode?.removeChild(link));
    };
  }, []); // Empty dependency array means this runs only on mount and unmount
  
  // Handle manifest loading when path changes
  useEffect(() => {
    
    // Build base URL
    let baseUrl: string | null = null;
    let exactPathMatch = false;
    
    // Get exact path match
    const pathWithoutParams = location.split('?')[0];
    
    // For entry page, no manifest is needed
    if (location === '/') {
      
      // If there's a previous manifest link, remove it
      const existingManifestLink = document.querySelector('link[rel="manifest"]');
      if (existingManifestLink) {
        existingManifestLink.parentNode?.removeChild(existingManifestLink);
      }
      
      // Only update state if changes are needed, avoid unnecessary rendering
      if (currentManifestPath || manifestInfo || manifestUrl) {
        setCurrentManifestPath(null);
        setManifestInfo(null);
        setManifestUrl(null);
      }
      
      // Reset request tracking state
      manifestRequested.current = {};
      
      return;
    }
    
    // Determine the correct manifest URL based on exact path
    if (pathWithoutParams === '/standalone') {
      baseUrl = '/manifests/standalone.json';
      exactPathMatch = true;
    } 
    else if (pathWithoutParams === '/minimal-ui') {
      baseUrl = '/manifests/minimal-ui.json';
      exactPathMatch = true;
    }
    else if (pathWithoutParams === '/fullscreen') {
      baseUrl = '/manifests/fullscreen.json';
      exactPathMatch = true;
    }
    else if (pathWithoutParams === '/browser') {
      // Special mode - displayed as browser, should not be installed
      baseUrl = '/manifests/browser.json';
      exactPathMatch = true;
    }
    
    // If path is unclear and doesn't exactly match a manifest, skip loading
    if (!exactPathMatch) {
      return;
    }
    
    // Optimization: If it's the same manifest and data is already loaded, use cache
    if (baseUrl === currentManifestPath && manifestInfo) {
      return;
    }
    
    // If this manifest has already been requested, wait for its response instead of requesting again
    if (baseUrl && manifestRequested.current[baseUrl]) {
      return;
    }
    
    // Reset error state
    setError(null);
    
    // If there's a valid URL, create a link tag and fetch manifest data
    if (baseUrl) {
      // Mark this manifest as requested
      manifestRequested.current[baseUrl] = true;
      
      // URL without adding timestamp
      const url = baseUrl;
      
      setIsLoading(true);
      setManifestUrl(url);
      setCurrentManifestPath(baseUrl);
      
      // Check existing manifest link
      const existingManifestLink = document.querySelector('link[rel="manifest"]');
      
      // If there's already the same link, don't make any changes
      if (existingManifestLink && existingManifestLink.getAttribute('href') === url) {
        // Link is already set
      } else {
        // Create new manifest link
        const newLink = document.createElement('link');
        newLink.rel = 'manifest';
        newLink.href = url;
        
        // If there's an old link, replace it; otherwise add the new link directly
        if (existingManifestLink) {
          document.head.replaceChild(newLink, existingManifestLink);
        } else {
          document.head.appendChild(newLink);
        }
      }
      
      // Add request timeout protection
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      // Fetch manifest data from server (allow browser caching)
      fetch(url, { signal: controller.signal })
        .then(response => {
          clearTimeout(timeoutId);
          if (!response.ok) {
            throw new Error(`Failed to fetch manifest: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (!data || Object.keys(data).length === 0) {
            throw new Error('Manifest data is empty');
          }
          setManifestInfo(data);
          setIsLoading(false);
        })
        .catch(err => {
          if (err.name === 'AbortError') {
            setError('Request timeout');
          } else {
            setError(err.message || 'Unknown error loading manifest');
          }
          setIsLoading(false);
          
          // If fetch fails, reset request flag so we can try again
          delete manifestRequested.current[baseUrl];
        });
    }
  }, [location, currentManifestPath]);
  
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
