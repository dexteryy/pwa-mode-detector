import React from 'react';
import { useTranslation } from 'react-i18next';
import { processTerms } from '../lib/termLinks';

interface TermTextProps {
  textKey: string; // i18n 翻译键名
  className?: string;
}

// 这个组件接收翻译键，获取文本并处理其中的术语链接
const TermText: React.FC<TermTextProps> = ({ textKey, className = '' }) => {
  const { t } = useTranslation();
  const text = t(textKey);
  
  return (
    <span className={className}>
      {processTerms(text)}
    </span>
  );
};

export default TermText;