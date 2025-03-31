"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

export default function LanguageSelector() {
  const locale = useLocale();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    // Get the path without the locale prefix
    const path = pathname.replace(/^\/[a-z]{2}(?:\/|$)/, "/");
    // Redirect to the new locale path
    window.location.href = `/${newLocale}${path}`;
  };

  return (
    <div className="relative">
      <select
        className="appearance-none bg-transparent border border-gray-300 dark:border-gray-600 rounded-md py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
        value={locale}
        onChange={handleChange}
      >
        <option value="en">English</option>
        <option value="vi">Tiếng Việt</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
        <svg
          className="h-4 w-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}
