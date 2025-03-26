import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import fs from 'fs';
import path from 'path';

export async function registerRoutes(app: Express): Promise<Server> {
  // 处理根目录下的manifest.json请求，根据当前路径智能地路由到正确的manifest文件
  app.get('/manifest.json', (req: Request, res: Response) => {
    // 获取当前页面路径（通过Referer头）
    const referer = req.headers.referer || '';
    let manifestPath = '';
    
    // 根据referer决定使用哪个manifest
    if (referer.includes('/standalone')) {
      manifestPath = path.join(__dirname, '../client/public/manifests/standalone.json');
      console.log('[server] Routing to standalone manifest');
    } 
    else if (referer.includes('/minimal-ui')) {
      manifestPath = path.join(__dirname, '../client/public/manifests/minimal-ui.json');
      console.log('[server] Routing to minimal-ui manifest');
    }
    else if (referer.includes('/fullscreen')) {
      manifestPath = path.join(__dirname, '../client/public/manifests/fullscreen.json');
      console.log('[server] Routing to fullscreen manifest');
    }
    else if (referer.includes('/browser')) {
      manifestPath = path.join(__dirname, '../client/public/manifests/browser.json');
      console.log('[server] Routing to browser manifest');
    }
    else {
      // 对于首页或其他页面，返回一个空的manifest
      const emptyManifest = {
        name: "PWA Mode Detector",
        short_name: "PWA Detector",
        description: "This is not a PWA enabled page",
        display: "browser"
      };
      
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(emptyManifest));
      console.log('[server] Handled request for root /manifest.json (empty manifest)');
      return;
    }
    
    // 如果找到了对应路径的manifest，返回它
    if (manifestPath && fs.existsSync(manifestPath)) {
      try {
        const manifestContent = fs.readFileSync(manifestPath, 'utf8');
        res.setHeader('Content-Type', 'application/json');
        res.send(manifestContent);
        console.log(`[server] Served manifest from ${manifestPath}`);
      } catch (err) {
        console.error('[server] Error reading manifest file:', err);
        res.status(500).send('Error reading manifest file');
      }
    } else {
      // 找不到文件时返回404
      console.error(`[server] Manifest file not found: ${manifestPath}`);
      res.status(404).send('Manifest not found');
    }
  });

  // PWA Display Mode Detector 不需要其他额外的API路由
  // 仅需要静态文件服务和Vite开发服务器

  const httpServer = createServer(app);
  return httpServer;
}
