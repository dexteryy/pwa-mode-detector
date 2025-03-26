import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import PWADetector from "@/pages/PWADetector";
import Entry from "@/pages/Entry";
import { useEffect, useState, ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

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
    else {
      // 如果是其他路径，设置默认 manifest
      manifestLink.setAttribute('href', '/manifest.json');
      console.log('设置默认 manifest: /manifest.json');
    }
  }, [location]);
  
  return null;
}

// I18n初始化包装组件
function I18nProvider({ children }: { children: ReactNode }) {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);
  
  useEffect(() => {
    // 确保i18n已初始化完成
    if (i18n.isInitialized) {
      setIsI18nInitialized(true);
    } else {
      const handleInitialized = () => {
        setIsI18nInitialized(true);
      };
      
      i18n.on('initialized', handleInitialized);
      
      return () => {
        i18n.off('initialized', handleInitialized);
      };
    }
  }, []);
  
  if (!isI18nInitialized) {
    // 显示加载状态或返回null，等待i18n初始化
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
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
      <I18nProvider>
        <ManifestHandler />
        <Router />
        <Toaster />
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
