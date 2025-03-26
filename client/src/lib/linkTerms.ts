/**
 * Used to process key technical terms in translated text, automatically adding reference links to MDN or web.dev
 */

interface TermInfo {
  term: string;   // Term text to be matched
  url: string;    // Link URL
}

// Define key terms for each language
const TERMS_BY_LANGUAGE: Record<string, TermInfo[]> = {
  // English
  en: [
    { 
      term: "PWA", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "PWAs", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "Web App Manifest", 
      url: "https://developer.mozilla.org/docs/Web/Manifest" 
    },
    { 
      term: "'display'", 
      url: "https://developer.mozilla.org/docs/Web/Manifest/display"
    }
  ],
  
  // Simplified Chinese
  zh: [
    { 
      term: "PWA", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "Web App Manifest", 
      url: "https://developer.mozilla.org/docs/Web/Manifest" 
    },
    { 
      term: "网页应用清单", 
      url: "https://developer.mozilla.org/docs/Web/Manifest" 
    },
    { 
      term: "'display'", 
      url: "https://developer.mozilla.org/docs/Web/Manifest/display"
    }
  ],
  
  // Traditional Chinese
  'zh-TW': [
    { 
      term: "PWA", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "Web App Manifest", 
      url: "https://developer.mozilla.org/docs/Web/Manifest" 
    },
    { 
      term: "網頁應用程式資訊清單", 
      url: "https://developer.mozilla.org/docs/Web/Manifest" 
    },
    { 
      term: "'display'", 
      url: "https://developer.mozilla.org/docs/Web/Manifest/display"
    }
  ],
  
  // Japanese
  ja: [
    { 
      term: "PWA", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "Web App Manifest", 
      url: "https://developer.mozilla.org/docs/Web/Manifest" 
    },
    { 
      term: "ウェブアプリマニフェスト", 
      url: "https://developer.mozilla.org/docs/Web/Manifest" 
    },
    { 
      term: "'display'", 
      url: "https://developer.mozilla.org/docs/Web/Manifest/display"
    }
  ],
  
  // German
  de: [
    { 
      term: "PWA", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "Web App Manifest", 
      url: "https://developer.mozilla.org/docs/Web/Manifest" 
    },
    { 
      term: "'display'", 
      url: "https://developer.mozilla.org/docs/Web/Manifest/display"
    }
  ],
  
  // French
  fr: [
    { 
      term: "PWA", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "Web App Manifest", 
      url: "https://developer.mozilla.org/docs/Web/Manifest" 
    },
    { 
      term: "manifeste d'application web", 
      url: "https://developer.mozilla.org/docs/Web/Manifest" 
    },
    { 
      term: "'display'", 
      url: "https://developer.mozilla.org/docs/Web/Manifest/display"
    }
  ],
  
  // Spanish
  es: [
    { 
      term: "PWA", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "Web App Manifest", 
      url: "https://developer.mozilla.org/docs/Web/Manifest" 
    },
    { 
      term: "manifiesto de aplicación web", 
      url: "https://developer.mozilla.org/docs/Web/Manifest" 
    },
    { 
      term: "'display'", 
      url: "https://developer.mozilla.org/docs/Web/Manifest/display"
    }
  ],
  
  // Portuguese
  pt: [
    { 
      term: "PWA", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "Web App Manifest", 
      url: "https://developer.mozilla.org/docs/Web/Manifest" 
    },
    { 
      term: "manifesto de aplicativo web", 
      url: "https://developer.mozilla.org/docs/Web/Manifest" 
    },
    { 
      term: "'display'", 
      url: "https://developer.mozilla.org/docs/Web/Manifest/display"
    }
  ],
  
  // Korean
  ko: [
    { 
      term: "PWA", 
      url: "https://web.dev/progressive-web-apps/" 
    },
    { 
      term: "Web App Manifest", 
      url: "https://developer.mozilla.org/docs/Web/Manifest" 
    },
    { 
      term: "웹 앱 매니페스트", 
      url: "https://developer.mozilla.org/docs/Web/Manifest" 
    },
    { 
      term: "'display'", 
      url: "https://developer.mozilla.org/docs/Web/Manifest/display"
    }
  ]
};

/**
 * Add links to key technical terms in text for a specific language
 * @param text Original text
 * @param lang Language code
 * @returns Text with added links
 */
export function addLinksToTerms(text: string, lang: string): string {
  if (!text) return text;

  // Get term list for the specified language, or use English if not available
  const terms = TERMS_BY_LANGUAGE[lang] || TERMS_BY_LANGUAGE['en'];
  
  // Sort terms by length in descending order to ensure longest terms are matched first
  const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);
  
  // Use a simple algorithm to avoid HTML overlap issues:
  // 1. Split text into blocks to mark which parts have been processed
  const blocks: { text: string; processed: boolean }[] = [{ text, processed: false }];
  
  // 2. For each term, scan all unprocessed blocks
  for (const { term, url } of sortedTerms) {
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      
      // Skip already processed blocks
      if (block.processed) continue;
      
      // Find term in the current block
      const index = block.text.indexOf(term);
      if (index === -1) continue;
      
      // Found a match, split block into 3 parts: before, linked part, after
      const before = block.text.substring(0, index);
      const linked = `<a href="${url}" target="_blank" rel="noopener" class="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-medium">${term}</a>`;
      const after = block.text.substring(index + term.length);
      
      // Replace original block with 3 new blocks
      blocks.splice(i, 1,
        { text: before, processed: false },
        { text: linked, processed: true },
        { text: after, processed: false }
      );
      
      // Adjust index to account for new blocks
      i += 2;
    }
  }
  
  // 3. Combine all blocks to get the final text
  return blocks.map(b => b.text).join('');
}

/**
 * Utility function - Add links to specific entries in i18n resources object
 * @param resources i18n resources object
 * @param keys Array of keys that need links added
 * @returns Updated i18n resources object
 */
export function addLinksToI18nResources(resources: Record<string, any>, keys: string[]): Record<string, any> {
  const result = JSON.parse(JSON.stringify(resources)); // Deep copy to avoid modifying the original object
  
  // Iterate through all languages
  for (const lang in result) {
    if (!result[lang] || !result[lang].translation) continue;
    
    // Add links for each specified key
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