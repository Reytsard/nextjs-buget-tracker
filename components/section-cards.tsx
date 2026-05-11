import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/server";
import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "./ui/chart";
import { Category, Transaction } from "@/app/types/Types";
import PieChartComponent from "./pie-chart";

export async function SectionCards() {
  let chartData = [];
  let chartConfig = {} satisfies ChartConfig;
  const supabase = await createClient();
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  const totalpnl = await transactions?.reduce(
    (a: any, b: any) => (b.type_id == 2 ? a - b.value : a + b.value),
    0,
  );

  const thisMonthsTransactions = transactions?.filter((transaction) => {
    const transactionDate = new Date(transaction.created_at);
    const now = new Date();
    return (
      transactionDate.getMonth() === now.getMonth() &&
      transactionDate.getFullYear() === now.getFullYear()
    );
  });

  const thisMonthsPnL = thisMonthsTransactions?.reduce(
    (a: any, b: any) => (b.type_id == 2 ? a - b.value : a + b.value),
    0,
  );

  const monthlySavings = thisMonthsTransactions?.reduce(
    (a: number, b: any) => (b.type_id !== 2 ? a + b.value : a),
    0
  ) ?? 0;
  const monthlyExpenses = thisMonthsTransactions?.reduce(
    (a: number, b: any) => (b.type_id === 2 ? a + b.value : a),
    0
  ) ?? 0;
  const savingsRate = monthlySavings + monthlyExpenses > 0
    ? Math.round((monthlySavings / (monthlySavings + monthlyExpenses)) * 100)
    : 0;

  if (thisMonthsTransactions) {
    const { data: categories, error: categoriesError } = await supabase
      .from("Category")
      .select("id, category");

    const distictCategoriesFromTransactions = thisMonthsTransactions.reduce(
      (acc: any, transaction: any) => {
        if (
          transaction.category_id !== null &&
          !acc.includes(transaction.category_id)
        ) {
          return [...acc, transaction.category_id];
        }
        return acc;
      },
      [-1], //used for other/no category
    );
    const mappedCategories = distictCategoriesFromTransactions.map(
      (categoryId: number) => {
        if (categoryId === -1) {
          return {
            categoryId: categoryId,
            category: "Others",
          };
        }
        const cat: { id: number; category: string } | undefined =
          categories?.find((c) => {
            return c.id === categoryId;
          });
        return {
          categoryId: categoryId,
          category: cat?.category,
          fill: deterministicColor(cat?.category ?? String(categoryId)),
        };
      },
    );

    //group/map transactions by category_id
    const grouped = new Map();
    for (const transaction of thisMonthsTransactions) {
      const catId = transaction.category_id;
      if (!grouped.has(transaction.category_id)) {
        grouped.set(catId, [transaction]);
      }
      grouped.get(catId).push(transaction);
    }

    const groupedExpenses = new Map();
    for (const [catId, transactions] of grouped) {
      const total = transactions.reduce(
        (sum: number, transaction: Transaction) => {
          if (transaction.type_id === 2) {
            return (sum += transaction.value);
          }
          return sum;
        },
        0,
      );
      groupedExpenses.set(catId, total);
    }

    const mergedData = mergeData(mappedCategories, groupedExpenses);
    const labels = mergedData.reduce((acc: any, item: any) => {
      acc[item.category] = {
        label: item.category,
        color: item.fill,
      };
      return acc;
    }, {});

    chartData = mergedData;
    chartConfig = labels;
  }

  function mergeData(categories: any, groupedExpenses: any) {
    let data: any = [];
    // console.log(categories);
    categories.forEach((category: any) => {
      let x = {};
      if (category.categoryId === -1) {
        x = {
          category: "Others",
          value: groupedExpenses.get(null),
        };
      } else {
        x = {
          category: category.category,
          value: groupedExpenses.get(category.categoryId),
        };
      }
      data.push(x);
    });
    return data;
  }

  function deterministicColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
      hash |= 0;
    }
    return `var(--chart-${(Math.abs(hash) % 8) + 1})`;
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total PnL</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalpnl}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {totalpnl > 0 ? <IconTrendingUp /> : <IconTrendingDown />}
            </Badge>
          </CardAction>
        </CardHeader>
        {/* <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter> */}
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>This Months PnL</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {thisMonthsPnL}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {thisMonthsPnL > 0 ? <IconTrendingUp /> : <IconTrendingDown />}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {/* <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div> */}
          <div className="text-muted-foreground">
            {thisMonthsPnL >= 1
              ? "Positive cash flow this month"
              : thisMonthsPnL === 0
                ? ""
                : "Negative cash flow this month"}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Monthly Expenses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {/* 
            Data needed
            distinct categories
            total value per category

            Config needed
            label
            color
          */}
            <PieChartComponent data={chartData} config={chartConfig} />
          </CardTitle>
          {/* <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction> */}
        </CardHeader>
        {/* <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter> */}
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>This Month Savings / Expenses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <span style={{ color: "var(--income)" }}>+{monthlySavings.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
            {" / "}
            <span style={{ color: "var(--expense)" }}>-{monthlyExpenses.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {savingsRate}% saved
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Savings rate this month
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
