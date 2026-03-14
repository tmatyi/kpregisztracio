# KPREGI - Event Ticketing System

A modern, secure event ticketing system built with Next.js 14+, Supabase, and TypeScript. Features QR code validation, dynamic form fields, and role-based access control.

## Features

- **Next.js 14+ App Router** with TypeScript
- **Supabase** for authentication and database
- **Dynamic Ticket Forms** with validation using react-hook-form and zod
- **Smart Cart Logic** with ticket type restrictions
- **QR Code Generation** for ticket validation
- **Row Level Security (RLS)** for data protection
- **Atomic Design** component architecture
- **Tailwind CSS** + **ShadcnUI** for modern UI

## Project Structure

```
kpregi/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── atoms/             # Basic UI elements
│   │   └── FormField.tsx
│   ├── molecules/         # Composite components
│   │   └── TicketFormFields.tsx
│   ├── organisms/         # Complex components
│   │   └── CheckoutForm.tsx
│   └── ui/                # ShadcnUI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── form.tsx
│       ├── input.tsx
│       └── label.tsx
├── hooks/
│   └── useCart.ts         # Cart management hook
├── lib/
│   ├── supabase/          # Supabase client setup
│   │   ├── client.ts      # Browser client
│   │   ├── server.ts      # Server client
│   │   └── middleware.ts  # Auth middleware
│   ├── validations/       # Zod schemas
│   │   └── checkout.ts
│   └── utils.ts           # Utility functions
├── types/
│   ├── database.types.ts  # Supabase types
│   └── index.ts           # Shared types
├── supabase/
│   └── schema.sql         # Database schema
└── middleware.ts          # Next.js middleware
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Set up Supabase database:**

- Create a new Supabase project
- Go to the SQL Editor in your Supabase dashboard
- Copy and paste the contents of `supabase/schema.sql`
- Execute the SQL to create tables, RLS policies, and triggers

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema

### Tables

- **profiles**: User profiles with roles (admin, staff, customer)
- **events**: Event information and status
- **orders**: Ticket orders with QR tokens
- **order_items**: Individual ticket details

### Row Level Security (RLS)

- Users can only view their own orders
- Staff and admin can view/scan all orders
- Public can view active events

## Cart Logic Rules

The `useCart` hook enforces these business rules:

### Individual Tickets
- Maximum 4 tickets per order
- Cannot mix with group tickets
- No authentication required

### Group Tickets
- Minimum 5 tickets required
- Cannot mix with individual tickets
- **Requires user authentication** before checkout

## Dynamic Form Fields

Forms adapt based on ticket type:

### Individual Child Ticket
- Name
- Age
- Parent/Guardian Name
- Email
- Phone Number
- Address

### Individual Adult Ticket
- Name
- Email
- Phone Number

### Group Child Ticket
- Name
- Age

### Group Adult Ticket
- Name only

## Development

### Build for production

```bash
npm run build
```

### Start production server

```bash
npm start
```

### Lint code

```bash
npm run lint
```

## Technology Stack

- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: ShadcnUI + Radix UI
- **Form Handling**: react-hook-form
- **Validation**: Zod
- **QR Codes**: qrcode library

## Component Architecture

Following **Atomic Design** principles:

- **Atoms**: Basic UI elements (FormField, Input, Button)
- **Molecules**: Composite components (TicketFormFields)
- **Organisms**: Complex components (CheckoutForm)
- **Templates**: Page layouts
- **Pages**: Complete pages in the app directory

## Security Features

- Row Level Security (RLS) on all tables
- Server-side authentication with Supabase
- Secure QR token generation
- Role-based access control
- Protected API routes

## License

MIT
