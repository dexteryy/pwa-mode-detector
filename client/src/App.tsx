import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import PWADetector from "@/pages/PWADetector";
import Entry from "@/pages/Entry";
import { useEffect, useState } from "react";

// 根据路径参数动态设置 manifest
function ManifestHandler() {
  const [location] = useLocation();
  
  // 当用户导航到新页面时执行
  useEffect(() => {
    // 设置多种禁止缓存的meta标签
    const metaTags = [
      { 'http-equiv': 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
      { 'http-equiv': 'Pragma', content: 'no-cache' },
      { 'http-equiv': 'Expires', content: '0' }
    ];
    
    metaTags.forEach(meta => {
      let metaTag = document.querySelector(`meta[http-equiv="${meta['http-equiv']}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('http-equiv', meta['http-equiv']);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', meta.content);
    });
    
    // 彻底清除所有manifest链接
    const existingLinks = document.querySelectorAll('link[rel="manifest"]');
    existingLinks.forEach(link => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    });
    
    // 添加强随机性，确保不会重用缓存
    const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const timestamp = new Date().getTime();
    
    // 为 PWA 页面创建新的 manifest 链接
    if (location.startsWith('/standalone')) {
      const newLink = document.createElement('link');
      newLink.rel = 'manifest';
      newLink.href = `/manifests/standalone.json?v=${timestamp}-${randomId}`;
      document.head.appendChild(newLink);
      console.log('设置 manifest 为: /manifests/standalone.json');
    } 
    else if (location.startsWith('/minimal-ui')) {
      const newLink = document.createElement('link');
      newLink.rel = 'manifest';
      newLink.href = `/manifests/minimal-ui.json?v=${timestamp}-${randomId}`;
      document.head.appendChild(newLink);
      console.log('设置 manifest 为: /manifests/minimal-ui.json');
    }
    else if (location.startsWith('/fullscreen')) {
      const newLink = document.createElement('link');
      newLink.rel = 'manifest';
      newLink.href = `/manifests/fullscreen.json?v=${timestamp}-${randomId}`;
      document.head.appendChild(newLink);
      console.log('设置 manifest 为: /manifests/fullscreen.json');
    }
    else if (location.startsWith('/browser')) {
      const newLink = document.createElement('link');
      newLink.rel = 'manifest';
      newLink.href = `/manifests/browser.json?v=${timestamp}-${randomId}`;
      document.head.appendChild(newLink);
      console.log('设置 manifest 为: /manifests/browser.json');
    }
    else if (location.startsWith('/pwa/')) {
      // 兼容旧的PWA路径，设置默认 manifest
      const newLink = document.createElement('link');
      newLink.rel = 'manifest';
      newLink.href = `/manifest.json?v=${timestamp}-${randomId}`;
      document.head.appendChild(newLink);
      console.log('设置默认 manifest: /manifest.json');
    } else {
      // 如果是入口页面或其他非PWA页面，不添加任何 manifest
      console.log('没有添加 manifest 链接（非PWA页面）');
    }
    
    // 组件卸载时也清理所有 manifest 链接
    return () => {
      const links = document.querySelectorAll('link[rel="manifest"]');
      links.forEach(link => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
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
