"use client";

import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ErrorContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "Payment failed";
  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-center">
              Payment Failed
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-2">{message}</p>
            {status && (
              <p className="text-sm text-gray-500">Status: {status}</p>
            )}
            {orderId && (
              <p className="text-sm text-gray-500">Order ID: {orderId}</p>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Your payment was not successful. Please try again or contact
              support if the problem persists.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/" className="w-full">
              <Button className="w-full" size="lg">
                <Home className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
            </Link>
            {orderId && (
              <Button variant="outline" className="w-full" size="lg">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
