import { createClient } from "@/lib/supabase/server";
import { LandingPageClient } from "./page-client";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("is_active", true)
    .order("date", { ascending: true });

  return <LandingPageClient events={events || []} />;
}
