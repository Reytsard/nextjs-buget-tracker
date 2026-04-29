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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import FormSubmitButton from "@/components/form-submit-button";
import { ChevronLeft } from "lucide-react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { data: transaction, error: transactionError } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .single();

  if (transactionError || !transaction) {
    redirect("/dashboard");
  }

  const types = await supabase.from("types").select("*");
  const categories = await supabase.from("Category").select("*");

  const currentType = types.data?.find(
    (t: any) => t.id === transaction.type_id
  );
  const currentCategory = categories.data?.find(
    (c: any) => c.id === transaction.category_id
  );

  const updateTransaction = async (formData: FormData) => {
    "use server";
    const value = Number(formData.get("value"));
    const typeValue = formData.get("type") as string;
    const categoryValue = formData.get("Category") as string;

    const supabase = await createClient();

    const { data: type, error: typeError } = await supabase
      .from("types")
      .select("id")
      .eq("value", typeValue)
      .single();

    if (typeError || !type) {
      return;
    }

    const { data: categoryContainingValue, error: categoryError } =
      await supabase
        .from("Category")
        .select("id")
        .eq("category", categoryValue)
        .maybeSingle();

    if (!categoryError && categoryContainingValue) {
      const { error } = await supabase
        .from("transactions")
        .update({
          value,
          type_id: type.id,
          category_id: categoryContainingValue.id,
        })
        .eq("id", id);
      if (!error) {
        redirect("/dashboard?success=transaction-updated");
      }
    } else if (!categoryError && !categoryContainingValue) {
      const { data: newCategory, error: newCategoryError } = await supabase
        .from("Category")
        .insert({ category: categoryValue })
        .select("id")
        .single();
      if (newCategoryError || !newCategory) {
        return;
      }
      const { error } = await supabase
        .from("transactions")
        .update({
          value,
          type_id: type.id,
          category_id: newCategory.id,
        })
        .eq("id", id);
      if (!error) {
        redirect("/dashboard?success=transaction-updated");
      }
    }
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
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <Card className="w-full max-w-lg">
                <CardHeader>
                  <Link href="/dashboard">
                    <Button size="sm" className="w-[50px]">
                      <ChevronLeft />
                    </Button>
                  </Link>
                  <CardTitle>Edit Transaction</CardTitle>
                  <CardDescription>
                    Update your transaction details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form action={updateTransaction}>
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="value">Value</FieldLabel>
                        <Input
                          id="value"
                          name="value"
                          type="number"
                          defaultValue={transaction.value}
                          required
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="type">Type</FieldLabel>
                        <Select
                          name="type"
                          defaultValue={currentType?.value}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {types.data &&
                              types.data.map((type: any) => (
                                <SelectItem key={type.id} value={type.value}>
                                  {type.value}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="Category">Category</FieldLabel>
                        <Select
                          name="Category"
                          defaultValue={currentCategory?.category}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.data &&
                              categories.data.map((category: any) => (
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
                      <FieldGroup>
                        <Field>
                          <FormSubmitButton />
                        </Field>
                      </FieldGroup>
                    </FieldGroup>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
