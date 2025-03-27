import { useState, useEffect } from 'react';

// 定义主题类型
type ThemeType = 'light' | 'dark' | 'system';

export function useTheme() {
  // 初始化状态，优先从localStorage读取
  const [theme, setTheme] = useState<ThemeType>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme') as ThemeType;
      if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
        return storedTheme;
      }
    }
    return 'system'; // 默认为系统主题
  });

  // 获取当前实际应用的主题（考虑系统主题）
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (theme === 'system' && typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme === 'system' ? 'light' : theme;
  });

  // 设置特定主题
  const setThemeMode = (newTheme: ThemeType) => {
    setTheme(newTheme);
  };

  // 循环切换主题：system -> light -> dark -> system
  const cycleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'system') return 'light';
      if (prevTheme === 'light') return 'dark';
      return 'system';
    });
  };

  // 监听系统主题变化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // 当系统主题变化时更新resolvedTheme
      const handleChange = () => {
        if (theme === 'system') {
          setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
        }
      };

      // 初始设置
      handleChange();
      
      // 添加监听器
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else {
        // 旧版浏览器兼容
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
    return undefined;
  }, [theme]);

  // 当theme变化时更新resolvedTheme
  useEffect(() => {
    if (theme !== 'system') {
      setResolvedTheme(theme as 'light' | 'dark');
    } else if (typeof window !== 'undefined') {
      setResolvedTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  }, [theme]);

  // 应用主题到DOM和localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      
      // 移除旧的类并添加新的类
      root.classList.remove('light', 'dark');
      root.classList.add(resolvedTheme);
      
      // 保存用户选择到localStorage
      localStorage.setItem('theme', theme);
    }
  }, [theme, resolvedTheme]);

  return { 
    theme,           // 用户选择的主题（light/dark/system）
    resolvedTheme,   // 实际应用的主题（只有light/dark）
    setTheme: setThemeMode,  // 设置特定主题
    cycleTheme       // 循环切换主题
  };
}