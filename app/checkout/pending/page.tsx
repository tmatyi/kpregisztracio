"use client";

import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Home } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function PendingContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl text-center">
              Payment Pending
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Your payment is being processed
            </p>
            {orderId && (
              <p className="text-sm text-gray-500">Order ID: {orderId}</p>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              We&apos;re waiting for confirmation from the payment provider. You
              will receive an email once the payment is confirmed.
            </p>
            <p className="text-sm text-gray-600">
              This usually takes a few minutes.
            </p>
          </div>

          <Link href="/" className="w-full block">
            <Button className="w-full" size="lg">
              <Home className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PendingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      }
    >
      <PendingContent />
    </Suspense>
  );
}
