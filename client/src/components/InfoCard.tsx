import { useTranslation } from "react-i18next";
import { HelpCircle } from "lucide-react";
import TermText from "./TermText";
import { processTerms } from "../lib/termLinks";

const InfoCard = () => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-dark dark:text-white mb-4 flex items-center">
        <HelpCircle className="h-5 w-5 mr-2 dark:text-blue-400" />
        {t('about_pwa_modes')}
      </h2>
      <div className="prose dark:prose-invert text-gray-700 dark:text-gray-300">
        <p className="mb-3"><TermText textKey="pwa_different_modes" /></p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>{t('browser_name')} ({processTerms("browser")})：</strong>
            <TermText textKey="browser_description" />
          </li>
          <li>
            <strong>{t('minimal_ui_name')} ({processTerms("minimal-ui")})：</strong>
            <TermText textKey="minimal_ui_description" />
          </li>
          <li>
            <strong>{t('standalone_name')} ({processTerms("standalone")})：</strong>
            <TermText textKey="standalone_description" />
          </li>
          <li>
            <strong>{t('fullscreen_name')} ({processTerms("fullscreen")})：</strong>
            <TermText textKey="fullscreen_description" />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InfoCard;
