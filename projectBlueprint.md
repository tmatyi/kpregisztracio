📜 ZYGO - PROJECT MASTER BLUEPRINT (v2.0)

1. Project Core & Logic
   Cél: Időszakos rendezvények jegyértékesítése és beléptetése.

Jegytípusok & Szabályok:

Egyéni (1-4 db): Gyerek (részletes adatok), Felnőtt (alap adatok). Bejelentkezés nem kötelező.

Csoportos (min. 5 db): Gyerek (Név, Kor), Felnőtt (Név). Bejelentkezés kötelező.

Tiltás: Egy kosárban nem keverhető az egyéni és a csoportos jegy.

QR Logika: \* Egy megrendelés = Egyetlen QR kód (mivel a csoport együtt érkezik).

Bejelentkezetteknek a profilban, vendégeknek e-mailben + "E-mail alapú lekérdezés" felületen elérhető.

2. Adatbázis Séma (Supabase / PostgreSQL)
   SQL
   -- Felhasználók (Auth integrációval)
   profiles (
   id uuid references auth.users,
   full_name text,
   email text,
   role text default 'customer', -- 'admin', 'staff', 'customer'
   saved_address text, -- regisztráltaknak kényelmi funkció
   phone text
   );

-- Események
events (
id uuid primary key,
title text,
event_date timestamptz,
location text,
is_active boolean default true
);

-- Megrendelések
orders (
id uuid primary key,
event_id uuid references events,
user_id uuid references profiles null, -- null, ha vendég
customer_email text,
total_amount int,
order_type text, -- 'individual' or 'group'
payment_status text, -- 'pending', 'paid', 'failed'
qr_token uuid unique, -- Ez lesz a QR kód alapja
used_at timestamptz, -- Beolvasás időpontja
scanned_by uuid -- Melyik személyzet olvasta be
);

-- Jegyek (Adatgyűjtés a megrendelésen belül)
order_items (
id uuid primary key,
order_id uuid references orders,
ticket_type text, -- 'child_indiv', 'adult_indiv', 'child_group', 'adult_group'
holder_name text,
holder_age int null,
parent_name text null,
holder_phone text null,
holder_address text null
); 3. Technikai Stack & Eszközök
Frontend: Next.js 14 (App Router), Tailwind CSS, ShadcnUI.

Backend: Supabase (Auth, DB, Edge Functions az e-mailekhez).

Fizetés: Barion SDK.

QR: lucide-react (ikonok), qrcode.react (generálás), html5-qrcode (beolvasás a személyzetnek).

E-mail: Resend (visszaigazolás + QR link küldése).
