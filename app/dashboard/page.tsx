import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TransactionSearch } from "@/components/transaction-search";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";
import { DashboardToast } from "@/components/dashboard-toast";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const userData = {
    name: data?.claims.user_name || "",
    email: data?.claims.email!,
    avatar: data?.claims.user_avatar || "",
  };

  const { q } = await searchParams;

  // Full dataset for chart (unfiltered)
  const { data: allTransactions } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  // Filtered dataset for table
  let query = supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("description", `%${q}%`);
  }

  const { data: transactions } = await query;

  const chartData = allTransactions?.map((transaction) => ({
    x: transaction.created_at,
    y: transaction.value,
    type: transaction.type_id,
  }));
  const savingsData = chartData
    ?.filter((item) => item.type === 1)
    .map((item) => ({ x: item.x, y: item.y }));
  const expenseData = chartData
    ?.filter((item) => item.type === 2)
    .map((item) => ({ x: item.x, y: item.y }));

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" userdata={userData} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={{ savings: savingsData ?? [], expenses: expenseData ?? [] }} />
              </div>
              <div className="flex items-center justify-end px-4 lg:px-6">
                <TransactionSearch initial={q} />
              </div>
              <DataTable data={transactions!} />
            </div>
          </div>
        </div>
      </SidebarInset>
      <DashboardToast />
    </SidebarProvider>
  );
}
