import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ArrowDownIcon, ArrowRightIcon, FileJson } from 'lucide-react';

interface WebAppManifest {
  name?: string;
  short_name?: string;
  start_url?: string;
  display?: string;
  background_color?: string;
  theme_color?: string;
  description?: string;
  icons?: Array<{
    src: string;
    sizes: string;
    type?: string;
    purpose?: string;
  }>;
  id?: string;
  scope?: string;
  [key: string]: any;  // 允许其他可能的属性
}

const ManifestViewer: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [manifest, setManifest] = useState<WebAppManifest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchManifest = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 找到页面上所有的manifest链接
        const manifestLinks = document.querySelectorAll('link[rel="manifest"]');
        
        if (manifestLinks.length === 0) {
          setError('No manifest link found in document');
          setIsLoading(false);
          return;
        }
        
        // 使用第一个manifest链接
        const manifestUrl = manifestLinks[0].getAttribute('href');
        
        if (!manifestUrl) {
          setError('Manifest link has no href attribute');
          setIsLoading(false);
          return;
        }
        
        // 请求manifest内容
        const response = await fetch(manifestUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch manifest: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setManifest(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error fetching manifest');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchManifest();
  }, []);

  // 格式化JSON显示
  const formatJson = (json: object): string => {
    return JSON.stringify(json, null, 2);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-lg font-semibold text-dark mb-4 flex items-center">
        <FileJson className="mr-2 h-5 w-5" />
        {t('manifest_viewer_title', 'Web App Manifest')}
      </h2>
      
      {/* 显示关键 manifest 属性 */}
      {manifest && (
        <div className="mb-4 flex flex-wrap gap-2">
          {manifest.display && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              display: {manifest.display}
            </span>
          )}
          {manifest.id && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
              id: {manifest.id}
            </span>
          )}
        </div>
      )}
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-md p-2">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-100 rounded transition-colors">
          <div className="flex items-center">
            {isOpen ? (
              <ArrowDownIcon className="mr-2 h-4 w-4" />
            ) : (
              <ArrowRightIcon className="mr-2 h-4 w-4" />
            )}
            <span className="font-medium">
              {t('view_manifest', 'View Manifest Content')}
            </span>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-2">
          {isLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">{t('loading', 'Loading...')}</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded">
              <p className="flex items-center">
                <span className="material-icons mr-2">error</span>
                {t('manifest_error', 'Error loading manifest')}
              </p>
              <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">{error}</pre>
            </div>
          )}
          
          {manifest && !isLoading && !error && (
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                {manifest.name && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    {t('manifest_name', 'Name')}: {manifest.name}
                  </span>
                )}
                {manifest.short_name && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    {t('manifest_short_name', 'Short Name')}: {manifest.short_name}
                  </span>
                )}
                {manifest.start_url && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {t('manifest_start_url', 'Start URL')}: {manifest.start_url}
                  </span>
                )}
                {manifest.scope && (
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                    {t('manifest_scope', 'Scope')}: {manifest.scope}
                  </span>
                )}
              </div>
              
              <pre className="bg-gray-50 p-4 rounded overflow-auto text-xs h-60">
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