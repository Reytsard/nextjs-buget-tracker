# Budget Track — Feature Roadmap

> Priority order within each section: items are listed top-to-bottom from most
> impactful / blocking to nice-to-have. Tackle the "Core Features" and
> "Transaction & Data Quality" sections before anything else.

---

## Legend
- [x] Already built
- [ ] Not yet built

---

## 1. Auth & Identity

> Foundation is solid. Fill the gaps before building user-specific features.

- [x] Email/password sign-up with confirmation email
- [x] Email/password login
- [x] Forgot password flow
- [x] Update password page
- [x] Auth middleware protecting all non-public routes
- [x] User name, email, and avatar surfaced in sidebar footer
- [ ] OAuth login (Google) — add a "Continue with Google" button to the login and sign-up forms using Supabase OAuth
- [ ] Display name editing — let users set/update their display name from a profile settings page
- [ ] Avatar upload — allow users to upload a profile photo stored in Supabase Storage; fall back to initials when no photo is set
- [ ] Account deletion — provide a "Delete my account" option in settings that removes all user data and the auth user via a server action



---

## 2. Core Transaction Features

> Several half-built items here are blocking basic usability.

- [x] Create transaction (value, type, category)
- [x] Delete transaction with optimistic UI removal
- [x] Category selection with inline "add new category" toggle
- [x] Tabbed list view filtered by type (All / Savings / Expenses / Emergency Savings)
- [x] Paginated transaction table (10–50 rows per page)
- [x] Edit transaction — created `/transaction/[id]` page with pre-filled form and server action
- [ ] Transaction description/notes field — add an optional free-text `description` column to the `transactions` table and expose it in the create and edit forms
- [ ] Transaction date picker — let users specify the actual transaction date instead of relying on `created_at`
- [x] Fix tab filtering — wired `handleTabListChange` to `activeTab` state; mobile Select values aligned to tab values ("1"/"2"/"3")
- [ ] Fix drag-to-reorder persistence — DnD Kit sorts local state but the new order is never written back to the database; persist a `sort_order` column or remove the drag handle
- [ ] Bulk delete — restore the commented-out row checkbox column and add a "Delete selected" action above the table
- [ ] Transaction search / filter bar — add a text input that filters by description or value, and a date-range picker

---

## 3. Dashboard & Analytics

> The dashboard shell is there; fill in the wired-but-empty cards and add real charts.

- [x] Total all-time PnL summary card
- [x] This month's PnL card with positive/negative label
- [x] Monthly expenses pie chart by category
- [x] Wire the "Savings/Expenses" card — shows monthly savings (green) vs expenses (red) with savings rate badge
- [x] Enable the area chart — wired with real savings vs expenses data grouped by day; re-enabled on dashboard
- [ ] Monthly income vs expense bar chart — show income vs expenses side-by-side for each of the last 6 months
- [ ] Running balance line chart — show a cumulative balance line over time
- [ ] Top spending categories list — below the pie chart, render a ranked list of the top 5 categories by spend this month
- [ ] Date range selector for dashboard — add a global month/quarter/year toggle that re-scopes all cards and charts
- [x] Fix `SiteHeader` title — changed from "Documents" to "Dashboard"

---

## 4. Budget Limits & Goals

> These are the features that turn a transaction log into an actual budget tool.

- [x] Category budget limits — `/budget` page with per-category spend vs limit, color-coded progress bars, upsert/delete actions; SQL migration in `supabase/migrations/001_budget_limits.sql`
- [x] Over-budget visual warning — progress bar turns red at 100%+, yellow at 70–99%
- [ ] Savings goals — let users create named savings goals with a target amount and optional deadline; show a progress bar card on the dashboard
- [ ] Emergency savings goal — give it a dedicated goal card showing the running total and a configurable target
- [ ] Budget health score — compute a 0–100 score each month based on how many category limits were respected and whether net flow was positive

---

## 5. Income Tracking

> Currently savings and income are conflated under `type_id = 1`. Separate them properly.

- [ ] Add "Income" as a distinct transaction type — add an `Income` entry to the `types` table so salary and other inflows are tracked separately from intentional savings deposits
- [ ] Income summary card — add a dashboard card showing total income this month vs last month with a percentage change badge
- [ ] Income vs expense ratio — surface the savings rate (income minus expenses divided by income) as a percentage on the dashboard

---

## 6. Recurring Transactions

> Power feature that eliminates repetitive manual entry for bills and salaries.

- [x] Recurring transaction model — `recurring_transactions` table with frequency, next_due_date, is_active; SQL migration in `supabase/migrations/002_recurring_transactions.sql`
- [x] Create/edit/delete recurring transactions — `/recurring` page with add form and list with pause/resume/delete actions
- [ ] Auto-generate due transactions — on dashboard load or via a Supabase Edge Function cron, check for recurring items where `next_due_date <= today` and insert them as real transactions
- [ ] Upcoming transactions widget — add a dashboard card listing the next 5 due recurring items (name, amount, due date)

---

## 7. Data Management

> Import/export and data integrity features that serious users will need.

- [x] CSV export — "Export CSV" button in transaction table toolbar; downloads all rows as `transactions-YYYY-MM-DD.csv`
- [x] CSV import — `/import` page with file upload, CSV parsing, 10-row preview, and bulk insert server action
- [ ] Transaction description column in Supabase — add `description TEXT` and `transaction_date DATE` columns via a migration
- [ ] Data validation with Zod — add server-side Zod validation to all server actions (create, edit, delete)
- [ ] Soft delete / archive — instead of hard deleting, add a `deleted_at` timestamp column and provide an "Archived" tab

---

## 8. UI / UX Polish

> Visible quality-of-life improvements that affect every session.

- [x] Dark mode toggle — `ThemeProvider` added to layout; sun/moon toggle button in `SiteHeader`
- [x] Sidebar navigation links — added Dashboard, Analytics, Recurring, Wallet (Settings) with real icons
- [ ] Mobile-responsive dashboard — audit and fix grid layout, sidebar collapse, and chart sizing on screens below 768 px
- [ ] Empty state illustrations — when the table has no rows, show a friendly illustration and "Add your first transaction" CTA
- [ ] Loading skeletons — replace blank flashes during data fetches with `Skeleton` components for cards and table
- [ ] Keyboard shortcut "N" to create transaction — map a global `keydown` listener so pressing N opens the create form
- [ ] Breadcrumb in site header — replace the hardcoded "Documents" heading with a dynamic breadcrumb component
- [x] Currency formatting — transaction values formatted as USD currency in the table

---

## 9. Notifications & Alerts

- [ ] In-app notification center — add a bell icon to `SiteHeader` with a dropdown listing recent alerts; store in a `notifications` table
- [ ] Over-budget toast alert — when a new transaction pushes a category over its monthly limit, fire a Sonner warning toast
- [ ] Monthly summary email — use Supabase Edge Functions + Resend to email the user a brief monthly summary on the 1st of each month

---

## 10. AI Features

> The landing page already promises AI-powered insights; build toward it.

- [x] Generic AI landing page
- [ ] AI spending analysis — integrate an LLM API via a server action; send aggregated transactions and display a 3-bullet spending insight on the dashboard
- [ ] Natural-language transaction entry — user types "spent $45 on groceries yesterday" and the model pre-fills the create form
- [ ] Category auto-suggestion — when a user types a new category, suggest the closest existing one to avoid duplicates
- [ ] Monthly budget recommendation — based on historical spending, have the AI suggest per-category budget limits
- [ ] AI chat assistant — add a floating chat sheet where users can ask questions like "How much did I spend on dining last month?"

---

## 11. Settings & Preferences

- [x] Settings page at `/settings` — Profile tab (edit name/avatar via `supabase.auth.updateUser`), Preferences tab (currency picker stored in localStorage), Danger Zone tab (placeholder)
- [x] Default currency selection — currency preference selector (USD, PHP, EUR, GBP, JPY) in Settings → Preferences, stored in localStorage
- [ ] Transaction types management — let users rename or add custom transaction types beyond the three hardcoded ones
- [ ] Category management page — build a proper `/settings/categories` page to rename, recolor, merge, or delete categories
- [ ] Week start day preference — let users set whether their week starts on Sunday or Monday

---

## 12. Performance & Code Quality

> Technical debt to address as the feature set grows.

- [x] Fix `randomColor()` in `section-cards.tsx` — replaced with `deterministicColor()` using a string hash → stable HSL hue
- [ ] Extract repeated pagination JSX — the pagination block is copy-pasted four times in `data-table.tsx`; extract it into a `<TablePagination table={table} />` component
- [ ] Extract tab content into a shared component — the four `TabsContent` blocks in `data-table.tsx` are nearly identical; extract a reusable `<TransactionTabContent />` component
- [ ] Move Supabase queries out of components — `section-cards.tsx` runs three inline queries; extract them into a `lib/queries.ts` module with typed return values
- [ ] Add TypeScript strict mode — enable `strict: true` in `tsconfig.json` and fix resulting type errors
- [ ] Environment variable validation — add a startup check (using Zod) that throws a clear error if Supabase env vars are missing
