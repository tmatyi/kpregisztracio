# KPREGI Setup Guide

## Quick Start Checklist

### 1. Install Dependencies ✓
Already completed. All npm packages are installed.

### 2. Configure Supabase

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be provisioned

#### Get Your Credentials
1. Go to Project Settings > API
2. Copy your project URL
3. Copy your anon/public key

#### Create `.env.local` file
```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

#### Run Database Migration
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Create a new query
4. Copy the entire contents of `supabase/schema.sql`
5. Paste and run the query
6. Verify all tables were created in the Table Editor

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Testing the Cart Logic

### Test Individual Tickets
1. Add 1-4 individual tickets to cart
2. Try adding a 5th - should show error
3. Try adding group tickets - should show error about mixing types

### Test Group Tickets
1. Clear cart
2. Add group tickets
3. Try adding less than 5 - should show error
4. Add 5 or more - should allow
5. Try adding individual tickets - should show error about mixing types

## Component Usage Examples

### Using the Cart Hook

```tsx
'use client'

import { useCart } from '@/hooks/useCart'

export function TicketSelector() {
  const { 
    items, 
    addItem, 
    totalAmount, 
    canCheckout,
    requiresAuth 
  } = useCart()

  const handleAddTicket = () => {
    const result = addItem('individual_child', 1, 25.00)
    if (!result.success) {
      alert(result.error)
    }
  }

  return (
    <div>
      <button onClick={handleAddTicket}>Add Child Ticket</button>
      <p>Total: ${totalAmount}</p>
      {requiresAuth && <p>Login required for group tickets</p>}
      <button disabled={!canCheckout}>Checkout</button>
    </div>
  )
}
```

### Using the Checkout Form

```tsx
'use client'

import { CheckoutForm } from '@/components/organisms/CheckoutForm'
import { useCart } from '@/hooks/useCart'

export function CheckoutPage() {
  const { items } = useCart()

  const handleSubmit = async (data) => {
    console.log('Order data:', data)
    // Submit to your API
  }

  return (
    <CheckoutForm
      eventId="your-event-id"
      cartItems={items}
      onSubmit={handleSubmit}
      userEmail="user@example.com"
    />
  )
}
```

## Database Schema Overview

### Key Tables

**profiles**
- Linked to Supabase Auth users
- Stores role (admin/staff/customer)
- Auto-created on user signup

**events**
- Event details and status
- Only active events visible to public

**orders**
- Links to event and user
- Contains QR token for validation
- Tracks usage and scanner

**order_items**
- Individual ticket details
- Stores participant information
- Links to parent order

## Ticket Type Reference

| Type | Min | Max | Auth Required | Fields |
|------|-----|-----|---------------|--------|
| individual_child | 1 | 4 | No | Name, Age, Parent, Email, Phone, Address |
| individual_adult | 1 | 4 | No | Name, Email, Phone |
| group_child | 5 | ∞ | Yes | Name, Age |
| group_adult | 5 | ∞ | Yes | Name |

## Next Steps

1. **Create Event Pages**: Build pages to display and select events
2. **Implement Checkout Flow**: Create the complete purchase flow
3. **Add QR Code Generation**: Generate QR codes after successful orders
4. **Build Scanner App**: Create staff interface for scanning tickets
5. **Add Payment Integration**: Integrate Stripe or other payment provider
6. **Email Notifications**: Send confirmation emails with QR codes
7. **Admin Dashboard**: Build admin interface for managing events

## Troubleshooting

### "Cannot find module" errors
Run `npm install` again to ensure all dependencies are installed.

### Supabase connection errors
- Verify your `.env.local` file exists and has correct credentials
- Check that your Supabase project is active
- Ensure you're using the correct URL (should include https://)

### Form validation errors
- Check that all required fields are filled
- Verify age is a number between 1-17 for children
- Ensure email format is valid

### Cart logic errors
- Cannot mix individual and group tickets
- Individual tickets limited to 4
- Group tickets require minimum 5
- Clear cart to switch ticket types

## Support

For issues or questions, refer to:
- Next.js docs: https://nextjs.org/docs
- Supabase docs: https://supabase.com/docs
- React Hook Form: https://react-hook-form.com
- Zod validation: https://zod.dev
