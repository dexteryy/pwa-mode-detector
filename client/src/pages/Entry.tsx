import React, { useEffect } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Globe, Layout, Smartphone, Maximize, ArrowRight, Code } from "lucide-react";

// 定义 PWA 的 display 模式选项
interface DisplayMode {
  name: string;
  displayName: string;
  description: string;
  Icon: React.ElementType; // 使用React组件类型代替图标名称字符串
}

const getDisplayModes = (t: any): DisplayMode[] => [
  {
    name: "browser",
    displayName: t("browser_name"),
    description: t("browser_description"),
    Icon: Globe
  },
  {
    name: "minimal-ui",
    displayName: t("minimal_ui_name"), 
    description: t("minimal_ui_description"),
    Icon: Layout
  },
  {
    name: "standalone",
    displayName: t("standalone_name"),
    description: t("standalone_description"),
    Icon: Smartphone
  },
  {
    name: "fullscreen",
    displayName: t("fullscreen_name"),
    description: t("fullscreen_description"),
    Icon: Maximize
  }
];

const Entry = () => {
  const { t } = useTranslation();
  const displayModes = getDisplayModes(t);

  // 入口页面加载时主动移除所有的 manifest 链接
  useEffect(() => {
    // 移除所有现有的 manifest 链接
    const existingLinks = document.querySelectorAll('link[rel="manifest"]');
    existingLinks.forEach(link => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    });
    console.log('[Entry] 主动移除所有 manifest 链接，防止显示安装按钮');

    // 添加特殊的空 manifest，进一步防止安装按钮显示
    const emptyManifest = document.createElement('link');
    emptyManifest.rel = 'manifest';
    emptyManifest.href = 'data:application/json,{}';
    document.head.appendChild(emptyManifest);

    // 退出时清理
    return () => {
      const emptyLink = document.querySelector('link[href="data:application/json,{}"]');
      if (emptyLink && emptyLink.parentNode) {
        emptyLink.parentNode.removeChild(emptyLink);
      }
    };
  }, []);
  
  return (
    <div className="bg-gray-100 dark:bg-gray-900 font-sans min-h-screen flex flex-col">
      {/* Integrated App Header - Native UI Style */}
      <header className="bg-blue-500 dark:bg-blue-800 text-white">
        {/* Top navigation bar - subtle style for native UI integration */}
        <div className="border-b border-blue-400/30 dark:border-blue-700/40">
          <div className="flex items-center justify-between px-2">
            <div></div>
            <div className="flex items-center">
              <LanguageSwitcher className="h-10" />
            </div>
          </div>
        </div>
        
        {/* Title area */}
        <div className="container mx-auto px-4 py-5">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{t('entry_title')}</h1>
            <p className="mt-2 text-blue-100">{t('entry_subtitle')}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow flex flex-col">
        <div className="max-w-3xl mx-auto w-full">
          {/* Introduction */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{t('what_is_pwa_display_mode')}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {(() => {
                const text = t('pwa_display_mode_description');
                
                // 定义替换模式
                const createLinks = (inputText: string): (string | React.ReactElement)[] => {
                  // 创建链接替换正则表达式模式，这些会应用于所有语言
                  const replacements = [
                    {
                      regex: /\bPWA(?:\s*\([^)]+\))?s?\b|\bProgressive Web Apps?\b/,
                      url: "https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps",
                    },
                    {
                      regex: /\bWeb App Manifest\b/,
                      url: "https://developer.mozilla.org/en-US/docs/Web/Manifest",
                    },
                    {
                      regex: /[''](display)['']\s+property|\b(display)\s+属性|\b(display)\b/,
                      url: "https://developer.mozilla.org/en-US/docs/Web/Manifest/display",
                      matchIndex: 1,
                    }
                  ];
                  
                  // 开始创建React元素数组
                  let result: (string | React.ReactElement)[] = [inputText];
                  
                  // 依次应用每个替换
                  replacements.forEach(({ regex, url, matchIndex = 0 }) => {
                    const newResult: (string | React.ReactElement)[] = [];
                    
                    result.forEach(part => {
                      if (typeof part !== 'string') {
                        newResult.push(part);
                        return;
                      }
                      
                      const matches = part.match(regex);
                      if (!matches) {
                        newResult.push(part);
                        return;
                      }
                      
                      const index = part.indexOf(matches[0]);
                      const linkText = matches[matchIndex] || matches[0];
                      
                      // 在匹配前的文本
                      if (index > 0) {
                        newResult.push(part.substring(0, index));
                      }
                      
                      // 链接元素
                      newResult.push(
                        <a
                          key={url + index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {linkText}
                        </a>
                      );
                      
                      // 匹配后的文本
                      if (index + matches[0].length < part.length) {
                        newResult.push(part.substring(index + matches[0].length));
                      }
                    });
                    
                    result = newResult;
                  });
                  
                  return result;
                };
                
                return createLinks(text);
              })()}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              {t('click_card_instruction')}
            </p>
          </div>

          {/* Display Mode Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayModes.map(mode => (
              <Link key={mode.name} href={`/${mode.name}`} className="h-full">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <mode.Icon className="h-8 w-8 text-blue-500 dark:text-blue-400 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{mode.displayName}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 flex-grow">{mode.description}</p>
                  <div className="mt-4 flex justify-end">
                    <span className="text-blue-500 dark:text-blue-400 font-medium flex items-center">
                      {t('view_demo')}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Technical Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <Code className="h-5 w-5 mr-2" />
              {t('technical_details')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {(() => {
                const text = t('technical_description');
                // 创建链接替换正则表达式模式，这些会应用于所有语言
                const replacements = [
                  {
                    regex: /\bPWA(?:\s*\([^)]+\))?s?\b|\bProgressive Web Apps?\b/,
                    url: "https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps",
                  },
                  {
                    regex: /\bWeb App Manifest\b/,
                    url: "https://developer.mozilla.org/en-US/docs/Web/Manifest",
                  },
                  {
                    regex: /\bmanifest\b/i,
                    url: "https://developer.mozilla.org/en-US/docs/Web/Manifest",
                  }
                ];
                
                // 开始创建React元素数组
                let result = [text];
                
                // 依次应用每个替换
                replacements.forEach(({ regex, url, matchIndex = 0 }) => {
                  const newResult = [];
                  
                  result.forEach(part => {
                    if (typeof part !== 'string') {
                      newResult.push(part);
                      return;
                    }
                    
                    const matches = part.match(regex);
                    if (!matches) {
                      newResult.push(part);
                      return;
                    }
                    
                    const index = part.indexOf(matches[0]);
                    const linkText = matches[matchIndex] || matches[0];
                    
                    // 在匹配前的文本
                    if (index > 0) {
                      newResult.push(part.substring(0, index));
                    }
                    
                    // 链接元素
                    newResult.push(
                      <a
                        key={url + index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {linkText}
                      </a>
                    );
                    
                    // 匹配后的文本
                    if (index + matches[0].length < part.length) {
                      newResult.push(part.substring(index + matches[0].length));
                    }
                  });
                  
                  result = newResult;
                });
                
                return result;
              })()}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              {t('browser_support_note')}
            </p>
          </div>
          
          {/* Spacer to push footer to bottom when content is short */}
          <div className="flex-grow"></div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-950 text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>{t('footer_text')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Entry;