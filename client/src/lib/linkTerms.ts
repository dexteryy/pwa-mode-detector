/**
 * 用于处理翻译文本中的关键技术术语，自动添加MDN或web.dev的参考链接
 */

interface TermDefinition {
  term: RegExp;
  url: string;
  prefix?: string;
}

// 关键术语定义及其对应链接
const TERM_DEFINITIONS: Record<string, TermDefinition[]> = {
  // 英文
  en: [
    { 
      term: /\b(Progressive Web Apps?)\b|\b(PWAs?)\b/g, 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: /\b(Web App Manifest)\b/g, 
      url: "https://developer.mozilla.org/en-US/docs/Web/Manifest" 
    },
    { 
      term: /\bdisplay\b(?! mode)/g, 
      url: "https://developer.mozilla.org/en-US/docs/Web/Manifest/display",
      prefix: "'" 
    }
  ],
  
  // 简体中文
  zh: [
    { 
      term: /\b(PWA)(?:\s*（渐进式(?:网络|Web)应用）)?\b|(渐进式(?:网络|Web)应用)/g,  
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: /\b(Web App Manifest)\b/g, 
      url: "https://developer.mozilla.org/zh-CN/docs/Web/Manifest" 
    },
    { 
      term: /\bdisplay\b(?! 属性|\s+模式)/g, 
      url: "https://developer.mozilla.org/zh-CN/docs/Web/Manifest/display",
      prefix: "'" 
    }
  ],
  
  // 繁体中文
  "zh-TW": [
    { 
      term: /\b(PWA)(?:\s*（漸進式(?:網絡|Web)應用）)?\b|(漸進式(?:網絡|Web)應用)/g, 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: /\b(Web App Manifest)\b/g, 
      url: "https://developer.mozilla.org/zh-TW/docs/Web/Manifest" 
    },
    { 
      term: /\bdisplay\b(?! 屬性|\s+模式)/g, 
      url: "https://developer.mozilla.org/zh-TW/docs/Web/Manifest/display",
      prefix: "'" 
    }
  ],
  
  // 日语
  ja: [
    { 
      term: /\b(PWA)(?:\s*（プログレッシブ\s*ウェブ\s*アプリ）)?\b|(プログレッシブ\s*ウェブ\s*アプリ)/g, 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: /\b(Web App Manifest)\b/g, 
      url: "https://developer.mozilla.org/ja/docs/Web/Manifest" 
    },
    { 
      term: /\bdisplay\b(?! 属性|\s+モード)/g, 
      url: "https://developer.mozilla.org/ja/docs/Web/Manifest/display",
      prefix: "'" 
    }
  ],
  
  // 德语
  de: [
    { 
      term: /\b(Progressive Web Apps?)\b|\b(PWAs?)\b/g, 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: /\b(Web App Manifest)\b/g, 
      url: "https://developer.mozilla.org/de/docs/Web/Manifest" 
    },
    { 
      term: /\bdisplay\b(?! Eigenschaft|\s+Modus)/g, 
      url: "https://developer.mozilla.org/de/docs/Web/Manifest/display",
      prefix: "'" 
    }
  ],
  
  // 法语
  fr: [
    { 
      term: /\b(Progressive Web Apps?)\b|\b(PWAs?)\b/g, 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: /\b(Web App Manifest)\b/g, 
      url: "https://developer.mozilla.org/fr/docs/Web/Manifest" 
    },
    { 
      term: /\bdisplay\b(?! propriété|\s+mode)/g, 
      url: "https://developer.mozilla.org/fr/docs/Web/Manifest/display",
      prefix: "'" 
    }
  ],
  
  // 西班牙语
  es: [
    { 
      term: /\b(Progressive Web Apps?)\b|\b(PWAs?)\b/g, 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: /\b(Web App Manifest)\b/g, 
      url: "https://developer.mozilla.org/es/docs/Web/Manifest" 
    },
    { 
      term: /\bdisplay\b(?! propiedad|\s+modo)/g, 
      url: "https://developer.mozilla.org/es/docs/Web/Manifest/display",
      prefix: "'" 
    }
  ],
  
  // 葡萄牙语
  pt: [
    { 
      term: /\b(Progressive Web Apps?)\b|\b(PWAs?)\b/g, 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: /\b(Web App Manifest)\b/g, 
      url: "https://developer.mozilla.org/pt-BR/docs/Web/Manifest" 
    },
    { 
      term: /\bdisplay\b(?! propriedade|\s+modo)/g, 
      url: "https://developer.mozilla.org/pt-BR/docs/Web/Manifest/display",
      prefix: "'" 
    }
  ],
  
  // 韩语
  ko: [
    { 
      term: /\b(PWA)(?:\s*（프로그레시브\s*웹\s*앱）)?\b|(프로그레시브\s*웹\s*앱)/g, 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: /\b(Web App Manifest)\b/g, 
      url: "https://developer.mozilla.org/ko/docs/Web/Manifest" 
    },
    { 
      term: /\bdisplay\b(?! 속성|\s+모드)/g, 
      url: "https://developer.mozilla.org/ko/docs/Web/Manifest/display",
      prefix: "'" 
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

  // 如果没有该语言的定义，使用英文
  const definitions = TERM_DEFINITIONS[lang] || TERM_DEFINITIONS['en'];
  
  // 遍历定义，添加链接
  let result = text;
  for (const definition of definitions) {
    result = result.replace(definition.term, (match) => {
      const prefix = definition.prefix || '';
      return `${prefix}<a href='${definition.url}' target='_blank' rel='noopener'>${match.replace(prefix, '')}</a>`;
    });
  }
  
  return result;
}

/**
 * 实用函数 - 将i18n对象中的特定条目添加链接
 * @param resources i18n资源对象
 * @param keys 需要添加链接的key数组
 * @returns 更新后的i18n资源对象
 */
export function addLinksToI18nResources(resources: Record<string, any>, keys: string[]): Record<string, any> {
  const result = { ...resources };
  
  // 遍历所有语言
  for (const lang in result) {
    if (!result[lang]) continue;
    
    // 为每个指定的key添加链接
    for (const key of keys) {
      if (result[lang][key]) {
        result[lang][key] = addLinksToTerms(result[lang][key], lang);
      }
    }
  }
  
  return result;
}