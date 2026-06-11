import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Monitor } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { coreMetrics, updateCoreMetrics } from '../../services/mockData';
import Carousel from '../../components/common/Carousel';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  icon: React.ReactNode;
  color: string;
}

function MetricCard({ title, value, unit, trend, trendValue, icon, color }: MetricCardProps) {
  const trendIcon = {
    up: <TrendingUp className="w-4 h-4 text-green-400" />,
    down: <TrendingDown className="w-4 h-4 text-red-400" />,
    stable: <Minus className="w-4 h-4 text-gray-400" />,
  };

  return (
    <Card className="p-6 relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)] mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-[var(--color-text-primary)]">
              {value}
            </span>
            <span className="text-sm text-[var(--color-text-secondary)]">{unit}</span>
          </div>
        </div>
        <div className={`${color} p-3 rounded-lg`}>{icon}</div>
      </div>
      {trend && trendValue && (
        <div className="flex items-center gap-2 text-sm">
          {trendIcon[trend]}
          <span className="text-[var(--color-text-secondary)]">{trendValue}</span>
        </div>
      )}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${color.replace('bg-', 'bg-').replace('/20', '')}`} />
    </Card>
  );
}

export default function Overview() {
  const [metrics, setMetrics] = useState(coreMetrics);
  const [showCarousel, setShowCarousel] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => updateCoreMetrics(prev));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">总览</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            城区运行态势实时监控
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse" />
          <span className="text-sm text-[var(--color-text-secondary)]">
            最后更新: {new Date().toLocaleTimeString()}
          </span>
          <Button
            variant="secondary"
            size="sm"
            icon={<Monitor className="w-4 h-4" />}
            onClick={() => setShowCarousel(true)}
            className="ml-4"
          >
            大屏轮播
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="今日交通流量"
          value={metrics.trafficFlow.toLocaleString()}
          unit="辆"
          trend="up"
          trendValue="较昨日 +12%"
          icon={<TrendingUp className="w-6 h-6" />}
          color="bg-blue-500/20"
        />
        <MetricCard
          title="管网压力指数"
          value={metrics.pipelinePressure}
          unit="MPa"
          trend="stable"
          trendValue="运行正常"
          icon={<TrendingUp className="w-6 h-6" />}
          color="bg-green-500/20"
        />
        <MetricCard
          title="空气质量指数"
          value={metrics.airQuality}
          unit="AQI"
          trend="down"
          trendValue="较昨日 -8%"
          icon={<TrendingUp className="w-6 h-6" />}
          color="bg-cyan-500/20"
        />
        <MetricCard
          title="进行中事件"
          value={metrics.activeEvents}
          unit="件"
          trend="up"
          trendValue="较昨日 +3"
          icon={<TrendingUp className="w-6 h-6" />}
          color="bg-orange-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            全局态势分布
          </h2>
          <div className="h-80 bg-[var(--color-bg-dark)] rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[var(--color-accent)] rounded-full blur-3xl" />
              <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-green-500 rounded-full blur-3xl" />
              <div className="absolute top-1/2 right-1/4 w-36 h-36 bg-orange-500 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 text-center">
              <div className="text-6xl font-bold text-[var(--color-accent)] mb-2">
                {metrics.onlineMonitors}
                <span className="text-2xl text-[var(--color-text-secondary)]">
                  /{metrics.totalMonitors}
                </span>
              </div>
              <p className="text-[var(--color-text-secondary)]">监控点位在线率</p>
              <p className="text-3xl font-bold text-[var(--color-success)] mt-4">
                {((metrics.onlineMonitors / metrics.totalMonitors) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            快速统计
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[var(--color-bg-dark)] rounded-lg">
              <span className="text-sm text-[var(--color-text-secondary)]">正常区域</span>
              <span className="text-lg font-bold text-[var(--color-success)]">156</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--color-bg-dark)] rounded-lg">
              <span className="text-sm text-[var(--color-text-secondary)]">关注区域</span>
              <span className="text-lg font-bold text-[var(--color-warning)]">23</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--color-bg-dark)] rounded-lg">
              <span className="text-sm text-[var(--color-text-secondary)]">异常区域</span>
              <span className="text-lg font-bold text-[var(--color-danger)]">5</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--color-bg-dark)] rounded-lg">
              <span className="text-sm text-[var(--color-text-secondary)]">今日处置</span>
              <span className="text-lg font-bold text-[var(--color-accent)]">89</span>
            </div>
          </div>
        </Card>
      </div>

      {showCarousel && <Carousel onClose={() => setShowCarousel(false)} />}
    </div>
  );
}
