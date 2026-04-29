"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CURRENCIES = [
  { value: "USD", label: "USD – US Dollar" },
  { value: "PHP", label: "PHP – Philippine Peso" },
  { value: "EUR", label: "EUR – Euro" },
  { value: "GBP", label: "GBP – British Pound" },
  { value: "JPY", label: "JPY – Japanese Yen" },
];

export function CurrencyPreference() {
  const [currency, setCurrency] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem("preferred_currency");
    if (stored) {
      setCurrency(stored);
    }
  }, []);

  function handleChange(value: string) {
    setCurrency(value);
    localStorage.setItem("preferred_currency", value);
    toast.success("Currency preference saved");
  }

  return (
    <Select value={currency} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a currency" />
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((c) => (
          <SelectItem key={c.value} value={c.value}>
            {c.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
