#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 确保静态站点目录中有package.json
if (!fs.existsSync(path.join(__dirname, 'package.json'))) {
  console.log('创建临时package.json文件...');
  const packageJson = {
    "name": "pwa-detector-static",
    "private": true,
    "version": "0.0.1",
    "type": "module",
    "scripts": {
      "build": "vite build",
      "preview": "vite preview"
    },
    "dependencies": {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "react-icons": "^4.12.0",
      "wouter": "^2.12.1",
      "@tanstack/react-query": "^5.8.2",
      "lucide-react": "^0.293.0",
      "clsx": "^2.0.0"
    },
    "devDependencies": {
      "@types/react": "^18.2.15",
      "@types/react-dom": "^18.2.7",
      "@vitejs/plugin-react": "^4.0.3",
      "typescript": "^5.0.2",
      "vite": "^4.4.5"
    }
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
}

// 运行Vite构建
console.log('运行Vite构建...');
try {
  execSync('npx vite build --outDir ../dist --config vite.config.ts', { 
    cwd: __dirname,
    stdio: 'inherit'
  });
  console.log('构建成功完成！');
} catch (error) {
  console.error('构建过程中出错:', error);
  process.exit(1);
}

// 复制manifest和图标
console.log('确保manifest和图标文件已复制...');
try {
  if (fs.existsSync(path.join(__dirname, 'public'))) {
    execSync('cp -r public/* ../dist/', { 
      cwd: __dirname,
      stdio: 'inherit'
    });
  }
  console.log('静态资源复制完成！');
} catch (error) {
  console.error('复制静态资源时出错:', error);
}

console.log('全部完成！您的PWA静态站点已成功构建。');