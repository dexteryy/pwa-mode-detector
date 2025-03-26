/**
 * 全局 Manifest 加载管理器
 * 
 * 此模块负责管理 manifest 的加载，并确保在同一页面会话中
 * 只会发送一次网络请求来获取 manifest。它通过协调多个组件的请求
 * 来减少重复加载。
 */

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

// 避免初始化相关的问题
let currentState: LoadState = {
  state: 'idle',
  manifest: null,
  error: null,
  lastLoaded: 0
};

// 存储正在等待 manifest 加载完成的订阅者回调函数
const subscribers: ((state: LoadState) => void)[] = [];

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
 * 这个函数只会触发一次实际的网络请求，无论被调用多少次
 * @param force 是否强制重新加载，即使已经有缓存
 */
export async function loadManifest(force: boolean = false): Promise<WebAppManifest | null> {
  // 如果已经加载，且不是强制重新加载，则直接返回缓存
  if (currentState.state === 'loaded' && !force) {
    console.log('[ManifestLoader] 使用已加载的 manifest 缓存');
    return currentState.manifest;
  }
  
  // 如果正在加载中，等待加载完成
  if (currentState.state === 'loading' && !force) {
    console.log('[ManifestLoader] 等待正在进行的加载完成');
    return new Promise((resolve) => {
      const unsub = subscribeToManifest((state) => {
        if (state.state === 'loaded' || state.state === 'error') {
          unsub(); // 取消订阅
          resolve(state.manifest);
        }
      });
    });
  }

  // 开始加载，更新状态
  updateState({
    state: 'loading',
    manifest: null,
    error: null,
    lastLoaded: Date.now()
  });
  
  try {
    // 找到文档中的 manifest 链接
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
    
    // 请求 manifest 内容
    const response = await fetch(manifestUrl);
    
    if (!response.ok) {
      throw new Error(`获取 manifest 失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // 更新状态为已加载
    updateState({
      state: 'loaded',
      manifest: data,
      error: null,
      lastLoaded: Date.now()
    });
    
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
  }
}

/**
 * 获取当前的 manifest 加载状态
 */
export function getManifestState(): LoadState {
  return {...currentState};
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