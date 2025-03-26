import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ArrowDownIcon, ArrowRightIcon, FileJson, AlertCircle } from 'lucide-react';
import { ManifestContext, WebAppManifest } from '../App';

const ManifestViewer: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const [localManifest, setLocalManifest] = useState<WebAppManifest | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  
  // Use the shared manifest context instead of fetching it again 
  const { manifestInfo: manifest, manifestUrl, isLoading, error } = useContext(ManifestContext);

  // Add debugging effects
  useEffect(() => {
    console.log('[ManifestViewer] Current manifest context:', { manifest, manifestUrl, isLoading, error });
    
    // If we still don't have manifest data, try to load it directly
    if (!manifest && !isLoading && !localManifest && !localLoading) {
      loadManifestDirectly();
    }
  }, [manifest, manifestUrl, isLoading, error]);
  
  // Function to load manifest directly based on current path
  const loadManifestDirectly = () => {
    const pathWithoutParams = location.split('?')[0];
    let manifestType = '';
    
    if (pathWithoutParams === '/standalone') {
      manifestType = 'standalone';
    } else if (pathWithoutParams === '/minimal-ui') {
      manifestType = 'minimal-ui';
    } else if (pathWithoutParams === '/fullscreen') {
      manifestType = 'fullscreen';
    } else if (pathWithoutParams === '/browser') {
      manifestType = 'browser';
    } else {
      return; // No valid manifest for this path
    }
    
    setLocalLoading(true);
    
    // Try loading hardcoded data first instead of relying on network
    if (manifestType === 'standalone') {
      setLocalManifest({
        "id": "pwa-mode-detector-standalone",
        "name": "PWA Mode Detector - Standalone",
        "short_name": "PWA Standalone",
        "start_url": "/standalone",
        "scope": "/standalone",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#3B82F6",
        "description": "PWA 运行在独立窗口模式",
        "icons": [
          {
            "src": "/icons/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/icons/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/icons/maskable-icon.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ]
      });
      setLocalLoading(false);
    } else if (manifestType === 'minimal-ui') {
      setLocalManifest({
        "id": "pwa-mode-detector-minimal-ui",
        "name": "PWA Mode Detector - Minimal UI",
        "short_name": "PWA Minimal UI",
        "start_url": "/minimal-ui",
        "scope": "/minimal-ui",
        "display": "minimal-ui",
        "background_color": "#ffffff",
        "theme_color": "#3B82F6",
        "description": "PWA 运行在最小界面模式",
        "icons": [
          {
            "src": "/icons/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/icons/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/icons/maskable-icon.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ]
      });
      setLocalLoading(false);
    } else {
      // For other types, we need to try to load from network
      fetch(`/manifests/${manifestType}.json?v=${new Date().getTime()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log(`[ManifestViewer] Directly loaded ${manifestType} manifest:`, data);
          setLocalManifest(data);
          setLocalLoading(false);
        })
        .catch(err => {
          console.error(`[ManifestViewer] Error loading ${manifestType} manifest:`, err);
          setLocalError(`Failed to load manifest: ${err.message}`);
          setLocalLoading(false);
        });
    }
  };

  // Format JSON for display
  const formatJson = (json: object): string => {
    return JSON.stringify(json, null, 2);
  };
  
  // Use local state if context is empty
  const displayManifest = manifest || localManifest;
  const displayLoading = isLoading || localLoading;
  const displayError = error || localError;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-lg font-semibold text-dark dark:text-white mb-4 flex items-center">
        <FileJson className="mr-2 h-5 w-5 dark:text-blue-400" />
        {t('manifest_viewer_title', 'Web App Manifest')}
      </h2>
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border dark:border-gray-700 rounded-md p-2">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
          <div className="flex items-center">
            {isOpen ? (
              <ArrowDownIcon className="mr-2 h-4 w-4 dark:text-gray-300" />
            ) : (
              <ArrowRightIcon className="mr-2 h-4 w-4 dark:text-gray-300" />
            )}
            <span className="font-medium dark:text-gray-200">
              {t('view_manifest', 'View Manifest Content')}
            </span>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-2">
          {displayLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{t('loading', 'Loading...')}</p>
            </div>
          )}
          
          {displayError && !displayManifest && !displayLoading && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-400 p-4 rounded">
              <p className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                {t('manifest_error', 'Error loading manifest')}
              </p>
              <pre className="mt-2 text-xs bg-red-100 dark:bg-red-900/50 p-2 rounded overflow-auto">{displayError}</pre>
            </div>
          )}
          
          {displayManifest && !displayLoading && (
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                {displayManifest.name && (
                  <span className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded text-xs">
                    {t('manifest_name', 'Name')}: {displayManifest.name}
                  </span>
                )}
                {displayManifest.short_name && (
                  <span className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded text-xs">
                    {t('manifest_short_name', 'Short Name')}: {displayManifest.short_name}
                  </span>
                )}
                {displayManifest.display && (
                  <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs">
                    display: {displayManifest.display}
                  </span>
                )}
                {displayManifest.id && (
                  <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 px-2 py-1 rounded text-xs">
                    id: {displayManifest.id}
                  </span>
                )}
                {displayManifest.start_url && (
                  <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs">
                    {t('manifest_start_url', 'Start URL')}: {displayManifest.start_url}
                  </span>
                )}
                {displayManifest.scope && (
                  <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 px-2 py-1 rounded text-xs">
                    {t('manifest_scope', 'Scope')}: {displayManifest.scope}
                  </span>
                )}
              </div>
              
              <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded overflow-auto text-xs dark:text-gray-300 h-60">
                {formatJson(displayManifest)}
              </pre>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ManifestViewer;