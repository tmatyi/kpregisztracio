import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { barionClient } from "@/lib/barion/client";
import { sendOrderConfirmationEmail } from "@/lib/email/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const paymentId = body.PaymentId;

    if (!paymentId) {
      return NextResponse.json({ error: "Missing PaymentId" }, { status: 400 });
    }

    const paymentState = await barionClient.getPaymentState(paymentId);

    const supabase = await createClient();

    const orderId = paymentState.PaymentRequestId;

    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (!order) {
      console.error("Order not found:", orderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let newStatus = order.status;

    if (paymentState.Status === "Succeeded") {
      newStatus = "paid";
    } else if (paymentState.Status === "Failed") {
      newStatus = "failed";
    } else if (paymentState.Status === "Canceled") {
      newStatus = "canceled";
    } else if (paymentState.Status === "Expired") {
      newStatus = "expired";
    }

    if (newStatus !== order.status) {
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (updateError) {
        console.error("Failed to update order status:", updateError);
        return NextResponse.json(
          { error: "Failed to update order" },
          { status: 500 },
        );
      }

      console.log(`Order ${orderId} status updated to ${newStatus}`);

      // Send confirmation email when payment is successful
      if (newStatus === "paid") {
        try {
          const { data: orderDetailsData } = await supabase
            .from("orders")
            .select(
              `
              id,
              email,
              total_amount,
              qr_token,
              events (
                title,
                date,
                location
              ),
              order_items (
                id
              )
            `,
            )
            .eq("id", orderId)
            .single();

          if (orderDetailsData) {
            // Convert events array to single event object
            const event = Array.isArray((orderDetailsData as any).events)
              ? (orderDetailsData as any).events[0]
              : (orderDetailsData as any).events;

            const appUrl =
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
            const qrCodeUrl = `${appUrl}/dashboard`;

            await sendOrderConfirmationEmail({
              to: orderDetailsData.email,
              orderNumber: orderDetailsData.id,
              eventTitle: event?.title || "",
              eventDate: event?.date || "",
              eventLocation: event?.location || "",
              participantCount: orderDetailsData.order_items?.length || 0,
              totalAmount: orderDetailsData.total_amount,
              qrCodeUrl,
            });

            console.log(`Confirmation email sent to ${orderDetailsData.email}`);
          }
        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError);
          // Don't fail the webhook if email fails
        }
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      status: newStatus,
    });
  } catch (error) {
    console.error("Barion webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Barion webhook endpoint" });
}
