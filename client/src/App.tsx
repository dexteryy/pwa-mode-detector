import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import PWADetector from "@/pages/PWADetector";
import Entry from "@/pages/Entry";
import { useEffect } from "react";

// 根据路径参数动态设置 manifest
function ManifestHandler() {
  const [location] = useLocation();
  
  useEffect(() => {
    // 检查路径是否匹配 PWA 路径模式
    const match = location.match(/\/pwa\/([a-z-]+)/);
    
    if (match) {
      const displayMode = match[1];
      const manifestPath = `/manifests/${displayMode}.json`;
      
      // 更新 manifest 链接
      let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
      
      if (!manifestLink) {
        const newLink = document.createElement('link');
        newLink.rel = 'manifest';
        document.head.appendChild(newLink);
        manifestLink = newLink;
      }
      
      manifestLink.setAttribute('href', manifestPath);
      console.log(`设置 manifest 为: ${manifestPath}`);
    }
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Entry} />
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
