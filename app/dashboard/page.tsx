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
import { Transaction } from "../types/Types";

export default async function Page() {
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

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*");

  const getChartData = async (data: Transaction[]) =>
    new Promise((resolve, reject) => {
      try {
        console.log("buh resolved");
        resolve("buh");
        // const hashSetDates = new Set();
        // transactions?.forEach((transaction) => {
        //   const date = new Date(transaction.created_at);
        //   const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
        //   hashSetDates.add(monthYear);
        // });
        // hashSetDates.forEach((date) => {
        //   const transactionOnDates = transactions?.filter((transaction) => {
        //     const transactionDate = new Date(transaction.created_at);
        //     const monthYear = `${
        //       transactionDate.getMonth() + 1
        //     }-${transactionDate.getFullYear()}`;
        //     return monthYear === date;
        //   });
        //   const totalValue = transactionOnDates?.reduce(
        //     (acc, curr) => acc + curr.value,
        //     0
        //   );
        //   console.log(`Date: ${date}, Total Value: ${totalValue}`);
        // });
      } catch (error) {
        reject(error);
      }
    });

  await getChartData(transactions!);
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
      <AppSidebar variant="inset" userdata={userData} />
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
