"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "../../components/auth/AuthForm";
import AuthInput from "../../components/auth/AuthInput";
import { useTranslations } from "next-intl";

export default function Register() {
  const t = useTranslations("auth.register");
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError(t("error.passwordsDoNotMatch"));
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError(t("error.passwordTooShort"));
      setIsLoading(false);
      return;
    }

    try {
      // Send registration request to API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("error.generic"));
      }

      // Redirect to login page after successful registration
      router.push("/login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error.generic"));
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      type="register"
      title={t("title")}
      subtitle={t("subtitle")}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      submitButtonText={t("createAccount")}
      loadingButtonText={t("creatingAccount")}
      alternateActionText={t("continueWith")}
      alternateActionLink="/login"
      alternateActionLinkText={t("signIn")}
    >
      <AuthInput
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        label={t("fullName")}
        placeholder={`${t("fullName")}...`}
        required
      />

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
        minLength={8}
        helpText={t("passwordRequirement")}
      />

      <AuthInput
        id="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        label={t("confirmPassword")}
        placeholder={`${t("confirmPassword")}...`}
        required
      />
    </AuthForm>
  );
}
