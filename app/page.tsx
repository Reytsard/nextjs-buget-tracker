import { createClient } from "@/lib/server";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  } else {
    redirect("/dashboard");
  }
}
