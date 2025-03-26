import { useTranslation } from "react-i18next";
import TechTermLink, { TECH_TERM_URLS, TechTermKey } from "./TechTermLink";

interface ModeInfo {
  name: string;
  displayName: string;
  description: string;
}

interface DetectionCardProps {
  mode: ModeInfo;
  isActive: boolean;
}

const DetectionCard = ({ mode, isActive }: DetectionCardProps) => {
  const { t } = useTranslation();
  
  // Card styling based on active state
  const cardClassName = isActive
    ? "border rounded-lg p-4 bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-600"
    : "border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/80 dark:border-gray-700";
    
  const indicatorClassName = isActive
    ? "inline-block w-3 h-3 rounded-full bg-green-500 dark:bg-green-400"
    : "inline-block w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600";
    
  const statusClassName = isActive 
    ? "text-sm text-green-600 dark:text-green-400 font-medium"
    : "text-sm text-gray-600 dark:text-gray-400";
    
  const statusText = isActive ? t('mode_active') : t('mode_inactive');

  // 将模式名称映射到TechTermKey类型
  const getModeKey = (name: string): TechTermKey => {
    switch(name) {
      case 'browser': return 'browser';
      case 'minimal-ui': return 'minimal-ui';
      case 'standalone': return 'standalone';
      case 'fullscreen': return 'fullscreen';
      default: return 'display'; // 默认返回display属性文档
    }
  };

  const modeKey = getModeKey(mode.name);

  return (
    <div className={cardClassName}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">
          <TechTermLink term={mode.displayName} url={TECH_TERM_URLS[modeKey]}>
            {mode.displayName}
          </TechTermLink>
        </h3>
        <span className={indicatorClassName}></span>
      </div>
      <p className={statusClassName}>{statusText}</p>
    </div>
  );
};

export default DetectionCard;
