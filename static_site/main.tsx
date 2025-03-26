import { createRoot } from "react-dom/client";
import App from "../client/src/App";
import "../client/src/index.css";

// 确保 manifest 正确加载
const ensureManifest = () => {
  // 检查是否已有 manifest 链接
  const existingManifest = document.querySelector('link[rel="manifest"]');
  
  // 如果没有或者是 base64 编码的，则添加或替换为正确的链接
  if (!existingManifest || existingManifest.getAttribute('href')?.startsWith('data:')) {
    if (existingManifest) {
      existingManifest.remove();
    }
    
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';
    document.head.appendChild(manifestLink);
    
    console.log('PWA manifest updated dynamically');
  }
};

// 页面加载完成后确保 manifest 正确
window.addEventListener('DOMContentLoaded', ensureManifest);

// 立即尝试确保 manifest 正确（以防 DOMContentLoaded 已经触发）
ensureManifest();

createRoot(document.getElementById("root")!).render(<App />);