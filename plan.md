# Budget Track — Feature Roadmap

> Priority top-to-bottom: most impactful/blocking first, nice-to-have last. Do Core Features and Transaction & Data Quality sections first.

---

## Legend
- [x] Already built
- [ ] Not yet built

---

## 1. Auth & Identity

> Foundation solid. Fill gaps before building user-specific features.

- [x] Email/password sign-up with confirmation email
- [x] Email/password login
- [x] Forgot password flow
- [x] Update password page
- [x] Auth middleware protecting all non-public routes
- [x] User name, email, and avatar surfaced in sidebar footer
- [ ] OAuth login (Google) — add "Continue with Google" to login/signup forms via Supabase OAuth
- [ ] Display name editing — let users set/update display name from profile settings page
- [ ] Avatar upload — upload profile photo to Supabase Storage; fall back to initials if no photo
- [ ] Account deletion — "Delete my account" in settings; removes all user data and auth user via server action



---

## 2. Core Transaction Features

> Several half-built items blocking basic usability.

- [x] Create transaction (value, type, category)
- [x] Delete transaction with optimistic UI removal
- [x] Category selection with inline "add new category" toggle
- [x] Tabbed list view filtered by type (All / Savings / Expenses / Emergency Savings)
- [x] Paginated transaction table (10–50 rows per page)
- [x] Edit transaction — created `/transaction/[id]` page with pre-filled form and server action
- [ ] Transaction description/notes field — add optional free-text `description` column to `transactions` table; expose in create and edit forms
- [ ] Transaction date picker — let users set actual transaction date instead of relying on `created_at`
- [x] Fix tab filtering — wired `handleTabListChange` to `activeTab` state; mobile Select values aligned to tab values ("1"/"2"/"3")
- [ ] Fix drag-to-reorder persistence — DnD Kit sorts local state but never writes back to DB; persist `sort_order` column or remove drag handle
- [ ] Bulk delete — restore commented-out checkbox column; add "Delete selected" above table
- [ ] Transaction search/filter bar — text input filtering by description or value, plus date-range picker

---

## 3. Dashboard & Analytics

> Dashboard shell exists; fill wired-but-empty cards and add real charts.

- [x] Total all-time PnL summary card
- [x] This month's PnL card with positive/negative label
- [x] Monthly expenses pie chart by category
- [x] Wire the "Savings/Expenses" card — shows monthly savings (green) vs expenses (red) with savings rate badge
- [x] Enable the area chart — wired with real savings vs expenses data grouped by day; re-enabled on dashboard
- [ ] Monthly income vs expense bar chart — income vs expenses side-by-side, last 6 months
- [ ] Running balance line chart — cumulative balance over time
- [ ] Top spending categories list — below pie chart, ranked top 5 categories by spend this month
- [ ] Date range selector for dashboard — global month/quarter/year toggle re-scoping all cards and charts
- [x] Fix `SiteHeader` title — changed from "Documents" to "Dashboard"

---

## 4. Budget Limits & Goals

> Features that turn transaction log into real budget tool.

- [x] Category budget limits — `/budget` page with per-category spend vs limit, color-coded progress bars, upsert/delete actions; SQL migration in `supabase/migrations/001_budget_limits.sql`
- [x] Over-budget visual warning — progress bar turns red at 100%+, yellow at 70–99%
- [ ] Savings goals — named goals with target amount and optional deadline; progress bar card on dashboard
- [ ] Emergency savings goal — dedicated goal card with running total and configurable target
- [ ] Budget health score — 0–100 monthly score based on category limits respected and positive net flow

---

## 5. Income Tracking

> Savings and income currently conflated under `type_id = 1`. Separate properly.

- [ ] Add "Income" as distinct transaction type — add `Income` to `types` table; track salary/inflows separately from savings deposits
- [ ] Income summary card — dashboard card: total income this month vs last month with % change badge
- [ ] Income vs expense ratio — show savings rate (income minus expenses / income) as % on dashboard

---

## 6. Recurring Transactions

> Eliminates repetitive manual entry for bills and salaries.

- [x] Recurring transaction model — `recurring_transactions` table with frequency, next_due_date, is_active; SQL migration in `supabase/migrations/002_recurring_transactions.sql`
- [x] Create/edit/delete recurring transactions — `/recurring` page with add form and list with pause/resume/delete actions
- [ ] Auto-generate due transactions — on dashboard load or Edge Function cron, check recurring items where `next_due_date <= today` and insert as real transactions
- [ ] Upcoming transactions widget — dashboard card listing next 5 due recurring items (name, amount, due date)

---

## 7. Data Management

> Import/export and data integrity features serious users need.

- [x] CSV export — "Export CSV" button in transaction table toolbar; downloads all rows as `transactions-YYYY-MM-DD.csv`
- [x] CSV import — `/import` page with file upload, CSV parsing, 10-row preview, and bulk insert server action
- [ ] Transaction description column in Supabase — add `description TEXT` and `transaction_date DATE` columns via a migration
- [ ] Data validation with Zod — add server-side Zod validation to all server actions (create, edit, delete)
- [ ] Soft delete/archive — add `deleted_at` timestamp instead of hard delete; provide "Archived" tab

---

## 8. UI / UX Polish

> Quality-of-life improvements affecting every session.

- [x] Dark mode toggle — `ThemeProvider` added to layout; sun/moon toggle button in `SiteHeader`
- [x] Sidebar navigation links — added Dashboard, Analytics, Recurring, Wallet (Settings) with real icons
- [ ] Mobile-responsive dashboard — fix grid layout, sidebar collapse, chart sizing below 768 px
- [ ] Empty state illustrations — no rows: show illustration and "Add your first transaction" CTA
- [ ] Loading skeletons — replace blank flashes with `Skeleton` components for cards and table
- [ ] Keyboard shortcut "N" to create transaction — global `keydown` listener; N opens create form
- [ ] Breadcrumb in site header — replace hardcoded "Documents" heading with dynamic breadcrumb
- [x] Currency formatting — transaction values formatted as USD currency in the table

---

## 9. Notifications & Alerts

- [ ] In-app notification center — bell icon in `SiteHeader`, dropdown with recent alerts; store in `notifications` table
- [ ] Over-budget toast alert — fire Sonner warning toast when transaction pushes category over monthly limit
- [ ] Monthly summary email — Supabase Edge Functions + Resend; email brief monthly summary on 1st

---

## 10. AI Features

> Landing page promises AI insights; build toward it.

- [x] Generic AI landing page
- [ ] AI spending analysis — LLM API via server action; send aggregated transactions, display 3-bullet insight on dashboard
- [ ] Natural-language transaction entry — user types "spent $45 on groceries yesterday", model pre-fills create form
- [ ] Category auto-suggestion — suggest closest existing category when user types new one; avoids duplicates
- [ ] Monthly budget recommendation — AI suggests per-category limits based on historical spending
- [ ] AI chat assistant — floating chat sheet for questions like "How much did I spend on dining last month?"

---

## 11. Settings & Preferences

- [x] Settings page at `/settings` — Profile tab (edit name/avatar via `supabase.auth.updateUser`), Preferences tab (currency picker stored in localStorage), Danger Zone tab (placeholder)
- [x] Default currency selection — currency preference selector (USD, PHP, EUR, GBP, JPY) in Settings → Preferences, stored in localStorage
- [ ] Transaction types management — rename or add custom types beyond three hardcoded ones
- [ ] Category management page — `/settings/categories` to rename, recolor, merge, or delete categories
- [ ] Week start day preference — Sunday or Monday

---

## 12. Performance & Code Quality

> Tech debt to address as feature set grows.

- [x] Fix `randomColor()` in `section-cards.tsx` — replaced with `deterministicColor()` using a string hash → stable HSL hue
- [ ] Extract repeated pagination JSX — pagination block copy-pasted 4x in `data-table.tsx`; extract into `<TablePagination table={table} />`
- [ ] Extract tab content into shared component — four `TabsContent` blocks in `data-table.tsx` nearly identical; extract `<TransactionTabContent />`
- [ ] Move Supabase queries out of components — `section-cards.tsx` has 3 inline queries; extract to `lib/queries.ts` with typed return values
- [ ] Add TypeScript strict mode — enable `strict: true` in `tsconfig.json`, fix type errors
- [ ] Environment variable validation — startup Zod check; throw clear error if Supabase env vars missing