"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import AuthForm from "../../components/auth/AuthForm";
import AuthInput from "../../components/auth/AuthInput";

export default function Register() {
  const t = useTranslations("auth.register");
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

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
      // Create the user with Clerk
      const result = await signUp.create({
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" ") || undefined,
        emailAddress: email,
        password,
      });

      // Start the email verification process
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      if (result.status === "complete") {
        // If sign up is complete, set the session active
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        // If email verification is required, redirect to verification page
        // In a real app, you might want to create a verification page
        router.push("/login?registered=true");
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string }> };
      setError(clerkError.errors?.[0]?.message || t("error.generic"));
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
