"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";

export function TransactionSearch({ initial }: { initial?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const q = e.target.value;
      const params = new URLSearchParams(searchParams.toString());
      if (q) {
        params.set("q", q);
      } else {
        params.delete("q");
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="relative flex items-center">
      <IconSearch className="absolute left-2.5 size-4 text-muted-foreground pointer-events-none" />
      <Input
        defaultValue={initial}
        onChange={handleChange}
        placeholder="Search transactions..."
        className="pl-8 h-8 w-48 text-sm"
        data-pending={isPending ? "" : undefined}
      />
    </div>
  );
}
