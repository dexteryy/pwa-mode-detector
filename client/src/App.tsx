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
    // 延迟一点执行，确保页面DOM完全加载
    const timer = setTimeout(async () => {
      try {
        console.log(`路由变化: ${location}, 正在加载适合的 manifest...`);
        
        // 移除所有现有的 manifest 链接元素
        const existingLinks = document.querySelectorAll('link[rel="manifest"]');
        existingLinks.forEach(link => {
          link.remove(); // 使用 remove() 更安全
        });
        
        // 获取对应模式的 manifest 内容
        let manifestContent: any = null;
        let manifestType = '';
        
        try {
          if (location.startsWith('/standalone')) {
            // 动态导入 manifest 文件内容
            const response = await fetch('/manifests/standalone.json');
            manifestContent = await response.json();
            manifestType = 'standalone';
          } 
          else if (location.startsWith('/minimal-ui')) {
            const response = await fetch('/manifests/minimal-ui.json');
            manifestContent = await response.json();
            manifestType = 'minimal-ui';
          }
          else if (location.startsWith('/fullscreen')) {
            const response = await fetch('/manifests/fullscreen.json');
            manifestContent = await response.json();
            manifestType = 'fullscreen';
          }
          else if (location.startsWith('/browser')) {
            const response = await fetch('/manifests/browser.json');
            manifestContent = await response.json();
            manifestType = 'browser';
          }
          else {
            // 默认 manifest
            const response = await fetch('/manifest.json');
            manifestContent = await response.json();
            manifestType = 'default';
          }
        } catch (error) {
          console.error('加载 manifest 文件失败:', error);
        }
        
        if (manifestContent) {
          // 添加时间戳以防止缓存问题
          manifestContent.updated_at = new Date().toISOString();
          
          // 创建一个 Blob URL
          const manifestBlob = new Blob(
            [JSON.stringify(manifestContent)],
            { type: 'application/json' }
          );
          const manifestBlobUrl = URL.createObjectURL(manifestBlob);
          
          // 创建一个新的 manifest 链接元素
          const newLink = document.createElement('link');
          newLink.id = `manifest-${manifestType}`;
          newLink.rel = 'manifest';
          newLink.href = manifestBlobUrl;
          
          // 添加新的链接元素到文档头
          document.head.appendChild(newLink);
          console.log(`成功加载并应用 ${manifestType} manifest`);
          
          // 记录清理 URL 的函数
          const cleanupBlobUrl = () => {
            URL.revokeObjectURL(manifestBlobUrl);
          };
          
          // 当页面卸载时清理 Blob URL 以防止内存泄漏
          window.addEventListener('unload', cleanupBlobUrl, { once: true });
        }
        
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
        
        // 强制浏览器重新检查 PWA 安装能力
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            if (registrations.length) {
              console.log('发现 Service Worker 注册，重新触发 PWA 检测...');
            }
          }).catch(err => console.error('无法检查 Service Worker 状态:', err));
        }
        
        // 更新文档标题以反映当前模式
        if (location !== '/') {
          const modeName = location.substring(1).charAt(0).toUpperCase() + location.substring(2);
          document.title = `PWA Mode - ${modeName}`;
        } else {
          document.title = 'PWA Mode Detector';
        }
      } catch (error) {
        console.error('应用 manifest 时出错:', error);
      }
    }, 100); // 添加100ms延迟以确保DOM已更新
    
    return () => clearTimeout(timer);
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
