"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { ReactNode } from "react";

interface AuthFormProps {
  type: "login" | "register";
  title: string;
  subtitle: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  error?: string;
  successMessage?: string;
  children: ReactNode;
  submitButtonText: string;
  loadingButtonText: string;
  alternateActionText: string;
  alternateActionLink: string;
  alternateActionLinkText: string;
}

export default function AuthForm({
  type,
  title,
  subtitle,
  onSubmit,
  isLoading,
  error,
  successMessage,
  children,
  submitButtonText,
  loadingButtonText,
  alternateActionText,
  alternateActionLink,
  alternateActionLinkText,
}: AuthFormProps) {
  const gradientClasses = {
    login: "from-indigo-600 to-indigo-500",
    register: "from-purple-600 to-purple-500",
  };

  const buttonClasses = {
    login: "auth-button-primary",
    register: "auth-button-secondary",
  };

  const linkClasses = {
    login: "text-indigo-600 hover:text-indigo-800 dark:text-indigo-400",
    register: "text-purple-600 hover:text-purple-800 dark:text-purple-400",
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 p-8">
      <div className="auth-card">
        <div className="text-center mb-8">
          <h1
            className={`text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r ${gradientClasses[type]}`}
          >
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg shadow-sm">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          {children}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`auth-button ${buttonClasses[type]}`}
            >
              {isLoading ? loadingButtonText : submitButtonText}
            </button>
          </div>
        </form>

        <div className="auth-divider">
          <div className="flex justify-center">
            <span className="auth-divider-text">{alternateActionText}</span>
          </div>
        </div>

        <div>
          {type === "login" ? (
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="social-button"
            >
              <GoogleIcon />
              {alternateActionText}
            </button>
          ) : (
            <Link href="/api/auth/signin/google" className="social-button">
              <GoogleIcon />
              {alternateActionText}
            </Link>
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <Link
              href={alternateActionLink}
              className={linkClasses[type] + " font-medium"}
            >
              {alternateActionLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
