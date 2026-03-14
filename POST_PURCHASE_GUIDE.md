# Post-Purchase Management System

This guide covers the customer dashboard and staff scanner interface for managing tickets after purchase.

## Customer Dashboard

### Overview
The customer dashboard allows users to view their order history, see participant details, and access QR codes for their tickets.

### Route
- **URL**: `/dashboard`
- **Access**: Requires authentication (logged-in users only)

### Features

#### 1. Order History Table
Displays all orders for the logged-in user with:
- Order ID (truncated)
- Event name and date
- Purchase date
- Total amount (formatted in HUF)
- Payment status badge
- Action buttons

#### 2. Order Details Modal
Click "Details" to view:
- Event information (title, date, location)
- Complete list of participants with:
  - Name
  - Age (for children)
  - Parent/Guardian name (for children)
  - Phone number
  - Address
- Order summary (ID, type, status, amount)

#### 3. QR Code Modal
Click "QR Code" (only for paid orders) to:
- View the ticket QR code
- Download QR code as PNG
- See event name

### Implementation Files
- `/app/dashboard/page.tsx` - Server component (fetches orders)
- `/app/dashboard/page-client.tsx` - Client component (UI and modals)
- `/components/organisms/OrderDetailsModal.tsx` - Order details display
- `/components/organisms/QRCodeModal.tsx` - QR code display and download

---

## Staff Scanner Interface

### Overview
The staff scanner interface allows staff and admin users to scan and verify ticket QR codes at event entrances.

### Route
- **URL**: `/dashboard/scanner`
- **Access**: Requires `staff` or `admin` role
- **Redirect**: Non-staff users are redirected to `/dashboard`

### Features

#### 1. QR Code Scanner
- Uses device camera to scan QR codes
- Real-time scanning with visual feedback
- Auto-pause after successful scan (3 seconds)
- Mobile-optimized interface

#### 2. Ticket Verification
When a QR code is scanned, the system:
1. Validates the QR token exists in the database
2. Checks if payment status is `paid`
3. Checks if ticket has already been used (`used_at` is null)
4. If valid:
   - Shows success message
   - Displays event name
   - Shows participant count
   - Updates `used_at` timestamp
   - Records `scanned_by` user ID
5. If invalid:
   - Shows appropriate error/warning message

#### 3. Scan Results Display
Visual feedback with color-coded alerts:
- **Success (Green)**: Valid ticket, entry granted
  - Shows event name
  - Shows number of participants
  - Shows order type (individual/group)
- **Warning (Yellow)**: Ticket issues
  - Already used
  - Payment not completed
- **Error (Red)**: Invalid QR code or system error

#### 4. Scan History
- Shows last 10 scans
- Displays scan result, event name, and timestamp
- Color-coded by result type
- Helps staff track recent entries

### Implementation Files
- `/app/dashboard/scanner/page.tsx` - Server component (role check)
- `/app/dashboard/scanner/page-client.tsx` - Scanner UI and logic

### Database Updates
When a valid ticket is scanned:
```sql
UPDATE orders
SET used_at = NOW(),
    scanned_by = <staff_user_id>
WHERE qr_token = <scanned_token>
```

---

## Mobile Optimization

### Scanner Interface
The scanner is optimized for mobile devices:
- Responsive layout (max-width: 2xl)
- Large touch targets for buttons
- Clear visual feedback
- Auto-focus on camera
- Works in portrait and landscape

### Best Practices
1. **Good Lighting**: Ensure adequate lighting for QR scanning
2. **Stable Position**: Hold device steady while scanning
3. **Distance**: Keep QR code 6-12 inches from camera
4. **Network**: Ensure stable internet connection for verification

---

## Security Features

### Role-Based Access Control
- Customer dashboard: Any authenticated user
- Scanner interface: Only `staff` or `admin` roles
- Automatic redirection for unauthorized access

### QR Token Security
- Unique tokens generated per order
- Tokens are long random strings (not sequential)
- One-time use validation
- Timestamp tracking for audit trail

### Data Privacy
- Users only see their own orders
- Staff can only scan, not view order details
- Scanned_by field tracks which staff member verified ticket

---

## Testing

### Customer Dashboard
1. Log in as a customer
2. Navigate to `/dashboard`
3. Verify orders are displayed
4. Click "Details" to view participants
5. Click "QR Code" to view/download QR

### Staff Scanner
1. Log in as staff/admin user
2. Navigate to `/dashboard/scanner`
3. Click "Start Scanner"
4. Allow camera permissions
5. Scan a valid QR code
6. Verify success message and database update
7. Try scanning the same QR again
8. Verify "Already Used" warning

### Test Scenarios
- ✅ Valid, unused ticket → Success
- ⚠️ Valid, already used ticket → Warning
- ⚠️ Unpaid order → Warning
- ❌ Invalid QR code → Error
- ❌ Non-existent token → Error

---

## Troubleshooting

### Camera Not Working
- Check browser permissions
- Ensure HTTPS (camera requires secure context)
- Try different browser (Chrome/Safari recommended)

### QR Code Not Scanning
- Ensure good lighting
- Clean camera lens
- Adjust distance from QR code
- Ensure QR code is not damaged

### "Already Used" Warning
- Check `used_at` timestamp in database
- Verify this is not a duplicate scan
- Contact admin if legitimate issue

### Role Access Issues
- Verify user role in `profiles` table
- Ensure role is `staff` or `admin`
- Check RLS policies are correct

---

## Database Schema Reference

### Orders Table
```sql
- id: UUID (primary key)
- qr_token: TEXT (unique, indexed)
- status: TEXT (pending, paid, failed)
- used_at: TIMESTAMPTZ (null until scanned)
- scanned_by: UUID (references profiles.id)
```

### Profiles Table
```sql
- id: UUID (references auth.users)
- role: TEXT (customer, staff, admin)
```

---

## Future Enhancements

Potential improvements:
- [ ] Offline scanning capability
- [ ] Batch QR code generation
- [ ] Scanner statistics dashboard
- [ ] Export scan history
- [ ] Multi-event scanner support
- [ ] Push notifications for staff
- [ ] QR code expiration dates
