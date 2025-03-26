import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // 添加特殊路由拦截所有manifest请求，确保只有特定路径能访问manifest
  app.get("/manifest.json", (req: Request, res: Response) => {
    // 从查询参数获取当前路径，避免依赖referer（可能不可靠）
    const requestedPath = req.query.path as string || '';
    const referer = req.headers.referer || '';
    console.log(`[Server] Manifest.json requested, path param: ${requestedPath}, referer: ${referer}`);
    
    // 只允许特定路径的manifest请求
    const validPaths = ['/standalone', '/minimal-ui', '/fullscreen'];
    
    // 请求路径从查询参数优先, referer作为备份
    const usePath = requestedPath || 
                   (referer.includes('/standalone') ? '/standalone' : 
                    referer.includes('/minimal-ui') ? '/minimal-ui' :
                    referer.includes('/fullscreen') ? '/fullscreen' :
                    referer.includes('/browser') ? '/browser' : '');
    
    console.log(`[Server] Using path for manifest selection: ${usePath}`);
    
    // 只有确认为PWA路径才提供manifest
    if (validPaths.includes(usePath) || usePath === '/browser' || usePath.startsWith('/pwa/')) {
      // 允许访问，但使用适合的manifest
      let manifestPath = '';
      
      if (usePath === '/standalone') {
        manifestPath = path.join(__dirname, '../client/public/manifests/standalone.json');
      } 
      else if (usePath === '/minimal-ui') {
        manifestPath = path.join(__dirname, '../client/public/manifests/minimal-ui.json');
      }
      else if (usePath === '/fullscreen') {
        manifestPath = path.join(__dirname, '../client/public/manifests/fullscreen.json');
      }
      else if (usePath === '/browser') {
        manifestPath = path.join(__dirname, '../client/public/manifests/browser.json');
      }
      else if (usePath.startsWith('/pwa/')) {
        // 从URL提取显示模式
        const match = usePath.match(/\/pwa\/([^/?#]+)/);
        if (match && ['standalone', 'minimal-ui', 'fullscreen', 'browser'].includes(match[1])) {
          manifestPath = path.join(__dirname, `../client/public/manifests/${match[1]}.json`);
        } else {
          manifestPath = path.join(__dirname, '../client/public/manifests/standalone.json');
        }
      }
      
      console.log(`[Server] Serving manifest: ${manifestPath}`);
      
      // 检查文件是否存在
      if (manifestPath && fs.existsSync(manifestPath)) {
        res.sendFile(manifestPath);
      } else {
        res.status(404).json({ error: 'Manifest not found' });
      }
    } else {
      // 对于入口页或其他页面，拒绝请求以避免不必要的manifest加载
      console.log('[Server] Blocked manifest request from non-PWA path');
      res.status(404).json({ error: 'Manifest not available for this path' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
