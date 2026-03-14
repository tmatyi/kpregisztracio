"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

interface SuccessPageClientProps {
  order: any;
  orderItems: any[];
}

export function SuccessPageClient({
  order,
  orderItems,
}: SuccessPageClientProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    if (order.qr_token) {
      QRCode.toDataURL(order.qr_token, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      }).then(setQrCodeUrl);
    }
  }, [order.qr_token]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `ticket-${order.id}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600">Thank you for your purchase</p>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Order #{order.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Event</p>
                <p className="font-medium">{order.events?.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-medium">{formatDate(order.events?.date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium">{order.events?.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-medium">{order.total_amount} HUF</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{order.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tickets</p>
                <p className="font-medium">{orderItems.length} ticket(s)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Ticket QR Code</CardTitle>
            <CardDescription>
              Present this QR code at the event entrance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              {qrCodeUrl ? (
                <>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <Image
                      src={qrCodeUrl}
                      alt="Ticket QR Code"
                      width={256}
                      height={256}
                      className="w-64 h-64"
                    />
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Token: {order.qr_token}
                  </p>
                  <Button onClick={downloadQRCode} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                </>
              ) : (
                <div className="w-64 h-64 bg-gray-100 animate-pulse rounded-lg" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ticket Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ticket Holders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orderItems.map((item, index) => (
                <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">
                    Ticket #{index + 1} -{" "}
                    {item.type === "child" ? "Child" : "Adult"}
                  </p>
                  <p className="text-sm text-gray-600">{item.holder_name}</p>
                  {item.holder_age && (
                    <p className="text-sm text-gray-600">
                      Age: {item.holder_age}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800 space-y-2">
            <p>✓ A confirmation email has been sent to {order.email}</p>
            <p>✓ Please save or print your QR code</p>
            <p>✓ Arrive 15 minutes before the event starts</p>
            <p>✓ Present your QR code at the entrance</p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button size="lg">
              <Home className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
