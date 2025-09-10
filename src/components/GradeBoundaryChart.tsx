import React, { useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";

interface GradeBoundaryChartProps {
  data: Array<{ year: string; session?: string; [key: string]: any }>;
  selectedGrades: string[];
}

const gradeColors = {
  "Full UMS": "#000000",
  "A*": "#16a34a",
  A: "#2563eb",
  B: "#9333ea",
  C: "#ea580c",
};

export const GradeBoundaryChart: React.FC<GradeBoundaryChartProps> = ({
  data,
  selectedGrades,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  // Sort data to ensure proper ordering: jan, june, oct pattern
  const sortedData = [...data].sort((a, b) => {
    if (a.year !== b.year) {
      return parseInt(a.year) - parseInt(b.year);
    }

    const sessionOrder = { jan: 1, june: 2, oct: 3, avg: 0 };
    const aOrder = sessionOrder[a.session as keyof typeof sessionOrder] || 4;
    const bOrder = sessionOrder[b.session as keyof typeof sessionOrder] || 4;

    return aOrder - bOrder;
  });

  const exportChartAsPNG = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        width: chartRef.current.offsetWidth,
        height: chartRef.current.offsetHeight,
      });

      const link = document.createElement("a");
      link.download = "grade-boundary-chart.png";
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error("Failed to export chart:", error);
    }
  };

  const chartConfig = selectedGrades.reduce((acc, grade) => {
    acc[grade] = {
      label: `Grade ${grade}`,
      color: gradeColors[grade as keyof typeof gradeColors],
    };
    return acc;
  }, {} as any);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Grade Boundary Trends</h3>
        <Button onClick={exportChartAsPNG} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Chart
        </Button>
      </div>

      <div ref={chartRef} className="bg-background p-4 rounded-lg border">
        <ChartContainer config={chartConfig} className="h-[400px]">
          <LineChart
            data={sortedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--muted-foreground))"
              opacity={0.3}
            />
            <XAxis
              dataKey={(item) =>
                item.session === "avg"
                  ? `${item.year} Avg`
                  : `${item.year} ${item.session?.charAt(0).toUpperCase()}${
                      item.session?.slice(1) || ""
                    }`
              }
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
              stroke="hsl(var(--foreground))"
            />
            <YAxis
              label={{ value: "Raw Mark", angle: -90, position: "insideLeft" }}
              stroke="hsl(var(--foreground))"
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              labelFormatter={(value) => {
                const parts = String(value).split(" ");
                if (parts.length >= 2) {
                  return parts[1] === "Avg"
                    ? `${parts[0]} Average`
                    : `${parts[0]} ${parts[1]}`;
                }
                return value;
              }}
            />
            <Legend />
            {selectedGrades.map((grade) => (
              <Line
                key={grade}
                type="monotone"
                dataKey={grade}
                stroke={gradeColors[grade as keyof typeof gradeColors]}
                strokeWidth={3}
                dot={{ r: 5 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};
