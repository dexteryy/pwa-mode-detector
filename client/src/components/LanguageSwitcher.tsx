import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LanguageSwitcher: React.FC = () => {
  const { t, i18n, ready } = useTranslation();
  
  // 如果 i18n 还没准备好，显示一个简单的加载图标
  if (!ready) {
    return (
      <Button variant="outline" size="icon" className="rounded-full opacity-50">
        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent"></div>
      </Button>
    );
  }
  
  const currentLanguage = i18n.language;

  const handleLanguageChange = (language: string) => {
    changeLanguage(language);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t('language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')}
          className={currentLanguage === 'en' ? 'bg-muted' : ''}
        >
          {t('language_english')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('zh')}
          className={currentLanguage === 'zh' ? 'bg-muted' : ''}
        >
          {t('language_chinese')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;