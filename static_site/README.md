# PWA 显示模式检测器 - 静态站点版本

这个目录包含了将PWA显示模式检测器构建为可部署静态网站的必要文件。

## 构建说明

### 自动构建（推荐）

1. 在终端中，导航到此目录：
   ```
   cd static_site
   ```

2. 运行构建脚本：
   ```
   ./build.sh
   ```

3. 构建完成后，生成的静态网站将位于项目根目录的 `dist` 文件夹中。

### 手动构建

如果自动脚本不起作用，您可以手动执行以下步骤：

1. 创建必要的目录：
   ```
   mkdir -p public/manifests public/icons
   ```

2. 复制静态资源：
   ```
   cp -r ../client/public/icons/* public/icons/
   cp -r ../client/public/manifests/* public/manifests/
   cp ../client/public/manifest.json public/
   ```

3. 运行构建脚本：
   ```
   node build.js
   ```

## 部署说明

构建完成后，您可以将 `dist` 目录中的所有文件部署到任何静态网站托管服务，如：

- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting
- Replit Pages

## 本地预览

您可以使用以下命令在本地预览构建好的站点：

```
npx serve ../dist
```

## 文件说明

- `build.sh` - 自动构建脚本
- `build.js` - Node.js构建脚本
- `App.tsx` - 静态站点专用的React应用组件
- `main.tsx` - 应用入口点
- `vite.config.ts` - Vite构建配置
- `index.html` - HTML模板文件

## 注意事项

1. 此静态版本不需要后端服务器即可运行
2. 所有PWA功能（显示模式检测等）将在部署后正常工作
3. 确保您的托管提供商支持配置HTTPS，这对PWA至关重要