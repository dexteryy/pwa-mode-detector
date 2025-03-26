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
  const { t, ready } = useTranslation();
  
  // 如果 i18n 还没准备好，显示加载状态
  if (!ready) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50 animate-pulse">
        <div className="flex justify-between items-center mb-2">
          <div className="h-5 bg-gray-200 rounded w-32"></div>
          <div className="w-3 h-3 rounded-full bg-gray-200"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    );
  }
  
  // Card styling based on active state
  const cardClassName = isActive
    ? "border rounded-lg p-4 bg-green-50 border-green-500"
    : "border rounded-lg p-4 bg-gray-50";
    
  const indicatorClassName = isActive
    ? "inline-block w-3 h-3 rounded-full bg-green-500"
    : "inline-block w-3 h-3 rounded-full bg-gray-300";
    
  const statusClassName = isActive 
    ? "text-sm text-green-600 font-medium"
    : "text-sm text-gray-600";
    
  const statusText = isActive ? t('mode_active') : t('mode_inactive');

  return (
    <div className={cardClassName}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{mode.displayName} ({mode.name})</h3>
        <span className={indicatorClassName}></span>
      </div>
      <p className={statusClassName}>{statusText}</p>
    </div>
  );
};

export default DetectionCard;
