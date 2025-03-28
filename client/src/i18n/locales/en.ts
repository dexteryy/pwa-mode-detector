export default {
  // Common
  language: "Choose Language",
  language_english: "English",
  language_chinese: "简体中文 (Simplified Chinese)",
  language_chinese_traditional: "繁體中文 (Traditional Chinese)",
  language_japanese: "日本語 (Japanese)",
  language_german: "Deutsch (German)",
  language_french: "Français (French)",
  language_spanish: "Español (Spanish)",
  language_portuguese: "Português (Portuguese)",
  language_korean: "한국어 (Korean)",
  
  // Theme
  theme_toggle: "Toggle theme",
  light_mode: "Light",
  dark_mode: "Dark",
  system_mode: "System",
  
  // External links
  github_repo: "View source code on GitHub",

  // Entry page
  entry_title: "PWA Mode Detector",
  entry_subtitle: "Select a display mode to see different PWA behaviors",
  what_is_pwa_display_mode: "What are PWA Display Modes?",
  pwa_display_mode_description:
    "Progressive Web Apps (PWAs) can run and display in different ways on user devices. The 'display' property in the Web App Manifest defines the presentation mode, affecting browser UI elements visibility and the overall appearance of the application.",
  click_card_instruction:
    "Click on any card below to navigate to the corresponding PWA app, each configured with a different display mode. After installing the app, you'll be able to observe the user experience differences across display modes.",
  view_demo: "View Demo",
  technical_details: "Technical Details",
  technical_description:
    "Each PWA app uses the same codebase but has different Web App Manifest configurations. The application will detect the current actual runtime mode and compare it with the expected mode declared in the manifest.",
  browser_support_note:
    "For the full PWA experience, use a PWA-supporting browser (like Chrome, Edge, Safari) and install the application.",
  footer_text: "PWA Mode Detector | Select a mode to start the experience",

  // Display modes
  standalone_name: "Standalone Mode",
  standalone_description: "App runs in its own window, without any browser UI",
  browser_name: "Browser Mode",
  browser_description: "App runs in a regular browser tab",
  minimal_ui_name: "Minimal UI Mode",
  minimal_ui_description: "App runs in a window with minimal browser controls",
  fullscreen_name: "Fullscreen Mode",
  fullscreen_description:
    "App takes up the entire screen without any browser UI",

  // Status card
  current_status: "Current Status",
  running_as: "Running as:",
  browser_tab: "Browser Tab",
  pwa_standalone: "PWA Standalone",
  can_be_installed: "Can be installed",
  already_installed: "Already installed",
  install_pwa: "Install PWA",
  refresh_detection: "Refresh",
  status_browser_running: "Application is running in standard browser mode",
  install_capability_title: "Installation Status",
  install_disabled_manifest_browser:
    "Display mode in manifest is set to 'browser', which doesn't support installation",
  install_disabled_browser_unsupported:
    "Your browser doesn't support PWA installation, or you have already installed this application",
  install_disabled_already_pwa:
    "Already running as a PWA window, cannot install again",
  install_disabled_already_installed:
    "App is already installed on this device, cannot install again",
  install_button_disabled: "Installation not available",

  // PWA Detector
  detector_title: "PWA Mode Detector",
  detector_subtitle: "This tool detects how your PWA is currently running",
  current_mode: "Current Mode",
  expected_mode: "Expected Mode",
  pwa_window: "PWA Window",
  status_title: "Status",
  installable: "Installable",
  not_installable: "Not Installable",
  back_to_home: "Back to Home",
  select_mode: "Select Mode",
  device_info: "Device Information",
  user_agent: "User Agent",
  detector_mode_mismatch:
    "The detected runtime mode differs from what is configured in the manifest. This may be because the browser does not support this mode or the app has not been installed.",
  status_standalone_running: "Application is running in standalone window mode",
  status_minimal_ui_prompt:
    "You can install this app to experience the full standalone window mode",
  status_fullscreen_running: "Application is running in fullscreen mode",
  status_browser_installable:
    "You can install this app to experience the PWA standalone window mode",
  status_browser_not_installable:
    "Your browser does not support installing PWA applications",
  status_browser_checking: "Checking if this page can be installed...",
  checking: "Checking...",
  browser_mode_info:
    "This page has a Web App Manifest but its display mode is set to 'browser', making it uninstallable and not a proper PWA",
  mode_active: "Active",
  mode_inactive: "Inactive",
  about_pwa_modes: "About PWA Modes",
  pwa_different_modes:
    "Progressive Web Apps (PWAs) can run in different display modes:",

  // Refresh notifications
  refreshing: "Refreshing...",
  refresh_process:
    "Checking display mode, installation status, and updating manifest information",

  // Manifest viewer
  manifest_viewer_title: "Web App Manifest",
  view_manifest: "View Manifest Content",
  loading: "Loading...",
  manifest_error: "Error loading manifest",
  manifest_name: "Name",
  manifest_short_name: "Short Name",
  manifest_start_url: "Start URL",
  manifest_scope: "Scope",
};
