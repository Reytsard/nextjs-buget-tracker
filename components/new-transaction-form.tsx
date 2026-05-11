import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { createClient } from "@/lib/server";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import FormSubmitButton from "./form-submit-button";
import { Value } from "@radix-ui/react-select";
import CategoryForm from "./category-form";

export async function NewTransactionForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const supabase = await createClient();
  const types = await supabase.from("types").select("*");

  const createRecord = async (formData: FormData) => {
    "use server";
    const value = Number(formData.get("value"));
    const typeValue = formData.get("type");
    const categoryValue = formData.get("Category");
    const description = (formData.get("description") as string) || null;
    const supabase = await createClient();
    const { data: type, error: typeError } = await supabase
      .from("types")
      .select("id")
      .eq("value", typeValue)
      .single();
    const { data: categoryContainingValue, error: categoryError } =
      await supabase
        .from("Category")
        .select("id")
        .eq("category", categoryValue)
        .maybeSingle();
    if (!categoryError && categoryContainingValue) {
      const { error } = await supabase.from("transactions").insert({
        value: value,
        type_id: type!.id,
        category_id: categoryContainingValue!.id,
        description,
      });
      if (!error) {
        redirect("/dashboard?success=transaction-created");
      }
    } else if (!categoryError && !categoryContainingValue) {
      const { data: newCategory, error: newCategoryError } = await supabase
        .from("Category")
        .insert({ category: categoryValue })
        .select("id")
        .single();
      const { error } = await supabase.from("transactions").insert({
        value: value,
        type_id: type!.id,
        category_id: newCategory!.id,
        description,
      });
      if (!error) {
        redirect("/dashboard?success=transaction-created");
      }
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <Link href="/dashboard">
          <Button size="sm" className="w-[50px]">
            <ChevronLeft />
          </Button>
        </Link>
        <CardTitle>New Transaction Record</CardTitle>
        <CardDescription>
          Enter your information below to create a new transaction.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={createRecord}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="value">Value</FieldLabel>
              <Input
                id="value"
                name="value"
                type="number"
                placeholder="123.45"
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
                  {/* values in select content, get it from database> */}
                  {types.data &&
                    types.data.map((type: any) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.value}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </Field>
            {/* <Field>
              <FieldLabel htmlFor="Category">Category</FieldLabel>
              <Input id="Category" type="Category" required />
            </Field> */}
            <CategoryForm />
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Input
                id="description"
                name="description"
                type="text"
                placeholder="Optional note..."
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
  );
}
