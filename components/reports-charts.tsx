"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

type CategoryTotal = { category: string; value: number };
type MonthlyBar = { month: string; savings: number; expenses: number; emergency: number };

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

export function CategoryPieChart({ data }: { data: CategoryTotal[] }) {
  if (!data.length) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground text-sm">
        No expense data for this month.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={({ category, percent }) =>
            `${category} ${(percent * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} style={{ fill: CHART_COLORS[i % CHART_COLORS.length] }} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) =>
            value.toLocaleString("en-US", { style: "currency", currency: "USD" })
          }
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MonthlyBarChart({ data }: { data: MonthlyBar[] }) {
  if (!data.length) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground text-sm">
        No data for the last 6 months.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(value: number) =>
            value.toLocaleString("en-US", { style: "currency", currency: "USD" })
          }
        />
        <Legend />
        <Bar dataKey="savings" name="Savings" style={{ fill: "var(--income)" }} radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" name="Expenses" style={{ fill: "var(--expense)" }} radius={[4, 4, 0, 0]} />
        <Bar dataKey="emergency" name="Emergency" style={{ fill: "var(--chart-6)" }} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
