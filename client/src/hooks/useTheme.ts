import { useState, useEffect } from 'react';

// 定义主题类型
type ThemeType = 'light' | 'dark';

export function useTheme() {
  // 初始化状态，优先从localStorage读取
  const [theme, setTheme] = useState<ThemeType>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme') as ThemeType;
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
      }
      
      // 如果没有存储的主题，检查系统主题
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light'; // 默认为亮色模式
  });

  // 切换主题的函数
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // 在主题变化时应用到DOM和localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      
      // 移除旧的类并添加新的类
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      
      // 保存到localStorage
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  return { theme, toggleTheme };
}