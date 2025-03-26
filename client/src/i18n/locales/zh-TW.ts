export default {
  // 通用
  language: "選擇語言",
  language_english: "English (英文)",
  language_chinese: "简体中文 (簡體中文)",
  language_chinese_traditional: "繁體中文",
  language_japanese: "日本語 (日文)",
  language_german: "Deutsch (德文)",
  language_french: "Français (法文)",
  language_spanish: "Español (西班牙文)",
  language_portuguese: "Português (葡萄牙文)",
  language_korean: "한국어 (韓文)",

  // 入口頁面
  entry_title: "PWA 展示模式演示",
  entry_subtitle: "選擇一種展示模式來查看 PWA 的不同運行方式",
  what_is_pwa_display_mode: "什麼是 PWA 展示模式？",
  pwa_display_mode_description:
    "PWA（漸進式網絡應用）可以以不同的方式在用戶設備上運行和顯示。Web App Manifest 的 display 屬性定義了應用的顯示模式，影響瀏覽器 UI 元素的可見性和應用的整體外觀。",
  click_card_instruction:
    "點擊下方的任意卡片，將跳轉到相應的 PWA 應用，每個應用都有不同的展示模式配置。安裝應用後，你將能夠觀察到不同展示模式下的用戶體驗差異。",
  view_demo: "查看演示",
  technical_details: "技術說明",
  technical_description:
    "每個 PWA 應用使用相同的代碼庫，但有不同的 Web App Manifest 配置。應用將檢測當前的實際運行模式，並與 manifest 中聲明的預期模式進行比較。",
  browser_support_note:
    "要獲得完整的 PWA 體驗，請使用支持 PWA 的瀏覽器（如 Chrome、Edge、Safari）並安裝應用。",
  footer_text: "PWA 展示模式演示 | 選擇一種模式開始體驗",

  // 展示模式
  standalone_name: "獨立窗口模式",
  standalone_description: "應用在沒有瀏覽器界面的獨立窗口中運行",
  minimal_ui_name: "最小界面模式",
  minimal_ui_description: "應用在帶有最小瀏覽器控件的窗口中運行",
  fullscreen_name: "全屏模式",
  fullscreen_description: "應用佔據整個屏幕，沒有任何瀏覽器界面",
  browser_name: "瀏覽器模式",
  browser_description: "應用在常規瀏覽器標籤頁中運行",

  // 狀態卡片
  current_status: "當前狀態",
  running_as: "運行方式：",
  browser_tab: "瀏覽器標籤頁",
  pwa_standalone: "PWA獨立窗口",
  can_be_installed: "可安裝",
  already_installed: "已安裝",
  install_pwa: "安裝PWA",
  refresh_detection: "刷新",
  status_browser_running: "應用正在標準瀏覽器模式下運行",
  install_capability_title: "安裝狀態",
  install_disabled_manifest_browser:
    "manifest中的display屬性設置為'browser'，此模式不支持安裝",
  install_disabled_browser_unsupported: "您的瀏覽器不支持PWA安裝",
  install_button_disabled: "安裝功能不可用",

  // PWA 檢測器
  detector_title: "PWA 展示模式檢測器",
  detector_subtitle: "此工具檢測您的 PWA 當前的運行方式",
  current_mode: "當前模式",
  expected_mode: "預期模式",
  pwa_window: "PWA獨立窗口",
  status_title: "狀態",
  installable: "可安裝",
  not_installable: "不可安裝",
  back_to_home: "選擇模式",
  device_info: "設備信息",
  user_agent: "用戶代理",
  detector_mode_mismatch:
    "檢測到的實際運行模式與 manifest 中配置的不同。這可能是因為瀏覽器不支持該模式或者應用尚未安裝。",
  status_standalone_running: "應用已在獨立窗口模式下運行",
  status_minimal_ui_prompt: "您可以安裝此應用以體驗完整的獨立窗口模式",
  status_fullscreen_running: "應用已在全屏模式下運行",
  status_browser_installable: "您可以安裝此應用以體驗 PWA 獨立窗口模式",
  status_browser_not_installable: "您的瀏覽器不支持安裝 PWA 應用",
  status_browser_checking: "正在檢查此頁面是否可安裝...",
  checking: "檢查中...",
  browser_mode_info:
    "此頁面雖然具有 Web App Manifest，但由於 display 屬性設置為 'browser'，因此無法安裝為 PWA",
  mode_active: "已啟用",
  mode_inactive: "未啟用",
  about_pwa_modes: "關於 PWA 模式",
  pwa_different_modes: "PWA（漸進式 Web 應用）可以在不同的顯示模式下運行：",

  // 刷新提示
  refreshing: "正在刷新...",
  refresh_process:
    "正在檢查 display mode、安裝狀態及更新 Web App Manifest 信息",

  // Manifest 查看器
  manifest_viewer_title: "Web App Manifest",
  view_manifest: "查看 Manifest 內容",
  loading: "加載中...",
  manifest_error: "加載 Manifest 出錯",
  manifest_name: "名稱",
  manifest_short_name: "短名稱",
  manifest_start_url: "起始URL",
  manifest_scope: "作用域",
};
