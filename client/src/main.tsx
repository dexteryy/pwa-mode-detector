import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// Import i18n configuration
import "./i18n";

// Ensure manifest is loaded correctly
const ensureManifest = () => {
  // Check if manifest link already exists
  const existingManifest = document.querySelector('link[rel="manifest"]');
  
  // If it doesn't exist or is base64 encoded, add or replace with the correct link
  if (!existingManifest || existingManifest.getAttribute('href')?.startsWith('data:')) {
    if (existingManifest) {
      existingManifest.remove();
    }
    
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';
    document.head.appendChild(manifestLink);
  }
};

// Ensure manifest is correct after page load completes
window.addEventListener('DOMContentLoaded', ensureManifest);

// Try to ensure manifest is correct immediately (in case DOMContentLoaded has already fired)
ensureManifest();

createRoot(document.getElementById("root")!).render(<App />);
