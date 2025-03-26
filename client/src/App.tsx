import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import PWADetector from "@/pages/PWADetector";
import Entry from "@/pages/Entry";
import { useEffect } from "react";

// Dynamically set manifest based on path parameters
function ManifestHandler() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Set meta tag to disable caching, ensuring manifest updates promptly
    let noCacheMeta = document.querySelector('meta[http-equiv="Cache-Control"]');
    if (!noCacheMeta) {
      noCacheMeta = document.createElement('meta');
      noCacheMeta.setAttribute('http-equiv', 'Cache-Control');
      document.head.appendChild(noCacheMeta);
    }
    noCacheMeta.setAttribute('content', 'no-cache, no-store, must-revalidate');
    
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
    
    // Create new manifest links only for PWA pages
    if (location.startsWith('/standalone')) {
      const newLink = document.createElement('link');
      newLink.rel = 'manifest';
      newLink.href = `/manifests/standalone.json?v=${timestamp}`;
      document.head.appendChild(newLink);
      console.log('[ManifestHandler] Setting manifest to: /manifests/standalone.json');
    } 
    else if (location.startsWith('/minimal-ui')) {
      const newLink = document.createElement('link');
      newLink.rel = 'manifest';
      newLink.href = `/manifests/minimal-ui.json?v=${timestamp}`;
      document.head.appendChild(newLink);
      console.log('[ManifestHandler] Setting manifest to: /manifests/minimal-ui.json');
    }
    else if (location.startsWith('/fullscreen')) {
      const newLink = document.createElement('link');
      newLink.rel = 'manifest';
      newLink.href = `/manifests/fullscreen.json?v=${timestamp}`;
      document.head.appendChild(newLink);
      console.log('[ManifestHandler] Setting manifest to: /manifests/fullscreen.json');
    }
    else if (location.startsWith('/browser')) {
      const newLink = document.createElement('link');
      newLink.rel = 'manifest';
      newLink.href = `/manifests/browser.json?v=${timestamp}`;
      document.head.appendChild(newLink);
      console.log('[ManifestHandler] Setting manifest to: /manifests/browser.json');
    }
    else if (location.startsWith('/pwa/')) {
      // For compatibility with old PWA paths, set default manifest
      const newLink = document.createElement('link');
      newLink.rel = 'manifest';
      newLink.href = `/manifest.json?v=${timestamp}`;
      document.head.appendChild(newLink);
      console.log('[ManifestHandler] Setting default manifest: /manifest.json');
    }
    
    // Also clean up all manifest links when component unmounts
    return () => {
      const links = document.querySelectorAll('link[rel="manifest"]');
      links.forEach(link => link.parentNode?.removeChild(link));
    };
  }, [location]);
  
  return null;
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
      <ManifestHandler />
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
