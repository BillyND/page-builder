"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/app/components/ui/button";

export default function LoginPrompt() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          You need to sign in to manage your pages
        </h1>
        <p className="text-gray-600 mb-6">
          Please sign in to your account to continue managing your pages
        </p>
        <div className="flex justify-center space-x-4">
          <SignInButton mode="modal">
            <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="outline" className="bg-white hover:bg-gray-100">
              Sign up
            </Button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
}
