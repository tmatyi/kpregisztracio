'use client'

import { useState } from 'react'
import { Event, TicketType, CartItem } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TicketSelector } from '@/components/molecules/TicketSelector'
import { Calendar, MapPin, ShoppingCart, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'

interface EventDetailClientProps {
  event: Event
  isLoggedIn: boolean
}

export function EventDetailClient({ event, isLoggedIn }: EventDetailClientProps) {
  const router = useRouter()
  const { items, addItem, removeItem, clearCart, error } = useCart()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleAddToCart = (type: TicketType, quantity: number) => {
    addItem(event.id, type, quantity)
  }

  const handleProceedToCheckout = () => {
    if (items.length === 0) return
    router.push('/checkout')
  }

  const totalTickets = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="mb-6"
        >
          ← Back to Events
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 mt-0.5 text-gray-600" />
                    <div>
                      <p className="font-medium">Date & Time</p>
                      <p className="text-gray-600">{formatDate(event.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-0.5 text-gray-600" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Selector */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Select Tickets</h2>
              <TicketSelector
                isLoggedIn={isLoggedIn}
                onAddToCart={handleAddToCart}
                cartItems={items}
                error={error}
              />
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Your Cart
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No tickets selected
                  </p>
                ) : (
                  <>
                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {item.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.type)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Tickets:</span>
                        <span>{totalTickets}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={handleProceedToCheckout}
                        className="w-full"
                        size="lg"
                      >
                        Proceed to Checkout
                      </Button>
                      <Button
                        onClick={clearCart}
                        variant="outline"
                        className="w-full"
                      >
                        Clear Cart
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
