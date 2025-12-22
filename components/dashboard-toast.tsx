"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export function DashboardToast() {
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("success") === "transaction-created") {
      toast.success("Transaction record created successfully!");
    }
  }, [params]);

  return null;
}
