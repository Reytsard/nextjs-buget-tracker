import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import FormSubmitButton from "@/components/form-submit-button";
import { DashboardToast } from "@/components/dashboard-toast";
import { IconTrash } from "@tabler/icons-react";

const createRecurring = async (formData: FormData) => {
  "use server";
  const value = Number(formData.get("value"));
  const typeValue = formData.get("type") as string;
  const categoryValue = formData.get("category") as string;
  const description = formData.get("description") as string;
  const frequency = formData.get("frequency") as string;
  const next_due_date = formData.get("next_due_date") as string;

  const supabase = await createClient();

  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) return;

  const user_id = claims.claims.sub as string;

  const { data: type, error: typeError } = await supabase
    .from("types")
    .select("id")
    .eq("value", typeValue)
    .single();

  if (typeError || !type) return;

  const { data: categoryContainingValue, error: categoryError } =
    await supabase
      .from("Category")
      .select("id")
      .eq("category", categoryValue)
      .maybeSingle();

  let category_id: number | null = null;

  if (!categoryError && categoryContainingValue) {
    category_id = categoryContainingValue.id;
  } else if (!categoryError && !categoryContainingValue && categoryValue) {
    const { data: newCategory, error: newCategoryError } = await supabase
      .from("Category")
      .insert({ category: categoryValue })
      .select("id")
      .single();
    if (newCategoryError || !newCategory) return;
    category_id = newCategory.id;
  }

  const { error } = await supabase.from("recurring_transactions").insert({
    user_id,
    value,
    type_id: type.id,
    category_id,
    description: description || null,
    frequency,
    next_due_date,
  });

  if (!error) {
    redirect("/recurring?success=recurring-created");
  }
};

const toggleRecurring = async (formData: FormData) => {
  "use server";
  const id = Number(formData.get("id"));
  const isActiveStr = formData.get("is_active") as string;
  const currentlyActive = isActiveStr === "true";

  const supabase = await createClient();

  await supabase
    .from("recurring_transactions")
    .update({ is_active: !currentlyActive })
    .eq("id", id);

  redirect("/recurring");
};

const deleteRecurring = async (formData: FormData) => {
  "use server";
  const id = Number(formData.get("id"));

  const supabase = await createClient();

  await supabase.from("recurring_transactions").delete().eq("id", id);

  redirect("/recurring?success=recurring-deleted");
};

function getTypeBadgeVariant(
  typeValue: string
): "default" | "secondary" | "destructive" | "outline" {
  if (typeValue === "Savings") return "default";
  if (typeValue === "Expenses") return "destructive";
  if (typeValue === "Emergency Savings") return "secondary";
  return "outline";
}

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

  const { data: recurringTransactions } = await supabase
    .from("recurring_transactions")
    .select('*, types(value), "Category"(category)')
    .order("next_due_date");

  const { data: types } = await supabase.from("types").select("*");
  const { data: categories } = await supabase.from("Category").select("*");

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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Add New Recurring Transaction */}
                <Card>
                  <CardHeader>
                    <CardTitle>New Recurring Transaction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form action={createRecurring}>
                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor="value">Value</FieldLabel>
                          <Input
                            id="value"
                            name="value"
                            type="number"
                            placeholder="123.45"
                            step="0.01"
                            min="0"
                            required
                          />
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="type">Type</FieldLabel>
                          <Select name="type" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {types &&
                                types.map((type: any) => (
                                  <SelectItem key={type.id} value={type.value}>
                                    {type.value}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="category">Category</FieldLabel>
                          <Select name="category">
                            <SelectTrigger>
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories &&
                                categories.map((category: any) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.category}
                                  >
                                    {category.category}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="description">
                            Description{" "}
                            <span className="text-muted-foreground font-normal">
                              (optional)
                            </span>
                          </FieldLabel>
                          <Input
                            id="description"
                            name="description"
                            type="text"
                            placeholder="e.g. Netflix subscription"
                          />
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="frequency">Frequency</FieldLabel>
                          <Select name="frequency" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="next_due_date">
                            Next Due Date
                          </FieldLabel>
                          <Input
                            id="next_due_date"
                            type="date"
                            name="next_due_date"
                            required
                          />
                        </Field>
                        <FieldGroup>
                          <Field>
                            <FormSubmitButton />
                          </Field>
                        </FieldGroup>
                      </FieldGroup>
                    </form>
                  </CardContent>
                </Card>

                {/* Right: Recurring Transactions List */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle>Recurring Transactions</CardTitle>
                      <Badge variant="secondary">
                        {recurringTransactions?.length ?? 0}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {recurringTransactions && recurringTransactions.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {recurringTransactions.map((item: any) => {
                          const typeLabel = item.types?.value ?? "";
                          return (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-3 rounded-lg border p-3"
                            >
                              {/* Left: description + details */}
                              <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="font-medium text-sm truncate">
                                  {item.description || "No description"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  }).format(item.value)}{" "}
                                  &middot; {item.frequency} &middot; due{" "}
                                  {item.next_due_date}
                                </span>
                              </div>

                              {/* Right: type badge + actions */}
                              <div className="flex items-center gap-2 shrink-0">
                                <Badge
                                  variant={getTypeBadgeVariant(typeLabel)}
                                >
                                  {typeLabel}
                                </Badge>

                                {/* Toggle active/pause */}
                                <form action={toggleRecurring}>
                                  <input type="hidden" name="id" value={item.id} />
                                  <input
                                    type="hidden"
                                    name="is_active"
                                    value={String(item.is_active)}
                                  />
                                  <Button
                                    type="submit"
                                    variant="outline"
                                    size="sm"
                                  >
                                    {item.is_active ? "Pause" : "Resume"}
                                  </Button>
                                </form>

                                {/* Delete */}
                                <form action={deleteRecurring}>
                                  <input type="hidden" name="id" value={item.id} />
                                  <Button
                                    type="submit"
                                    variant="destructive"
                                    size="sm"
                                  >
                                    <IconTrash className="size-4" />
                                  </Button>
                                </form>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No recurring transactions yet. Add one on the left.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
      <DashboardToast />
    </SidebarProvider>
  );
}
