"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckoutForm } from "@/components/organisms/CheckoutForm";
import { ShoppingCart, Trash2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { User } from "@supabase/supabase-js";

interface CheckoutPageClientProps {
  user: User | null;
}

export function CheckoutPageClient({ user }: CheckoutPageClientProps) {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      router.push("/");
    }
  }, [items, router]);

  const hasGroupTickets = items.some(
    (item) => item.type === "group_child" || item.type === "group_adult",
  );

  if (hasGroupTickets && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              You must be logged in to purchase group tickets.
            </p>
            <Button onClick={() => router.push("/login")} className="w-full">
              Login to Continue
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full"
            >
              Back to Events
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6"
        >
          ← Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            {paymentError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payment Error</AlertTitle>
                <AlertDescription>{paymentError}</AlertDescription>
              </Alert>
            )}
            <CheckoutForm
              eventId={items[0]?.eventId || ""}
              cartItems={items}
              onSubmit={async (data) => {
                setPaymentError(null);
                console.log("=== Client: Submitting checkout form ===");
                console.log("Event ID:", items[0]?.eventId);
                console.log("Cart items:", items.length);

                try {
                  const { createOrderAndInitiatePayment } =
                    await import("./actions");

                  console.log("Calling createOrderAndInitiatePayment...");
                  const result = await createOrderAndInitiatePayment(data);

                  console.log("Result:", result);

                  if (result.success && result.gatewayUrl) {
                    console.log("Redirecting to:", result.gatewayUrl);
                    clearCart();
                    window.location.href = result.gatewayUrl;
                  } else {
                    const errorMsg =
                      "Failed to initiate payment - no gateway URL received";
                    console.error(errorMsg);
                    setPaymentError(errorMsg);
                  }
                } catch (error) {
                  console.error("=== Client: Payment error ===");
                  console.error("Error:", error);
                  const errorMsg =
                    error instanceof Error
                      ? error.message
                      : "Payment initiation failed. Please try again.";
                  console.error("Error message:", errorMsg);
                  setPaymentError(errorMsg);
                }
              }}
              userEmail={user?.email}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between p-3 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {item.type
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Tickets:</span>
                    <span>
                      {items.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
