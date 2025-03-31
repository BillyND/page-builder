import React from "react";
import AuthCheck from "@/app/components/pages/AuthCheck";
import Header from "../components/header/Header";

export default function PagesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <AuthCheck />
    </main>
  );
}
