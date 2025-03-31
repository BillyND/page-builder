"use client";

import Link from "next/link";
import {
  SignInButton,
  UserButton,
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Skeleton } from "@/app/components/ui/skeleton";

export default function Header() {
  return (
    <header className="bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Next Page Builder
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              href="/pages"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Pages
            </Link>

            <div className="flex items-center space-x-4">
              <ClerkLoading>
                <Skeleton className="h-8 w-8 rounded-full" />
              </ClerkLoading>
              <ClerkLoaded>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      className="border border-blue-500 text-blue-500 hover:bg-blue-50"
                    >
                      Sign in
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </ClerkLoaded>

              <div className="flex items-center pl-4 border-l border-gray-200">
                {/* <LanguageSelector /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
