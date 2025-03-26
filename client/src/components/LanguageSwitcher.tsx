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
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const handleLanguageChange = (language: string) => {
    changeLanguage(language);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="bg-white text-blue-500 px-2 sm:px-4 py-2 flex items-center justify-center rounded-full hover:bg-blue-50 transition-colors cursor-pointer w-10 h-10 sm:w-auto sm:h-auto">
          <Globe className="h-[1.2rem] w-[1.2rem] md:mr-2" />
          <span className="hidden md:inline">{t('language')}</span>
        </div>
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