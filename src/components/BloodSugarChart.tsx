import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartData {
  date: string;
  value: number;
}

interface BloodSugarChartProps {
  data: ChartData[];
}

export const BloodSugarChart = ({ data }: BloodSugarChartProps) => {
  // Group by date and take average
  const groupedData = data.reduce((acc, item) => {
    const existing = acc.find((d) => d.date === item.date);
    if (existing) {
      existing.value = (existing.value + item.value) / 2;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, [] as ChartData[]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={groupedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          tickFormatter={(value) => value.slice(5)}
        />
        <YAxis
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          domain={[0, 15]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
          formatter={(value: number) => [`${value} mmol/L`, "血糖值"]}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--primary))", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
