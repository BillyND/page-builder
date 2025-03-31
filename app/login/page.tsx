import { redirect } from "next/navigation";

// Redirect from the root login to the default locale (English)
export default function LoginRedirect() {
  redirect("/en/login");
}
