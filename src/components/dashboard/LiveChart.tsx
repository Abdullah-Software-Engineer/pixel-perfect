import ReactECharts from 'echarts-for-react';
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLivePowerData, startPolling, stopPolling } from '@/store/slices/powerSlice';
import { usePolling } from '@/hooks/usePolling';
import { Button } from '@/components/ui/button';
import { Play, Square, Zap, Activity } from 'lucide-react';

export function LiveChart() {
  const dispatch = useAppDispatch();
  const { chartData, isPolling, currentPower, loading } = useAppSelector(state => state.power);

  const fetchData = useCallback(async () => {
    await dispatch(fetchLivePowerData());
  }, [dispatch]);

  const { startPolling: start, stopPolling: stop } = usePolling(fetchData, {
    interval: 60000, // 60 seconds as per requirements
    immediate: true,
  });

  const handleStart = () => {
    dispatch(startPolling());
    start();
  };

  const handleStop = () => {
    dispatch(stopPolling());
    stop();
  };

  // Auto-start on mount
  useEffect(() => {
    handleStart();
    return () => {
      handleStop();
    };
  }, []);

  const chartOption = {
    backgroundColor: 'transparent',
    animation: true,
    animationDuration: 300,
    grid: {
      top: 30,
      right: 20,
      bottom: 30,
      left: 50,
    },
    xAxis: {
      type: 'category',
      data: chartData.map((_, i) => i),
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      min: -150,
      max: 150,
      interval: 50,
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#9ca3af', fontSize: 11 },
      splitLine: { lineStyle: { color: '#374151', type: 'solid' } },
    },
    series: [
      {
        name: 'Active Power',
        type: 'line',
        data: chartData.map(d => d.activePower.toFixed(2)),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: '#ef4444',
          width: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(239, 68, 68, 0.3)' },
              { offset: 1, color: 'rgba(239, 68, 68, 0)' },
            ],
          },
        },
      },
      {
        name: 'Reactive Power',
        type: 'line',
        data: chartData.map(d => d.reactivePower.toFixed(2)),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: '#3b82f6',
          width: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.2)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0)' },
            ],
          },
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      borderColor: '#374151',
      textStyle: { color: '#f9fafb' },
      formatter: (params: any) => {
        const active = params[0]?.value || 0;
        const reactive = params[1]?.value || 0;
        return `
          <div class="font-mono text-sm">
            <div style="color: #ef4444">Active: ${active} kW</div>
            <div style="color: #3b82f6">Reactive: ${reactive} kVAR</div>
          </div>
        `;
      },
    },
  };

  return (
    <div className="glass-panel p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">Live Chart</h2>
          {isPolling && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-chart-live/20 text-chart-live text-xs font-medium animate-pulse-glow">
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              LIVE
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-chart-live" />
              <span className="text-muted-foreground">Active:</span>
              <span className="font-mono font-medium text-foreground">
                {currentPower.active.toFixed(2)} kW
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Reactive:</span>
              <span className="font-mono font-medium text-foreground">
                {currentPower.reactive.toFixed(2)} kVAR
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[280px]">
        <ReactECharts
          option={chartOption}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>

      <div className="flex items-center gap-3 mt-4">
        <Button
          variant={isPolling ? 'secondary' : 'default'}
          size="sm"
          onClick={handleStart}
          disabled={isPolling || loading}
          className="gap-2"
        >
          <Play className="w-4 h-4" />
          Start
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleStop}
          disabled={!isPolling}
          className="gap-2"
        >
          <Square className="w-4 h-4" />
          Stop
        </Button>
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          {chartData.length}/100 points
        </span>
      </div>
    </div>
  );
}
