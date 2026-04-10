import { createClient } from "@/lib/server";
import { MonthlyCategoryChartClient } from "./monthly-category-chart-client";

export async function MonthlyCategoryChart() {
  const supabase = await createClient();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("type_id", 2) // only expenses
    .order("created_at", { ascending: true });

  const { data: categories } = await supabase
    .from("Category")
    .select("id, category");

  if (!transactions || !categories) return null;

  // Group by month
  const monthlyDataMap = new Map<string, any>();
  const categoryNames = new Set<string>();
  const categoryLabels = new Map<string, string>();

  transactions.forEach((tx) => {
    const date = new Date(tx.created_at);
    // Format as "MMM YYYY", e.g. "Jan 2024"
    const monthKey = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    if (!monthlyDataMap.has(monthKey)) {
      monthlyDataMap.set(monthKey, { month: monthKey });
    }

    const monthEntry = monthlyDataMap.get(monthKey);
    let catName = "Others";
    if (tx.category_id) {
      const cat = categories.find((c) => c.id === tx.category_id);
      if (cat) catName = cat.category;
    }

    const safeCatName = catName.replace(/\s+/g, '_');
    categoryNames.add(safeCatName);
    categoryLabels.set(safeCatName, catName);

    if (!monthEntry[safeCatName]) {
      monthEntry[safeCatName] = 0;
    }
    monthEntry[safeCatName] += tx.value;
  });

  const chartData = Array.from(monthlyDataMap.values());
  const categoriesList = Array.from(categoryNames);

  // Generate distinct colors for config
  const chartConfig: Record<string, any> = {};
  const colors = [
    "#2563eb",
    "#e11d48",
    "#16a34a",
    "#c026d3",
    "#ea580c",
    "#0ea5e9",
    "#8b5cf6",
    "#059669",
    "#dc2626",
    "#d97706",
  ];

  categoriesList.forEach((cat, index) => {
    chartConfig[cat] = {
      label: categoryLabels.get(cat),
      color: colors[index % colors.length],
    };
  });

  return (
    <MonthlyCategoryChartClient 
      data={chartData} 
      categories={categoriesList} 
      config={chartConfig} 
    />
  );
}
