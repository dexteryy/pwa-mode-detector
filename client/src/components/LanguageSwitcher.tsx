import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';
import { Globe, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
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
    switch (currentLanguage) {
      case 'zh':
        return '简';
      case 'zh-TW':
        return '繁';
      case 'ja':
        return 'JP';
      default:
        return 'EN';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className={cn(
          "text-white flex items-center justify-center cursor-pointer whitespace-nowrap rounded-md", 
          "w-16 h-10 hover:bg-blue-400/20 dark:hover:bg-blue-500/30 transition-colors",
          className
        )}>
          <Globe className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">{getCurrentLanguageDisplay()}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')}
          className={currentLanguage === 'en' ? 'bg-muted' : ''}
        >
          {t('language_english')}
          {currentLanguage === 'en' && (
            <Check className="h-4 w-4 ml-2" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('zh')}
          className={currentLanguage === 'zh' ? 'bg-muted' : ''}
        >
          {t('language_chinese')}
          {currentLanguage === 'zh' && (
            <Check className="h-4 w-4 ml-2" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('zh-TW')}
          className={currentLanguage === 'zh-TW' ? 'bg-muted' : ''}
        >
          {t('language_chinese_traditional')}
          {currentLanguage === 'zh-TW' && (
            <Check className="h-4 w-4 ml-2" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('ja')}
          className={currentLanguage === 'ja' ? 'bg-muted' : ''}
        >
          {t('language_japanese')}
          {currentLanguage === 'ja' && (
            <Check className="h-4 w-4 ml-2" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;