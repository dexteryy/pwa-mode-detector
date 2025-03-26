import { useTranslation } from "react-i18next";

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

  return (
    <div className={cardClassName}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{mode.displayName}</h3>
        <span className={indicatorClassName}></span>
      </div>
      <p className={statusClassName}>{statusText}</p>
    </div>
  );
};

export default DetectionCard;
