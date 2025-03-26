import React from 'react';

// 术语链接映射
const termLinks: Record<string, string> = {
  'PWA': 'https://web.dev/progressive-web-apps/',
  'Progressive Web Apps': 'https://web.dev/progressive-web-apps/',
  'Web App Manifest': 'https://developer.mozilla.org/docs/Web/Manifest',
  'display': 'https://developer.mozilla.org/docs/Web/Manifest/display',
  'browser': 'https://developer.mozilla.org/docs/Web/Manifest/display#browser',
  'standalone': 'https://developer.mozilla.org/docs/Web/Manifest/display#standalone',
  'minimal-ui': 'https://developer.mozilla.org/docs/Web/Manifest/display#minimal-ui',
  'fullscreen': 'https://developer.mozilla.org/docs/Web/Manifest/display#fullscreen',
};

// 处理文本中的专业术语，将其转换为链接
export function processTerms(text: string): React.ReactNode {
  if (!text) return '';
  
  // 创建正则表达式模式，匹配所有术语
  // 使用 word boundaries 确保只匹配完整单词
  const terms = Object.keys(termLinks).sort((a, b) => b.length - a.length); // 长词优先匹配
  const pattern = new RegExp(`\\b(${terms.map(term => term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})\\b`, 'g');
  
  // 分割文本并插入链接
  const parts = text.split(pattern);
  if (parts.length === 1) return text;
  
  const result: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i++) {
    result.push(parts[i]);
    
    // 如果有匹配项且不是最后一项
    if (i < parts.length - 1) {
      const term = text.match(pattern)?.[i];
      if (term && termLinks[term]) {
        result.push(
          <a 
            key={`term-${i}`} 
            href={termLinks[term]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            {term}
          </a>
        );
      }
    }
  }
  
  return <>{result}</>;
}