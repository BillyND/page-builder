"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiGlobe } from "react-icons/fi";

export default function LanguageSelector() {
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    // Get the path without the locale prefix
    const path = pathname.replace(/^\/[a-z]{2}(?:\/|$)/, "/");
    // Redirect to the new locale path
    window.location.href = `/${langCode}${path}`;
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors focus:outline-none"
      >
        <FiGlobe className="h-5 w-5" />
        <span className="text-sm font-medium">{currentLanguage.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`block w-full text-left px-4 py-2 text-sm ${
                locale === language.code
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                <span className="mr-2">{language.flag}</span>
                {language.name}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
