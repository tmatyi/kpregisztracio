"use server";

import { createClient } from "@/lib/supabase/server";
import { barionClient } from "@/lib/barion/client";
import { BARION_CONFIG } from "@/lib/barion/config";
import { CheckoutFormData } from "@/lib/validations/checkout";
import { revalidatePath } from "next/cache";

export async function createOrderAndInitiatePayment(
  formData: CheckoutFormData,
) {
  console.log("=== Starting payment initiation ===");
  console.log("Form data:", JSON.stringify(formData, null, 2));

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("User:", user?.id);

    const eventId = formData.event_id;
    const tickets = formData.tickets;

    console.log("Event ID:", eventId);
    console.log("Tickets:", tickets.length);

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (eventError) {
      console.error("Event fetch error:", eventError);
      throw new Error(`Event fetch failed: ${eventError.message}`);
    }

    if (!event) {
      throw new Error("Event not found");
    }

    console.log("Event found:", event.title);

    const orderType = tickets[0].type.startsWith("group")
      ? "group"
      : "individual";
    const totalAmount = tickets.length * 10;

    console.log("Order type:", orderType);
    console.log("Total amount:", totalAmount);

    const qrToken = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        event_id: eventId,
        user_id: user?.id || null,
        email: formData.email,
        total_amount: totalAmount,
        type: orderType,
        status: "pending",
        qr_token: qrToken,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    if (!order) {
      throw new Error("Failed to create order: No data returned");
    }

    console.log("Order created:", order.id);

    const orderItems = tickets.map((ticket) => ({
      order_id: order.id,
      type: ticket.type.includes("child") ? "child" : "adult",
      holder_name: ticket.data.holder_name,
      holder_age: "holder_age" in ticket.data ? ticket.data.holder_age : null,
      parent_name:
        "parent_name" in ticket.data ? ticket.data.parent_name : null,
      holder_phone:
        "holder_phone" in ticket.data ? ticket.data.holder_phone : null,
      holder_address:
        "holder_address" in ticket.data ? ticket.data.holder_address : null,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items error:", itemsError);
      await supabase.from("orders").delete().eq("id", order.id);
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    console.log("Order items created");
    console.log("Barion config:", {
      posKey: BARION_CONFIG.posKey?.substring(0, 10) + "...",
      environment: BARION_CONFIG.environment,
      baseUrl: BARION_CONFIG.baseUrl,
    });

    const barionRequest = {
      POSKey: BARION_CONFIG.posKey,
      PaymentType: "Immediate" as const,
      GuestCheckOut: true,
      FundingSources: ["All"],
      PaymentRequestId: order.id,
      PayerHint: formData.email,
      Locale: "en-US",
      OrderNumber: order.id,
      Currency: "HUF",
      RedirectUrl: `${BARION_CONFIG.appUrl}/api/barion/callback`,
      CallbackUrl: `${BARION_CONFIG.appUrl}/api/barion/webhook`,
      Transactions: [
        {
          POSTransactionId: `${order.id}-1`,
          Payee: BARION_CONFIG.payeeEmail,
          Total: totalAmount,
          Comment: `Tickets for ${event.title}`,
          Items: tickets.map((ticket, index) => ({
            Name: `${ticket.type.replace("_", " ")} ticket`,
            Description: `Ticket for ${event.title}`,
            Quantity: 1,
            Unit: "piece",
            UnitPrice: 10,
            ItemTotal: 10,
            SKU: `${ticket.type}-${index}`,
          })),
        },
      ],
    };

    console.log("Starting Barion payment...");

    const paymentResponse = await barionClient.startPayment(barionRequest);

    console.log("Barion response:", {
      paymentId: paymentResponse.PaymentId,
      status: paymentResponse.Status,
    });

    await supabase
      .from("orders")
      .update({
        status: "payment_initiated",
      })
      .eq("id", order.id);

    const gatewayUrl = barionClient.getPaymentUrl(paymentResponse.PaymentId);
    console.log("Gateway URL:", gatewayUrl);

    return {
      success: true,
      orderId: order.id,
      paymentId: paymentResponse.PaymentId,
      gatewayUrl,
    };
  } catch (error) {
    console.error("=== Payment initiation error ===");
    console.error("Error:", error);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : "Unknown error",
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack",
    );

    throw error;
  }
}
