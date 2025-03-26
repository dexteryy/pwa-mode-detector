# PWA模式检测器 - 静态站点构建指南

这个目录包含了将PWA模式检测器应用构建为静态网站的必要文件。

## 构建步骤

1. 安装依赖:
```bash
cd static_site
npm install
```

2. 构建静态站点:
```bash
npm run build
```

构建完成后，静态站点文件将位于项目根目录的`dist`文件夹中。

## 预览构建后的站点

构建完成后，你可以预览静态站点:
```bash
npm run preview
```

## 部署到Replit静态页面

Replit提供了部署静态网站的功能。请按照以下步骤操作:

1. 在Replit界面顶部点击"Deploy"按钮
2. 选择"Static Site"作为部署类型
3. 确认`dist`目录作为静态文件源
4. 点击部署

## 注意事项

- 所有PWA manifest文件都已正确配置
- 静态站点包含所有PWA模式检测功能
- 图标文件位于`client/public/icons`目录中