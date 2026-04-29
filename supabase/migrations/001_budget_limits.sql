create table if not exists budget_limits (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) on delete cascade not null,
  category_id bigint references "Category"(id) on delete cascade not null,
  monthly_limit numeric(12,2) not null default 0,
  created_at timestamptz default now() not null,
  unique(user_id, category_id)
);

alter table budget_limits enable row level security;

create policy "Users can manage their own budget limits"
  on budget_limits for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
