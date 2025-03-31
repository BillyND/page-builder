"use client";

import { useTranslations } from "next-intl";
import LanguageSelector from "./LanguageSelector";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Header() {
  const t = useTranslations("app");
  const authT = useTranslations("auth.login");
  const homeT = useTranslations("home");
  const { data: session } = useSession();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              {t("title")}
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <Link
                href="/api/auth/signout"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm"
              >
                {homeT("signOut")}
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm"
              >
                {authT("signIn")}
              </Link>
            )}
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600 dark:text-gray-300">
                {t("language")}:
              </span>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
