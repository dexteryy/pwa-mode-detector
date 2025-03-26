/**
 * 用于处理翻译文本中的关键技术术语，自动添加MDN或web.dev的参考链接
 */

interface TermInfo {
  term: string;   // 需要匹配的术语文本
  url: string;    // 链接URL
}

// 为每种语言定义关键术语列表
const TERMS_BY_LANGUAGE: Record<string, TermInfo[]> = {
  // 英文
  en: [
    { 
      term: "Progressive Web App", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "PWA", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "Progressive Web Apps", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "PWAs", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "Web App Manifest", 
      url: "https://developer.mozilla.org/en-US/docs/Web/Manifest" 
    },
    { 
      term: "'display'", 
      url: "https://developer.mozilla.org/en-US/docs/Web/Manifest/display"
    }
  ],
  
  // 简体中文
  zh: [
    { 
      term: "PWA", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "渐进式网络应用", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "渐进式Web应用", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "Web App Manifest", 
      url: "https://developer.mozilla.org/zh-CN/docs/Web/Manifest" 
    },
    { 
      term: "网页应用清单", 
      url: "https://developer.mozilla.org/zh-CN/docs/Web/Manifest" 
    },
    { 
      term: "'display'", 
      url: "https://developer.mozilla.org/zh-CN/docs/Web/Manifest/display"
    }
  ],
  
  // 繁体中文
  'zh-TW': [
    { 
      term: "PWA", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "漸進式網路應用", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "漸進式Web應用", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "Web App Manifest", 
      url: "https://developer.mozilla.org/zh-TW/docs/Web/Manifest" 
    },
    { 
      term: "網頁應用程式資訊清單", 
      url: "https://developer.mozilla.org/zh-TW/docs/Web/Manifest" 
    },
    { 
      term: "'display'", 
      url: "https://developer.mozilla.org/zh-TW/docs/Web/Manifest/display"
    }
  ],
  
  // 日语
  ja: [
    { 
      term: "PWA", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "プログレッシブ ウェブ アプリ", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "Web App Manifest", 
      url: "https://developer.mozilla.org/ja/docs/Web/Manifest" 
    },
    { 
      term: "ウェブアプリマニフェスト", 
      url: "https://developer.mozilla.org/ja/docs/Web/Manifest" 
    },
    { 
      term: "'display'", 
      url: "https://developer.mozilla.org/ja/docs/Web/Manifest/display"
    }
  ],
  
  // 德语
  de: [
    { 
      term: "Progressive Web App", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "PWA", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "Progressive Web Apps", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "Web App Manifest", 
      url: "https://developer.mozilla.org/de/docs/Web/Manifest" 
    },
    { 
      term: "'display'", 
      url: "https://developer.mozilla.org/de/docs/Web/Manifest/display"
    }
  ],
  
  // 法语
  fr: [
    { 
      term: "Progressive Web App", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "PWA", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "Progressive Web Apps", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "application web progressive", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "Web App Manifest", 
      url: "https://developer.mozilla.org/fr/docs/Web/Manifest" 
    },
    { 
      term: "manifeste d'application web", 
      url: "https://developer.mozilla.org/fr/docs/Web/Manifest" 
    },
    { 
      term: "'display'", 
      url: "https://developer.mozilla.org/fr/docs/Web/Manifest/display"
    }
  ],
  
  // 西班牙语
  es: [
    { 
      term: "Progressive Web App", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "PWA", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "aplicación web progresiva", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "Web App Manifest", 
      url: "https://developer.mozilla.org/es/docs/Web/Manifest" 
    },
    { 
      term: "manifiesto de aplicación web", 
      url: "https://developer.mozilla.org/es/docs/Web/Manifest" 
    },
    { 
      term: "'display'", 
      url: "https://developer.mozilla.org/es/docs/Web/Manifest/display"
    }
  ],
  
  // 葡萄牙语
  pt: [
    { 
      term: "Progressive Web App", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "PWA", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "aplicativo web progressivo", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "Web App Manifest", 
      url: "https://developer.mozilla.org/pt-BR/docs/Web/Manifest" 
    },
    { 
      term: "manifesto de aplicativo web", 
      url: "https://developer.mozilla.org/pt-BR/docs/Web/Manifest" 
    },
    { 
      term: "'display'", 
      url: "https://developer.mozilla.org/pt-BR/docs/Web/Manifest/display"
    }
  ],
  
  // 韩语
  ko: [
    { 
      term: "PWA", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "프로그레시브 웹 앱", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "Web App Manifest", 
      url: "https://developer.mozilla.org/ko/docs/Web/Manifest" 
    },
    { 
      term: "웹 앱 매니페스트", 
      url: "https://developer.mozilla.org/ko/docs/Web/Manifest" 
    },
    { 
      term: "'display'", 
      url: "https://developer.mozilla.org/ko/docs/Web/Manifest/display"
    }
  ]
};

/**
 * 为指定语言的文本添加关键技术术语的链接
 * @param text 原始文本
 * @param lang 语言代码
 * @returns 添加链接后的文本
 */
export function addLinksToTerms(text: string, lang: string): string {
  if (!text) return text;

  // 获取对应语言的术语列表，如果不存在，使用英文
  const terms = TERMS_BY_LANGUAGE[lang] || TERMS_BY_LANGUAGE['en'];
  
  // 按术语长度降序排序，确保先匹配最长的术语
  const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);
  
  // 使用一个简单的算法来避免HTML重叠问题：
  // 1. 将文本分割成块以标记哪些部分已被处理
  const blocks: { text: string; processed: boolean }[] = [{ text, processed: false }];
  
  // 2. 对每个术语，扫描所有未处理的块
  for (const { term, url } of sortedTerms) {
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      
      // 跳过已处理的块
      if (block.processed) continue;
      
      // 在块中查找术语
      const index = block.text.indexOf(term);
      if (index === -1) continue;
      
      // 找到匹配，将块分割为3部分：前部，链接部分，后部
      const before = block.text.substring(0, index);
      const linked = `<a href="${url}" target="_blank" rel="noopener">${term}</a>`;
      const after = block.text.substring(index + term.length);
      
      // 替换原块为3个新块
      blocks.splice(i, 1,
        { text: before, processed: false },
        { text: linked, processed: true },
        { text: after, processed: false }
      );
      
      // 调整索引以考虑新块
      i += 2;
    }
  }
  
  // 3. 合并所有块以获取最终文本
  return blocks.map(b => b.text).join('');
}

/**
 * 实用函数 - 将i18n对象中的特定条目添加链接
 * @param resources i18n资源对象
 * @param keys 需要添加链接的key数组
 * @returns 更新后的i18n资源对象
 */
export function addLinksToI18nResources(resources: Record<string, any>, keys: string[]): Record<string, any> {
  const result = JSON.parse(JSON.stringify(resources)); // 深拷贝以避免修改原对象
  
  // 遍历所有语言
  for (const lang in result) {
    if (!result[lang] || !result[lang].translation) continue;
    
    // 为每个指定的key添加链接
    for (const key of keys) {
      if (result[lang].translation[key]) {
        const originalText = result[lang].translation[key];
        const linkedText = addLinksToTerms(originalText, lang);
        result[lang].translation[key] = linkedText;
      }
    }
  }
  
  return result;
}