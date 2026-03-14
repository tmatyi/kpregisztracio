'use client'

import { useCart } from '@/hooks/useCart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CheckoutDebugPage() {
  const cart = useCart()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Cart Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(cart, null, 2)}
          </pre>
          
          <div className="mt-4 space-y-2">
            <p><strong>Items count:</strong> {cart.items.length}</p>
            <p><strong>Total tickets:</strong> {cart.totalTickets}</p>
            <p><strong>Total amount:</strong> {cart.totalAmount}</p>
            <p><strong>Order type:</strong> {cart.orderType}</p>
            <p><strong>Can checkout:</strong> {cart.canCheckout ? 'Yes' : 'No'}</p>
            <p><strong>Requires auth:</strong> {cart.requiresAuth ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {cart.error || 'None'}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-bold mb-2">Cart Items:</h3>
            {cart.items.map((item, index) => (
              <div key={index} className="bg-white p-3 rounded mb-2">
                <p><strong>Event ID:</strong> {item.eventId || 'MISSING!'}</p>
                <p><strong>Type:</strong> {item.type}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Price:</strong> {item.price}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
