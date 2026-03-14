"use client";

import { useState } from "react";
import { Event } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Users,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { deleteEvent, toggleEventStatus } from "@/app/admin/events/actions";
import { useRouter } from "next/navigation";

interface EventWithAnalytics extends Event {
  analytics?: {
    totalTickets: number;
    individualTickets: number;
    groupTickets: number;
    totalRevenue: number;
    scannedOrders: number;
    totalOrders: number;
  };
}

interface EventListProps {
  events: EventWithAnalytics[];
  onEdit: (event: EventWithAnalytics) => void;
}

export function EventList({ events, onEdit }: EventListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Biztosan törölni szeretnéd ezt az eseményt?")) return;

    setDeletingId(id);
    try {
      await deleteEvent(id);
      router.refresh();
    } catch (error) {
      alert("Nem sikerült törölni az eseményt");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      await toggleEventStatus(id, !currentStatus);
      router.refresh();
    } catch (error) {
      alert("Nem sikerült frissíteni az esemény státuszát");
    } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("hu-HU", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Még nincsenek események. Hozd létre az első eseményt!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  {event.title}
                  {event.is_active ? (
                    <span className="text-xs font-normal px-2 py-1 bg-green-100 text-green-800 rounded">
                      Aktív
                    </span>
                  ) : (
                    <span className="text-xs font-normal px-2 py-1 bg-gray-100 text-gray-800 rounded">
                      Inaktív
                    </span>
                  )}
                </CardTitle>
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <p>📅 {formatDate(event.date)}</p>
                  <p>📍 {event.location}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleStatus(event.id, event.is_active)}
                  disabled={togglingId === event.id}
                >
                  {event.is_active ? (
                    <ToggleRight className="w-4 h-4" />
                  ) : (
                    <ToggleLeft className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(event)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(event.id)}
                  disabled={deletingId === event.id}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          {event.analytics && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Eladott jegyek</p>
                    <p className="text-lg font-semibold">
                      {event.analytics.totalTickets}
                    </p>
                    <p className="text-xs text-gray-500">
                      Egyéni: {event.analytics.individualTickets} | Csoportos:{" "}
                      {event.analytics.groupTickets}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bevétel</p>
                    <p className="text-lg font-semibold">
                      {new Intl.NumberFormat("hu-HU", {
                        style: "currency",
                        currency: "HUF",
                      }).format(event.analytics.totalRevenue)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Beolvasások</p>
                    <p className="text-lg font-semibold">
                      {event.analytics.scannedOrders}/
                      {event.analytics.totalOrders}
                    </p>
                    <p className="text-xs text-gray-500">
                      {event.analytics.totalOrders > 0
                        ? Math.round(
                            (event.analytics.scannedOrders /
                              event.analytics.totalOrders) *
                              100,
                          )
                        : 0}
                      % beolvasva
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
