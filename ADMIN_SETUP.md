# Quick Admin Setup Guide

## Step 1: Create Your First Admin User

### Option A: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication > Users**
3. Click **"Add user"**
4. Enter email and password
5. Click **"Create user"**

### Option B: Using SQL

```sql
-- This will be done through Supabase Auth UI or API
-- The profile will be auto-created via trigger
```

## Step 2: Set Admin Role

After creating the user, run this SQL in Supabase SQL Editor:

```sql
-- Replace 'admin@example.com' with your actual admin email
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

Verify it worked:

```sql
SELECT id, email, role 
FROM profiles 
WHERE email = 'admin@example.com';
```

You should see `role = 'admin'`.

## Step 3: Login

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/login`

3. Enter your admin credentials

4. You'll be redirected to: `http://localhost:3000/admin/events`

## Step 4: Create Your First Event

1. Click **"Create Event"** button
2. Fill in the form:
   ```
   Title: Summer Music Festival 2024
   Date: 2024-07-15 18:00
   Location: Central Park, New York
   Active: ✓ (checked)
   ```
3. Click **"Create Event"**

## Verification Checklist

- [ ] Admin user created in Supabase Auth
- [ ] Profile exists in `profiles` table
- [ ] Profile role set to 'admin'
- [ ] Can login at `/login`
- [ ] Redirected to `/admin/events` after login
- [ ] Can create events
- [ ] Can edit events
- [ ] Can delete events
- [ ] Can toggle event status

## Common Issues

### Issue: "Access Denied" after login

**Cause**: User role is not 'admin'

**Fix**:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Issue: No profile found

**Cause**: Trigger didn't create profile

**Fix**:
```sql
INSERT INTO profiles (id, email, role)
VALUES (
  'user-uuid-from-auth-users',
  'admin@example.com',
  'admin'
);
```

### Issue: Can't access /admin/events

**Cause**: Not logged in or not admin

**Fix**: 
1. Go to `/login`
2. Sign in with admin credentials
3. Verify role is 'admin' in database

## Testing the Full Flow

### 1. Create Test Events

```
Event 1:
- Title: Spring Concert
- Date: 2024-04-20 19:00
- Location: Madison Square Garden
- Active: Yes

Event 2:
- Title: Summer Festival
- Date: 2024-07-15 14:00
- Location: Central Park
- Active: No (for testing)
```

### 2. Test Event Management

- ✓ Create both events
- ✓ Edit Event 1 (change time)
- ✓ Toggle Event 2 status (make it active)
- ✓ Toggle Event 2 status again (make it inactive)
- ✓ Delete Event 2
- ✓ Verify Event 1 still exists

### 3. Test Access Control

1. Open incognito window
2. Try to access `/admin/events` directly
3. Should redirect to `/login`
4. Login with non-admin user
5. Should redirect to `/` (home)

## Next Development Steps

Once admin dashboard is working:

1. **Customer Event Listing**
   - Create `/events` page
   - Show only active events
   - Add ticket selection UI

2. **Ticket Purchase Flow**
   - Integrate cart system
   - Add checkout page
   - Process payments

3. **Order Management**
   - Admin view of all orders
   - Order status tracking
   - QR code generation

4. **Staff Scanner**
   - QR code scanning interface
   - Ticket validation
   - Usage tracking

## Database Quick Reference

### Check Admin Users

```sql
SELECT p.email, p.role, p.created_at
FROM profiles p
WHERE p.role = 'admin';
```

### Check All Events

```sql
SELECT id, title, date, location, is_active
FROM events
ORDER BY date DESC;
```

### Check Event Orders (for later)

```sql
SELECT o.id, e.title, o.email, o.total_amount, o.status
FROM orders o
JOIN events e ON o.event_id = e.id
WHERE e.id = 'event-uuid';
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit `.env.local`** - Contains sensitive keys
2. **Use strong passwords** for admin accounts
3. **Regularly audit admin users** - Remove unused accounts
4. **Monitor admin actions** - Check Supabase logs
5. **Keep Supabase updated** - Apply security patches

## Production Deployment

Before deploying to production:

1. **Set up environment variables** in your hosting platform
2. **Create production admin user** with strong password
3. **Enable MFA** for admin accounts (Supabase feature)
4. **Set up monitoring** and error tracking
5. **Test all admin functions** in production environment

## Support

If you encounter issues:

1. Check browser console for errors
2. Check Supabase logs
3. Verify RLS policies are enabled
4. Ensure triggers are active
5. Test database connection

---

**You're all set!** 🎉

Your admin dashboard is ready to manage events for the KPREGI ticketing system.
