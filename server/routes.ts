import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // Add special route to handle the default manifest.json request
  app.get('/manifest.json', (req: Request, res: Response) => {
    // Get referer to determine which page requested the manifest
    const referer = req.headers.referer || '';
    const url = new URL(referer, `http://${req.headers.host}`);
    const pathname = url.pathname;
    
    // Determine which manifest to serve based on the referer path
    let manifestPath = '';
    
    if (pathname.includes('/standalone')) {
      manifestPath = path.resolve(__dirname, '../client/public/manifests/standalone.json');
    } else if (pathname.includes('/minimal-ui')) {
      manifestPath = path.resolve(__dirname, '../client/public/manifests/minimal-ui.json');
    } else if (pathname.includes('/fullscreen')) {
      manifestPath = path.resolve(__dirname, '../client/public/manifests/fullscreen.json');
    } else if (pathname.includes('/browser')) {
      manifestPath = path.resolve(__dirname, '../client/public/manifests/browser.json');
    } else {
      // For unknown paths or the entry page, return a default empty manifest
      // This prevents 404 errors but doesn't make the entry page installable
      return res.json({
        name: "PWA Mode Detector",
        short_name: "PWA Detector",
        display: "browser",
        start_url: "/"
      });
    }
    
    try {
      // Read and send the specific manifest file
      if (fs.existsSync(manifestPath)) {
        const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        return res.json(manifestContent);
      } else {
        console.error(`Manifest file not found: ${manifestPath}`);
        return res.status(404).json({ error: 'Manifest not found' });
      }
    } catch (error) {
      console.error('Error serving manifest:', error);
      return res.status(500).json({ error: 'Error serving manifest' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
