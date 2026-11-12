-- ============================================================
-- ByteBar Library — progress table (SPEC §4.2)
-- Project: the simulator's existing Supabase project
--   (https://duutviqszajmmoskvdfy.supabase.co)
-- STATUS: DELIVERED FOR REVIEW — DO NOT RUN until Cori approves.
-- The library front-end (library.js) already reads/writes this exact
-- shape; until it exists, those calls fail soft and progress lives in
-- the browser's localStorage only.
--
-- One row per (user, book, chapter). Resume position + completion —
-- deliberately nothing fancier in v1 (SPEC §4.2: "progress = resume +
-- completion toggle in v1").
-- ============================================================

create table if not exists public.library_progress (
  user_id     uuid        not null references auth.users (id) on delete cascade,
  book_slug   text        not null,               -- e.g. 'secplus', 'nclex-rn'
  chapter_n   integer     not null,               -- 0 = Start Here, 1..N chapters
  position_s  integer     not null default 0,     -- resume position, seconds
  completed   boolean     not null default false,
  updated_at  timestamptz not null default now(),
  primary key (user_id, book_slug, chapter_n)
);

comment on table public.library_progress is
  'ByteBar Library per-user chapter progress (resume + completion). Written by library.js via upsert on conflict (user_id, book_slug, chapter_n).';

-- Row Level Security: a student sees and writes only their own rows.
alter table public.library_progress enable row level security;

create policy "library_progress_select_own"
  on public.library_progress for select
  using (auth.uid() = user_id);

create policy "library_progress_insert_own"
  on public.library_progress for insert
  with check (auth.uid() = user_id);

create policy "library_progress_update_own"
  on public.library_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "library_progress_delete_own"
  on public.library_progress for delete
  using (auth.uid() = user_id);

-- The anon key ships in the client (same as the simulator); RLS above is
-- the enforcement. No service-role key is used by the library front-end.

-- ============================================================
-- LATER (not in this file, not yet built): the signing function.
-- Edge Function "library-sign-url" (SPEC §4.2):
--   1. Verify the caller's Supabase session (Authorization header).
--   2. Check entitlement for the requested book (free-with-account in v1;
--      Pro flag from the simulator's existing entitlement when §6 lands).
--   3. Mint a short-lived Bunny token-auth URL server-side
--      (BUNNY_TOKEN_AUTH_KEY + library id live in function secrets only).
--   4. Return { url, expires }.
-- The client stub is BB.resolveStream() in library.js.
-- ============================================================
