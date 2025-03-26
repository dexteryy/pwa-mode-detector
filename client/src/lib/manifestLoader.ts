/**
 * 增强版 Manifest 加载管理器
 * 
 * 此模块负责管理 manifest 的加载，通过多重缓存机制确保在整个会话中
 * 只发送一次网络请求来获取 manifest。使用 sessionStorage 来持久化
 * manifest 数据，跨页面/刷新保持缓存。
 */

// 用于 sessionStorage 的键名
const MANIFEST_CACHE_KEY = 'pwa_manifest_cache';
const MANIFEST_TIMESTAMP_KEY = 'pwa_manifest_timestamp';
// 缓存有效期 (毫秒) - 设置为 5 分钟
const CACHE_TTL = 5 * 60 * 1000;

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
  [key: string]: any;  // 允许其他可能的属性
}

// 全局变量来存储当前的加载状态
type LoadingState = 'idle' | 'loading' | 'loaded' | 'error';
interface LoadState {
  state: LoadingState;
  manifest: WebAppManifest | null;
  error: string | null;
  lastLoaded: number; // 时间戳，用于判断缓存新鲜度
}

// 从 sessionStorage 初始化状态
const initializeState = (): LoadState => {
  try {
    const cachedManifestJson = sessionStorage.getItem(MANIFEST_CACHE_KEY);
    const cachedTimestamp = sessionStorage.getItem(MANIFEST_TIMESTAMP_KEY);
    
    if (cachedManifestJson && cachedTimestamp) {
      const cachedManifest = JSON.parse(cachedManifestJson);
      const timestamp = parseInt(cachedTimestamp, 10);
      const now = Date.now();
      
      // 检查缓存是否仍然有效
      if (now - timestamp < CACHE_TTL) {
        console.log('[ManifestLoader] 使用 sessionStorage 中的缓存');
        return {
          state: 'loaded',
          manifest: cachedManifest,
          error: null,
          lastLoaded: timestamp
        };
      } else {
        console.log('[ManifestLoader] sessionStorage 中的缓存已过期');
      }
    }
  } catch (e) {
    console.warn('[ManifestLoader] 读取 sessionStorage 失败:', e);
  }
  
  // 如果没有缓存或缓存无效，则返回初始状态
  return {
    state: 'idle',
    manifest: null,
    error: null,
    lastLoaded: 0
  };
};

// 初始化当前状态
let currentState: LoadState = initializeState();

// 存储正在等待 manifest 加载完成的订阅者回调函数
const subscribers: ((state: LoadState) => void)[] = [];

// 防止并发加载的锁
let loadingPromise: Promise<WebAppManifest | null> | null = null;

/**
 * 订阅 manifest 加载状态变化
 * @param callback 当状态变化时要调用的函数
 * @returns 取消订阅的函数
 */
export function subscribeToManifest(callback: (state: LoadState) => void): () => void {
  // 立即通知当前状态
  callback({...currentState});
  
  // 添加到订阅者列表
  subscribers.push(callback);
  
  // 返回取消订阅函数
  return () => {
    const index = subscribers.indexOf(callback);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  };
}

/**
 * 加载 Web App Manifest
 * 通过多重缓存和异步锁确保只发送一次网络请求
 * @param force 是否强制重新加载，即使已经有缓存
 */
export async function loadManifest(force: boolean = false): Promise<WebAppManifest | null> {
  // 1. 如果已经有加载好的数据，且不是强制刷新，直接返回
  if (!force && currentState.state === 'loaded' && currentState.manifest) {
    console.log('[ManifestLoader] 使用内存中的缓存');
    return currentState.manifest;
  }
  
  // 2. 如果已经有正在进行的请求，复用该请求
  if (loadingPromise && !force) {
    console.log('[ManifestLoader] 复用正在进行的请求');
    return loadingPromise;
  }
  
  // 3. 开始新的加载过程，创建异步锁
  loadingPromise = (async () => {
    // 如果是强制刷新，清除旧缓存
    if (force) {
      try {
        sessionStorage.removeItem(MANIFEST_CACHE_KEY);
        sessionStorage.removeItem(MANIFEST_TIMESTAMP_KEY);
        console.log('[ManifestLoader] 已清除缓存以强制刷新');
      } catch (e) {
        console.warn('[ManifestLoader] 清除缓存失败:', e);
      }
    }
    
    // 更新状态为加载中
    updateState({
      state: 'loading',
      manifest: null,
      error: null,
      lastLoaded: Date.now()
    });
    
    try {
      // 查找文档中的 manifest 链接
      const manifestLinks = document.querySelectorAll('link[rel="manifest"]');
      
      if (manifestLinks.length === 0) {
        throw new Error('文档中没有找到 manifest 链接');
      }
      
      // 使用第一个 manifest 链接
      const manifestUrl = manifestLinks[0].getAttribute('href');
      
      if (!manifestUrl) {
        throw new Error('Manifest 链接没有 href 属性');
      }
      
      console.log(`[ManifestLoader] 从 ${manifestUrl} 加载 manifest`);
      
      // 发起网络请求获取 manifest
      const response = await fetch(manifestUrl);
      
      if (!response.ok) {
        throw new Error(`获取 manifest 失败: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const now = Date.now();
      
      // 更新状态为已加载
      updateState({
        state: 'loaded',
        manifest: data,
        error: null,
        lastLoaded: now
      });
      
      // 保存到 sessionStorage
      try {
        sessionStorage.setItem(MANIFEST_CACHE_KEY, JSON.stringify(data));
        sessionStorage.setItem(MANIFEST_TIMESTAMP_KEY, now.toString());
        console.log('[ManifestLoader] Manifest 已缓存到 sessionStorage');
      } catch (e) {
        console.warn('[ManifestLoader] 缓存到 sessionStorage 失败:', e);
      }
      
      console.log('[ManifestLoader] Manifest 加载成功');
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '加载 manifest 时出现未知错误';
      console.error(`[ManifestLoader] Error: ${errorMsg}`);
      
      // 更新状态为错误
      updateState({
        state: 'error',
        manifest: null,
        error: errorMsg,
        lastLoaded: Date.now()
      });
      
      return null;
    } finally {
      // 释放异步锁
      loadingPromise = null;
    }
  })();
  
  return loadingPromise;
}

/**
 * 获取当前的 manifest 加载状态
 */
export function getManifestState(): LoadState {
  return {...currentState};
}

/**
 * 手动重置并强制重新加载 manifest
 */
export function resetAndReloadManifest(): Promise<WebAppManifest | null> {
  console.log('[ManifestLoader] 手动重置并重新加载 manifest');
  return loadManifest(true);
}

/**
 * 更新状态并通知所有订阅者
 */
function updateState(newState: LoadState): void {
  currentState = newState;
  
  // 通知所有订阅者
  subscribers.forEach(callback => {
    try {
      callback({...currentState});
    } catch (e) {
      console.error('[ManifestLoader] 通知订阅者时出错:', e);
    }
  });
}