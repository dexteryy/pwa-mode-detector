import React from 'react';

interface IconWithFallbackProps {
  name: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const IconWithFallback: React.FC<IconWithFallbackProps> = ({ 
  name, 
  className = '', 
  size = 'md' 
}) => {
  // 处理不同尺寸的样式
  const sizeClasses = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'md': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl'
  };

  // 为图标定义固定尺寸容器，防止布局抖动
  const containerSizes = {
    'xs': 'w-3 h-3',
    'sm': 'w-4 h-4',
    'md': 'w-6 h-6',
    'lg': 'w-8 h-8',
    'xl': 'w-10 h-10'
  };

  const iconSize = sizeClasses[size];
  const containerSize = containerSizes[size];

  return (
    <span className={`material-icons ${iconSize} ${containerSize} inline-flex items-center justify-center overflow-hidden ${className}`}>
      {name}
    </span>
  );
};

export default IconWithFallback;