import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import data1 from "./data.json";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";
import { DashboardToast } from "@/components/dashboard-toast";

export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*");
  const chartData = transactions?.map((transaction) => ({
    x: transaction.created_at,
    y: transaction.value,
    type: transaction.type_id,
  }));
  const savingsData = chartData
    ?.filter((item) => item.type === 1)
    .map((item: any) => ({ x: item.created_at, y: item.value }));
  const expenseData = chartData
    ?.filter((item) => item.type === 2)
    .map((item: any) => ({ x: item.created_at, y: item.value }));

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
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              {/* <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={chartAreaData} />
              </div> */}
              <DataTable data={transactions!} />
            </div>
          </div>
        </div>
      </SidebarInset>
      <DashboardToast />
    </SidebarProvider>
  );
}
