"use client";

import { useAuth } from "@clerk/nextjs";
import PageList from "./PageList";
import LoginPrompt from "@/app/components/auth/LoginPrompt";

export default function AuthCheck() {
  const { isSignedIn } = useAuth();

  return isSignedIn ? <PageList /> : <LoginPrompt />;
}
