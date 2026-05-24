import { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface ChartData {
  date: string;
  value: number;
}

interface EChartsBloodSugarChartProps {
  data: ChartData[];
}

type TooltipParam = {
  axisValueLabel?: string;
  value?: number | string | null;
};

const isChartData = (item: ChartData | null): item is ChartData => item !== null;

export const EChartsBloodSugarChart = ({ data }: EChartsBloodSugarChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // 清除之前的实例
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    chartInstance.current = echarts.init(chartRef.current);

    // 如果没有数据，显示空图表
    if (!data || data.length === 0) {
      const emptyOption = {
        grid: { left: '10%', right: '10%', bottom: '15%', top: '10%', containLabel: true },
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value', min: 0, max: 15 },
        series: [{ type: 'line', data: [] }]
      };
      chartInstance.current.setOption(emptyOption);
      return;
    }

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

    // Sort by date
    groupedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 确保数据中没有null或undefined值，并转换单位
    const cleanData = groupedData.map(item => {
      let value = Number(item.value);

      // 如果数值大于20，假设是mg/dL单位，转换为mmol/L（除以18）
      if (value > 20) {
        value = value / 18;
      }

      // 确保值在合理范围内（2-30 mmol/L）
      if (value < 2 || value > 30) {
        return null;
      }

      return {
        date: item.date,
        value: isNaN(value) ? null : parseFloat(value.toFixed(1))
      };
    }).filter(isChartData);

    // 图表配置
    const option = {
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        top: '10%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: unknown) => {
          const points = Array.isArray(params) ? (params as TooltipParam[]) : [params as TooltipParam];
          const point = points[0];
          return `${point?.axisValueLabel ?? ""}<br/>血糖值: ${point?.value ?? "-"} mmol/L`;
        }
      },
      xAxis: {
        type: 'category',
        data: cleanData.map(item => item.date.slice(5)), // Show MM-DD
        axisLabel: { color: '#6b7280', fontSize: 12 }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 20,
        axisLabel: {
          color: '#6b7280',
          fontSize: 12,
          formatter: '{value}'
        },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: '血糖值',
          type: 'bar',
          data: cleanData.map(item => item.value),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#3b82f6' },
                { offset: 1, color: '#60a5fa' }
              ]
            },
            borderRadius: [4, 4, 0, 0]
          },
          barWidth: '60%'
        }
      ]
    };

    chartInstance.current.setOption(option);

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [data]);

  return (
    <div
      ref={chartRef}
      style={{
        width: '100%',
        height: '200px',
        display: 'block'
      }}
    />
  );
};
