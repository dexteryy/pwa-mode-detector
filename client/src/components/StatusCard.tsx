interface StatusCardProps {
  mode: string;
  isInstallable: boolean;
}

const StatusCard = ({ mode, isInstallable }: StatusCardProps) => {
  // Determine status card styling based on mode
  let cardClassName = "bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 ";
  let iconClassName = "material-icons text-3xl mr-3 ";
  let iconName = "";
  let statusText = "";
  let promptText = "";

  if (mode === "standalone") {
    cardClassName += "border-green-500";
    iconClassName += "text-green-500";
    iconName = "check_circle";
    statusText = "当前运行模式：PWA独立窗口（standalone）";
    promptText = "应用已在独立窗口模式下运行";
  } else if (mode === "minimal-ui") {
    cardClassName += "border-blue-500";
    iconClassName += "text-blue-500";
    iconName = "view_compact";
    statusText = "当前运行模式：最小界面（minimal-ui）";
    promptText = "您可以安装此应用以体验完整的独立窗口模式";
  } else if (mode === "fullscreen") {
    cardClassName += "border-blue-500";
    iconClassName += "text-blue-500";
    iconName = "fullscreen";
    statusText = "当前运行模式：全屏（fullscreen）";
    promptText = "应用已在全屏模式下运行";
  } else {
    cardClassName += "border-amber-500";
    iconClassName += "text-amber-500";
    iconName = "public";
    statusText = "当前运行模式：浏览器标签页（browser）";
    promptText = isInstallable 
      ? "您可以安装此应用以体验 PWA 独立窗口模式"
      : "您的浏览器不支持安装 PWA 应用";
  }

  return (
    <div className={cardClassName}>
      <div className="flex items-center mb-4">
        <span className={iconClassName}>{iconName}</span>
        <div>
          <h2 className="text-xl font-semibold text-dark">{statusText}</h2>
          <p className="text-gray-500">{promptText}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
