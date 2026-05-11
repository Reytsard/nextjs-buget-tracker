-- ===================================================================
-- 004: Schema improvements
-- - Performance indexes for common query patterns
-- - RLS hardening on Category, transactions, and types tables
-- - User ownership on Category via user_id column + policy
-- - get_monthly_summary() function to replace N+1 loop in reports
-- ===================================================================


-- ===================================================================
-- INDEXES
-- ===================================================================

-- transactions: cover category and type filters (user+created_at already in 003)
create index if not exists idx_transactions_category_id
  on transactions(category_id);

create index if not exists idx_transactions_type_id
  on transactions(type_id);

-- Composite covering index for the monthly breakdown query in reports
create index if not exists idx_transactions_user_type_created
  on transactions(user_id, type_id, created_at);

-- recurring_transactions: index active rows by next processing date
create index if not exists idx_recurring_transactions_user_active_due
  on recurring_transactions(user_id, next_due_date)
  where is_active = true;

-- budget_limits: composite for user+category lookup
create index if not exists idx_budget_limits_user_category
  on budget_limits(user_id, category_id);


-- ===================================================================
-- transactions: ensure RLS + user-scoped policy
-- ===================================================================

alter table transactions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'transactions'
      and policyname = 'Users can manage their own transactions'
  ) then
    create policy "Users can manage their own transactions"
      on transactions for all
      using  (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;


-- ===================================================================
-- Category: add user_id ownership column, RLS, and user-scoped policy
-- ===================================================================

-- Add user_id with auth.uid() as default so inserts auto-assign the owner
alter table "Category"
  add column if not exists user_id uuid
    references auth.users(id) on delete cascade
    default auth.uid();

-- Back-fill any pre-existing rows that are orphaned (null user_id).
-- These will remain inaccessible after RLS is enabled; this update is
-- safe – it only affects rows that have no owner yet.
update "Category"
  set user_id = auth.uid()
  where user_id is null;

alter table "Category" enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'Category'
      and policyname = 'Users can manage their own categories'
  ) then
    create policy "Users can manage their own categories"
      on "Category" for all
      using  (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;


-- ===================================================================
-- types: shared lookup table – read-only for authenticated users
-- ===================================================================

alter table types enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'types'
      and policyname = 'Authenticated users can read types'
  ) then
    create policy "Authenticated users can read types"
      on types for select
      to authenticated
      using (true);
  end if;
end $$;


-- ===================================================================
-- get_monthly_summary: single-query replacement for the 6-loop in
-- app/reports/page.tsx. Uses security invoker so auth.uid() resolves
-- to the calling user automatically.
-- ===================================================================

create or replace function get_monthly_summary(months_back integer default 6)
returns table (
  month_label text,
  month_start timestamptz,
  savings     numeric,
  expenses    numeric,
  emergency   numeric
)
language sql
security invoker
stable
as $$
  select
    to_char(gs.month, 'Mon')                                   as month_label,
    gs.month                                                   as month_start,
    coalesce(sum(t.value) filter (where t.type_id = 1), 0)    as savings,
    coalesce(sum(t.value) filter (where t.type_id = 2), 0)    as expenses,
    coalesce(sum(t.value) filter (where t.type_id = 3), 0)    as emergency
  from generate_series(
    date_trunc('month', now()) - ((months_back - 1) * interval '1 month'),
    date_trunc('month', now()),
    interval '1 month'
  ) as gs(month)
  left join transactions t
    on  t.created_at >= gs.month
    and t.created_at <  gs.month + interval '1 month'
    and t.user_id    =  auth.uid()
  group by gs.month
  order by gs.month;
$$;
