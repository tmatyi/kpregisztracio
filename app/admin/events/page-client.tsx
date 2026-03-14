"use client";

import { useState } from "react";
import { Event } from "@/types";
import { EventForm } from "@/components/organisms/EventForm";
import { EventList } from "@/components/organisms/EventList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createEvent, updateEvent } from "./actions";
import { useRouter } from "next/navigation";
import { EventFormData } from "@/lib/validations/event";

interface EventsPageClientProps {
  initialEvents: Event[];
}

export function EventsPageClient({ initialEvents }: EventsPageClientProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const handleCreate = async (data: EventFormData) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("date", data.date);
      formData.append("location", data.location);
      formData.append("is_active", String(data.is_active));

      await createEvent(formData);
      setShowForm(false);
      router.refresh();
    } catch (error) {
      alert("Nem sikerült létrehozni az eseményt");
    }
  };

  const handleUpdate = async (data: EventFormData) => {
    if (!editingEvent) return;

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("date", data.date);
      formData.append("location", data.location);
      formData.append("is_active", String(data.is_active));

      await updateEvent(editingEvent.id, formData);
      setEditingEvent(null);
      router.refresh();
    } catch (error) {
      alert("Nem sikerült frissíteni az eseményt");
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  return (
    <div className="px-4 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Események kezelése</h1>
        {!showForm && !editingEvent && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Új esemény
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-6">
          <EventForm onSubmit={handleCreate} onCancel={handleCancel} />
        </div>
      )}

      {editingEvent && (
        <div className="mb-6">
          <EventForm
            event={editingEvent}
            onSubmit={handleUpdate}
            onCancel={handleCancel}
          />
        </div>
      )}

      <EventList events={initialEvents} onEdit={handleEdit} />
    </div>
  );
}
