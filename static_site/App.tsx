import React, { useEffect } from "react";
import { Switch, Route, Link, useLocation } from "wouter";
import Home from "../client/src/pages/Home";
import Entry from "../client/src/pages/Entry";
import PWADetector from "../client/src/pages/PWADetector";
import NotFound from "../client/src/pages/not-found";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../client/src/lib/queryClient";
import { Toaster } from "../client/src/components/ui/toaster";

// 处理不同路径的PWA清单
function ManifestHandler() {
  const [location] = useLocation();

  useEffect(() => {
    // 获取当前页面的manifest链接元素
    const existingManifest = document.querySelector('link[rel="manifest"]');

    // 根据当前路径确定应该使用哪个manifest
    let manifestPath = '/manifest.json'; // 默认manifest
    
    // 检查当前路径是否包含PWA模式路径
    if (location.includes('/pwa/')) {
      const mode = location.split('/pwa/')[1].trim();
      
      if (['standalone', 'minimal-ui', 'fullscreen', 'browser'].includes(mode)) {
        manifestPath = `/manifests/${mode}.json`;
      }
    }

    // 更新或创建manifest链接
    if (!existingManifest) {
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = manifestPath;
      document.head.appendChild(manifestLink);
    } else {
      // 移除现有manifest并添加新的
      existingManifest.remove();
      const newLink = document.createElement('link');
      newLink.rel = 'manifest';
      newLink.href = manifestPath;
      document.head.appendChild(newLink);
    }
    
    console.log(`PWA manifest updated to: ${manifestPath}`);
  }, [location]);

  return null;
}

// 路由组件
function Router() {
  return (
    <Switch>
      <Route path="/" component={Entry} />
      <Route path="/home" component={Home} />
      <Route path="/pwa/:display" component={PWADetector} />
      <Route component={NotFound} />
    </Switch>
  );
}

// 主应用组件
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