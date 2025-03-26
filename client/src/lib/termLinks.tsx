import React from 'react';

// 技术术语链接映射
export const termLinks: Record<string, string> = {
  "PWA": "https://web.dev/learn/pwa/",
  "Progressive Web App": "https://web.dev/progressive-web-apps/",
  "Web App Manifest": "https://developer.mozilla.org/en-US/docs/Web/Manifest",
  "manifest": "https://developer.mozilla.org/en-US/docs/Web/Manifest",
  "display mode": "https://developer.mozilla.org/en-US/docs/Web/Manifest/display",
  "display": "https://developer.mozilla.org/en-US/docs/Web/Manifest/display",
  "standalone": "https://developer.mozilla.org/en-US/docs/Web/Manifest/display#standalone",
  "fullscreen": "https://developer.mozilla.org/en-US/docs/Web/Manifest/display#fullscreen",
  "minimal-ui": "https://developer.mozilla.org/en-US/docs/Web/Manifest/display#minimal-ui",
  "browser": "https://developer.mozilla.org/en-US/docs/Web/Manifest/display#browser",
};

/**
 * 将文本中的技术术语转换为链接
 * @param text 要处理的文本
 * @param inHeading 是否在标题中 (标题中不添加链接)
 * @returns 处理后的HTML字符串
 */
export function linkifyTerms(text: string, inHeading = false): string {
  if (inHeading) return text;
  
  // 创建正则表达式模式，匹配所有技术术语
  // 使用 \\b 边界匹配确保只匹配完整的单词
  const terms = Object.keys(termLinks).sort((a, b) => b.length - a.length); // 按长度倒序排列，优先匹配较长术语
  
  let result = text;
  
  // 依次处理每个术语
  for (const term of terms) {
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // 转义正则表达式特殊字符
    const regex = new RegExp(`\\b${escapedTerm}\\b`, 'g');
    
    // 替换为链接格式
    result = result.replace(regex, (match) => {
      return `<a href="${termLinks[term]}" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:opacity-80 transition-opacity">${match}</a>`;
    });
  }
  
  return result;
}

/**
 * React组件：带有技术术语链接的文本
 */
export function TermLinkedText({ 
  text, 
  className = "", 
  inHeading = false 
}: { 
  text: string; 
  className?: string; 
  inHeading?: boolean;
}): JSX.Element {
  return (
    <span 
      className={className} 
      dangerouslySetInnerHTML={{ __html: linkifyTerms(text, inHeading) }}
    />
  );
}