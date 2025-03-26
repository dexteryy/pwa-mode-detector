import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import IconWithFallback from "../components/IconWithFallback";

// 定义 PWA 的 display 模式选项
interface DisplayMode {
  name: string;
  displayName: string;
  description: string;
  icon: string;
}

const getDisplayModes = (t: any): DisplayMode[] => [
  {
    name: "browser",
    displayName: t("browser_name"),
    description: t("browser_description"),
    icon: "public"
  },
  {
    name: "minimal-ui",
    displayName: t("minimal_ui_name"), 
    description: t("minimal_ui_description"),
    icon: "tab"
  },
  {
    name: "standalone",
    displayName: t("standalone_name"),
    description: t("standalone_description"),
    icon: "tablet_mac"
  },
  {
    name: "fullscreen",
    displayName: t("fullscreen_name"),
    description: t("fullscreen_description"),
    icon: "fullscreen"
  }
];

const Entry = () => {
  const { t } = useTranslation();
  const displayModes = getDisplayModes(t);
  
  return (
    <div className="bg-gray-100 font-sans min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <div className="bg-blue-700 text-white">
        <div className="container mx-auto px-4 py-1">
          <div className="flex items-center justify-between">
            <div>
              {/* 空白的左侧区域，保持布局平衡 */}
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <header className="bg-blue-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-7">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{t('entry_title')}</h1>
            <p className="mt-2 text-blue-100">{t('entry_subtitle')}</p>
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
                    <div className="w-10 h-10 mr-3 flex items-center justify-center">
                      <IconWithFallback name={mode.icon} className="text-blue-500" size="xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{mode.displayName}</h3>
                  </div>
                  <p className="text-gray-600 flex-grow">{mode.description}</p>
                  <div className="mt-4 flex justify-end">
                    <span className="text-blue-500 font-medium flex items-center">
                      {t('view_demo')}
                      <IconWithFallback name="arrow_forward" className="ml-1" size="sm" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Technical Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-6 h-6 mr-2 flex items-center justify-center">
                <IconWithFallback name="code" size="md" />
              </div>
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