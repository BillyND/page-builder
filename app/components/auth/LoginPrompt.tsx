"use client";

import { useTranslations } from "next-intl";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/app/components/ui/button";

export default function LoginPrompt() {
  const t = useTranslations("auth.login");

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {t("loginRequired")}
        </h1>
        <p className="text-gray-600 mb-6">{t("loginToManagePages")}</p>
        <div className="flex justify-center space-x-4">
          <SignInButton mode="modal">
            <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
              {t("signIn")}
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="outline" className="bg-white hover:bg-gray-100">
              {t("signUp")}
            </Button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
}
