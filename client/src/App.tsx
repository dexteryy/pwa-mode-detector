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
    // 获取或创建 manifest 链接元素
    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (!manifestLink) {
      const newLink = document.createElement('link');
      newLink.rel = 'manifest';
      document.head.appendChild(newLink);
      manifestLink = newLink;
    }
    
    // 根据路径设置不同的manifest
    if (location.startsWith('/standalone')) {
      manifestLink.setAttribute('href', '/manifests/standalone.json');
      console.log('设置 manifest 为: /manifests/standalone.json');
    } 
    else if (location.startsWith('/minimal-ui')) {
      manifestLink.setAttribute('href', '/manifests/minimal-ui.json');
      console.log('设置 manifest 为: /manifests/minimal-ui.json');
    }
    else if (location.startsWith('/fullscreen')) {
      manifestLink.setAttribute('href', '/manifests/fullscreen.json');
      console.log('设置 manifest 为: /manifests/fullscreen.json');
    }
    else if (location.startsWith('/browser')) {
      manifestLink.setAttribute('href', '/manifests/browser.json');
      console.log('设置 manifest 为: /manifests/browser.json');
    }
    else if (location.startsWith('/pwa/')) {
      // 兼容旧的PWA路径，设置默认 manifest
      manifestLink.setAttribute('href', '/manifest.json');
      console.log('设置默认 manifest: /manifest.json');
    } else {
      // 如果是入口页面或其他非PWA页面，移除manifest链接
      manifestLink.remove();
      console.log('移除 manifest 链接（非PWA页面）');
    }
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
