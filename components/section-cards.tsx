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
import { PieChart } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent } from "./ui/chart";
import { Category, Transaction } from "@/app/types/Types";

export async function SectionCards() {
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
  }

  function mergeData(categories: any, groupedExpenses: any) {
    const listOfGroupedExpenses = Object.fromEntries(groupedExpenses);
  }

  function randomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // const chartData = await supabase.from("Category").select("id");
  // const data1 = await supabase
  //   .from("transactions")
  //   .select("value.sum(), category_id");
  // console.log("chart data");
  // console.log(data1);

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
            {/* <ChartContainer config={chartConfig}>
              <PieChart data={}>
                <ChartLegend
                  content={<ChartLegendContent nameKey="browser" />}
                  className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                />
              </PieChart>
            </ChartContainer> */}
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
          <CardDescription>Savings/Expenses</CardDescription>
          {/* <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction> */}
        </CardHeader>
        {/* <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter> */}
      </Card>
    </div>
  );
}
