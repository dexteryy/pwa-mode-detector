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
  DropdownMenuGroup,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  
  // Listen for language changes to ensure UI state is synchronized with the actual language
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
  
  // Display abbreviation or icon for the current language
  const getCurrentLanguageDisplay = () => {
    switch (currentLanguage) {
      case 'zh':
        return '简';
      case 'zh-TW':
        return '繁';
      case 'ja':
        return 'JP';
      case 'ko':
        return 'KO';
      case 'de':
        return 'DE';
      case 'fr':
        return 'FR';
      case 'es':
        return 'ES';
      case 'pt':
        return 'PT';
      default:
        return 'EN';
    }
  };

  // Function to create language menu items
  const createLanguageMenuItem = (languageCode: string, translationKey: string) => (
    <DropdownMenuItem 
      onClick={() => handleLanguageChange(languageCode)}
      className={currentLanguage === languageCode ? 'bg-muted' : ''}
    >
      {t(translationKey)}
      {currentLanguage === languageCode && (
        <Check className="h-4 w-4 ml-2" />
      )}
    </DropdownMenuItem>
  );

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
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* English */}
        {createLanguageMenuItem('en', 'language_english')}
        
        <DropdownMenuSeparator />
        
        {/* East Asian languages */}
        <DropdownMenuGroup>
          {createLanguageMenuItem('zh', 'language_chinese')}
          {createLanguageMenuItem('zh-TW', 'language_chinese_traditional')}
          {createLanguageMenuItem('ja', 'language_japanese')}
          {createLanguageMenuItem('ko', 'language_korean')}
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* European languages */}
        <DropdownMenuGroup>
          {createLanguageMenuItem('de', 'language_german')}
          {createLanguageMenuItem('fr', 'language_french')}
          {createLanguageMenuItem('es', 'language_spanish')}
          {createLanguageMenuItem('pt', 'language_portuguese')}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;