export default {
  // Geral
  language: "Selecionar idioma",
  language_english: "English (Inglês)",
  language_chinese: "简体中文 (Chinês simplificado)",
  language_chinese_traditional: "繁體中文 (Chinês tradicional)",
  language_japanese: "日本語 (Japonês)",
  language_german: "Deutsch (Alemão)",
  language_french: "Français (Francês)",
  language_spanish: "Español (Espanhol)",
  language_portuguese: "Português",
  language_korean: "한국어 (Coreano)",

  // Página de entrada
  entry_title: "Demonstração de Modos de Exibição PWA",
  entry_subtitle:
    "Escolha um modo de exibição para ver como os PWAs funcionam de maneira diferente",
  what_is_pwa_display_mode: "O que é um modo de exibição PWA?",
  pwa_display_mode_description:
    "Progressive Web Apps (PWAs) podem ser exibidos de diferentes maneiras no dispositivo do usuário. A propriedade 'display' no Web App Manifest define o modo de exibição e influencia quais elementos da interface do usuário do navegador são visíveis e a aparência geral do aplicativo.",
  click_card_instruction:
    "Clique em qualquer um dos cartões abaixo para navegar até um PWA com esse modo de exibição específico. Após a instalação, você poderá observar como a experiência do usuário difere dependendo do modo.",
  view_demo: "Ver demonstração",
  technical_details: "Detalhes técnicos",
  technical_description:
    "Cada PWA usa a mesma base de código, mas com diferentes configurações de Web App Manifest. O aplicativo detectará o modo de execução real e o comparará com o modo esperado declarado no manifest.",
  browser_support_note:
    "Para uma experiência PWA completa, use um navegador compatível com PWA (como Chrome, Edge, Safari) e instale o aplicativo.",
  footer_text:
    "Demonstração de Modos de Exibição PWA | Escolha um modo para começar",

  // Modos de exibição
  standalone_name: "Independente",
  standalone_description:
    "O aplicativo é executado em sua própria janela sem interface do navegador",
  minimal_ui_name: "Interface mínima",
  minimal_ui_description:
    "O aplicativo é executado em uma janela com controles mínimos do navegador",
  fullscreen_name: "Tela cheia",
  fullscreen_description:
    "O aplicativo ocupa toda a tela, sem interface do navegador",
  browser_name: "Navegador",
  browser_description:
    "O aplicativo é executado em uma aba normal do navegador",

  // Cartão de status
  current_status: "Status atual",
  browser_tab: "Aba do navegador",
  pwa_standalone: "PWA independente",
  can_be_installed: "Instalável",
  already_installed: "Já instalado",
  install_pwa: "Instalar PWA",
  refresh_detection: "Atualizar",
  status_browser_running:
    "O aplicativo está sendo executado no modo navegador padrão",
  install_capability_title: "Status de instalação",
  install_disabled_manifest_browser:
    "O modo de exibição do manifesto é 'browser', este modo não suporta instalação",
  install_disabled_browser_unsupported:
    "Seu navegador não suporta instalação de PWA",
  install_button_disabled: "Instalação não disponível",

  // Detector PWA
  detector_title: "Detector de Modo de Exibição PWA",
  detector_subtitle:
    "Esta ferramenta detecta como seu PWA está sendo executado atualmente",
  current_mode: "Modo atual",
  expected_mode: "Modo esperado",
  pwa_window: "PWA independente",
  status_title: "Status",
  installable: "Instalável",
  not_installable: "Não instalável",
  back_to_home: "Escolher modos",
  device_info: "Informações do dispositivo",
  user_agent: "Agente do usuário",
  detector_mode_mismatch:
    "O modo de execução detectado difere do configurado no manifesto. Isso pode ser porque seu navegador não suporta este modo ou o aplicativo ainda não está instalado.",
  status_standalone_running:
    "O aplicativo já está sendo executado no modo independente",
  status_minimal_ui_prompt:
    "Você pode instalar este aplicativo para experimentar o modo independente completo",
  status_fullscreen_running:
    "O aplicativo já está sendo executado no modo de tela cheia",
  status_browser_installable:
    "Você pode instalar este aplicativo para experimentar o modo independente PWA",
  status_browser_not_installable: "Seu navegador não suporta instalação de PWA",
  status_browser_checking: "Verificando se esta página é instalável...",
  checking: "Verificando...",
  browser_mode_info:
    "Esta página tem um Web App Manifest, mas não pode ser instalada devido à propriedade 'display' configurada como 'browser', não é um PWA completo",
  mode_active: "Ativo",
  mode_inactive: "Inativo",
  about_pwa_modes: "Sobre os modos PWA",
  pwa_different_modes:
    "Os Aplicativos Web Progressivos (PWAs) podem ser executados em diferentes modos de exibição:",

  // Toast de atualização
  refreshing: "Atualizando...",
  refresh_process:
    "Verificando o modo de exibição, o status de instalação e atualizando as informações do manifest",

  // Visualizador de manifesto
  manifest_viewer_title: "Web App Manifest",
  view_manifest: "Ver manifest",
  loading: "Carregando...",
  manifest_error: "Erro ao carregar o manifest",
  manifest_name: "Nome",
  manifest_short_name: "Nome curto",
  manifest_start_url: "URL inicial",
  manifest_scope: "Escopo",
};
