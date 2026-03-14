"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Camera,
  Users,
} from "lucide-react";

interface ScanResult {
  type: "success" | "error" | "warning";
  message: string;
  details?: {
    eventTitle?: string;
    participantCount?: number;
    orderType?: string;
  };
}

interface ScannerClientProps {
  userName: string;
}

export function ScannerClient({ userName }: ScannerClientProps) {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [scanHistory, setScanHistory] = useState<
    Array<ScanResult & { timestamp: Date }>
  >([]);

  async function verifyQRCode(qrToken: string) {
    const supabase = createClient();

    try {
      // Fetch order with QR token
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select(
          `
          id,
          status,
          used_at,
          scanned_by,
          type,
          events (
            title
          ),
          order_items (
            id
          )
        `,
        )
        .eq("qr_token", qrToken)
        .single();

      if (orderError || !order) {
        const result: ScanResult = {
          type: "error",
          message: "Invalid QR Code",
        };
        setScanResult(result);
        setScanHistory((prev) => [
          { ...result, timestamp: new Date() },
          ...prev.slice(0, 9),
        ]);
        return;
      }

      // Check if payment is completed
      if (order.status !== "paid") {
        const result: ScanResult = {
          type: "warning",
          message: "Payment Not Completed",
        };
        setScanResult(result);
        setScanHistory((prev) => [
          { ...result, timestamp: new Date() },
          ...prev.slice(0, 9),
        ]);
        return;
      }

      // Check if already used
      if (order.used_at) {
        // Convert events array to single event object
        const event = Array.isArray((order as any).events)
          ? (order as any).events[0]
          : (order as any).events;

        const result: ScanResult = {
          type: "warning",
          message: "Ticket Already Used",
          details: {
            eventTitle: event?.title,
          },
        };
        setScanResult(result);
        setScanHistory((prev) => [
          { ...result, timestamp: new Date() },
          ...prev.slice(0, 9),
        ]);
        return;
      }

      // Mark as used
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error: updateError } = await supabase
        .from("orders")
        .update({
          used_at: new Date().toISOString(),
          scanned_by: user?.id,
        })
        .eq("id", order.id);

      if (updateError) {
        const result: ScanResult = {
          type: "error",
          message: "Failed to mark ticket as used",
        };
        setScanResult(result);
        setScanHistory((prev) => [
          { ...result, timestamp: new Date() },
          ...prev.slice(0, 9),
        ]);
        return;
      }

      // Success
      // Convert events array to single event object
      const event = Array.isArray((order as any).events)
        ? (order as any).events[0]
        : (order as any).events;

      const result: ScanResult = {
        type: "success",
        message: "Ticket Verified Successfully",
        details: {
          eventTitle: event?.title,
          participantCount: order.order_items?.length || 0,
          orderType: order.type,
        },
      };
      setScanResult(result);
      setScanHistory((prev) => [
        { ...result, timestamp: new Date() },
        ...prev.slice(0, 9),
      ]);
    } catch (error) {
      const result: ScanResult = {
        type: "error",
        message: "Error verifying ticket",
      };
      setScanResult(result);
      setScanHistory((prev) => [
        { ...result, timestamp: new Date() },
        ...prev.slice(0, 9),
      ]);
    }
  }

  const onScanSuccess = useCallback(async (decodedText: string) => {
    if (scannerRef.current) {
      scannerRef.current.pause(true);
    }

    await verifyQRCode(decodedText);

    setTimeout(() => {
      if (scannerRef.current) {
        scannerRef.current.resume();
      }
    }, 3000);
  }, []);

  const onScanError = useCallback((error: string) => {
    // Ignore scan errors (they happen frequently during scanning)
  }, []);

  useEffect(() => {
    if (isScanning && !scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false,
      );

      scannerRef.current.render(onScanSuccess, onScanError);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [isScanning, onScanSuccess, onScanError]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5" />;
      case "error":
        return <XCircle className="h-5 w-5" />;
      case "warning":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getAlertVariant = (type: string): "default" | "destructive" => {
    return type === "error" ? "destructive" : "default";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">QR Scanner</h1>
          <p className="text-gray-600 text-sm">Welcome, {userName}</p>
        </div>

        {/* Scanner Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Scan Ticket
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isScanning ? (
              <div className="text-center py-12">
                <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Start scanning to verify tickets
                </p>
                <Button onClick={() => setIsScanning(true)} size="lg">
                  Start Scanner
                </Button>
              </div>
            ) : (
              <div>
                <div id="qr-reader" className="w-full"></div>
                <Button
                  onClick={() => {
                    setIsScanning(false);
                    setScanResult(null);
                  }}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Stop Scanner
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scan Result */}
        {scanResult && (
          <Alert
            variant={getAlertVariant(scanResult.type)}
            className={`mb-6 ${
              scanResult.type === "success"
                ? "border-green-500 bg-green-50"
                : scanResult.type === "warning"
                  ? "border-yellow-500 bg-yellow-50"
                  : ""
            }`}
          >
            {getAlertIcon(scanResult.type)}
            <AlertTitle className="text-lg font-bold">
              {scanResult.message}
            </AlertTitle>
            {scanResult.details && (
              <AlertDescription className="mt-2">
                {scanResult.details.eventTitle && (
                  <div className="font-medium">
                    Event: {scanResult.details.eventTitle}
                  </div>
                )}
                {scanResult.details.participantCount !== undefined && (
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {scanResult.details.participantCount} participant
                      {scanResult.details.participantCount !== 1 ? "s" : ""}
                    </span>
                    {scanResult.details.orderType && (
                      <span className="text-sm text-gray-600">
                        ({scanResult.details.orderType})
                      </span>
                    )}
                  </div>
                )}
              </AlertDescription>
            )}
          </Alert>
        )}

        {/* Scan History */}
        {scanHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {scanHistory.map((scan, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`${
                          scan.type === "success"
                            ? "text-green-600"
                            : scan.type === "warning"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {getAlertIcon(scan.type)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {scan.message}
                        </div>
                        {scan.details?.eventTitle && (
                          <div className="text-xs text-gray-600">
                            {scan.details.eventTitle}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {scan.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
