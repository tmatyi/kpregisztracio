"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { CartItem, TicketType, OrderType } from "@/types";

interface UseCartReturn {
  items: CartItem[];
  addItem: (
    eventId: string,
    type: TicketType,
    quantity: number,
    price?: number,
  ) => void;
  removeItem: (type: TicketType) => void;
  updateQuantity: (
    type: TicketType,
    quantity: number,
  ) => { success: boolean; error?: string };
  clearCart: () => void;
  totalAmount: number;
  totalTickets: number;
  orderType: OrderType | null;
  canCheckout: boolean;
  requiresAuth: boolean;
  error: string | null;
}

export function useCart(): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });
  const [error, setError] = useState<string | null>(null);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items]);

  const orderType = useMemo((): OrderType | null => {
    if (items.length === 0) return null;
    const firstItem = items[0];
    return firstItem.type.startsWith("group") ? "group" : "individual";
  }, [items]);

  const totalTickets = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }, [items]);

  const requiresAuth = useMemo(() => {
    return orderType === "group";
  }, [orderType]);

  const canCheckout = useMemo(() => {
    if (items.length === 0) return false;

    if (orderType === "individual") {
      return totalTickets <= 4 && totalTickets > 0;
    }

    if (orderType === "group") {
      return totalTickets >= 5;
    }

    return false;
  }, [items.length, orderType, totalTickets]);

  const validateAddition = useCallback(
    (
      type: TicketType,
      quantity: number,
    ): { valid: boolean; error?: string } => {
      const newItemType: OrderType = type.startsWith("group")
        ? "group"
        : "individual";

      if (items.length > 0 && orderType !== newItemType) {
        return {
          valid: false,
          error: `Cannot mix ${orderType} and ${newItemType} tickets in the same cart`,
        };
      }

      const existingItem = items.find((item) => item.type === type);
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      const newTotal = totalTickets - currentQuantity + quantity;

      if (newItemType === "individual" && newTotal > 4) {
        return {
          valid: false,
          error: "Individual tickets are limited to a maximum of 4 per order",
        };
      }

      if (newItemType === "group" && newTotal < 5 && newTotal > 0) {
        return {
          valid: false,
          error: "Group tickets require a minimum of 5 tickets",
        };
      }

      return { valid: true };
    },
    [items, orderType, totalTickets],
  );

  const addItem = useCallback(
    (
      eventId: string,
      type: TicketType,
      quantity: number,
      price: number = 0,
    ): void => {
      if (quantity <= 0) {
        setError("Quantity must be greater than 0");
        return;
      }

      const validation = validateAddition(type, quantity);
      if (!validation.valid) {
        setError(validation.error || "Invalid ticket selection");
        return;
      }

      setError(null);
      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.type === type);

        if (existingIndex >= 0) {
          const newItems = [...prevItems];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity,
            price,
          };
          return newItems;
        }

        return [...prevItems, { eventId, type, quantity, price }];
      });
    },
    [validateAddition],
  );

  const removeItem = useCallback((type: TicketType) => {
    setItems((prevItems) => prevItems.filter((item) => item.type !== type));
  }, []);

  const updateQuantity = useCallback(
    (
      type: TicketType,
      quantity: number,
    ): { success: boolean; error?: string } => {
      if (quantity <= 0) {
        removeItem(type);
        return { success: true };
      }

      const item = items.find((i) => i.type === type);
      if (!item) {
        return { success: false, error: "Item not found in cart" };
      }

      const validation = validateAddition(type, quantity);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.type === type ? { ...item, quantity } : item,
        ),
      );

      return { success: true };
    },
    [items, validateAddition, removeItem],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
  }, []);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalAmount,
    totalTickets,
    orderType,
    canCheckout,
    requiresAuth,
    error,
  };
}
