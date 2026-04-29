"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export function DashboardToast() {
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("success") === "transaction-created") {
      toast.success("Transaction record created successfully!");
    } else if (params.get("success") === "transaction-updated") {
      toast.success("Transaction updated successfully!");
    } else if (params.get("success") === "limit-saved") {
      toast.success("Budget limit saved!");
    } else if (params.get("success") === "limit-deleted") {
      toast.info("Budget limit removed.");
    } else if (params.get("success") === "profile-updated") {
      toast.success("Profile updated successfully!");
    } else if (params.get("success") === "recurring-created") {
      toast.success("Recurring transaction created!");
    } else if (params.get("success") === "recurring-deleted") {
      toast.info("Recurring transaction deleted.");
    } else if (params.get("success") === "import-complete") {
      const count = params.get("count");
      toast.success(
        count
          ? `Successfully imported ${count} transaction${Number(count) !== 1 ? "s" : ""}!`
          : "Transactions imported successfully!"
      );
    }
  }, [params]);

  return null;
}
