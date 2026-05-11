"use client";

import { useEffect } from "react";
import { ChartContainer, ChartLegend, ChartLegendContent } from "./ui/chart";
import { Cell, Pie, PieChart } from "recharts";

function PieChartComponent({ data, config }: any) {
  useEffect(() => {
    console.log("data");
    console.log(config);
  }, []);
  return (
    <ChartContainer
      config={config}
      className="mx-auto aspect-square max-h-[160px]"
    >
      <PieChart>
        <Pie data={data} dataKey="value">
          {data.map((item: any, index: number) => (
            <Cell
              key={index}
              style={{
                fill: config[item.category]?.color || `var(--chart-${(index % 8) + 1})`,
              }}
            />
          ))}
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="category" />}
          className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}

export default PieChartComponent;
