import { redirect } from "next/navigation";

// Redirect from the root to the default locale (English)
export default function RootPage() {
  redirect("/en");
}
