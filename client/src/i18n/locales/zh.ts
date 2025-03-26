export default {
  // 通用
  language: "选择语言",
  language_english: "English (英文)",
  language_chinese: "简体中文",
  language_chinese_traditional: "繁體中文 (繁体中文)",
  language_japanese: "日本語 (日文)",
  language_german: "Deutsch (德文)",
  language_french: "Français (法文)",
  language_spanish: "Español (西班牙文)",
  language_portuguese: "Português (葡萄牙文)",
  language_korean: "한국어 (韩文)",

  // 入口页面
  entry_title: "PWA 展示模式演示",
  entry_subtitle: "选择一种展示模式来查看 PWA 的不同运行方式",
  what_is_pwa_display_mode: "什么是 PWA 展示模式？",
  pwa_display_mode_description:
    "PWA（渐进式网络应用）可以以不同的方式在用户设备上运行和显示。Web App Manifest 的 display 属性定义了应用的显示模式，影响浏览器 UI 元素的可见性和应用的整体外观。",
  click_card_instruction:
    "点击下方的任意卡片，将跳转到相应的 PWA 应用，每个应用都有不同的展示模式配置。安装应用后，你将能够观察到不同展示模式下的用户体验差异。",
  view_demo: "查看演示",
  technical_details: "技术说明",
  technical_description:
    "每个 PWA 应用使用相同的代码库，但有不同的 Web App Manifest 配置。应用将检测当前的实际运行模式，并与 manifest 中声明的预期模式进行比较。",
  browser_support_note:
    "要获得完整的 PWA 体验，请使用支持 PWA 的浏览器（如 Chrome、Edge、Safari）并安装应用。",
  footer_text: "PWA 展示模式演示 | 选择一种模式开始体验",

  // 展示模式
  standalone_name: "独立窗口模式",
  standalone_description: "应用在没有浏览器界面的独立窗口中运行",
  minimal_ui_name: "最小界面模式",
  minimal_ui_description: "应用在带有最小浏览器控件的窗口中运行",
  fullscreen_name: "全屏模式",
  fullscreen_description: "应用占据整个屏幕，没有任何浏览器界面",
  browser_name: "浏览器模式",
  browser_description: "应用在常规浏览器标签页中运行",

  // 状态卡片
  current_status: "当前状态",
  browser_tab: "浏览器标签页",
  pwa_standalone: "PWA独立窗口",
  can_be_installed: "可安装",
  already_installed: "已安装",
  install_pwa: "安装PWA",
  refresh_detection: "刷新",
  status_browser_running: "应用正在标准浏览器模式下运行",
  install_capability_title: "安装状态",
  install_disabled_manifest_browser:
    "manifest中的display属性设置为'browser'，此模式不支持安装",
  install_disabled_browser_unsupported: "您的浏览器不支持PWA安装",
  install_button_disabled: "安装功能不可用",

  // PWA 检测器
  detector_title: "PWA 展示模式检测器",
  detector_subtitle: "此工具检测您的 PWA 当前的运行方式",
  current_mode: "当前模式",
  expected_mode: "预期模式",
  pwa_window: "PWA独立窗口",
  status_title: "状态",
  installable: "可安装",
  not_installable: "不可安装",
  back_to_home: "选择模式",
  device_info: "设备信息",
  user_agent: "用户代理",
  detector_mode_mismatch:
    "检测到的实际运行模式与 manifest 中配置的不同。这可能是因为浏览器不支持该模式或者应用尚未安装。",
  status_standalone_running: "应用已在独立窗口模式下运行",
  status_minimal_ui_prompt: "您可以安装此应用以体验完整的独立窗口模式",
  status_fullscreen_running: "应用已在全屏模式下运行",
  status_browser_installable: "您可以安装此应用以体验 PWA 独立窗口模式",
  status_browser_not_installable: "您的浏览器不支持安装 PWA 应用",
  status_browser_checking: "正在检查此页面是否可安装...",
  checking: "检查中...",
  browser_mode_info:
    "此页面虽然具有 Web App Manifest，但由于 display 属性设置为 'browser'，因此无法安装为 PWA",
  mode_active: "已启用",
  mode_inactive: "未启用",
  about_pwa_modes: "关于 PWA 模式",
  pwa_different_modes: "PWA（渐进式 Web 应用）可以在不同的显示模式下运行：",

  // 刷新提示
  refreshing: "正在刷新...",
  refresh_process:
    "正在检查 display mode、安装状态及更新 Web App Manifest 信息",

  // Manifest 查看器
  manifest_viewer_title: "Web App Manifest",
  view_manifest: "查看 Manifest 内容",
  loading: "加载中...",
  manifest_error: "加载 Manifest 出错",
  manifest_name: "名称",
  manifest_short_name: "短名称",
  manifest_start_url: "起始URL",
  manifest_scope: "作用域",
};
