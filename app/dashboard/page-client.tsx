"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, QrCode } from "lucide-react";
import { OrderDetailsModal } from "@/components/organisms/OrderDetailsModal";
import { QRCodeModal } from "@/components/organisms/QRCodeModal";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
}

interface Order {
  id: string;
  event_id: string;
  email: string;
  total_amount: number;
  type: string;
  status: string;
  qr_token: string;
  created_at: string;
  events: Event;
}

interface DashboardClientProps {
  orders: Order[];
  userEmail: string;
}

export function DashboardClient({ orders, userEmail }: DashboardClientProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [qrOrderId, setQrOrderId] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      paid: "default",
      pending: "secondary",
      payment_initiated: "secondary",
      failed: "destructive",
    };

    const labels: Record<string, string> = {
      paid: "FIZETVE",
      pending: "FÜGGŐBEN",
      payment_initiated: "FIZETÉS FOLYAMATBAN",
      failed: "SIKERTELEN",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status.toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("hu-HU", {
      style: "currency",
      currency: "HUF",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Rendeléseim</h1>
          <p className="text-gray-600 mt-2">Jegyek megtekintése és kezelése</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">Még nem vásároltál jegyeket.</p>
              <Button onClick={() => (window.location.href = "/")}>
                Események böngészése
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Rendelési előzmények</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rendelésszám</TableHead>
                      <TableHead>Esemény</TableHead>
                      <TableHead>Dátum</TableHead>
                      <TableHead>Összeg</TableHead>
                      <TableHead>Státusz</TableHead>
                      <TableHead className="text-right">Műveletek</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          {order.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {order.events.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(order.events.date)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(order.created_at)}</TableCell>
                        <TableCell>
                          {formatAmount(order.total_amount)}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrderId(order.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Részletek
                            </Button>
                            {order.status === "paid" && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => setQrOrderId(order.id)}
                              >
                                <QrCode className="h-4 w-4 mr-1" />
                                QR kód
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedOrderId && (
          <OrderDetailsModal
            orderId={selectedOrderId}
            onClose={() => setSelectedOrderId(null)}
          />
        )}

        {qrOrderId && (
          <QRCodeModal orderId={qrOrderId} onClose={() => setQrOrderId(null)} />
        )}
      </div>
    </div>
  );
}
