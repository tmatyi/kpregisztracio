import { Database } from "./database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Event = Database["public"]["Tables"]["events"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];

export type TicketType =
  | "individual_child"
  | "individual_adult"
  | "group_child"
  | "group_adult";
export type OrderType = "individual" | "group";

export interface CartItem {
  eventId: string;
  type: TicketType;
  quantity: number;
  price: number;
}

export interface TicketFormData {
  holder_name: string;
  holder_age?: number;
  parent_name?: string;
  holder_phone?: string;
  holder_address?: string;
  email?: string;
}
