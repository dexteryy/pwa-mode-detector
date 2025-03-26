#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 彩色输出函数
const colorLog = {
  info: (msg) => console.log('\x1b[34m%s\x1b[0m', msg),
  success: (msg) => console.log('\x1b[32m%s\x1b[0m', msg),
  warning: (msg) => console.log('\x1b[33m%s\x1b[0m', msg),
  error: (msg) => console.log('\x1b[31m%s\x1b[0m', msg)
};

// 检查必需的文件
colorLog.info('检查项目结构...');

// 检查源代码文件
const requiredFiles = [
  'App.tsx',
  'main.tsx',
  'vite.config.ts',
  'index.html'
];

let missingFiles = [];
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(__dirname, file))) {
    missingFiles.push(file);
  }
}

if (missingFiles.length > 0) {
  colorLog.error(`缺少必要的文件: ${missingFiles.join(', ')}`);
  colorLog.warning('构建过程可能会失败。尝试从源文件复制...');
  
  // 尝试从client目录复制缺少的文件
  try {
    for (const file of missingFiles) {
      if (file === 'App.tsx' || file === 'main.tsx') {
        // 这些文件应该已经存在于static_site中，且有特殊处理
        continue;
      }
      if (fs.existsSync(path.join(__dirname, '../client/src', file))) {
        fs.copyFileSync(
          path.join(__dirname, '../client/src', file),
          path.join(__dirname, file)
        );
        colorLog.success(`已复制文件: ${file}`);
      }
    }
  } catch (error) {
    colorLog.error(`复制源文件失败: ${error.message}`);
  }
}

// 确保静态站点目录中有package.json
if (!fs.existsSync(path.join(__dirname, 'package.json'))) {
  colorLog.info('创建package.json文件...');
  const packageJson = {
    "name": "pwa-detector-static",
    "private": true,
    "version": "1.0.0",
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
      "clsx": "^2.0.0",
      "tailwind-merge": "^2.0.0"
    },
    "devDependencies": {
      "@types/react": "^18.2.15",
      "@types/react-dom": "^18.2.7",
      "@vitejs/plugin-react": "^4.0.3",
      "autoprefixer": "^10.4.14",
      "postcss": "^8.4.24",
      "tailwindcss": "^3.3.2",
      "typescript": "^5.0.2",
      "vite": "^4.4.5"
    }
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  colorLog.success('package.json创建完成');
}

// 确保存在tailwind和postcss配置
if (!fs.existsSync(path.join(__dirname, 'tailwind.config.js')) && 
    fs.existsSync(path.join(__dirname, '../tailwind.config.ts'))) {
  colorLog.info('复制Tailwind配置...');
  try {
    // 由于配置格式不同，我们需要转换一下
    let tailwindConfig = fs.readFileSync(path.join(__dirname, '../tailwind.config.ts'), 'utf8');
    tailwindConfig = tailwindConfig.replace('export default', 'module.exports =');
    tailwindConfig = tailwindConfig.replace(/import\s+[^;]+;/g, '');
    
    fs.writeFileSync(path.join(__dirname, 'tailwind.config.js'), tailwindConfig);
    colorLog.success('Tailwind配置复制完成');
  } catch (error) {
    colorLog.error(`复制Tailwind配置失败: ${error.message}`);
  }
}

if (!fs.existsSync(path.join(__dirname, 'postcss.config.js')) && 
    fs.existsSync(path.join(__dirname, '../postcss.config.js'))) {
  colorLog.info('复制PostCSS配置...');
  try {
    fs.copyFileSync(
      path.join(__dirname, '../postcss.config.js'),
      path.join(__dirname, 'postcss.config.js')
    );
    colorLog.success('PostCSS配置复制完成');
  } catch (error) {
    colorLog.error(`复制PostCSS配置失败: ${error.message}`);
  }
}

// 确保public目录中有必要的文件
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(path.join(publicDir, 'manifest.json'))) {
  colorLog.warning('未找到manifest.json，尝试从client目录复制...');
  try {
    if (fs.existsSync(path.join(__dirname, '../client/public/manifest.json'))) {
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      fs.copyFileSync(
        path.join(__dirname, '../client/public/manifest.json'),
        path.join(publicDir, 'manifest.json')
      );
      colorLog.success('manifest.json复制完成');
    }
  } catch (error) {
    colorLog.error(`复制manifest.json失败: ${error.message}`);
  }
}

// 运行Vite构建
colorLog.info('开始Vite构建过程...');
try {
  execSync('npx vite build --outDir ../dist --config vite.config.ts', { 
    cwd: __dirname,
    stdio: 'inherit'
  });
  colorLog.success('Vite构建成功完成！');
} catch (error) {
  colorLog.error(`Vite构建失败: ${error.message}`);
  process.exit(1);
}

// 复制manifest和图标
colorLog.info('复制manifest和图标文件...');
try {
  if (fs.existsSync(path.join(__dirname, 'public'))) {
    execSync('cp -r public/* ../dist/ 2>/dev/null || :', { 
      cwd: __dirname,
      stdio: 'inherit',
      shell: true
    });
    colorLog.success('静态资源复制完成');
  } else {
    colorLog.warning('public目录不存在，跳过资源复制');
  }
} catch (error) {
  colorLog.error(`复制静态资源失败: ${error.message}`);
}

// 处理404页面
colorLog.info('创建404.html页面（用于GitHub Pages等托管服务）...');
try {
  fs.copyFileSync(
    path.join(__dirname, '../dist/index.html'),
    path.join(__dirname, '../dist/404.html')
  );
  colorLog.success('404.html页面创建完成');
} catch (error) {
  colorLog.error(`创建404.html失败: ${error.message}`);
}

colorLog.success('==========================================');
colorLog.success('  PWA显示模式检测器 - 静态构建完成！');
colorLog.success('==========================================');
colorLog.info('您的应用已成功构建为纯静态PWA，无需服务器即可运行。');
colorLog.info('构建结果位于: ../dist 目录');
console.log('');