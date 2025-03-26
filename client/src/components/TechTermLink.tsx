import React from 'react';

interface TechTermLinkProps {
  term: string;
  url: string;
  children?: React.ReactNode;
}

/**
 * 技术术语链接组件
 * 将技术术语包装成一个链接，点击后在新窗口打开参考文档
 */
const TechTermLink: React.FC<TechTermLinkProps> = ({ term, url, children }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:underline dark:text-blue-400"
      title={`Learn more about ${term}`}
    >
      {children || term}
    </a>
  );
};

// 术语URL映射类型
export type TechTermKey = 
  | 'PWA' 
  | 'Progressive Web App' 
  | 'Web App Manifest' 
  | 'display' 
  | 'browser' 
  | 'minimal-ui' 
  | 'standalone' 
  | 'fullscreen';

// 术语URL映射
export const TECH_TERM_URLS: Record<TechTermKey, string> = {
  PWA: 'https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps',
  'Progressive Web App': 'https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps',
  'Web App Manifest': 'https://developer.mozilla.org/en-US/docs/Web/Manifest',
  'display': 'https://developer.mozilla.org/en-US/docs/Web/Manifest/display',
  'browser': 'https://developer.mozilla.org/en-US/docs/Web/Manifest/display#browser',
  'minimal-ui': 'https://developer.mozilla.org/en-US/docs/Web/Manifest/display#minimal-ui',
  'standalone': 'https://developer.mozilla.org/en-US/docs/Web/Manifest/display#standalone',
  'fullscreen': 'https://developer.mozilla.org/en-US/docs/Web/Manifest/display#fullscreen',
};

export default TechTermLink;