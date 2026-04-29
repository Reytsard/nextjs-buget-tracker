import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import { IconUpload } from "@tabler/icons-react";
import React from "react";
import CSVImportForm from "./csv-import-form";

// ─── Server Action ────────────────────────────────────────────────────────────

async function importTransactions(formData: FormData) {
  "use server";

  const rawRows = formData.get("rows");
  if (!rawRows || typeof rawRows !== "string") {
    redirect("/import?error=no-data");
  }

  let rows: { value: number; type: string; category: string }[];
  try {
    rows = JSON.parse(rawRows as string);
  } catch {
    redirect("/import?error=invalid-json");
  }

  const supabase = await createClient();

  // Fetch all types once
  const { data: types, error: typesError } = await supabase
    .from("types")
    .select("id, value");

  if (typesError || !types) {
    redirect("/import?error=types-fetch-failed");
  }

  const typeMap = new Map<string, number>(
    types.map((t: { id: number; value: string }) => [t.value, t.id])
  );

  // Fetch existing categories once
  const { data: existingCategories } = await supabase
    .from("Category")
    .select("id, category");

  const categoryMap = new Map<string, number>(
    (existingCategories ?? []).map(
      (c: { id: number; category: string }) => [c.category, c.id]
    )
  );

  const transactionsToInsert: {
    value: number;
    type_id: number;
    category_id: number | null;
  }[] = [];

  for (const row of rows) {
    const type_id = typeMap.get(row.type);
    if (!type_id) continue;

    let category_id: number | null = null;

    if (row.category) {
      if (categoryMap.has(row.category)) {
        category_id = categoryMap.get(row.category)!;
      } else {
        const { data: newCat, error: newCatError } = await supabase
          .from("Category")
          .insert({ category: row.category })
          .select("id")
          .single();
        if (!newCatError && newCat) {
          categoryMap.set(row.category, newCat.id);
          category_id = newCat.id;
        }
      }
    }

    transactionsToInsert.push({ value: row.value, type_id, category_id });
  }

  if (transactionsToInsert.length === 0) {
    redirect("/import?error=no-valid-rows");
  }

  const { error: insertError } = await supabase
    .from("transactions")
    .insert(transactionsToInsert);

  if (insertError) {
    redirect("/import?error=insert-failed");
  }

  redirect(
    `/dashboard?success=import-complete&count=${transactionsToInsert.length}`
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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
              <Card className="w-full max-w-2xl">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <IconUpload className="size-5" />
                    <CardTitle>Import Transactions</CardTitle>
                  </div>
                  <CardDescription>
                    Upload a CSV file with columns: value, type (Savings /
                    Expenses / Emergency Savings), category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CSVImportForm importAction={importTransactions} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
