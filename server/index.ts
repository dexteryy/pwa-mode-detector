import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "https";
import fs from 'fs';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Provide basic request logging for PWA application
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    // Only log non-static resource requests to reduce log noise
    if (!path.match(/\.(js|css|png|jpg|svg|ico|json)$/)) {
      log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

(async () => {
  registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use environment variable for port, fallback to 3000
  const port = process.env.PORT || 3000;
  const host = process.env.HOST || "0.0.0.0";
  
  const tlsOptions = app.get("env") === "production" ? ({
    cert: fs.readFileSync(`${process.env.CA_PATH}/origin.crt`, 'utf8'),
    key: fs.readFileSync(`${process.env.CA_PATH}/origin.key`,  'utf8'),
  }) : undefined;

  createServer(tlsOptions, app).listen(port, host, () => {
    log(`serving on http://${host}:${port}`);
  });

})();
