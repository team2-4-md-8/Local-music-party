create extension if not exists "pgcrypto";

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  city text,
  venue text,
  event_date timestamptz,
  cover_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

insert into events (title, description, city, venue, event_date, is_published)
values
  ('Shorefest', 'Большой локальный концерт с независимыми артистами', 'Москва', 'Warehouse Hall', now() + interval '7 days', true),
  ('Jason Derulo Night', 'Анонс зарубежного артиста и тематическая вечеринка', 'Санкт-Петербург', 'Blue Club', now() + interval '14 days', true),
  ('Indie Signal', 'Новые имена локальной сцены', 'Казань', 'Pulse Stage', now() + interval '20 days', true)
on conflict do nothing;

alter table contacts enable row level security;
alter table events enable row level security;

drop policy if exists "public insert contacts" on contacts;
create policy "public insert contacts"
on contacts
for insert
to anon, authenticated
with check (true);

drop policy if exists "public read events" on events;
create policy "public read events"
on events
for select
to anon, authenticated
using (is_published = true);
