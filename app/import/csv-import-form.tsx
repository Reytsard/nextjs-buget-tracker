"use client";

import React, { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { IconUpload } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ParsedRow = {
  value: number;
  type: string;
  category: string;
};

interface CSVImportFormProps {
  importAction: (formData: FormData) => Promise<void>;
}

export default function CSVImportForm({ importAction }: CSVImportFormProps) {
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [parseError, setParseError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setParseError("");
    setParsedRows([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) {
        setParseError("Could not read file.");
        return;
      }

      const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      if (lines.length === 0) {
        setParseError("The file is empty.");
        return;
      }

      // Skip header row if first cell is non-numeric (i.e. it's a header)
      const firstCells = lines[0].split(",");
      const startIndex = isNaN(Number(firstCells[0])) ? 1 : 0;

      const rows: ParsedRow[] = [];
      for (let i = startIndex; i < lines.length; i++) {
        const cols = lines[i].split(",");
        if (cols.length < 2) continue;
        const value = Number(cols[0]?.trim());
        if (isNaN(value)) continue;
        const type = cols[1]?.trim() ?? "";
        const category = cols[2]?.trim() ?? "";
        rows.push({ value, type, category });
      }

      if (rows.length === 0) {
        setParseError("No valid rows found. Make sure columns are: value, type, category.");
        return;
      }

      setParsedRows(rows);
    };
    reader.onerror = () => setParseError("Error reading file.");
    reader.readAsText(file);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (parsedRows.length === 0) {
      toast.error("No rows to import. Please select a valid CSV file.");
      return;
    }

    const formData = new FormData();
    formData.set("rows", JSON.stringify(parsedRows));

    startTransition(async () => {
      try {
        await importAction(formData);
        // importAction redirects on success, so if we reach here it failed silently
        toast.success(`Importing ${parsedRows.length} transaction(s)…`);
      } catch {
        // Next.js redirect throws internally — this is expected on success
        // Any real error surfaces here
        toast.error("Import failed. Please try again.");
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* File picker */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="csv-file" className="flex items-center gap-2 cursor-pointer w-fit">
          <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors">
            <IconUpload className="size-4" />
            {fileName ? fileName : "Choose CSV file"}
          </div>
        </Label>
        <Input
          id="csv-file"
          type="file"
          accept=".csv"
          className="sr-only"
          onChange={handleFileChange}
        />
        <p className="text-muted-foreground text-xs">
          Expected column order: <span className="font-mono">value, type, category</span>
        </p>
      </div>

      {/* Parse error */}
      {parseError && (
        <p className="text-destructive text-sm">{parseError}</p>
      )}

      {/* Preview table */}
      {parsedRows.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">
            Preview — showing {Math.min(parsedRows.length, 10)} of{" "}
            {parsedRows.length} row(s)
          </p>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Value</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedRows.slice(0, 10).map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      {row.value.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.category || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Hidden field (populated on submit) */}
      <input ref={hiddenInputRef} type="hidden" name="rows" />

      {/* Submit */}
      <Button
        type="submit"
        disabled={parsedRows.length === 0 || isPending}
        className="w-fit"
      >
        {isPending
          ? "Importing…"
          : parsedRows.length > 0
          ? `Import ${parsedRows.length} transaction${parsedRows.length !== 1 ? "s" : ""}`
          : "Import transactions"}
      </Button>
    </form>
  );
}
