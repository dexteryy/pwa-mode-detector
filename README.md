# PWA Display Mode Detector

<div align="center">
  <img src="client/public/icons/icon-512x512.png" alt="PWA Mode Detector logo" width="120">
  <h3>A sophisticated tool for analyzing and testing Progressive Web App display modes</h3>
</div>

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-v18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-v5-blue)
![PWA](https://img.shields.io/badge/PWA-ready-brightgreen)
![i18n](https://img.shields.io/badge/i18n-8_languages-orange)

English | [简体中文](./README.zh.md)

## Introduction

PWA Display Mode Detector is an advanced tool designed for developers to analyze, demonstrate, and test Progressive Web App (PWA) behavior across different display modes. This application provides context-aware insights into how PWAs run in various environments, allowing you to experience and compare the four main PWA display modes: `standalone`, `minimal-ui`, `fullscreen`, and `browser`.

<div align="center">
  <img src="screenshots/preview.png" alt="Application Preview" width="80%">
</div>

## Key Features

- ✅ **Real-time Mode Detection**: Instantly identifies and monitors the current PWA running mode
- ✅ **Intelligent Context Analysis**: Provides detailed insights about the PWA running environment
- ✅ **Multi-mode Installation Testing**: Test installation and behavior of all four PWA display modes
- ✅ **Independent Scope Installation**: Each mode can be installed as a separate PWA simultaneously
- ✅ **Dynamic Manifest Management**: Automatically serves appropriate manifests based on user context
- ✅ **Granular Installability Analysis**: Determines exactly why a PWA is or isn't installable
- ✅ **User Agent and Browser Intelligence**: Shows detailed environment information
- ✅ **Multi-language Support**: Available in 8 languages with automatic detection
- ✅ **Responsive UI**: Works seamlessly across mobile, tablet, and desktop devices

## Display Modes Explained

1. **Standalone Mode** (`display: standalone`): PWA runs in a standalone window without browser UI, similar to native applications. Has its own window, appears in task switchers, and doesn't display browser controls.

2. **Minimal UI Mode** (`display: minimal-ui`): PWA runs in a window with minimal browser controls. Shows minimal browser UI elements like a back button and possibly a URL bar.

3. **Fullscreen Mode** (`display: fullscreen`): PWA occupies the entire screen without any browser UI. Maximum screen real estate without any browser elements, ideal for immersive experiences.

4. **Browser Mode** (`display: browser`): PWA runs in a regular browser tab. Demonstrates how setting this explicit mode prevents the PWA from being installable.

## Getting Started

### Local Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/pwa-mode-detector.git
   cd pwa-mode-detector
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5000` in your browser

### Build for Production

```bash
npm run build
```

The generated files will be in the `dist` directory.

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: React Hooks + Context API
- **Build System**: Vite with HMR (Hot Module Replacement)
- **Styling**: Tailwind CSS with theme customization + shadcn/ui components
- **Routing**: wouter (lightweight React router)
- **API Client**: TanStack Query (React Query v5)
- **Backend**: Express.js server with dynamic manifest management
- **Internationalization**: i18next with language auto-detection
- **PWA Features**: Web App Manifest, installability detection, display mode media queries
- **Development Tools**: TypeScript, ESLint, Prettier

## How It Works

The application implements several advanced techniques:

1. **Dynamic Manifest Interception**: The server intercepts requests to different paths and serves the appropriate manifest.json file based on the requested display mode.

2. **Context-Aware PWA Detection**: The app uses multiple detection methods including:
   - `window.matchMedia('(display-mode: standalone)')` to detect current display mode
   - `navigator.getInstalledRelatedApps()` API where available
   - `BeforeInstallPromptEvent` to detect installation capability
   - iOS standalone mode detection via `navigator.standalone`

3. **Intelligent Installation Status Analysis**: The application uses a sophisticated algorithm to determine the exact reason why a PWA might not be installable:
   - Already running as a PWA
   - Browser doesn't support PWA installation
   - Manifest uses `display: browser` mode
   - Already installed but running in browser mode

4. **Manifest Scope Isolation**: Each display mode operates under its own scope (`/standalone`, `/minimal-ui`, etc.), allowing multiple installations of the same app with different display modes.

5. **Advanced Event Monitoring**: The app monitors display mode changes, visibility changes, and installation events to provide real-time updates without page refreshes.

6. **Internationalization with Term Linking**: Uses i18next with a custom system to automatically add reference links to key technical terms for educational purposes.

## Multi-language Support

The application supports 8 languages with automatic browser language detection:

- English (en)
- Simplified Chinese (zh)
- Traditional Chinese (zh-TW)
- Japanese (ja)
- Korean (ko)
- German (de)
- French (fr)
- Spanish (es)
- Portuguese (pt)

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) to get started.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or suggestions, please contact us through:

- Submit a [GitHub issue](https://github.com/yourusername/pwa-mode-detector/issues)
- Send an email to [your-email@example.com](mailto:your-email@example.com)

---

<div align="center">
  <p>If this project helped you, please consider giving it a ⭐️</p>
  <p>Made with ❤️ for the PWA community</p>
</div>