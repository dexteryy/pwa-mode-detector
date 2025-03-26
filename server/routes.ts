import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // 记录所有请求
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.includes('manifest')) {
      console.log(`[Server] Request received: ${req.method} ${req.path}`);
    }
    next();
  });

  // 添加中间件来处理 /manifest.json 请求
  app.use((req: Request, res: Response, next: NextFunction) => {
    // 只处理 /manifest.json 请求
    if (req.path === "/manifest.json") {
      // 尝试从 referer 获取信息
      const referer = req.headers.referer || "";
      let pathname = "";
      
      if (referer) {
        try {
          const url = new URL(referer, `http://${req.headers.host || 'localhost'}`);
          pathname = url.pathname;
        } catch (e) {
          console.error("Error parsing referer:", e);
        }
      }
      
      // 如果无法从 referer 获取路径，尝试从当前页面路径获取
      if (!pathname && req.originalUrl) {
        // 从当前请求的路径中获取（可能是通过刷新页面触发的请求）
        pathname = req.originalUrl.split("/manifest.json")[0] || "/";
      }
      
      console.log(`[Server] Handling /manifest.json request with pathname: ${pathname}`);
      
      // 根据路径决定返回哪个 manifest 或者什么都不返回
      if (pathname.includes("/standalone")) {
        // 对应 standalone 模式的页面
        return res.redirect("/manifests/standalone.json");
      } else if (pathname.includes("/minimal-ui")) {
        // 对应 minimal-ui 模式的页面
        return res.redirect("/manifests/minimal-ui.json");
      } else if (pathname.includes("/fullscreen")) {
        // 对应 fullscreen 模式的页面
        return res.redirect("/manifests/fullscreen.json");
      } else if (pathname.includes("/browser")) {
        // 对应 browser 模式的页面
        return res.redirect("/manifests/browser.json");
      } else {
        // 对于入口页或无法识别的路径，返回空内容
        // 使用 204 No Content 响应，避免浏览器错误提示，但不会加载任何内容
        console.log(`[Server] Handling /manifest.json request with no valid path context: ${pathname}, returning 204`);
        return res.status(204).end();
      }
    }
    next();
  });

  const httpServer = createServer(app);
  return httpServer;
}
