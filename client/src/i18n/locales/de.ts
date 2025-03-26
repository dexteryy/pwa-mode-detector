export default {
  // Allgemein
  language: "Sprache wählen",
  language_english: "English (Englisch)",
  language_chinese: "简体中文 (Vereinfachtes Chinesisch)",
  language_chinese_traditional: "繁體中文 (Traditionelles Chinesisch)",
  language_japanese: "日本語 (Japanisch)",
  language_german: "Deutsch",
  language_french: "Français (Französisch)",
  language_spanish: "Español (Spanisch)",
  language_portuguese: "Português (Portugiesisch)",
  language_korean: "한국어 (Koreanisch)",

  // Entry Page
  entry_title: "PWA Display-Modus Demo",
  entry_subtitle:
    "Wählen Sie einen Display-Modus um zu sehen, wie PWAs unterschiedlich ausgeführt werden",
  what_is_pwa_display_mode: "Was ist ein PWA Display-Modus?",
  pwa_display_mode_description:
    "Progressive Web Apps (PWAs) können in verschiedener Weise auf dem Gerät des Benutzers angezeigt werden. Die 'display'-Eigenschaft im Web App Manifest definiert den Anzeigemodus und beeinflusst, welche Browser-UI-Elemente sichtbar sind und wie die App allgemein erscheint.",
  click_card_instruction:
    "Klicken Sie auf eine der Karten unten, um zu einer PWA mit diesem spezifischen Display-Modus zu navigieren. Nach der Installation können Sie beobachten, wie sich die Benutzererfahrung je nach Modus unterscheidet.",
  view_demo: "Demo ansehen",
  technical_details: "Technische Details",
  technical_description:
    "Jede PWA verwendet den gleichen Codebase, hat aber unterschiedliche Web App Manifest-Konfigurationen. Die App erkennt den tatsächlichen Laufmodus und vergleicht ihn mit dem im Manifest deklarierten erwarteten Modus.",
  browser_support_note:
    "Für das volle PWA-Erlebnis verwenden Sie bitte einen PWA-fähigen Browser (wie Chrome, Edge, Safari) und installieren Sie die App.",
  footer_text:
    "PWA Display-Modus Demo | Wählen Sie einen Modus, um zu beginnen",

  // Display Modes
  standalone_name: "Eigenständig",
  standalone_description: "App läuft in einem eigenen Fenster ohne Browser-UI",
  minimal_ui_name: "Minimale UI",
  minimal_ui_description:
    "App läuft in einem Fenster mit minimalen Browser-Steuerelementen",
  fullscreen_name: "Vollbild",
  fullscreen_description:
    "App nimmt den gesamten Bildschirm ein, ohne Browser-UI",
  browser_name: "Browser",
  browser_description: "App läuft in einem normalen Browser-Tab",

  // Status Card
  current_status: "Aktueller Status",
  browser_tab: "Browser-Tab",
  pwa_standalone: "PWA Eigenständig",
  can_be_installed: "Installierbar",
  already_installed: "Bereits installiert",
  install_pwa: "PWA installieren",
  refresh_detection: "Aktualisieren",
  status_browser_running: "Die App läuft im Standard-Browser-Modus",
  install_capability_title: "Installationsstatus",
  install_disabled_manifest_browser:
    "Der 'display'-Modus im Web App Manifest ist 'browser', dieser Modus unterstützt keine Installation",
  install_disabled_browser_unsupported:
    "Ihr Browser unterstützt keine PWA-Installation",
  install_button_disabled: "Installation nicht verfügbar",

  // PWA Detector
  detector_title: "PWA Display-Modus Detektor",
  detector_subtitle:
    "Dieses Tool erkennt, wie Ihre PWA derzeit ausgeführt wird",
  current_mode: "Aktueller Modus",
  expected_mode: "Erwarteter Modus",
  pwa_window: "PWA Eigenständig",
  status_title: "Status",
  installable: "Installierbar",
  not_installable: "Nicht installierbar",
  back_to_home: "Modi wählen",
  device_info: "Geräteinformationen",
  user_agent: "User Agent",
  detector_mode_mismatch:
    "Der erkannte Ausführungsmodus unterscheidet sich vom im manifest konfigurierten. Dies könnte daran liegen, dass Ihr Browser diesen Modus nicht unterstützt oder die App noch nicht installiert ist.",
  status_standalone_running: "Die App läuft bereits im eigenständigen Modus",
  status_minimal_ui_prompt:
    "Sie können diese App installieren, um den vollständigen eigenständigen Modus zu erleben",
  status_fullscreen_running: "Die App läuft bereits im Vollbildmodus",
  status_browser_installable:
    "Sie können diese App installieren, um den PWA eigenständigen Modus zu erleben",
  status_browser_not_installable:
    "Ihr Browser unterstützt keine PWA-Installation",
  status_browser_checking: "Überprüfe, ob diese Seite installierbar ist...",
  checking: "Überprüfe...",
  browser_mode_info:
    "Diese Seite hat ein Web App Manifest, kann aber aufgrund der 'display'-Eigenschaft mit Wert 'browser' nicht installiert werden, ist keine vollständige PWA",
  mode_active: "Aktiv",
  mode_inactive: "Inaktiv",
  about_pwa_modes: "Über PWA-Modi",
  pwa_different_modes:
    "Progressive Web Apps (PWAs) können in verschiedenen Anzeigemodi ausgeführt werden:",

  // Refresh Toast
  refreshing: "Aktualisiere...",
  refresh_process:
    "Überprüfe Display-Modus, Installationsstatus und aktualisiere Manifest-Informationen",

  // Manifest Viewer
  manifest_viewer_title: "Web App Manifest",
  view_manifest: "Manifest anzeigen",
  loading: "Wird geladen...",
  manifest_error: "Fehler beim Laden des Manifests",
  manifest_name: "Name",
  manifest_short_name: "Kurzname",
  manifest_start_url: "Start-URL",
  manifest_scope: "Geltungsbereich",
};
