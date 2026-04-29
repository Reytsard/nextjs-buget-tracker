create table if not exists recurring_transactions (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) on delete cascade not null,
  value numeric(12,2) not null,
  type_id bigint references types(id) not null,
  category_id bigint references "Category"(id),
  description text,
  frequency text not null check (frequency in ('daily','weekly','monthly','yearly')),
  next_due_date date not null,
  is_active boolean default true not null,
  created_at timestamptz default now() not null
);

alter table recurring_transactions enable row level security;

create policy "Users can manage their own recurring transactions"
  on recurring_transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
