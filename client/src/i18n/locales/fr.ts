export default {
  // Général
  language: "Choisir la langue",
  language_english: "English (Anglais)",
  language_chinese: "简体中文 (Chinois simplifié)",
  language_chinese_traditional: "繁體中文 (Chinois traditionnel)",
  language_japanese: "日本語 (Japonais)",
  language_german: "Deutsch (Allemand)",
  language_french: "Français",
  language_spanish: "Español (Espagnol)",
  language_portuguese: "Português (Portugais)",
  language_korean: "한국어 (Coréen)",

  // Page d'accueil
  entry_title: "Démo des modes d'affichage PWA",
  entry_subtitle: "Choisissez un mode d'affichage pour voir comment les PWA fonctionnent différemment",
  what_is_pwa_display_mode: "Qu'est-ce qu'un mode d'affichage PWA ?",
  pwa_display_mode_description:
    "Les applications web progressives (PWA) peuvent s'afficher de différentes manières sur l'appareil de l'utilisateur. La propriété d'affichage dans le Manifeste d'application web définit le mode d'affichage et influence quels éléments de l'interface utilisateur du navigateur sont visibles et l'apparence générale de l'application.",
  click_card_instruction:
    "Cliquez sur l'une des cartes ci-dessous pour naviguer vers une PWA avec ce mode d'affichage spécifique. Après l'installation, vous pourrez observer comment l'expérience utilisateur diffère selon le mode.",
  view_demo: "Voir la démo",
  technical_details: "Détails techniques",
  technical_description:
    "Chaque PWA utilise la même base de code, mais avec différentes configurations de Manifeste d'application web. L'application détectera le mode d'exécution réel et le comparera au mode attendu déclaré dans le manifeste.",
  browser_support_note:
    "Pour une expérience PWA complète, veuillez utiliser un navigateur compatible PWA (comme Chrome, Edge, Safari) et installer l'application.",
  footer_text: "Démo des modes d'affichage PWA | Choisissez un mode pour commencer",

  // Modes d'affichage
  standalone_name: "Autonome (standalone)",
  standalone_description: "L'application fonctionne dans sa propre fenêtre sans interface utilisateur de navigateur",
  minimal_ui_name: "Interface minimale (minimal-ui)",
  minimal_ui_description: "L'application fonctionne dans une fenêtre avec des contrôles de navigateur minimaux",
  fullscreen_name: "Plein écran (fullscreen)",
  fullscreen_description: "L'application occupe tout l'écran, sans interface utilisateur de navigateur",
  browser_name: "Navigateur (browser)",
  browser_description: "L'application fonctionne dans un onglet de navigateur normal",

  // Carte de statut
  current_status: "Statut actuel",
  browser_tab: "Onglet de navigateur",
  pwa_standalone: "PWA autonome",
  can_be_installed: "Installable",
  already_installed: "Déjà installé",
  install_pwa: "Installer la PWA",
  refresh_detection: "Actualiser",
  status_browser_running: "L'application fonctionne en mode navigateur standard",
  install_capability_title: "Statut d'installation",
  install_disabled_manifest_browser:
    "Le mode d'affichage du manifeste est 'browser', ce mode ne prend pas en charge l'installation",
  install_disabled_browser_unsupported: "Votre navigateur ne prend pas en charge l'installation de PWA",
  install_button_disabled: "Installation non disponible",

  // Détecteur PWA
  detector_title: "Détecteur de mode d'affichage PWA",
  detector_subtitle: "Cet outil détecte comment votre PWA fonctionne actuellement",
  current_mode: "Mode actuel",
  expected_mode: "Mode attendu",
  pwa_window: "PWA autonome",
  status_title: "Statut",
  installable: "Installable",
  not_installable: "Non installable",
  back_to_home: "Choisir les modes",
  device_info: "Informations sur l'appareil",
  user_agent: "Agent utilisateur",
  detector_mode_mismatch:
    "Le mode d'exécution détecté diffère de celui configuré dans le manifeste. Cela pourrait être dû au fait que votre navigateur ne prend pas en charge ce mode ou que l'application n'est pas encore installée.",
  status_standalone_running: "L'application fonctionne déjà en mode autonome",
  status_minimal_ui_prompt: "Vous pouvez installer cette application pour expérimenter le mode autonome complet",
  status_fullscreen_running: "L'application fonctionne déjà en mode plein écran",
  status_browser_installable: "Vous pouvez installer cette application pour expérimenter le mode autonome PWA",
  status_browser_not_installable: "Votre navigateur ne prend pas en charge l'installation de PWA",
  status_browser_checking: "Vérification si cette page est installable...",
  checking: "Vérification...",
  browser_mode_info:
    "Cette page a un Manifeste d'application web, mais ne peut pas être installée en raison de la propriété d'affichage 'browser', ce n'est pas une PWA complète",
  mode_active: "Actif",
  mode_inactive: "Inactif",
  about_pwa_modes: "À propos des modes PWA",
  pwa_different_modes: "Les applications web progressives (PWA) peuvent fonctionner dans différents modes d'affichage :",

  // Toast d'actualisation
  refreshing: "Actualisation...",
  refresh_process: "Vérification du mode d'affichage, du statut d'installation et mise à jour des informations du manifeste",

  // Visionneuse de manifeste
  manifest_viewer_title: "Manifeste d'application web",
  view_manifest: "Voir le manifeste",
  loading: "Chargement...",
  manifest_error: "Erreur lors du chargement du manifeste",
  manifest_name: "Nom",
  manifest_short_name: "Nom court",
  manifest_start_url: "URL de démarrage",
  manifest_scope: "Portée",
};