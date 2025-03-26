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
    // 先移除所有现有的 manifest 链接，确保没有多余的 manifest
    const existingLinks = document.querySelectorAll('link[rel="manifest"]');
    existingLinks.forEach(link => link.remove());
    
    // 为 PWA 页面创建新的 manifest 链接
    if (location.startsWith('/standalone')) {
      const newLink = document.createElement('link');
      newLink.rel = 'manifest';
      newLink.href = '/manifests/standalone.json';
      document.head.appendChild(newLink);
      console.log('设置 manifest 为: /manifests/standalone.json');
    } 
    else if (location.startsWith('/minimal-ui')) {
      const newLink = document.createElement('link');
      newLink.rel = 'manifest';
      newLink.href = '/manifests/minimal-ui.json';
      document.head.appendChild(newLink);
      console.log('设置 manifest 为: /manifests/minimal-ui.json');
    }
    else if (location.startsWith('/fullscreen')) {
      const newLink = document.createElement('link');
      newLink.rel = 'manifest';
      newLink.href = '/manifests/fullscreen.json';
      document.head.appendChild(newLink);
      console.log('设置 manifest 为: /manifests/fullscreen.json');
    }
    else if (location.startsWith('/browser')) {
      const newLink = document.createElement('link');
      newLink.rel = 'manifest';
      newLink.href = '/manifests/browser.json';
      document.head.appendChild(newLink);
      console.log('设置 manifest 为: /manifests/browser.json');
    }
    else if (location.startsWith('/pwa/')) {
      // 兼容旧的PWA路径，设置默认 manifest
      const newLink = document.createElement('link');
      newLink.rel = 'manifest';
      newLink.href = '/manifest.json';
      document.head.appendChild(newLink);
      console.log('设置默认 manifest: /manifest.json');
    } else {
      // 如果是入口页面或其他非PWA页面，不添加任何 manifest
      console.log('没有添加 manifest 链接（非PWA页面）');
    }
    
    // 组件卸载时也清理所有 manifest 链接
    return () => {
      const links = document.querySelectorAll('link[rel="manifest"]');
      links.forEach(link => link.remove());
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
