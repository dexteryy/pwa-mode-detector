import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // PWA Display Mode Detector 不需要额外的API路由
  // 仅需要静态文件服务和Vite开发服务器

  const httpServer = createServer(app);
  return httpServer;
}
