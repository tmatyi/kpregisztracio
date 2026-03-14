"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/atoms/FormField";
import { TicketFormFields } from "@/components/molecules/TicketFormFields";
import {
  checkoutFormSchema,
  CheckoutFormData,
} from "@/lib/validations/checkout";
import { CartItem, TicketType } from "@/types";

interface CheckoutFormProps {
  eventId: string;
  cartItems: CartItem[];
  onSubmit: (data: CheckoutFormData) => Promise<void>;
  userEmail?: string;
}

export function CheckoutForm({
  eventId,
  cartItems,
  onSubmit,
  userEmail,
}: CheckoutFormProps) {
  console.log("CheckoutForm rendered with:", {
    eventId,
    cartItemsCount: cartItems.length,
    userEmail,
  });

  const ticketsArray = cartItems.flatMap((item) =>
    Array.from({ length: item.quantity }, () => ({
      type: item.type,
      data: {},
    })),
  );

  console.log("Tickets array:", ticketsArray);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      event_id: eventId,
      email: userEmail || "",
      tickets: ticketsArray,
    },
  });

  console.log("Form errors:", errors);
  console.log("Is submitting:", isSubmitting);

  const groupedTickets = ticketsArray.reduce(
    (acc, ticket, index) => {
      const type = ticket.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(index);
      return acc;
    },
    {} as Record<TicketType, number[]>,
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <TextField
            label="Email Address"
            type="email"
            required
            placeholder="your@email.com"
            {...register("email")}
            error={errors.email?.message as string}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(groupedTickets).map(([ticketType, indices]) => (
            <div key={ticketType} className="space-y-4">
              <h3 className="text-lg font-semibold capitalize">
                {ticketType.replace("_", " ")} Tickets ({indices.length})
              </h3>

              {indices.map((index, i) => (
                <Card key={index} className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-base">Ticket #{i + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <input
                      type="hidden"
                      {...register(`tickets.${index}.type`)}
                      value={ticketType}
                    />
                    <TicketFormFields
                      ticketType={ticketType as TicketType}
                      index={index}
                      register={register}
                      errors={errors}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Complete Purchase"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
