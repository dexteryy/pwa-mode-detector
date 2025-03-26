import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  
  // 监听语言变化，确保UI状态与实际语言同步
  useEffect(() => {
    const handleLanguageChanged = () => {
      setCurrentLanguage(i18n.language);
    };
    
    i18n.on('languageChanged', handleLanguageChanged);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  const handleLanguageChange = (language: string) => {
    changeLanguage(language);
  };
  
  // 显示当前语言的简写或图标
  const getCurrentLanguageDisplay = () => {
    return currentLanguage === 'zh' ? '中' : 'EN';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="bg-blue-600 text-white text-xs px-2 py-1 flex items-center justify-center rounded hover:bg-blue-500 transition-colors cursor-pointer whitespace-nowrap h-6 min-w-10">
          <Globe className="h-3 w-3 mr-1" />
          <span>{getCurrentLanguageDisplay()}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')}
          className={currentLanguage === 'en' ? 'bg-muted' : ''}
        >
          {t('language_english')}
          {currentLanguage === 'en' && (
            <span className="material-icons text-xs ml-2">check</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('zh')}
          className={currentLanguage === 'zh' ? 'bg-muted' : ''}
        >
          {t('language_chinese')}
          {currentLanguage === 'zh' && (
            <span className="material-icons text-xs ml-2">check</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;