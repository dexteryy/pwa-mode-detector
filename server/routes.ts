import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // Provide static files - ensure client public resources are accessible
  app.use(express.static(path.join(process.cwd(), 'client/public')));
  
  // Log all requests
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.includes('manifest')) {
      console.log(`[Server] Request received: ${req.method} ${req.path}`);
    }
    next();
  });

  // Add route to handle all manifest files
  app.get('/manifests/:name.json', (req: Request, res: Response) => {
    const manifestName = req.params.name;
    // Note: Replit's working directory is the project root, so paths need to start from the root
    const manifestPath = path.join(process.cwd(), 'client/public/manifests', `${manifestName}.json`);
    
    console.log(`[Server] Serving manifest: ${manifestPath}`);
    
    try {
      if (fs.existsSync(manifestPath)) {
        // Prevent caching to ensure latest content is retrieved each time
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');
        
        const manifestContent = fs.readFileSync(manifestPath, 'utf8');
        res.type('application/json');
        res.send(manifestContent);
        console.log(`[Server] Successfully served manifest: ${manifestName}.json`);
      } else {
        console.error(`[Server] Manifest not found: ${manifestPath}`);
        res.status(404).send('Manifest not found');
      }
    } catch (error) {
      console.error(`[Server] Error serving manifest: ${error}`, error);
      res.status(500).send(`Internal server error: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  // Add middleware to handle /manifest.json requests
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Only process /manifest.json requests
    if (req.path === "/manifest.json") {
      // Try to get information from referer
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
      
      // If unable to get path from referer, try to get from current page path
      if (!pathname && req.originalUrl) {
        // Get from current request path (possibly triggered by page refresh)
        pathname = req.originalUrl.split("/manifest.json")[0] || "/";
      }
      
      console.log(`[Server] Handling /manifest.json request with pathname: ${pathname}`);
      
      // Decide which manifest to return based on path, or return nothing
      if (pathname.includes("/standalone")) {
        // For standalone mode page
        return res.redirect("/manifests/standalone.json");
      } else if (pathname.includes("/minimal-ui")) {
        // For minimal-ui mode page
        return res.redirect("/manifests/minimal-ui.json");
      } else if (pathname.includes("/fullscreen")) {
        // For fullscreen mode page
        return res.redirect("/manifests/fullscreen.json");
      } else if (pathname.includes("/browser")) {
        // For browser mode page
        return res.redirect("/manifests/browser.json");
      } else {
        // For entry page or unrecognized paths, return empty content
        // Use 204 No Content response to avoid browser error prompt but not load any content
        console.log(`[Server] Handling /manifest.json request with no valid path context: ${pathname}, returning 204`);
        return res.status(204).end();
      }
    }
    next();
  });

  const httpServer = createServer(app);
  return httpServer;
}
