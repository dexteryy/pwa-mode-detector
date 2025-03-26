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
  
  useEffect(() => {
    // Set meta tag to disable caching, ensuring manifest updates promptly
    let noCacheMeta = document.querySelector('meta[http-equiv="Cache-Control"]');
    if (!noCacheMeta) {
      noCacheMeta = document.createElement('meta');
      noCacheMeta.setAttribute('http-equiv', 'Cache-Control');
      document.head.appendChild(noCacheMeta);
    }
    noCacheMeta.setAttribute('content', 'no-cache, no-store, must-revalidate');
    
    // Reset state
    setManifestInfo(null);
    setManifestUrl(null);
    setError(null);
    
    // ======== 修复manifest加载问题 ========
    // 为了彻底解决manifest冲突问题，我们需要多种技术结合
    
    // 1. 禁用索引数据库缓存（可能存储了manifest）
    try {
      // 清除indexedDB缓存，其中可能存储了manifest
      indexedDB.deleteDatabase('manifest-store');
      if ('caches' in window) {
        // 清除服务工作者缓存，可能包含manifest
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            if (cacheName.includes('manifest')) {
              caches.delete(cacheName);
            }
          });
        });
      }
    } catch (e) {
      console.log('[ManifestHandler] Error clearing caches:', e);
    }
    
    // 2. 添加禁用默认manifest的meta标签
    let disableDefaultMeta = document.querySelector('meta[name="disabled-manifest"]');
    if (!disableDefaultMeta) {
      disableDefaultMeta = document.createElement('meta');
      disableDefaultMeta.setAttribute('name', 'disabled-manifest');
      document.head.appendChild(disableDefaultMeta);
    }
    disableDefaultMeta.setAttribute('content', 'true');
    
    // 3. 添加特殊非标准meta标签，某些浏览器会识别这个
    let disablePwaStorageMeta = document.querySelector('meta[name="pwa-storage-disabled"]');
    if (!disablePwaStorageMeta) {
      disablePwaStorageMeta = document.createElement('meta');
      disablePwaStorageMeta.setAttribute('name', 'pwa-storage-disabled');
      disablePwaStorageMeta.setAttribute('content', 'true');
      document.head.appendChild(disablePwaStorageMeta);
    }
    
    // 4. 在添加新manifest前彻底清除所有旧的manifest链接，无论它们来自哪里
    const existingLinks = document.querySelectorAll('link[rel="manifest"]');
    existingLinks.forEach(link => {
      console.log(`[ManifestHandler] Removing existing manifest link: ${link.getAttribute('href')}`);
      link.parentNode?.removeChild(link);
    });
    
    // 5. 创建一个元素拦截器，全面阻止浏览器自动加载默认manifest
    const originalCreateElement = document.createElement;
    const hookedCreateElement = function(tagName: string, ...args: any[]): HTMLElement {
      const element = originalCreateElement.call(document, tagName, ...args);
      if (tagName.toLowerCase() === 'link') {
        // 监听元素属性变化
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function(name: string, value: string) {
          if (name === 'rel' && value === 'manifest') {
            const href = element.getAttribute('href');
            const currentPath = window.location.pathname;
            // 检查是否匹配当前路径的manifest
            const isPathMatch = 
              (href?.includes('standalone') && currentPath.includes('standalone')) ||
              (href?.includes('minimal-ui') && currentPath.includes('minimal-ui')) || 
              (href?.includes('fullscreen') && currentPath.includes('fullscreen')) ||
              (href?.includes('browser') && currentPath.includes('browser'));
            
            // 只允许与当前路径匹配的manifest
            if (!isPathMatch && href === '/manifest.json') {
              console.log('[ManifestHandler] Prevented loading of incorrect manifest:', href);
              // 不设置rel="manifest"属性，使其失效
              return;
            }
          }
          return originalSetAttribute.call(element, name, value);
        };
        
        // 拦截href属性设置
        const originalHrefDescriptor = Object.getOwnPropertyDescriptor(element, 'href');
        if (originalHrefDescriptor && originalHrefDescriptor.set) {
          Object.defineProperty(element, 'href', {
            set(value) {
              // 如果尝试设置默认manifest且当前不是对应路径，则阻止
              if (value === '/manifest.json' && element.getAttribute('rel') === 'manifest') {
                console.log('[ManifestHandler] Blocked setting href to default manifest');
                return;
              }
              originalHrefDescriptor.set.call(this, value);
            },
            get: originalHrefDescriptor.get
          });
        }
      }
      return element;
    };
    
    // 短暂替换createElement方法以拦截可能的manifest加载
    document.createElement = hookedCreateElement as any;
    // 然后在短时间后恢复
    setTimeout(() => {
      document.createElement = originalCreateElement;
      console.log('[ManifestHandler] Restored original createElement');
    }, 2000); // 延长时间确保所有初始化完成
    
    // 重置title元素，避免它被PWA缓存
    document.title = location.startsWith('/browser') 
      ? "PWA Mode Detector - Browser" 
      : location.startsWith('/standalone') 
        ? "PWA Mode Detector - Standalone"
        : location.startsWith('/minimal-ui')
          ? "PWA Mode Detector - Minimal UI"
          : location.startsWith('/fullscreen')
            ? "PWA Mode Detector - Fullscreen"
            : "PWA Mode Detector";
    
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
    let url: string | null = null;
    
    // Determine correct manifest URL based on path
    if (location.startsWith('/standalone')) {
      url = `/manifests/standalone.json?v=${timestamp}`;
      console.log("[ManifestHandler] Standalone mode manifest path detected");
    } 
    else if (location.startsWith('/minimal-ui')) {
      url = `/manifests/minimal-ui.json?v=${timestamp}`;
      console.log("[ManifestHandler] Minimal-UI mode manifest path detected");
    }
    else if (location.startsWith('/fullscreen')) {
      url = `/manifests/fullscreen.json?v=${timestamp}`;
      console.log("[ManifestHandler] Fullscreen mode manifest path detected");
    }
    else if (location.startsWith('/browser')) {
      url = `/manifests/browser.json?v=${timestamp}`;
      console.log("[ManifestHandler] Browser mode manifest path detected");
    }
    else if (location.startsWith('/pwa/')) {
      url = `/manifest.json?v=${timestamp}`;
      console.log("[ManifestHandler] Generic PWA mode manifest path detected");
    }
    
    // If we have a valid URL, create the link tag and fetch manifest data
    if (url) {
      setIsLoading(true);
      setManifestUrl(url);
      
      // 创建一个唯一的ID属性，便于后续调试和查找
      const manifestId = `manifest-${location.split('/')[1]}-${timestamp}`;
      
      // Create new manifest link for PWA pages
      const newLink = document.createElement('link');
      newLink.rel = 'manifest';
      newLink.href = url;
      newLink.id = manifestId; // 添加唯一ID方便调试
      document.head.appendChild(newLink);
      console.log(`[ManifestHandler] Setting manifest to: ${url} with ID: ${manifestId}`);
      
      // 解决manifest加载问题，多次重试且增加超时处理
      const maxRetries = 3;  // 最大重试次数
      const retryDelay = 500; // 每次重试间隔（毫秒）
      
      // 创建重试获取函数
      const fetchWithRetry = async (url: string, attempt = 1): Promise<any> => {
        try {
          // 添加随机参数确保不使用缓存
          const cacheBustUrl = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
          console.log(`[ManifestHandler] Fetching manifest (attempt ${attempt}): ${cacheBustUrl}`);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒超时
          
          const response = await fetch(cacheBustUrl, { 
            signal: controller.signal,
            headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch manifest: ${response.status}`);
          }
          
          const data = await response.json();
          return data;
        } catch (err: any) {
          // 如果还有重试次数，则进行重试
          if (attempt < maxRetries) {
            console.log(`[ManifestHandler] Retry ${attempt}/${maxRetries} after error: ${err.message}`);
            return new Promise(resolve => {
              setTimeout(() => resolve(fetchWithRetry(url, attempt + 1)), retryDelay);
            });
          }
          
          // 用完重试次数，抛出最终错误
          throw err;
        }
      };
      
      // 开始获取manifest
      fetchWithRetry(url)
        .then(data => {
          console.log('[ManifestHandler] Manifest data loaded', data);
          setManifestInfo(data);
          setIsLoading(false);
          
          // 确保manifest已成功加载后，主动验证是否所有标签页都正确设置了manifest信息
          // 这样ManifestViewer组件可以立即显示内容
          setTimeout(() => {
            if (data && !manifestInfo) {
              console.log('[ManifestHandler] Ensuring manifest info is updated...');
              setManifestInfo(data);
            }
          }, 500);
        })
        .catch(err => {
          console.error('[ManifestHandler] Error loading manifest:', err);
          setError(err.message || 'Unknown error loading manifest');
          setIsLoading(false);
          
          // 如果出错，一秒后尝试最后一次获取
          setTimeout(() => {
            console.log('[ManifestHandler] Final attempt to load manifest...');
            fetch(url)
              .then(response => response.json())
              .then(data => {
                console.log('[ManifestHandler] Final manifest load succeeded');
                setManifestInfo(data);
                setError(null);
              })
              .catch(finalErr => {
                console.error('[ManifestHandler] Final manifest load failed', finalErr);
              });
          }, 1000);
        });
    }
    
    // Also clean up all manifest links when component unmounts
    return () => {
      const links = document.querySelectorAll('link[rel="manifest"]');
      links.forEach(link => {
        console.log(`[ManifestHandler] Cleanup: removing manifest link: ${link.getAttribute('href')}`);
        link.parentNode?.removeChild(link);
      });
    };
  }, [location]);
  
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
      <Route path="/pwa/:display" component={PWADetector} />
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
