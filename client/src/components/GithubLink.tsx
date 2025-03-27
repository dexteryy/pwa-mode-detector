import React from 'react';
import { Github } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface GithubLinkProps {
  className?: string;
}

const GithubLink: React.FC<GithubLinkProps> = ({ className }) => {
  const { t } = useTranslation();
  
  return (
    <a
      href="https://github.com/dexteryy/pwa-mode-detector"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "text-white flex items-center justify-center whitespace-nowrap rounded-md",
        "w-10 h-10 hover:bg-blue-400/20 dark:hover:bg-blue-500/30 transition-colors",
        className
      )}
      aria-label={t('github_repo')}
    >
      <Github className="h-5 w-5" />
    </a>
  );
};

export default GithubLink;