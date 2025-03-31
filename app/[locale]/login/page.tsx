"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import AuthForm from "../../components/auth/AuthForm";
import AuthInput from "../../components/auth/AuthInput";
import { useTranslations } from "next-intl";

export default function Login() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Check if user just registered
    const registered = searchParams.get("registered");
    if (registered === "true") {
      setSuccessMessage(t("successMessage"));
    }
  }, [searchParams, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      console.log("result", result);

      if (result?.error) {
        setError(t("error.invalidCredentials"));
        setIsLoading(false);
        return;
      }

      router.push("/");
    } catch {
      setError(t("error.generic"));
      setIsLoading(false);
    }
  };

  const forgotPasswordLink = (
    <a
      href="#"
      className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-medium"
    >
      {t("forgotPassword")}
    </a>
  );

  return (
    <AuthForm
      type="login"
      title={t("title")}
      subtitle={t("subtitle")}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      successMessage={successMessage}
      submitButtonText={t("signIn")}
      loadingButtonText={t("signingIn")}
      alternateActionText={t("continueWith")}
      alternateActionLink="/register"
      alternateActionLinkText={t("signUp")}
    >
      <AuthInput
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label={t("email")}
        placeholder={`${t("email")}...`}
        required
      />

      <AuthInput
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label={t("password")}
        placeholder={`${t("password")}...`}
        required
        rightElement={forgotPasswordLink}
      />
    </AuthForm>
  );
}
