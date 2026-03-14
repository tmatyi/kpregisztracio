import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("[requireAdmin] User check:", {
    user: user?.id,
    error: userError?.message,
  });

  if (userError || !user) {
    console.log("[requireAdmin] No user, redirecting to /login");
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  console.log("[requireAdmin] Profile check:", {
    userId: user.id,
    profile,
    error: profileError?.message,
    role: profile?.role,
  });

  if (profileError || !profile || profile.role !== "admin") {
    console.log("[requireAdmin] Not admin, redirecting to /");
    redirect("/");
  }

  console.log("[requireAdmin] Success! User is admin");
  return { user, profile };
}

export async function checkUserRole() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, role: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return { user, role: profile?.role || null };
}
