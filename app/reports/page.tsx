import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MonthPicker } from "@/components/month-picker";
import { CategoryPieChart, MonthlyBarChart } from "@/components/reports-charts";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { month } = await searchParams;
  const now = new Date();
  const currentMonth = month ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [year, mon] = currentMonth.split("-").map(Number);
  const from = new Date(year, mon - 1, 1).toISOString();
  const to = new Date(year, mon, 1).toISOString();

  const { data: categories } = await supabase.from("Category").select("id, category");
  const categoryMap: Record<number, string> = {};
  (categories ?? []).forEach((c: any) => { categoryMap[c.id] = c.category; });

  // Transactions for selected month
  const { data: monthTx } = await supabase
    .from("transactions")
    .select("*")
    .gte("created_at", from)
    .lt("created_at", to);

  // Category breakdown for expenses (type_id=2)
  const expensesByCat: Record<string, number> = {};
  (monthTx ?? []).filter((t: any) => t.type_id === 2).forEach((t: any) => {
    const cat = categoryMap[t.category_id] ?? "Uncategorized";
    expensesByCat[cat] = (expensesByCat[cat] ?? 0) + t.value;
  });
  const pieData = Object.entries(expensesByCat)
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);

  // Summary stats
  const totalSavings = (monthTx ?? []).filter((t: any) => t.type_id === 1).reduce((s: number, t: any) => s + t.value, 0);
  const totalExpenses = (monthTx ?? []).filter((t: any) => t.type_id === 2).reduce((s: number, t: any) => s + t.value, 0);
  const totalEmergency = (monthTx ?? []).filter((t: any) => t.type_id === 3).reduce((s: number, t: any) => s + t.value, 0);
  const netSavings = totalSavings - totalExpenses;
  const topCategory = pieData[0]?.category ?? "—";

  // Last 6 months bar data — single RPC call replaces the previous 6-query loop
  const { data: monthlySummary } = await supabase.rpc("get_monthly_summary", { months_back: 6 });
  const barData = (monthlySummary ?? []).map((row: any) => ({
    month: row.month_label,
    savings: row.savings,
    expenses: row.expenses,
    emergency: row.emergency,
  }));

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 lg:px-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Monthly Report</h1>
                <MonthPicker current={currentMonth} />
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Savings</CardDescription>
                    <CardTitle className="text-income text-xl">{fmt(totalSavings)}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Expenses</CardDescription>
                    <CardTitle className="text-expense text-xl">{fmt(totalExpenses)}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Net Savings</CardDescription>
                    <CardTitle className={`text-xl ${netSavings >= 0 ? "text-income" : "text-expense"}`}>
                      {fmt(netSavings)}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Top Expense Category</CardDescription>
                    <CardTitle className="text-xl truncate">{topCategory}</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Expenses by Category</CardTitle>
                    <CardDescription>Breakdown for {MONTHS_SHORT[mon - 1]} {year}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CategoryPieChart data={pieData} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Last 6 Months</CardTitle>
                    <CardDescription>Savings vs. expenses trend</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MonthlyBarChart data={barData} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
