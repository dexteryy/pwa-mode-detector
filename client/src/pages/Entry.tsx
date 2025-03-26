import { Link } from "wouter";

// 定义 PWA 的 display 模式选项
const displayModes = [
  {
    name: "standalone",
    displayName: "独立窗口模式 (standalone)",
    description: "应用在没有浏览器界面的独立窗口中运行",
    icon: "tablet_mac"
  },
  {
    name: "minimal-ui",
    displayName: "最小界面模式 (minimal-ui)", 
    description: "应用在带有最小浏览器控件的窗口中运行",
    icon: "tab"
  },
  {
    name: "fullscreen",
    displayName: "全屏模式 (fullscreen)",
    description: "应用占据整个屏幕，没有任何浏览器界面",
    icon: "fullscreen"
  },
  {
    name: "browser",
    displayName: "浏览器模式 (browser)",
    description: "应用在常规浏览器标签页中运行",
    icon: "public"
  }
];

const Entry = () => {
  return (
    <div className="bg-gray-100 font-sans min-h-screen">
      {/* Header */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-center">PWA 展示模式演示</h1>
          <p className="text-center mt-2 text-blue-100">选择一种展示模式来查看 PWA 的不同运行方式</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">什么是 PWA 展示模式？</h2>
            <p className="text-gray-600 mb-4">
              PWA（渐进式网络应用）可以以不同的方式在用户设备上运行和显示。Web App Manifest 的 
              <code className="bg-gray-100 px-1 rounded">display</code> 属性定义了应用的显示模式，
              影响浏览器 UI 元素的可见性和应用的整体外观。
            </p>
            <p className="text-gray-600">
              点击下方的任意卡片，将跳转到相应的 PWA 应用，每个应用都有不同的展示模式配置。
              安装应用后，你将能够观察到不同展示模式下的用户体验差异。
            </p>
          </div>

          {/* Display Mode Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayModes.map(mode => (
              <Link key={mode.name} href={`/pwa/${mode.name}`}>
                <a className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary">
                  <div className="flex items-center mb-4">
                    <span className="material-icons text-4xl text-primary mr-3">{mode.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-800">{mode.displayName}</h3>
                  </div>
                  <p className="text-gray-600">{mode.description}</p>
                  <div className="mt-4 flex justify-end">
                    <span className="text-primary font-medium flex items-center">
                      查看演示
                      <span className="material-icons ml-1">arrow_forward</span>
                    </span>
                  </div>
                </a>
              </Link>
            ))}
          </div>

          {/* Technical Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="material-icons mr-2">code</span>
              技术说明
            </h2>
            <p className="text-gray-600 mb-4">
              每个 PWA 应用使用相同的代码库，但有不同的 Web App Manifest 配置。
              应用将检测当前的实际运行模式，并与 manifest 中声明的预期模式进行比较。
            </p>
            <p className="text-gray-600">
              要获得完整的 PWA 体验，请使用支持 PWA 的浏览器（如 Chrome、Edge、Safari）并安装应用。
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>PWA 展示模式演示 | 选择一种模式开始体验</p>
        </div>
      </footer>
    </div>
  );
};

export default Entry;