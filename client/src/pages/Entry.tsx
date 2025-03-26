import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

// 定义 PWA 的 display 模式选项
interface DisplayMode {
  name: string;
  displayName: string;
  description: string;
  icon: string;
}

const getDisplayModes = (t: any): DisplayMode[] => [
  {
    name: "standalone",
    displayName: t("standalone_name"),
    description: t("standalone_description"),
    icon: "tablet_mac"
  },
  {
    name: "minimal-ui",
    displayName: t("minimal_ui_name"), 
    description: t("minimal_ui_description"),
    icon: "tab"
  },
  {
    name: "fullscreen",
    displayName: t("fullscreen_name"),
    description: t("fullscreen_description"),
    icon: "fullscreen"
  },
  {
    name: "browser",
    displayName: t("browser_name"),
    description: t("browser_description"),
    icon: "public"
  }
];

const Entry = () => {
  const { t } = useTranslation();
  const displayModes = getDisplayModes(t);
  
  return (
    <div className="bg-gray-100 font-sans min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-6 relative">
          <div className="absolute right-4 top-4 z-10">
            <LanguageSwitcher />
          </div>
          <div className="pt-8 sm:pt-0">
            <h1 className="text-2xl font-bold text-center">{t('entry_title')}</h1>
            <p className="text-center mt-2 text-blue-100">{t('entry_subtitle')}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow flex flex-col">
        <div className="max-w-3xl mx-auto w-full">
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('what_is_pwa_display_mode')}</h2>
            <p className="text-gray-600 mb-4">
              {t('pwa_display_mode_description')}
            </p>
            <p className="text-gray-600">
              {t('click_card_instruction')}
            </p>
          </div>

          {/* Display Mode Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayModes.map(mode => (
              <Link key={mode.name} href={`/${mode.name}`} className="h-full">
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500 cursor-pointer h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <span className="material-icons text-4xl text-blue-500 mr-3">{mode.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-800">{mode.displayName}</h3>
                  </div>
                  <p className="text-gray-600 flex-grow">{mode.description}</p>
                  <div className="mt-4 flex justify-end">
                    <span className="text-blue-500 font-medium flex items-center">
                      {t('view_demo')}
                      <span className="material-icons ml-1">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Technical Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="material-icons mr-2">code</span>
              {t('technical_details')}
            </h2>
            <p className="text-gray-600 mb-4">
              {t('technical_description')}
            </p>
            <p className="text-gray-600">
              {t('browser_support_note')}
            </p>
          </div>
          
          {/* Spacer to push footer to bottom when content is short */}
          <div className="flex-grow"></div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>{t('footer_text')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Entry;