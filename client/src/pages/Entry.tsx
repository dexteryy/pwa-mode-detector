import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ThemeToggle from "../components/ThemeToggle";
import GithubLink from "../components/GithubLink";
import { useEffect } from "react";
import {
  Globe,
  Layout,
  Smartphone,
  Maximize,
  ArrowRight,
  Code,
} from "lucide-react";

// Define PWA display mode options
interface DisplayMode {
  name: string;
  displayName: string;
  description: string;
  Icon: React.ElementType; // Use React component type instead of icon name string
}

const getDisplayModes = (t: any): DisplayMode[] => [
  {
    name: "browser",
    displayName: t("browser_name"),
    description: t("browser_description"),
    Icon: Globe,
  },
  {
    name: "minimal-ui",
    displayName: t("minimal_ui_name"),
    description: t("minimal_ui_description"),
    Icon: Layout,
  },
  {
    name: "standalone",
    displayName: t("standalone_name"),
    description: t("standalone_description"),
    Icon: Smartphone,
  },
  {
    name: "fullscreen",
    displayName: t("fullscreen_name"),
    description: t("fullscreen_description"),
    Icon: Maximize,
  },
];

const Entry = () => {
  const { t } = useTranslation();
  const displayModes = getDisplayModes(t);

  // Make sure no manifest is present on entry page
  useEffect(() => {
    // Entry page should not have any manifest, check if ManifestHandler left anything
    const existingLinks = document.querySelectorAll('link[rel="manifest"]');
    if (existingLinks.length > 0) {
      // Remove all existing manifest links to ensure no PWA installation is possible
      existingLinks.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    }

    // No longer adding empty manifest - this was causing unintended behavior
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 font-sans min-h-screen flex flex-col">
      {/* Integrated App Header - Native UI Style */}
      <header className="bg-blue-500 dark:bg-blue-800 text-white">
        {/* Top navigation bar - subtle style for native UI integration */}
        <div className="border-b border-blue-400/30 dark:border-blue-700/40">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center">
              <GithubLink />
            </div>
            <div className="flex items-center space-x-0.5">
              <ThemeToggle />
              <LanguageSwitcher className="h-10" />
            </div>
          </div>
        </div>

        {/* Title area */}
        <div className="container mx-auto px-4 py-5">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{t("entry_title")}</h1>
            <p className="mt-2 text-blue-100">{t("entry_subtitle")}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow flex flex-col">
        <div className="max-w-3xl mx-auto w-full">
          {/* Introduction */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              {t("what_is_pwa_display_mode")}
            </h2>
            <p
              className="text-gray-600 dark:text-gray-300 mb-4"
              dangerouslySetInnerHTML={{
                __html: t("pwa_display_mode_description"),
              }}
            ></p>
            <p className="text-gray-600 dark:text-gray-300">
              {t("click_card_instruction")}
            </p>
          </div>

          {/* Display Mode Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayModes.map((mode) => (
              <Link key={mode.name} href={`/${mode.name}`} className="h-full">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <mode.Icon className="h-8 w-8 text-blue-500 dark:text-blue-400 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {mode.displayName}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 flex-grow">
                    {mode.description}
                  </p>
                  <div className="mt-4 flex justify-end">
                    <span className="text-blue-500 dark:text-blue-400 font-medium flex items-center">
                      {t("view_demo")}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Technical Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <Code className="h-5 w-5 mr-2" />
              {t("technical_details")}
            </h2>
            <p
              className="text-gray-600 dark:text-gray-300 mb-4"
              dangerouslySetInnerHTML={{ __html: t("technical_description") }}
            ></p>
            <p className="text-gray-600 dark:text-gray-300">
              {t("browser_support_note")}
            </p>
          </div>

          {/* Spacer to push footer to bottom when content is short */}
          <div className="flex-grow"></div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-950 text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>{t("footer_text")}</p>
        </div>
      </footer>
    </div>
  );
};

export default Entry;
