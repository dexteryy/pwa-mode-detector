# PWA 展示模式检测器

<div align="center">
  <img src="client/public/icons/icon-512x512.png" alt="PWA Mode Detector logo" width="120">
  <h3>一个用于展示和测试PWA不同显示模式的工具</h3>
</div>

![许可证](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-v18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-v5-blue)
![PWA](https://img.shields.io/badge/PWA-ready-brightgreen)

[English](./README.md) | 简体中文

## 简介

PWA 展示模式检测器是一个专为开发者设计的工具，用于展示和测试渐进式Web应用（PWA）在不同显示模式下的行为和外观。该工具允许你体验和比较 PWA 的四种主要展示模式：`standalone`、`minimal-ui`、`fullscreen` 和 `browser`。

<div align="center">
  <img src="screenshots/preview.png" alt="应用预览" width="80%">
</div>

## 特性

- ✅ **实时模式检测**：自动识别当前 PWA 的运行模式
- ✅ **多模式支持**：测试四种不同的 PWA 显示模式
- ✅ **独立安装**：每种模式可以作为独立 PWA 安装
- ✅ **响应式设计**：在各种设备上都能良好工作
- ✅ **用户代理信息**：显示当前环境的详细浏览器信息
- ✅ **安装按钮**：在支持的环境中提供直观的安装体验

## 四种显示模式

1. **独立窗口模式 (standalone)**：PWA 在没有浏览器界面的独立窗口中运行，类似于原生应用
2. **最小界面模式 (minimal-ui)**：PWA 在带有最小浏览器控件的窗口中运行
3. **全屏模式 (fullscreen)**：PWA 占据整个屏幕，没有任何浏览器界面
4. **浏览器模式 (browser)**：PWA 在常规浏览器标签页中运行

## 开始使用

### 在线演示

访问 [https://pwa-mode-detector.example.com](https://pwa-mode-detector.example.com) 查看在线演示。

### 本地运行

1. 克隆仓库
   ```bash
   git clone https://github.com/yourusername/pwa-mode-detector.git
   cd pwa-mode-detector
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 启动开发服务器
   ```bash
   npm run dev
   ```

4. 在浏览器中打开 `http://localhost:5000`

### 构建生产版本

```bash
npm run build
```

生成的文件将位于 `dist` 目录中。

## 技术栈

- **前端框架**：React + TypeScript
- **构建工具**：Vite
- **CSS框架**：Tailwind CSS + shadcn/ui
- **路由**：wouter
- **数据获取**：TanStack Query
- **后端**：Express.js

## 工作原理

该应用通过以下方式工作：

1. 用户可以从主页选择要测试的 PWA 显示模式
2. 每个模式都有自己的 `manifest.json` 文件，定义了 `display` 属性和其他相关配置
3. 应用通过 `window.matchMedia()` 检测当前实际的显示模式
4. 比较实际模式和预期模式，提供视觉反馈
5. 每种模式都配置了独立的 `scope`，允许它们作为独立 PWA 同时安装

## 贡献

欢迎贡献！请阅读 [贡献指南](CONTRIBUTING.zh.md) 了解如何开始。

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请通过以下方式联系我们：

- 提交 [GitHub issue](https://github.com/yourusername/pwa-mode-detector/issues)
- 发送邮件至 [your-email@example.com](mailto:your-email@example.com)

---

<div align="center">
  <p>如果这个项目对你有帮助，请考虑给它一个⭐️</p>
  <p>Made with ❤️ for the PWA community</p>
</div>