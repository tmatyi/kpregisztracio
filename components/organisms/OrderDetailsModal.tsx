"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, User, Calendar, MapPin } from "lucide-react";

interface OrderItem {
  id: string;
  type: string;
  holder_name: string;
  holder_age: number | null;
  parent_name: string | null;
  holder_phone: string | null;
  holder_address: string | null;
}

interface Event {
  title: string;
  date: string;
  location: string;
}

interface Order {
  id: string;
  total_amount: number;
  type: string;
  status: string;
  created_at: string;
  events: Event;
}

interface OrderDetailsModalProps {
  orderId: string;
  onClose: () => void;
}

export function OrderDetailsModal({
  orderId,
  onClose,
}: OrderDetailsModalProps) {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    async function fetchOrderDetails() {
      const supabase = createClient();

      const { data: orderData } = await supabase
        .from("orders")
        .select(
          `
          id,
          total_amount,
          type,
          status,
          created_at,
          events (
            title,
            date,
            location
          )
        `,
        )
        .eq("id", orderId)
        .single();

      const { data: itemsData } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

      if (orderData) {
        // Convert events array to single event object
        const mappedOrder = {
          ...orderData,
          events: Array.isArray((orderData as any).events)
            ? (orderData as any).events[0]
            : (orderData as any).events,
        };
        setOrder(mappedOrder as Order);
      }
      if (itemsData) setOrderItems(itemsData);
      setLoading(false);
    }

    fetchOrderDetails();
  }, [orderId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rendelés részletei</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : order ? (
          <div className="space-y-6">
            {/* Event Information */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4">
                  Esemény információk
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium">{order.events.title}</div>
                      <div className="text-sm text-gray-600">
                        {formatDate(order.events.date)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="text-sm text-gray-600">
                      {order.events.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Participants */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4">
                  Résztvevők ({orderItems.length})
                </h3>
                <div className="space-y-4">
                  {orderItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          Résztvevő #{index + 1}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({item.type === "child" ? "Gyermek" : "Felnőtt"})
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Név:</span>{" "}
                          <span className="font-medium">
                            {item.holder_name}
                          </span>
                        </div>
                        {item.holder_age && (
                          <div>
                            <span className="text-gray-600">Életkor:</span>{" "}
                            <span className="font-medium">
                              {item.holder_age}
                            </span>
                          </div>
                        )}
                        {item.parent_name && (
                          <div>
                            <span className="text-gray-600">
                              Szülő/Gondviselő:
                            </span>{" "}
                            <span className="font-medium">
                              {item.parent_name}
                            </span>
                          </div>
                        )}
                        {item.holder_phone && (
                          <div>
                            <span className="text-gray-600">Telefon:</span>{" "}
                            <span className="font-medium">
                              {item.holder_phone}
                            </span>
                          </div>
                        )}
                        {item.holder_address && (
                          <div className="md:col-span-2">
                            <span className="text-gray-600">Cím:</span>{" "}
                            <span className="font-medium">
                              {item.holder_address}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4">
                  Rendelés összegzése
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rendelésszám:</span>
                    <span className="font-mono">
                      {order.id.substring(0, 8)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rendelés típusa:</span>
                    <span className="capitalize">{order.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Státusz:</span>
                    <span className="capitalize">
                      {order.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rendelés dátuma:</span>
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-semibold">
                    <span>Végösszeg:</span>
                    <span>
                      {new Intl.NumberFormat("hu-HU", {
                        style: "currency",
                        currency: "HUF",
                      }).format(order.total_amount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">Order not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
