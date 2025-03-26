export default {
  // 通用
  "language": "语言",
  "language_english": "英文",
  "language_chinese": "中文",

  // 入口页面
  "entry_title": "PWA 展示模式演示",
  "entry_subtitle": "选择一种展示模式来查看 PWA 的不同运行方式",
  "what_is_pwa_display_mode": "什么是 PWA 展示模式？",
  "pwa_display_mode_description": "PWA（渐进式网络应用）可以以不同的方式在用户设备上运行和显示。Web App Manifest 的 display 属性定义了应用的显示模式，影响浏览器 UI 元素的可见性和应用的整体外观。",
  "click_card_instruction": "点击下方的任意卡片，将跳转到相应的 PWA 应用，每个应用都有不同的展示模式配置。安装应用后，你将能够观察到不同展示模式下的用户体验差异。",
  "view_demo": "查看演示",
  "technical_details": "技术说明",
  "technical_description": "每个 PWA 应用使用相同的代码库，但有不同的 Web App Manifest 配置。应用将检测当前的实际运行模式，并与 manifest 中声明的预期模式进行比较。",
  "browser_support_note": "要获得完整的 PWA 体验，请使用支持 PWA 的浏览器（如 Chrome、Edge、Safari）并安装应用。",
  "footer_text": "PWA 展示模式演示 | 选择一种模式开始体验",

  // 展示模式
  "standalone_name": "独立窗口模式 (standalone)",
  "standalone_description": "应用在没有浏览器界面的独立窗口中运行",
  "minimal_ui_name": "最小界面模式 (minimal-ui)",
  "minimal_ui_description": "应用在带有最小浏览器控件的窗口中运行",
  "fullscreen_name": "全屏模式 (fullscreen)",
  "fullscreen_description": "应用占据整个屏幕，没有任何浏览器界面",
  "browser_name": "浏览器模式 (browser)",
  "browser_description": "应用在常规浏览器标签页中运行",

  // PWA 检测器
  "detector_title": "PWA 展示模式检测器",
  "detector_subtitle": "此工具检测您的 PWA 当前的运行方式",
  "current_mode": "当前模式",
  "expected_mode": "预期模式",
  "running_as": "运行方式",
  "browser_tab": "浏览器标签页",
  "pwa_window": "PWA独立窗口",
  "status_title": "状态",
  "installable": "可安装",
  "not_installable": "不可安装",
  "install_pwa": "安装PWA",
  "back_to_home": "返回首页",
  "device_info": "设备信息",
  "user_agent": "用户代理",
  "detector_mode_mismatch": "检测到的实际运行模式与 manifest 中配置的不同。这可能是因为浏览器不支持该模式或者应用尚未安装。",
  "status_standalone_running": "应用已在独立窗口模式下运行",
  "status_minimal_ui_prompt": "您可以安装此应用以体验完整的独立窗口模式",
  "status_fullscreen_running": "应用已在全屏模式下运行",
  "status_browser_installable": "您可以安装此应用以体验 PWA 独立窗口模式",
  "status_browser_not_installable": "您的浏览器不支持安装 PWA 应用"
}