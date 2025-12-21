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
import { toast } from "sonner";

export async function NewTransactionForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims.user_metadata?.sub;
  console.log(data);
  const types = await supabase.from("types").select("*");

  const createRecord = async (formData: FormData) => {
    "use server";
    const value = formData.get("value");
    const type = formData.get("type");
    const supabase = await createClient();
    const { data: record, error } = await supabase.from("transaction").insert([
      {
        value: Number(value),
        type: String(type),
        category: null,
        created_at: new Date(),
      },
    ]);
    console.log(data);
    if (error) {
      console.log("Error creating record:", error);
    } else {
      toast.success("Record created successfully!");
      window.location.href = "/dashboard";
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
              <FieldLabel htmlFor="name">Value</FieldLabel>
              <Input id="name" type="number" placeholder="1000.25" required />
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
                    types.data.map((type) => (
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
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field> */}
            {/* <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" type="password" required />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field> */}
            <FieldGroup>
              <Field>
                <Button type="submit">Create Record</Button>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
