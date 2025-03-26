import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import PWADetector from "@/pages/PWADetector";
import Entry from "@/pages/Entry";
import { useEffect, createContext, useState, useRef, ReactNode } from "react";

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
  const [currentManifestPath, setCurrentManifestPath] = useState<string | null>(null);
  
  // 使用useRef跟踪manifest请求状态，避免重复请求
  const manifestRequested = useRef<Record<string, boolean>>({});
  
  // 组件挂载和卸载时的清理
  useEffect(() => {
    // 移除可能阻止缓存的meta标签
    const noCacheMeta = document.querySelector('meta[http-equiv="Cache-Control"]');
    if (noCacheMeta) {
      noCacheMeta.parentNode?.removeChild(noCacheMeta);
      console.log('[ManifestHandler] Removed no-cache meta tag to allow caching');
    }
    
    // 清理函数 - 当组件卸载时执行
    return () => {
      const links = document.querySelectorAll('link[rel="manifest"]');
      links.forEach(link => link.parentNode?.removeChild(link));
      console.log('[ManifestHandler] Cleanup on unmount: removed all manifest links');
    };
  }, []); // 空依赖数组表示仅在挂载和卸载时执行
  
  // 处理路径变化时的manifest加载
  useEffect(() => {
    
    // 构建基础URL
    let baseUrl: string | null = null;
    let exactPathMatch = false;
    
    // 获取精确路径匹配
    const pathWithoutParams = location.split('?')[0];
    
    console.log(`[ManifestHandler] 处理路径: ${pathWithoutParams}`);
    
    // 对于入口页面，不需要manifest
    if (location === '/') {
      console.log('[ManifestHandler] 检测到入口页面，无需manifest');
      
      // 如果之前有manifest链接，移除它
      const existingManifestLink = document.querySelector('link[rel="manifest"]');
      if (existingManifestLink) {
        existingManifestLink.parentNode?.removeChild(existingManifestLink);
        console.log('[ManifestHandler] 从文档中移除了manifest链接');
      }
      
      // 只有在状态需要更改时才更新状态，避免不必要的渲染
      if (currentManifestPath || manifestInfo || manifestUrl) {
        setCurrentManifestPath(null);
        setManifestInfo(null);
        setManifestUrl(null);
        console.log('[ManifestHandler] 重置了入口页面的manifest状态');
      }
      
      // 重置请求跟踪状态
      manifestRequested.current = {};
      
      return;
    }
    
    // 根据精确路径确定正确的manifest URL
    if (pathWithoutParams === '/standalone') {
      baseUrl = '/manifests/standalone.json';
      exactPathMatch = true;
    } 
    else if (pathWithoutParams === '/minimal-ui') {
      baseUrl = '/manifests/minimal-ui.json';
      exactPathMatch = true;
    }
    else if (pathWithoutParams === '/fullscreen') {
      baseUrl = '/manifests/fullscreen.json';
      exactPathMatch = true;
    }
    else if (pathWithoutParams === '/browser') {
      // 特殊模式 - 显示为浏览器，不应被安装
      baseUrl = '/manifests/browser.json';
      exactPathMatch = true;
      console.log("[ManifestHandler] 检测到浏览器模式manifest路径 (display:browser)");
    }
    
    // 如果路径不明确且不精确匹配manifest，则跳过加载
    if (!exactPathMatch) {
      console.log(`[ManifestHandler] 路径 ${pathWithoutParams} 未被识别为有效的PWA路径，跳过manifest`);
      return;
    }
    
    // 优化：如果是同一个manifest并且已经加载过数据，直接使用缓存
    if (baseUrl === currentManifestPath && manifestInfo) {
      console.log(`[ManifestHandler] manifest已经为 ${baseUrl} 加载，使用缓存数据`);
      return;
    }
    
    // 如果这个manifest已经被请求过，等待其响应而不是再次请求
    if (baseUrl && manifestRequested.current[baseUrl]) {
      console.log(`[ManifestHandler] 已经请求过manifest: ${baseUrl}，等待响应中`);
      return;
    }
    
    // 重置错误状态
    setError(null);
    
    // 如果有有效的URL，创建link标签并获取manifest数据
    if (baseUrl) {
      // 标记该manifest为已请求
      manifestRequested.current[baseUrl] = true;
      
      // URL不添加时间戳
      const url = baseUrl;
      
      setIsLoading(true);
      setManifestUrl(url);
      setCurrentManifestPath(baseUrl);
      
      // 检查现有的manifest链接
      const existingManifestLink = document.querySelector('link[rel="manifest"]');
      
      // 如果已经有相同的链接，则不做任何改变
      if (existingManifestLink && existingManifestLink.getAttribute('href') === url) {
        console.log(`[ManifestHandler] Manifest链接已经设置为${url}，无需更改`);
      } else {
        // 创建新的manifest链接
        const newLink = document.createElement('link');
        newLink.rel = 'manifest';
        newLink.href = url;
        
        // 如果有旧的链接，替换它；否则直接添加新链接
        if (existingManifestLink) {
          document.head.replaceChild(newLink, existingManifestLink);
        } else {
          document.head.appendChild(newLink);
        }
        console.log(`[ManifestHandler] 设置manifest链接为: ${url}`);
      }
      
      // 添加请求超时保护
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时
      
      // 从服务器获取 manifest 数据（允许浏览器缓存）
      console.log(`[ManifestHandler] 正在获取manifest: ${url}`);
      
      fetch(url, { signal: controller.signal })
        .then(response => {
          clearTimeout(timeoutId);
          if (!response.ok) {
            console.error(`[ManifestHandler] 服务器返回状态码 ${response.status}`);
            throw new Error(`获取manifest失败: ${response.status}`);
          }
          console.log(`[ManifestHandler] Manifest获取成功，正在解析JSON...`);
          return response.json();
        })
        .then(data => {
          console.log('[ManifestHandler] Manifest数据已加载:', data);
          if (!data || Object.keys(data).length === 0) {
            throw new Error('Manifest数据为空');
          }
          setManifestInfo(data);
          setIsLoading(false);
        })
        .catch(err => {
          if (err.name === 'AbortError') {
            console.error('[ManifestHandler] 获取请求超时');
            setError('请求超时');
          } else {
            console.error('[ManifestHandler] 加载manifest时出错:', err);
            setError(err.message || '加载manifest时出现未知错误');
          }
          setIsLoading(false);
          
          // 如果获取失败，重置请求标记以便可以再次尝试
          delete manifestRequested.current[baseUrl];
        });
    }
  }, [location, currentManifestPath]);
  
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
