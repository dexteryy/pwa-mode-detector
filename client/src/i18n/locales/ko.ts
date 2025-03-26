export default {
  // 일반
  language: "언어 선택",
  language_english: "English (영어)",
  language_chinese: "简体中文 (중국어 간체)",
  language_chinese_traditional: "繁體中文 (중국어 번체)",
  language_japanese: "日本語 (일본어)",
  language_german: "Deutsch (독일어)",
  language_french: "Français (프랑스어)",
  language_spanish: "Español (스페인어)",
  language_portuguese: "Português (포르투갈어)",
  language_korean: "한국어",

  // 입장 페이지
  entry_title: "PWA 디스플레이 모드 데모",
  entry_subtitle: "PWA가 다양하게 작동하는 방식을 보려면 디스플레이 모드를 선택하세요",
  what_is_pwa_display_mode: "PWA 디스플레이 모드란 무엇인가요?",
  pwa_display_mode_description:
    "Progressive Web Apps(PWA)은 사용자 장치에서 다양한 방식으로 표시될 수 있습니다. Web App Manifest의 'display' 속성은 표시 모드를 정의하고 어떤 브라우저 UI 요소가 표시되는지와 앱의 전체적인 모양에 영향을 줍니다.",
  click_card_instruction:
    "아래 카드 중 하나를 클릭하여 해당 특정 디스플레이 모드로 설정된 PWA로 이동합니다. 설치 후에는 모드에 따라 사용자 경험이 어떻게 달라지는지 관찰할 수 있습니다.",
  view_demo: "데모 보기",
  technical_details: "기술 세부사항",
  technical_description:
    "각 PWA는 동일한 코드베이스를 사용하지만 Web App Manifest 구성이 다릅니다. 앱은 실제 실행 모드를 감지하고 manifest에 선언된 예상 모드와 비교합니다.",
  browser_support_note:
    "전체 PWA 경험을 위해 PWA를 지원하는 브라우저(Chrome, Edge, Safari와 같은)를 사용하고 앱을 설치하세요.",
  footer_text: "PWA 디스플레이 모드 데모 | 시작하려면 모드를 선택하세요",

  // 디스플레이 모드
  standalone_name: "독립 실행형 (standalone)",
  standalone_description: "앱이 브라우저 UI 없이 자체 창에서 실행됩니다",
  minimal_ui_name: "최소 UI (minimal-ui)",
  minimal_ui_description: "앱이 최소한의 브라우저 컨트롤과 함께 창에서 실행됩니다",
  fullscreen_name: "전체화면 (fullscreen)",
  fullscreen_description: "앱이 브라우저 UI 없이 전체 화면을 차지합니다",
  browser_name: "브라우저 (browser)",
  browser_description: "앱이 일반 브라우저 탭에서 실행됩니다",

  // 상태 카드
  current_status: "현재 상태",
  browser_tab: "브라우저 탭",
  pwa_standalone: "PWA 독립 실행형",
  can_be_installed: "설치 가능",
  already_installed: "이미 설치됨",
  install_pwa: "PWA 설치",
  refresh_detection: "새로고침",
  status_browser_running: "앱이 표준 브라우저 모드에서 실행 중입니다",
  install_capability_title: "설치 상태",
  install_disabled_manifest_browser:
    "매니페스트 디스플레이 모드가 'browser'로 설정되어 있어 이 모드는 설치를 지원하지 않습니다",
  install_disabled_browser_unsupported: "브라우저가 PWA 설치를 지원하지 않습니다",
  install_button_disabled: "설치를 사용할 수 없음",

  // PWA 감지기
  detector_title: "PWA 디스플레이 모드 감지기",
  detector_subtitle: "이 도구는 PWA가 현재 어떻게 실행되고 있는지 감지합니다",
  current_mode: "현재 모드",
  expected_mode: "예상 모드",
  pwa_window: "PWA 독립 실행형",
  status_title: "상태",
  installable: "설치 가능",
  not_installable: "설치 불가능",
  back_to_home: "모드 선택",
  device_info: "기기 정보",
  user_agent: "사용자 에이전트",
  detector_mode_mismatch:
    "감지된 실행 모드가 매니페스트에 구성된 것과 다릅니다. 브라우저가 이 모드를 지원하지 않거나 앱이 아직 설치되지 않았기 때문일 수 있습니다.",
  status_standalone_running: "앱이 이미 독립 실행형 모드에서 실행 중입니다",
  status_minimal_ui_prompt: "전체 독립 실행형 모드를 경험하려면 이 앱을 설치할 수 있습니다",
  status_fullscreen_running: "앱이 이미 전체화면 모드에서 실행 중입니다",
  status_browser_installable: "PWA 독립 실행형 모드를 경험하려면 이 앱을 설치할 수 있습니다",
  status_browser_not_installable: "브라우저가 PWA 설치를 지원하지 않습니다",
  status_browser_checking: "이 페이지가 설치 가능한지 확인 중...",
  checking: "확인 중...",
  browser_mode_info:
    "이 페이지는 웹 앱 매니페스트를 가지고 있지만 디스플레이 속성이 'browser'로 설정되어 있어 설치할 수 없으며, 완전한 PWA가 아닙니다",
  mode_active: "활성화됨",
  mode_inactive: "비활성화됨",
  about_pwa_modes: "PWA 모드에 대하여",
  pwa_different_modes: "프로그레시브 웹 앱(PWA)은 다양한 디스플레이 모드에서 실행될 수 있습니다:",

  // 새로고침 토스트
  refreshing: "새로고침 중...",
  refresh_process: "디스플레이 모드, 설치 상태 확인 및 매니페스트 정보 업데이트 중",

  // 매니페스트 뷰어
  manifest_viewer_title: "웹 앱 매니페스트",
  view_manifest: "매니페스트 보기",
  loading: "로딩 중...",
  manifest_error: "매니페스트 로딩 오류",
  manifest_name: "이름",
  manifest_short_name: "짧은 이름",
  manifest_start_url: "시작 URL",
  manifest_scope: "범위",
};