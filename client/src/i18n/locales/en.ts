export default {
  // Common
  "language": "Language",
  "language_english": "English",
  "language_chinese": "Chinese",

  // Entry page
  "entry_title": "PWA Display Mode Demo",
  "entry_subtitle": "Select a display mode to see different PWA behaviors",
  "what_is_pwa_display_mode": "What are PWA Display Modes?",
  "pwa_display_mode_description": "Progressive Web Apps (PWAs) can run and display in different ways on user devices. The 'display' property in the Web App Manifest defines the presentation mode, affecting browser UI elements visibility and the overall appearance of the application.",
  "click_card_instruction": "Click on any card below to navigate to the corresponding PWA app, each configured with a different display mode. After installing the app, you'll be able to observe the user experience differences across display modes.",
  "view_demo": "View Demo",
  "technical_details": "Technical Details",
  "technical_description": "Each PWA app uses the same codebase but has different Web App Manifest configurations. The application will detect the current actual runtime mode and compare it with the expected mode declared in the manifest.",
  "browser_support_note": "For the full PWA experience, use a PWA-supporting browser (like Chrome, Edge, Safari) and install the application.",
  "footer_text": "PWA Display Mode Demo | Select a mode to start the experience",

  // Display modes
  "standalone_name": "Standalone Mode",
  "standalone_description": "App runs in its own window, without any browser UI",
  "minimal_ui_name": "Minimal UI Mode",
  "minimal_ui_description": "App runs in a window with minimal browser controls",
  "fullscreen_name": "Fullscreen Mode",
  "fullscreen_description": "App takes up the entire screen without any browser UI",
  "browser_name": "Browser Mode",
  "browser_description": "App runs in a regular browser tab",

  // PWA Detector
  "detector_title": "PWA Display Mode Detector",
  "detector_subtitle": "This tool detects how your PWA is currently running",
  "current_mode": "Current Mode",
  "expected_mode": "Expected Mode",
  "running_as": "Running as",
  "browser_tab": "Browser Tab",
  "pwa_window": "PWA Window",
  "status_title": "Status",
  "installable": "Installable",
  "not_installable": "Not Installable",
  "install_pwa": "Install PWA",
  "back_to_home": "Back to Home",
  "device_info": "Device Information",
  "user_agent": "User Agent",
  "detector_mode_mismatch": "The detected runtime mode differs from what is configured in the manifest. This may be because the browser does not support this mode or the app has not been installed.",
  "status_standalone_running": "Application is running in standalone window mode",
  "status_minimal_ui_prompt": "You can install this app to experience the full standalone window mode",
  "status_fullscreen_running": "Application is running in fullscreen mode",
  "status_browser_installable": "You can install this app to experience the PWA standalone window mode",
  "status_browser_not_installable": "Your browser does not support installing PWA applications",
  "mode_active": "Active",
  "mode_inactive": "Inactive"
}