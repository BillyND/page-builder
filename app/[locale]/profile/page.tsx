"use client";

import { useTranslations } from "next-intl";
import UserProfile from "../../components/auth/UserProfile";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  // Redirect to login if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/login");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!isSignedIn) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        {t("title")}
      </h1>
      <UserProfile />
    </div>
  );
}
