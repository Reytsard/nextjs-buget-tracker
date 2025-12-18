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

export async function NewTransactionForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const supabase = await createClient();
  // const { data, error } = await supabase.auth.getClaims();
  // const userId = data?.claims.user_metadata?.sub;
  const types = await supabase.from("types").select("*");
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>New Transaction Record</CardTitle>
        <CardDescription>
          Enter your information below to create a new transaction.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Value</FieldLabel>
              <Input id="name" type="number" placeholder="1000.25" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Type</FieldLabel>
              <Select name="type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {/* values in select content, get it from database> */}
                  {types.data &&
                    types.data.map((type) => (
                      <SelectItem
                        key={type.value}
                        value={type.value.toString()}
                      >
                        {type.value}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </Field>
            {/* <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" required />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" type="password" required />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field> */}
            <FieldGroup>
              <Field>
                <Button type="submit">Create Record</Button>
                {/* <Button variant="outline" type="button">
                  Sign up with Google
                </Button> */}
                <FieldDescription className="px-6 text-center">
                  Already have an account? <a href="/login">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
