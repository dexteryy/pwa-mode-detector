import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ArrowDownIcon, ArrowRightIcon, FileJson, AlertCircle } from 'lucide-react';
import { loadManifest, subscribeToManifest, WebAppManifest } from "@/lib/manifestLoader";

const ManifestViewer: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [manifest, setManifest] = useState<WebAppManifest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use the centralized manifest loader, with auto subscription
  useEffect(() => {
    // Don't even subscribe if not opened
    if (!isOpen) return;
    
    // Set loading state
    setIsLoading(true);
    
    // Subscribe to manifest state changes
    const unsubscribe = subscribeToManifest((state) => {
      // Update our component state based on the loader state
      if (state.state === 'loaded' && state.manifest) {
        setManifest(state.manifest);
        setError(null);
        setIsLoading(false);
        console.log('[ManifestViewer] Received manifest from loader:', state.manifest);
      } else if (state.state === 'loading') {
        setIsLoading(true);
        setError(null);
      } else if (state.state === 'error') {
        setError(state.error);
        setIsLoading(false);
        console.error('[ManifestViewer] Error from loader:', state.error);
      }
    });
    
    // Trigger a manifest load (without forcing a reload)
    loadManifest(false).catch(error => {
      console.error('[ManifestViewer] Failed to load manifest:', error);
      setError('Failed to load manifest: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setIsLoading(false);
    });
    
    // Cleanup subscription when component unmounts or collapsible closes
    return () => unsubscribe();
  }, [isOpen]);

  // Format JSON for display
  const formatJson = (json: object): string => {
    return JSON.stringify(json, null, 2);
  };

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
          {isLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{t('loading', 'Loading...')}</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-400 p-4 rounded">
              <p className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                {t('manifest_error', 'Error loading manifest')}
              </p>
              <pre className="mt-2 text-xs bg-red-100 dark:bg-red-900/50 p-2 rounded overflow-auto">{error}</pre>
            </div>
          )}
          
          {manifest && !isLoading && !error && (
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                {manifest.name && (
                  <span className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded text-xs">
                    {t('manifest_name', 'Name')}: {manifest.name}
                  </span>
                )}
                {manifest.short_name && (
                  <span className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded text-xs">
                    {t('manifest_short_name', 'Short Name')}: {manifest.short_name}
                  </span>
                )}
                {manifest.display && (
                  <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs">
                    display: {manifest.display}
                  </span>
                )}
                {manifest.id && (
                  <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 px-2 py-1 rounded text-xs">
                    id: {manifest.id}
                  </span>
                )}
                {manifest.start_url && (
                  <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs">
                    {t('manifest_start_url', 'Start URL')}: {manifest.start_url}
                  </span>
                )}
                {manifest.scope && (
                  <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 px-2 py-1 rounded text-xs">
                    {t('manifest_scope', 'Scope')}: {manifest.scope}
                  </span>
                )}
              </div>
              
              <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded overflow-auto text-xs dark:text-gray-300 h-60">
                {formatJson(manifest)}
              </pre>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ManifestViewer;