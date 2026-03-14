"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import Image from "next/image";
import QRCode from "qrcode";

interface QRCodeModalProps {
  orderId: string;
  onClose: () => void;
}

export function QRCodeModal({ orderId, onClose }: QRCodeModalProps) {
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [qrToken, setQrToken] = useState<string>("");
  const [eventTitle, setEventTitle] = useState<string>("");

  useEffect(() => {
    async function fetchOrderQR() {
      const supabase = createClient();

      const { data: order } = await supabase
        .from("orders")
        .select(
          `
          qr_token,
          events (
            title
          )
        `,
        )
        .eq("id", orderId)
        .single();

      if (order && order.qr_token) {
        // Convert events array to single event object
        const event = Array.isArray((order as any).events)
          ? (order as any).events[0]
          : (order as any).events;

        setQrToken(order.qr_token);
        setEventTitle(event?.title || "");

        const url = await QRCode.toDataURL(order.qr_token, {
          width: 400,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });

        setQrCodeUrl(url);
      }

      setLoading(false);
    }

    fetchOrderQR();
  }, [orderId]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `ticket-${qrToken.substring(0, 8)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Your Ticket QR Code</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : qrCodeUrl ? (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Show this QR code at the event entrance
              </p>
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200 inline-block">
                <Image
                  src={qrCodeUrl}
                  alt="Ticket QR Code"
                  width={256}
                  height={256}
                  className="w-64 h-64"
                />
              </div>
              <p className="text-xs text-gray-500 mt-4">Event: {eventTitle}</p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleDownload}
                className="flex-1"
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Download QR Code
              </Button>
              <Button onClick={onClose} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            QR code not available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
