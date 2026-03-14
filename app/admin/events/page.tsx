import { requireAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { EventsPageClient } from "./page-client";

export default async function EventsPage() {
  await requireAdmin();

  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  // Fetch analytics for each event
  const eventsWithAnalytics = await Promise.all(
    (events || []).map(async (event) => {
      // Get all orders for this event
      const { data: orders } = await supabase
        .from("orders")
        .select(
          `
          id,
          total_amount,
          type,
          status,
          used_at,
          order_items (
            id,
            type
          )
        `,
        )
        .eq("event_id", event.id)
        .eq("status", "paid");

      // Calculate analytics
      const totalTickets =
        orders?.reduce(
          (sum, order) => sum + (order.order_items?.length || 0),
          0,
        ) || 0;

      const individualTickets =
        orders
          ?.filter((o) => o.type === "individual")
          .reduce((sum, order) => sum + (order.order_items?.length || 0), 0) ||
        0;

      const groupTickets =
        orders
          ?.filter((o) => o.type === "group")
          .reduce((sum, order) => sum + (order.order_items?.length || 0), 0) ||
        0;

      const totalRevenue =
        orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) ||
        0;

      const scannedOrders =
        orders?.filter((o) => o.used_at !== null).length || 0;
      const totalOrders = orders?.length || 0;

      return {
        ...event,
        analytics: {
          totalTickets,
          individualTickets,
          groupTickets,
          totalRevenue,
          scannedOrders,
          totalOrders,
        },
      };
    }),
  );

  return <EventsPageClient initialEvents={eventsWithAnalytics} />;
}
