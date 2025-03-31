import { redirect } from "next/navigation";

// Redirect from the root register to the default locale (English)
export default function RegisterRedirect() {
  redirect("/en/register");
}
