-- ============================================================
-- AA KURMAWA AUTOMOBILES
-- DATABASE SCHEMA
-- Supabase / PostgreSQL
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================

create extension if not exists "pgcrypto";


-- ============================================================
-- ENUMS
-- ============================================================

do $$
begin
  create type public.vehicle_status as enum (
    'AVAILABLE',
    'RESERVED',
    'SOLD'
  );
exception
  when duplicate_object then null;
end $$;


do $$
begin
  create type public.user_role as enum (
    'ADMIN',
    'EDITOR',
    'SALES'
  );
exception
  when duplicate_object then null;
end $$;


do $$
begin
  create type public.lead_status as enum (
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'CLOSED'
  );
exception
  when duplicate_object then null;
end $$;


do $$
begin
  create type public.appointment_status as enum (
    'PENDING',
    'CONFIRMED',
    'COMPLETED',
    'CANCELLED'
  );
exception
  when duplicate_object then null;
end $$;


-- ============================================================
-- PROFILES
-- Extends Supabase auth.users
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  full_name text,
  email text,

  role public.user_role not null default 'SALES',

  avatar_url text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ============================================================
-- VEHICLES
-- Main inventory table
-- ============================================================

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),

  slug text not null unique,

  brand text not null,
  model text not null,
  year integer not null,

  price numeric(15, 2),
  currency text not null default 'NGN',

  mileage integer not null default 0,

  transmission text,
  fuel text,
  body text,

  engine text,
  drivetrain text,

  exterior_color text,
  interior_color text,

  description text,

  status public.vehicle_status not null default 'AVAILABLE',

  featured boolean not null default false,
  published boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint vehicles_year_check
    check (year >= 1900 and year <= 2100),

  constraint vehicles_mileage_check
    check (mileage >= 0),

  constraint vehicles_price_check
    check (price is null or price >= 0)
);


-- ============================================================
-- VEHICLE IMAGES
-- One vehicle can have many images
-- ============================================================

create table if not exists public.vehicle_images (
  id uuid primary key default gen_random_uuid(),

  vehicle_id uuid not null
    references public.vehicles(id)
    on delete cascade,

  image_url text not null,

  alt_text text,

  sort_order integer not null default 0,

  is_primary boolean not null default false,

  created_at timestamptz not null default now()
);


-- ============================================================
-- VEHICLE FEATURES
-- Flexible feature list for each vehicle
-- ============================================================

create table if not exists public.vehicle_features (
  id uuid primary key default gen_random_uuid(),

  vehicle_id uuid not null
    references public.vehicles(id)
    on delete cascade,

  feature text not null,

  sort_order integer not null default 0,

  created_at timestamptz not null default now()
);


-- ============================================================
-- LEADS
-- Website enquiries
-- ============================================================

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),

  vehicle_id uuid
    references public.vehicles(id)
    on delete set null,

  name text not null,
  email text,
  phone text,

  message text,

  source text default 'website',

  status public.lead_status not null default 'NEW',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ============================================================
-- APPOINTMENTS
-- Vehicle inspections / showroom visits
-- ============================================================

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),

  vehicle_id uuid
    references public.vehicles(id)
    on delete set null,

  name text not null,
  email text,
  phone text not null,

  appointment_date date not null,
  appointment_time time,

  message text,

  status public.appointment_status not null default 'PENDING',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ============================================================
-- SERVICES
-- Services displayed on the website
-- ============================================================

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  slug text not null unique,

  short_description text,

  description text,

  icon text,

  sort_order integer not null default 0,

  published boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ============================================================
-- SITE SETTINGS
-- Editable dealership information
-- ============================================================

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),

  business_name text not null default 'AA Kurmawa Automobiles',

  phone text,
  whatsapp text,
  email text,

  address text,

  instagram_url text,
  facebook_url text,
  tiktok_url text,

  opening_hours text,

  updated_at timestamptz not null default now()
);


-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists vehicles_published_idx
  on public.vehicles(published);

create index if not exists vehicles_status_idx
  on public.vehicles(status);

create index if not exists vehicles_featured_idx
  on public.vehicles(featured);

create index if not exists vehicles_brand_idx
  on public.vehicles(brand);

create index if not exists vehicles_year_idx
  on public.vehicles(year);

create index if not exists vehicle_images_vehicle_id_idx
  on public.vehicle_images(vehicle_id);

create index if not exists vehicle_images_sort_order_idx
  on public.vehicle_images(vehicle_id, sort_order);

create index if not exists vehicle_features_vehicle_id_idx
  on public.vehicle_features(vehicle_id);

create index if not exists leads_vehicle_id_idx
  on public.leads(vehicle_id);

create index if not exists leads_status_idx
  on public.leads(status);

create index if not exists appointments_vehicle_id_idx
  on public.appointments(vehicle_id);

create index if not exists appointments_date_idx
  on public.appointments(appointment_date);


-- ============================================================
-- UPDATED_AT FUNCTION
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================

drop trigger if exists profiles_updated_at on public.profiles;

create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();


drop trigger if exists vehicles_updated_at on public.vehicles;

create trigger vehicles_updated_at
before update on public.vehicles
for each row
execute function public.set_updated_at();


drop trigger if exists leads_updated_at on public.leads;

create trigger leads_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();


drop trigger if exists appointments_updated_at on public.appointments;

create trigger appointments_updated_at
before update on public.appointments
for each row
execute function public.set_updated_at();


drop trigger if exists services_updated_at on public.services;

create trigger services_updated_at
before update on public.services
for each row
execute function public.set_updated_at();


drop trigger if exists site_settings_updated_at on public.site_settings;

create trigger site_settings_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();


-- ============================================================
-- AUTO-CREATE PROFILE WHEN A USER SIGNS UP
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    email
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  );

  return new;
end;
$$;


drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();


-- ============================================================
-- ADMIN / STAFF HELPER
-- ============================================================

create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('ADMIN', 'EDITOR', 'SALES')
  );
$$;


create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'ADMIN'
  );
$$;


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_images enable row level security;
alter table public.vehicle_features enable row level security;
alter table public.leads enable row level security;
alter table public.appointments enable row level security;
alter table public.services enable row level security;
alter table public.site_settings enable row level security;


-- ============================================================
-- VEHICLES POLICIES
-- ============================================================

drop policy if exists "Public can view published vehicles"
on public.vehicles;

create policy "Public can view published vehicles"
on public.vehicles
for select
to anon, authenticated
using (
  published = true
);


drop policy if exists "Staff can view all vehicles"
on public.vehicles;

create policy "Staff can view all vehicles"
on public.vehicles
for select
to authenticated
using (
  public.is_staff()
);


drop policy if exists "Staff can create vehicles"
on public.vehicles;

create policy "Staff can create vehicles"
on public.vehicles
for insert
to authenticated
with check (
  public.is_staff()
);


drop policy if exists "Staff can update vehicles"
on public.vehicles;

create policy "Staff can update vehicles"
on public.vehicles
for update
to authenticated
using (
  public.is_staff()
)
with check (
  public.is_staff()
);


drop policy if exists "Admins can delete vehicles"
on public.vehicles;

create policy "Admins can delete vehicles"
on public.vehicles
for delete
to authenticated
using (
  public.is_admin()
);


-- ============================================================
-- VEHICLE IMAGES POLICIES
-- ============================================================

drop policy if exists "Public can view images of published vehicles"
on public.vehicle_images;

create policy "Public can view images of published vehicles"
on public.vehicle_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.vehicles
    where vehicles.id = vehicle_images.vehicle_id
      and vehicles.published = true
  )
);


drop policy if exists "Staff can view all vehicle images"
on public.vehicle_images;

create policy "Staff can view all vehicle images"
on public.vehicle_images
for select
to authenticated
using (
  public.is_staff()
);


drop policy if exists "Staff can create vehicle images"
on public.vehicle_images;

create policy "Staff can create vehicle images"
on public.vehicle_images
for insert
to authenticated
with check (
  public.is_staff()
);


drop policy if exists "Staff can update vehicle images"
on public.vehicle_images;

create policy "Staff can update vehicle images"
on public.vehicle_images
for update
to authenticated
using (
  public.is_staff()
)
with check (
  public.is_staff()
);


drop policy if exists "Staff can delete vehicle images"
on public.vehicle_images;

create policy "Staff can delete vehicle images"
on public.vehicle_images
for delete
to authenticated
using (
  public.is_staff()
);


-- ============================================================
-- VEHICLE FEATURES POLICIES
-- ============================================================

drop policy if exists "Public can view features of published vehicles"
on public.vehicle_features;

create policy "Public can view features of published vehicles"
on public.vehicle_features
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.vehicles
    where vehicles.id = vehicle_features.vehicle_id
      and vehicles.published = true
  )
);


drop policy if exists "Staff can manage vehicle features"
on public.vehicle_features;

create policy "Staff can manage vehicle features"
on public.vehicle_features
for all
to authenticated
using (
  public.is_staff()
)
with check (
  public.is_staff()
);


-- ============================================================
-- PROFILES POLICIES
-- ============================================================

drop policy if exists "Users can view own profile"
on public.profiles;

create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
);


drop policy if exists "Admins can view all profiles"
on public.profiles;

create policy "Admins can view all profiles"
on public.profiles
for select
to authenticated
using (
  public.is_admin()
);


drop policy if exists "Admins can update profiles"
on public.profiles;

create policy "Admins can update profiles"
on public.profiles
for update
to authenticated
using (
  public.is_admin()
)
with check (
  public.is_admin()
);


-- ============================================================
-- LEADS POLICIES
-- ============================================================

drop policy if exists "Anyone can create leads"
on public.leads;

create policy "Anyone can create leads"
on public.leads
for insert
to anon, authenticated
with check (
  true
);


drop policy if exists "Staff can view leads"
on public.leads;

create policy "Staff can view leads"
on public.leads
for select
to authenticated
using (
  public.is_staff()
);


drop policy if exists "Staff can update leads"
on public.leads;

create policy "Staff can update leads"
on public.leads
for update
to authenticated
using (
  public.is_staff()
)
with check (
  public.is_staff()
);


-- ============================================================
-- APPOINTMENT POLICIES
-- ============================================================

drop policy if exists "Anyone can create appointments"
on public.appointments;

create policy "Anyone can create appointments"
on public.appointments
for insert
to anon, authenticated
with check (
  true
);


drop policy if exists "Staff can view appointments"
on public.appointments;

create policy "Staff can view appointments"
on public.appointments
for select
to authenticated
using (
  public.is_staff()
);


drop policy if exists "Staff can update appointments"
on public.appointments;

create policy "Staff can update appointments"
on public.appointments
for update
to authenticated
using (
  public.is_staff()
)
with check (
  public.is_staff()
);


-- ============================================================
-- SERVICES POLICIES
-- ============================================================

drop policy if exists "Public can view published services"
on public.services;

create policy "Public can view published services"
on public.services
for select
to anon, authenticated
using (
  published = true
);


drop policy if exists "Staff can manage services"
on public.services;

create policy "Staff can manage services"
on public.services
for all
to authenticated
using (
  public.is_staff()
)
with check (
  public.is_staff()
);


-- ============================================================
-- SITE SETTINGS POLICIES
-- ============================================================

drop policy if exists "Public can view site settings"
on public.site_settings;

create policy "Public can view site settings"
on public.site_settings
for select
to anon, authenticated
using (
  true
);


drop policy if exists "Admins can manage site settings"
on public.site_settings;

create policy "Admins can manage site settings"
on public.site_settings
for all
to authenticated
using (
  public.is_admin()
)
with check (
  public.is_admin()
);


-- ============================================================
-- DEFAULT SITE SETTINGS
-- ============================================================

insert into public.site_settings (
  business_name,
  phone,
  whatsapp,
  address
)
select
  'AA Kurmawa Automobiles',
  '07077773521',
  '2347077773521',
  '346 Abdullahi Bayero Road, Kano, Nigeria'
where not exists (
  select 1
  from public.site_settings
);


-- ============================================================
-- DEFAULT SERVICES
-- ============================================================

insert into public.services (
  title,
  slug,
  short_description,
  sort_order
)
select
  'Vehicle Sales',
  'vehicle-sales',
  'New and pre-owned vehicles selected for quality and value.',
  1
where not exists (
  select 1 from public.services where slug = 'vehicle-sales'
);


insert into public.services (
  title,
  slug,
  short_description,
  sort_order
)
select
  'Leasing & Documentation',
  'leasing-documentation',
  'Flexible solutions and professional documentation support.',
  2
where not exists (
  select 1 from public.services where slug = 'leasing-documentation'
);


insert into public.services (
  title,
  slug,
  short_description,
  sort_order
)
select
  'Service & Maintenance',
  'service-maintenance',
  'Professional automotive care from people who understand vehicles.',
  3
where not exists (
  select 1 from public.services where slug = 'service-maintenance'
);


insert into public.services (
  title,
  slug,
  short_description,
  sort_order
)
select
  'Fleet Management',
  'fleet-management',
  'Automotive solutions for businesses and organizations.',
  4
where not exists (
  select 1 from public.services where slug = 'fleet-management'
);