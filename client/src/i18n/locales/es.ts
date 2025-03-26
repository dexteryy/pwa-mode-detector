export default {
  // General
  language: "Seleccionar idioma",
  language_english: "English (Inglés)",
  language_chinese: "简体中文 (Chino simplificado)",
  language_chinese_traditional: "繁體中文 (Chino tradicional)",
  language_japanese: "日本語 (Japonés)",
  language_german: "Deutsch (Alemán)",
  language_french: "Français (Francés)",
  language_spanish: "Español",
  language_portuguese: "Português (Portugués)",
  language_korean: "한국어 (Coreano)",

  // Página de entrada
  entry_title: "Demostración de Modos de Visualización PWA",
  entry_subtitle: "Elige un modo de visualización para ver cómo las PWA funcionan de manera diferente",
  what_is_pwa_display_mode: "¿Qué es un modo de visualización PWA?",
  pwa_display_mode_description:
    "Las Progressive Web Apps (PWA) pueden mostrarse de diferentes maneras en el dispositivo del usuario. La propiedad 'display' en el Web App Manifest define el modo de visualización e influye en qué elementos de la interfaz de usuario del navegador son visibles y la apariencia general de la aplicación.",
  click_card_instruction:
    "Haz clic en cualquiera de las tarjetas a continuación para navegar a una PWA con ese modo de visualización específico. Después de la instalación, podrás observar cómo difiere la experiencia del usuario según el modo.",
  view_demo: "Ver demostración",
  technical_details: "Detalles técnicos",
  technical_description:
    "Cada PWA utiliza la misma base de código, pero con diferentes configuraciones de Web App Manifest. La aplicación detectará el modo de ejecución real y lo comparará con el modo esperado declarado en el manifest.",
  browser_support_note:
    "Para una experiencia PWA completa, utiliza un navegador compatible con PWA (como Chrome, Edge, Safari) e instala la aplicación.",
  footer_text: "Demostración de Modos de Visualización PWA | Elige un modo para comenzar",

  // Modos de visualización
  standalone_name: "Independiente (standalone)",
  standalone_description: "La aplicación se ejecuta en su propia ventana sin interfaz de usuario del navegador",
  minimal_ui_name: "Interfaz mínima (minimal-ui)",
  minimal_ui_description: "La aplicación se ejecuta en una ventana con controles mínimos del navegador",
  fullscreen_name: "Pantalla completa (fullscreen)",
  fullscreen_description: "La aplicación ocupa toda la pantalla, sin interfaz de usuario del navegador",
  browser_name: "Navegador (browser)",
  browser_description: "La aplicación se ejecuta en una pestaña normal del navegador",

  // Tarjeta de estado
  current_status: "Estado actual",
  browser_tab: "Pestaña del navegador",
  pwa_standalone: "PWA independiente",
  can_be_installed: "Instalable",
  already_installed: "Ya instalada",
  install_pwa: "Instalar PWA",
  refresh_detection: "Actualizar",
  status_browser_running: "La aplicación se está ejecutando en modo navegador estándar",
  install_capability_title: "Estado de instalación",
  install_disabled_manifest_browser:
    "El modo de visualización del manifiesto es 'browser', este modo no admite la instalación",
  install_disabled_browser_unsupported: "Tu navegador no admite la instalación de PWA",
  install_button_disabled: "Instalación no disponible",

  // Detector PWA
  detector_title: "Detector de Modo de Visualización PWA",
  detector_subtitle: "Esta herramienta detecta cómo se está ejecutando actualmente tu PWA",
  current_mode: "Modo actual",
  expected_mode: "Modo esperado",
  pwa_window: "PWA independiente",
  status_title: "Estado",
  installable: "Instalable",
  not_installable: "No instalable",
  back_to_home: "Elegir modos",
  device_info: "Información del dispositivo",
  user_agent: "Agente de usuario",
  detector_mode_mismatch:
    "El modo de ejecución detectado difiere del configurado en el manifiesto. Esto podría deberse a que tu navegador no admite este modo o a que la aplicación aún no está instalada.",
  status_standalone_running: "La aplicación ya se está ejecutando en modo independiente",
  status_minimal_ui_prompt: "Puedes instalar esta aplicación para experimentar el modo independiente completo",
  status_fullscreen_running: "La aplicación ya se está ejecutando en modo de pantalla completa",
  status_browser_installable: "Puedes instalar esta aplicación para experimentar el modo independiente PWA",
  status_browser_not_installable: "Tu navegador no admite la instalación de PWA",
  status_browser_checking: "Comprobando si esta página es instalable...",
  checking: "Comprobando...",
  browser_mode_info:
    "Esta página tiene un Web App Manifest, pero no se puede instalar debido a la propiedad 'display' configurada como 'browser', no es una PWA completa",
  mode_active: "Activo",
  mode_inactive: "Inactivo",
  about_pwa_modes: "Acerca de los modos PWA",
  pwa_different_modes: "Las aplicaciones web progresivas (PWA) pueden ejecutarse en diferentes modos de visualización:",

  // Toast de actualización
  refreshing: "Actualizando...",
  refresh_process: "Comprobando el modo de visualización, el estado de instalación y actualizando la información del manifiesto",

  // Visor de manifiesto
  manifest_viewer_title: "Web App Manifest",
  view_manifest: "Ver manifest",
  loading: "Cargando...",
  manifest_error: "Error al cargar el manifiesto",
  manifest_name: "Nombre",
  manifest_short_name: "Nombre corto",
  manifest_start_url: "URL de inicio",
  manifest_scope: "Alcance",
};