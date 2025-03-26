import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // 处理根目录下的manifest.json请求，防止404错误
  app.get('/manifest.json', (req: Request, res: Response) => {
    // 返回一个空manifest，指示这是不是一个PWA
    // 或者根据需要重定向到正确的manifest
    const emptyManifest = {
      name: "PWA Mode Detector",
      short_name: "PWA Detector",
      description: "This is not a PWA enabled page",
      display: "browser"
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(emptyManifest));
    console.log('[server] Handled request for root /manifest.json');
  });

  // PWA Display Mode Detector 不需要其他额外的API路由
  // 仅需要静态文件服务和Vite开发服务器

  const httpServer = createServer(app);
  return httpServer;
}
