import React from 'react';
import { Moon, Sun, MonitorSmartphone } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { t } = useTranslation();

  // 获取当前图标
  const getIcon = () => {
    if (theme === 'system') {
      return <MonitorSmartphone className="h-4 w-4" />;
    }
    return theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "text-white flex items-center justify-center cursor-pointer whitespace-nowrap rounded-md",
            "w-10 h-10 hover:bg-blue-400/20 dark:hover:bg-blue-500/30 transition-colors",
            className
          )}
          aria-label={t('theme_toggle')}
        >
          {getIcon()}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>{t('light_mode')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>{t('dark_mode')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <MonitorSmartphone className="mr-2 h-4 w-4" />
          <span>{t('system_mode')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;