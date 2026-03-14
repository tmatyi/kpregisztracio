# Admin Dashboard Guide

## Overview

The KPREGI Admin Dashboard provides a secure interface for administrators to manage events. Access is restricted to users with the 'admin' role in the database.

## Features

### ✅ Role-Based Access Control
- Only users with `role = 'admin'` can access `/admin/*` routes
- Automatic redirect to login if not authenticated
- Automatic redirect to home if not admin

### ✅ Event Management
- **Create Events**: Add new events with title, date, location
- **Edit Events**: Update event details
- **Delete Events**: Remove events (with confirmation)
- **Toggle Status**: Activate/deactivate events for public visibility
- **List Events**: View all events sorted by date

## Accessing the Admin Dashboard

### 1. Create an Admin User

First, you need to create a user in Supabase and set their role to 'admin':

```sql
-- After creating a user through Supabase Auth, update their profile:
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-admin@example.com';
```

### 2. Login

Navigate to `/login` and sign in with your admin credentials.

### 3. Access Dashboard

After successful login, you'll be redirected to `/admin/events`.

## Admin Routes

- **`/admin/events`** - Event management dashboard
- **`/login`** - Authentication page

## Event Management Interface

### Creating an Event

1. Click the **"Create Event"** button
2. Fill in the form:
   - **Title**: Event name (min 3 characters)
   - **Date & Time**: When the event occurs
   - **Location**: Where the event takes place (min 3 characters)
   - **Active**: Check to make visible to customers
3. Click **"Create Event"**

### Editing an Event

1. Click the **Edit** button (pencil icon) on any event
2. Modify the fields as needed
3. Click **"Update Event"**
4. Click **"Cancel"** to discard changes

### Deleting an Event

1. Click the **Delete** button (trash icon) on any event
2. Confirm the deletion in the popup
3. Event will be permanently removed

### Toggling Event Status

1. Click the **Toggle** button (switch icon) on any event
2. Event status will switch between Active/Inactive
3. Only active events are visible to customers

## Event Status Indicators

- **🟢 Active** - Event is visible to customers
- **⚫ Inactive** - Event is hidden from customers

## Security Features

### Server-Side Protection

All admin routes are protected at the server level:

```typescript
// lib/auth/admin.ts
export async function requireAdmin() {
  // Checks authentication
  // Verifies admin role
  // Redirects if unauthorized
}
```

### Server Actions

All mutations use Next.js Server Actions with admin verification:

- `createEvent()` - Create new event
- `updateEvent()` - Update existing event
- `deleteEvent()` - Delete event
- `toggleEventStatus()` - Change event visibility

### RLS Policies

Database-level security ensures:
- Admins can manage all events
- Regular users can only view active events
- All operations are logged and auditable

## Component Architecture

### Server Components
- **`app/admin/events/page.tsx`** - Server-side data fetching
- **`app/admin/layout.tsx`** - Admin layout with auth check

### Client Components
- **`app/admin/events/page-client.tsx`** - Interactive UI
- **`components/organisms/EventForm.tsx`** - Event creation/editing form
- **`components/organisms/EventList.tsx`** - Event listing with actions

## Validation

### Form Validation (Zod)

```typescript
{
  title: min 3 characters
  date: required, valid datetime
  location: min 3 characters
  is_active: boolean
}
```

### Server-Side Validation

All server actions validate data before database operations.

## Error Handling

- **Authentication Errors**: Redirect to login
- **Authorization Errors**: Redirect to home
- **Validation Errors**: Display inline error messages
- **Database Errors**: Show user-friendly error alerts

## Development

### Adding New Admin Features

1. Create route in `app/admin/`
2. Add server actions in route's `actions.ts`
3. Use `requireAdmin()` for protection
4. Add navigation link in `app/admin/layout.tsx`

### Testing Admin Access

```bash
# Create test admin user in Supabase
# Update their role to 'admin'
# Login at /login
# Access /admin/events
```

## Troubleshooting

### "Access Denied" or Redirect to Home

**Issue**: User doesn't have admin role

**Solution**:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'user-uuid';
```

### Cannot See Events

**Issue**: No events created yet

**Solution**: Click "Create Event" to add your first event

### Form Validation Errors

**Issue**: Invalid data entered

**Solution**: 
- Ensure title is at least 3 characters
- Select a valid date and time
- Ensure location is at least 3 characters

### Login Fails

**Issue**: Invalid credentials or user doesn't exist

**Solution**:
- Verify email and password
- Create user in Supabase Auth first
- Ensure profile was auto-created

## Best Practices

1. **Always set event dates in the future** for upcoming events
2. **Use descriptive titles** that customers will understand
3. **Include full location details** (venue name, address)
4. **Test event visibility** by toggling status
5. **Delete old events** to keep the list manageable
6. **Keep events inactive** until ready to publish

## Next Steps

After setting up events, you can:

1. **Build Customer Event Listing** - Show active events to customers
2. **Add Ticket Types** - Define pricing for each event
3. **Implement Checkout Flow** - Allow customers to purchase tickets
4. **Generate QR Codes** - Create unique codes for each order
5. **Build Scanner App** - Staff interface for ticket validation

## API Reference

### Server Actions

```typescript
// Create event
createEvent(formData: FormData): Promise<{ success: boolean }>

// Update event
updateEvent(id: string, formData: FormData): Promise<{ success: boolean }>

// Delete event
deleteEvent(id: string): Promise<{ success: boolean }>

// Toggle status
toggleEventStatus(id: string, isActive: boolean): Promise<{ success: boolean }>
```

### Auth Utilities

```typescript
// Require admin role (throws/redirects if not admin)
requireAdmin(): Promise<{ user, profile }>

// Check user role (returns null if not authenticated)
checkUserRole(): Promise<{ user, role }>
```

## Support

For issues or questions:
- Check Supabase logs for database errors
- Verify RLS policies are active
- Ensure user has admin role in profiles table
- Check browser console for client-side errors
