export default {
  // 共通
  language: "言語選択",
  language_english: "English (英語)",
  language_chinese: "简体中文 (簡体中国語)",
  language_chinese_traditional: "繁體中文 (繁体中国語)",
  language_japanese: "日本語",
  language_german: "Deutsch (ドイツ語)",
  language_french: "Français (フランス語)",
  language_spanish: "Español (スペイン語)",
  language_portuguese: "Português (ポルトガル語)",
  language_korean: "한국어 (韓国語)",

  // エントリーページ
  entry_title: "PWA 表示モードデモ",
  entry_subtitle: "異なるPWAの動作を確認するために表示モードを選択してください",
  what_is_pwa_display_mode: "PWA表示モードとは？",
  pwa_display_mode_description:
    "プログレッシブWebアプリ（PWA）は、ユーザーデバイス上でさまざまな方法で実行・表示できます。Web App Manifestの「display」プロパティは、ブラウザUIの表示や全体的な外観に影響するプレゼンテーションモードを定義します。",
  click_card_instruction:
    "以下のカードをクリックすると、対応するPWAアプリに移動します。それぞれ異なる表示モードで設定されています。アプリをインストールすると、表示モード間のユーザー体験の違いを観察できます。",
  view_demo: "デモを見る",
  technical_details: "技術詳細",
  technical_description:
    "各PWAアプリは同じコードベースを使用していますが、Web App Manifestの設定が異なります。アプリは現在の実際の実行モードを検出し、manifestで宣言された予想モードと比較します。",
  browser_support_note:
    "完全なPWA体験を得るには、PWAをサポートするブラウザ（Chrome、Edge、Safariなど）を使用してアプリケーションをインストールしてください。",
  footer_text: "PWA 表示モードデモ | モードを選択して体験を始める",

  // 表示モード
  standalone_name: "スタンドアロンモード",
  standalone_description: "ブラウザUIなしの独自ウィンドウでアプリを実行",
  browser_name: "ブラウザモード",
  browser_description: "通常のブラウザタブでアプリを実行",
  minimal_ui_name: "最小UIモード",
  minimal_ui_description:
    "最小限のブラウザコントロールを備えたウィンドウでアプリを実行",
  fullscreen_name: "フルスクリーンモード",
  fullscreen_description: "ブラウザUIなしで画面全体を占めるアプリ",

  // ステータスカード
  current_status: "現在のステータス",
  running_as: "実行モード：",
  browser_tab: "ブラウザタブ",
  pwa_standalone: "PWAスタンドアロン",
  can_be_installed: "インストール可能",
  already_installed: "インストール済み",
  install_pwa: "PWAをインストール",
  refresh_detection: "更新",
  status_browser_running: "アプリケーションは標準ブラウザモードで実行中です",
  install_capability_title: "インストール状態",
  install_disabled_manifest_browser:
    "manifestの表示モードが「browser」に設定されているため、インストールをサポートしていません",
  install_disabled_browser_unsupported:
    "お使いのブラウザはPWAのインストールをサポートしていないか、すでにこのアプリケーションをインストールしています",
  install_disabled_already_pwa:
    "すでにPWAウィンドウで実行中のため、再インストールできません",
  install_disabled_already_installed:
    "このデバイスにすでにアプリがインストールされているため、再インストールできません",
  install_button_disabled: "インストールは利用できません",

  // PWA検出器
  detector_title: "PWA表示モード検出器",
  detector_subtitle: "このツールはPWAの現在の実行状態を検出します",
  current_mode: "現在のモード",
  expected_mode: "予想モード",
  pwa_window: "PWAウィンドウ",
  status_title: "ステータス",
  installable: "インストール可能",
  not_installable: "インストール不可",
  back_to_home: "モード選択",
  device_info: "デバイス情報",
  user_agent: "ユーザーエージェント",
  detector_mode_mismatch:
    "検出された実行モードがmanifestで設定されているものと異なります。これはブラウザがこのモードをサポートしていないか、アプリがインストールされていないためかもしれません。",
  status_standalone_running:
    "アプリケーションはスタンドアロンウィンドウモードで実行中です",
  status_minimal_ui_prompt:
    "このアプリをインストールして、完全なスタンドアロンウィンドウモードを体験できます",
  status_fullscreen_running:
    "アプリケーションはフルスクリーンモードで実行中です",
  status_browser_installable:
    "このアプリをインストールして、PWAスタンドアロンウィンドウモードを体験できます",
  status_browser_not_installable:
    "お使いのブラウザはPWAアプリケーションのインストールをサポートしていません",
  status_browser_checking: "このページがインストール可能かどうか確認中です...",
  checking: "確認中...",
  browser_mode_info:
    "このページはWeb App Manifestを持っていますが、'display'プロパティが「browser」に設定されているため、インストールできず、適切なPWAではありません",
  mode_active: "アクティブ",
  mode_inactive: "非アクティブ",
  about_pwa_modes: "PWAモードについて",
  pwa_different_modes:
    "プログレッシブWebアプリ（PWA）は異なる表示モードで実行できます：",

  // 更新通知
  refreshing: "更新中...",
  refresh_process:
    "表示モード、インストール状態を確認し、manifest情報を更新しています",

  // manifestビューア
  manifest_viewer_title: "Web App Manifest",
  view_manifest: "manifest内容を表示",
  loading: "読み込み中...",
  manifest_error: "manifestの読み込みエラー",
  manifest_name: "名前",
  manifest_short_name: "短縮名",
  manifest_start_url: "開始URL",
  manifest_scope: "スコープ",
};
