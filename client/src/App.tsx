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
    // 移除所有现有的 manifest 链接元素，以确保浏览器重新加载
    const existingLinks = document.querySelectorAll('link[rel="manifest"]');
    existingLinks.forEach(link => {
      document.head.removeChild(link);
    });
    
    // 创建一个新的 manifest 链接元素
    const newLink = document.createElement('link');
    newLink.rel = 'manifest';
    
    // 为每个链接添加随机查询字符串，以防止缓存
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8);
    const cacheBuster = `?v=${timestamp}-${randomString}`;
    
    // 根据路径设置不同的 manifest
    if (location.startsWith('/standalone')) {
      newLink.href = `/manifests/standalone.json${cacheBuster}`;
      console.log('设置 manifest 为: /manifests/standalone.json');
    } 
    else if (location.startsWith('/minimal-ui')) {
      newLink.href = `/manifests/minimal-ui.json${cacheBuster}`;
      console.log('设置 manifest 为: /manifests/minimal-ui.json');
    }
    else if (location.startsWith('/fullscreen')) {
      newLink.href = `/manifests/fullscreen.json${cacheBuster}`;
      console.log('设置 manifest 为: /manifests/fullscreen.json');
    }
    else if (location.startsWith('/browser')) {
      newLink.href = `/manifests/browser.json${cacheBuster}`;
      console.log('设置 manifest 为: /manifests/browser.json');
    }
    else {
      // 如果是其他路径，设置默认 manifest
      newLink.href = `/manifest.json${cacheBuster}`;
      console.log('设置默认 manifest: /manifest.json');
    }
    
    // 添加新的链接元素到文档头
    document.head.appendChild(newLink);
    
    // 添加 meta 标签，告知浏览器应用可安装
    // 安卓设备
    let metaWebAppCapable = document.querySelector('meta[name="mobile-web-app-capable"]') as HTMLMetaElement;
    if (!metaWebAppCapable) {
      metaWebAppCapable = document.createElement('meta');
      metaWebAppCapable.name = 'mobile-web-app-capable';
      document.head.appendChild(metaWebAppCapable);
    }
    metaWebAppCapable.content = 'yes';
    
    // iOS 设备
    let metaAppleAppCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]') as HTMLMetaElement;
    if (!metaAppleAppCapable) {
      metaAppleAppCapable = document.createElement('meta');
      metaAppleAppCapable.name = 'apple-mobile-web-app-capable';
      document.head.appendChild(metaAppleAppCapable);
    }
    metaAppleAppCapable.content = 'yes';
    
    // 设置主题色，确保它与当前 manifest 一致
    let metaThemeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = '#3B82F6'; // 确保与 manifest 中的主题色一致
    
    // 更新文档标题以反映当前模式
    if (location !== '/') {
      const modeName = location.substring(1).charAt(0).toUpperCase() + location.substring(2);
      document.title = `PWA Mode - ${modeName}`;
    } else {
      document.title = 'PWA Mode Detector';
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
