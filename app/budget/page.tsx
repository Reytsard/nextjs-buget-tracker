import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import { DashboardToast } from "@/components/dashboard-toast";
import { IconTarget } from "@tabler/icons-react";

const upsertBudgetLimit = async (formData: FormData) => {
  "use server";
  const category_id = Number(formData.get("category_id"));
  const monthly_limit = Number(formData.get("monthly_limit"));

  const supabase = await createClient();
  const { data, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !data?.claims) {
    redirect("/auth/login");
  }

  const user_id = data.claims.sub;

  await supabase
    .from("budget_limits")
    .upsert(
      { user_id, category_id, monthly_limit },
      { onConflict: "user_id,category_id" }
    );

  redirect("/budget?success=limit-saved");
};

const deleteBudgetLimit = async (formData: FormData) => {
  "use server";
  const limit_id = Number(formData.get("limit_id"));

  const supabase = await createClient();
  await supabase.from("budget_limits").delete().eq("id", limit_id);

  redirect("/budget?success=limit-deleted");
};

export default async function BudgetPage() {
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

  // Fetch all categories
  const { data: categories } = await supabase.from("Category").select("*");

  // Fetch existing budget limits for the user
  const { data: budgetLimits } = await supabase
    .from("budget_limits")
    .select("*");

  // Fetch this month's expenses (type_id = 2)
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

  const { data: monthlyExpenses } = await supabase
    .from("transactions")
    .select("*")
    .gte("created_at", startOfMonth)
    .lt("created_at", startOfNextMonth)
    .eq("type_id", 2);

  // Calculate spend per category
  const spendByCategory = new Map<number, number>();
  for (const tx of monthlyExpenses ?? []) {
    const catId = tx.category_id as number;
    spendByCategory.set(catId, (spendByCategory.get(catId) ?? 0) + tx.value);
  }

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
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Page header */}
              <div className="flex items-center gap-2">
                <IconTarget className="size-6" />
                <h1 className="text-2xl font-semibold">Budget Limits</h1>
              </div>

              {/* Category cards grid */}
              <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
                {(categories ?? []).map((category: any) => {
                  const existingLimit = budgetLimits?.find(
                    (l: any) => l.category_id === category.id
                  );
                  const spent = spendByCategory.get(category.id) ?? 0;
                  const limit = existingLimit?.monthly_limit ?? 0;
                  const percentage = limit > 0 ? (spent / limit) * 100 : 0;

                  const barColor =
                    percentage >= 100
                      ? "hsl(0,84%,60%)"
                      : percentage >= 70
                      ? "hsl(48,96%,53%)"
                      : "hsl(142,76%,36%)";

                  return (
                    <Card key={category.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">
                          {category.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-3">
                        {/* Progress bar */}
                        <div>
                          <div className="w-full bg-muted rounded-full h-2 mt-2">
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: `${Math.min(percentage, 100)}%`,
                                backgroundColor: barColor,
                              }}
                            />
                          </div>
                          <div className="flex justify-between items-center mt-1 text-sm">
                            <span className="text-destructive font-medium">
                              Spent{" "}
                              {spent.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </span>
                            <span className="text-muted-foreground">
                              {limit > 0
                                ? `of ${limit.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  })}`
                                : "no limit set"}
                            </span>
                          </div>
                        </div>

                        {/* Save limit form */}
                        <form action={upsertBudgetLimit} className="flex gap-2">
                          <input
                            type="hidden"
                            name="category_id"
                            value={category.id}
                          />
                          <Input
                            name="monthly_limit"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Set monthly limit"
                            defaultValue={existingLimit?.monthly_limit ?? ""}
                            className="flex-1"
                          />
                          <Button type="submit" size="sm">
                            Save Limit
                          </Button>
                        </form>

                        {/* Remove limit form */}
                        {existingLimit && (
                          <form action={deleteBudgetLimit}>
                            <input
                              type="hidden"
                              name="limit_id"
                              value={existingLimit.id}
                            />
                            <Button
                              type="submit"
                              variant="outline"
                              size="sm"
                              className="w-full text-muted-foreground"
                            >
                              Remove
                            </Button>
                          </form>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
      <DashboardToast />
    </SidebarProvider>
  );
}
