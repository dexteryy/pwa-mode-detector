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
  const [currentManifestPath, setCurrentManifestPath] = useState<string | null>(null);
  
  // Set up no-cache meta tag only once at component mount
  useEffect(() => {
    // Set meta tag to disable caching, ensuring manifest updates promptly
    let noCacheMeta = document.querySelector('meta[http-equiv="Cache-Control"]');
    if (!noCacheMeta) {
      noCacheMeta = document.createElement('meta');
      noCacheMeta.setAttribute('http-equiv', 'Cache-Control');
      noCacheMeta.setAttribute('content', 'no-cache, no-store, must-revalidate');
      document.head.appendChild(noCacheMeta);
      console.log('[ManifestHandler] Added no-cache meta tag');
    }
    
    // Clean up all manifest links when component unmounts completely
    return () => {
      const links = document.querySelectorAll('link[rel="manifest"]');
      links.forEach(link => link.parentNode?.removeChild(link));
      console.log('[ManifestHandler] Cleanup on unmount: removed all manifest links');
    };
  }, []); // Empty dependency array means this runs once on mount
  
  // Handle manifest changes when location changes
  useEffect(() => {
    // Construct the base URL without timestamp
    let baseUrl: string | null = null;
    let exactPathMatch = false;
    
    // Get exact path for precise matching
    const pathWithoutParams = location.split('?')[0];
    
    // Log for debugging
    console.log(`[ManifestHandler] Processing path: ${pathWithoutParams}`);
    
    // For entry page ('/') only, don't add any manifest and exit early
    if (location === '/') {
      console.log('[ManifestHandler] Entry page detected, no manifest needed');
      
      // If we previously had a manifest, clean it up
      if (currentManifestPath) {
        const existingLinks = document.querySelectorAll('link[rel="manifest"]');
        existingLinks.forEach(link => link.parentNode?.removeChild(link));
        setCurrentManifestPath(null);
        setManifestInfo(null);
        setManifestUrl(null);
      }
      return;
    }
    
    // Determine correct manifest URL based on exact path
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
      // Special mode for browser display - should NOT be installed
      baseUrl = '/manifests/browser.json';
      exactPathMatch = true;
      console.log("[ManifestHandler] Browser mode manifest path detected (display:browser)");
    }
    
    // Skip loading if path is ambiguous and doesn't exactly match a manifest
    if (!exactPathMatch) {
      console.log(`[ManifestHandler] Path ${pathWithoutParams} is not recognized as a valid PWA path, skipping manifest`);
      return;
    }
    
    // Skip if this is the same manifest we're already using
    if (baseUrl === currentManifestPath) {
      console.log(`[ManifestHandler] Manifest already set to ${baseUrl}, skipping reload`);
      return;
    }
    
    // Clean up existing manifest if we're changing to a new one
    const existingLinks = document.querySelectorAll('link[rel="manifest"]');
    if (existingLinks.length > 0) {
      console.log(`[ManifestHandler] Removing ${existingLinks.length} existing manifest links`);
      existingLinks.forEach(link => link.parentNode?.removeChild(link));
    }
    
    // Reset state for new manifest loading
    setManifestInfo(null);
    setError(null);
    
    // If we have a valid URL, create the link tag and fetch manifest data
    if (baseUrl) {
      // Add timestamp to prevent caching issues
      const timestamp = new Date().getTime();
      const url = `${baseUrl}?v=${timestamp}`;
      
      setIsLoading(true);
      setManifestUrl(url);
      setCurrentManifestPath(baseUrl);
      
      // Create new manifest link for PWA pages
      const newLink = document.createElement('link');
      newLink.rel = 'manifest';
      newLink.href = url;
      document.head.appendChild(newLink);
      console.log(`[ManifestHandler] Setting manifest to: ${url}`);
      
      // 直接获取实际的manifest文件路径，而不是使用带时间戳的URL
      // 这样可以避免重定向导致的fetch问题
      const actualManifestPath = baseUrl; // 例如 /manifests/standalone.json
      console.log(`[ManifestHandler] Fetching manifest directly from: ${actualManifestPath}`);
      
      fetch(actualManifestPath)
        .then(response => {
          console.log(`[ManifestHandler] Fetch response status: ${response.status}, ${response.statusText}`);
          console.log(`[ManifestHandler] Response headers:`, 
            Array.from(response.headers.entries()).map(([key, value]) => `${key}: ${value}`).join(', '));
          
          if (!response.ok) {
            throw new Error(`Failed to fetch manifest: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('[ManifestHandler] Manifest data loaded:', JSON.stringify(data));
          setManifestInfo(data); // 显式地更新状态
          setIsLoading(false);
          
          // 确认状态更新后的结果
          setTimeout(() => {
            console.log('[ManifestHandler] State after update, manifestInfo:', manifestInfo);
          }, 100);
        })
        .catch(err => {
          console.error('[ManifestHandler] Error loading manifest:', err);
          setError(err.message || 'Unknown error loading manifest');
          setIsLoading(false);
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
