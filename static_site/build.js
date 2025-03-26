import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 定义构建配置
async function buildStaticSite() {
  try {
    console.log('开始构建静态站点...');
    
    // 使用vite.config.ts中的配置构建应用
    await build({
      configFile: path.resolve(__dirname, 'vite.config.ts'),
      root: __dirname,
    });
    
    console.log('静态站点构建完成！');
  } catch (e) {
    console.error('构建过程出错:', e);
    process.exit(1);
  }
}

buildStaticSite();