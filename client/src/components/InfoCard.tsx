const InfoCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-dark mb-4 flex items-center">
        <span className="material-icons mr-2">help_outline</span>
        关于 PWA 模式
      </h2>
      <div className="prose text-gray-700">
        <p className="mb-3">PWA（渐进式 Web 应用）可以在不同的显示模式下运行：</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>独立窗口 (standalone)：</strong>应用在没有浏览器界面的独立窗口中运行，类似于原生应用</li>
          <li><strong>浏览器 (browser)：</strong>应用在常规浏览器标签页中运行</li>
          <li><strong>最小界面 (minimal-ui)：</strong>应用在带有最小浏览器控件的窗口中运行</li>
          <li><strong>全屏 (fullscreen)：</strong>应用占据整个屏幕，没有任何浏览器界面</li>
        </ul>
      </div>
    </div>
  );
};

export default InfoCard;
