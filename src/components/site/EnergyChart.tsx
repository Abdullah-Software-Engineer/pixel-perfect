import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import { useTheme } from 'next-themes';
import { useAppSelector } from '@/store/hooks';

export function EnergyChart() {
  const { energyStats, totalEnergy, solarTotal, gridTotal } = useAppSelector(state => state.site);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const chartOption = useMemo(() => ({
    backgroundColor: 'transparent',
    animation: true,
    animationDuration: 500,
    title: {
      text: `Total Energy - ${totalEnergy} (KWh)`,
      left: 'center',
      top: 10,
      textStyle: {
        color: isDark ? '#f9fafb' : '#111827',
        fontSize: 16,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      textStyle: { color: isDark ? '#f9fafb' : '#111827' },
      formatter: (params: any) => {
        const date = params[0]?.axisValue || '';
        const solar = params[0]?.value || 0;
        const grid = params[1]?.value || 0;
        return `
          <div class="font-mono text-sm">
            <div class="mb-1 font-medium">${date}</div>
            <div style="color: #f97316">Solar: ${solar.toFixed(2)} KWh</div>
            <div style="color: #22c55e">Grid: ${grid.toFixed(2)} KWh</div>
          </div>
        `;
      },
    },
    legend: {
      data: [`Solar - ${solarTotal.toFixed(2)} KWh`, `Grid - ${gridTotal.toFixed(2)} KWh`],
      bottom: 10,
      textStyle: { color: isDark ? '#9ca3af' : '#6b7280' },
      itemGap: 24,
    },
    grid: {
      top: 60,
      right: 20,
      bottom: 60,
      left: 50,
    },
    xAxis: {
      type: 'category',
      data: energyStats.map(d => d.date),
      axisLine: { lineStyle: { color: isDark ? '#374151' : '#d1d5db' } },
      axisLabel: { 
        color: isDark ? '#9ca3af' : '#6b7280', 
        fontSize: 10,
        rotate: 45,
        interval: 2,
      },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      name: 'Energy (KWh)',
      nameTextStyle: { color: isDark ? '#9ca3af' : '#6b7280' },
      axisLine: { lineStyle: { color: isDark ? '#374151' : '#d1d5db' } },
      axisLabel: { color: isDark ? '#9ca3af' : '#6b7280', fontSize: 11 },
      splitLine: { lineStyle: { color: isDark ? '#374151' : '#e5e7eb', type: 'dashed' } },
    },
    series: [
      {
        name: `Solar - ${solarTotal.toFixed(2)} KWh`,
        type: 'bar',
        stack: 'total',
        data: energyStats.map(d => d.solar),
        itemStyle: {
          color: '#f97316',
          borderRadius: [0, 0, 0, 0],
        },
        emphasis: {
          itemStyle: {
            color: '#fb923c',
          },
        },
      },
      {
        name: `Grid - ${gridTotal.toFixed(2)} KWh`,
        type: 'bar',
        stack: 'total',
        data: energyStats.map(d => d.grid),
        itemStyle: {
          color: '#22c55e',
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: {
          itemStyle: {
            color: '#4ade80',
          },
        },
      },
    ],
  }), [energyStats, totalEnergy, solarTotal, gridTotal, isDark]);

  return (
    <div className="glass-panel p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-foreground">Energy Report 1.0</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded bg-secondary">Energy Report</span>
          <span className="px-2 py-1 rounded bg-secondary/50">Reporting Anomalies</span>
          <span className="font-mono">2025-11-08 ~ 2025-12-08</span>
        </div>
      </div>

      <div className="h-[350px]">
        <ReactECharts
          option={chartOption}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    </div>
  );
}
