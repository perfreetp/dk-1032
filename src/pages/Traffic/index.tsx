import { useState } from 'react';
import { Search, Car, Bus, AlertTriangle } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { trafficData, busArrivals } from '../../services/mockData';

export default function Traffic() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCongestion, setSelectedCongestion] = useState<string>('all');

  const filteredTraffic = trafficData.filter((road) => {
    const matchesSearch = road.roadName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCongestion = selectedCongestion === 'all' || road.congestionLevel === selectedCongestion;
    return matchesSearch && matchesCongestion;
  });

  const congestionStats = {
    smooth: trafficData.filter((r) => r.congestionLevel === 'smooth').length,
    slow: trafficData.filter((r) => r.congestionLevel === 'slow').length,
    congested: trafficData.filter((r) => r.congestionLevel === 'congested').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">交通</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            实时路况监控与交通事件管理
          </p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-green-500/20 rounded-lg">
            <p className="text-xs text-green-400">畅通</p>
            <p className="text-2xl font-bold text-green-400">{congestionStats.smooth}</p>
          </div>
          <div className="px-4 py-2 bg-yellow-500/20 rounded-lg">
            <p className="text-xs text-yellow-400">缓慢</p>
            <p className="text-2xl font-bold text-yellow-400">{congestionStats.slow}</p>
          </div>
          <div className="px-4 py-2 bg-red-500/20 rounded-lg">
            <p className="text-xs text-red-400">拥堵</p>
            <p className="text-2xl font-bold text-red-400">{congestionStats.congested}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Car className="w-5 h-5" />
                路况监控
              </h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索道路..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>
                <select
                  value={selectedCongestion}
                  onChange={(e) => setSelectedCongestion(e.target.value)}
                  className="px-4 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)]"
                >
                  <option value="all">全部</option>
                  <option value="smooth">畅通</option>
                  <option value="slow">缓慢</option>
                  <option value="congested">拥堵</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTraffic.map((road) => (
                  <div
                    key={road.roadId}
                    className="p-4 bg-[var(--color-bg-dark)] rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{road.roadName}</h3>
                        <Badge status={road.congestionLevel} />
                      </div>
                      <span className="text-xs text-[var(--color-text-secondary)]">
                        更新: {new Date(road.updateTime).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-[var(--color-text-secondary)]">车流量</p>
                        <p className="text-lg font-mono font-bold">{road.vehicleCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--color-text-secondary)]">平均车速</p>
                        <p className="text-lg font-mono font-bold">{road.averageSpeed} km/h</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--color-text-secondary)]">拥堵指数</p>
                        <p className={`text-lg font-mono font-bold ${
                          road.congestionLevel === 'congested' ? 'text-red-400' :
                          road.congestionLevel === 'slow' ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {road.congestionLevel === 'congested' ? '高' : road.congestionLevel === 'slow' ? '中' : '低'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                交通事件
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-red-400">延安路高架事故</span>
                    <Badge status="critical" />
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                    延安路高架西向东方向发生两车追尾,占用右侧车道
                  </p>
                  <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                    <span>发生时间: 08:30</span>
                    <span>持续时间: 45分钟</span>
                    <span>影响范围: 2km</span>
                  </div>
                </div>
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-yellow-400">淮海路施工</span>
                    <Badge status="high" />
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                    淮海中路道路维修施工,占用左侧车道
                  </p>
                  <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                    <span>开始时间: 07:00</span>
                    <span>预计结束: 18:00</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Bus className="w-5 h-5" />
                公交到站
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {busArrivals.map((bus) => (
                  <div key={bus.lineId} className="p-3 bg-[var(--color-bg-dark)] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{bus.lineName}</span>
                      <span className="text-xs text-[var(--color-text-secondary)]">{bus.stationName}</span>
                    </div>
                    <div className="space-y-2">
                      {bus.arrivals.map((arrival, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-[var(--color-text-secondary)]">班次 {idx + 1}</span>
                          <span className="font-mono text-[var(--color-accent)]">{arrival.arrivalTime}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">重点路段</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {trafficData.slice(0, 4).map((road) => (
                  <div
                    key={road.roadId}
                    className="p-3 bg-[var(--color-bg-dark)] rounded-lg flex items-center justify-between"
                  >
                    <span className="text-sm">{road.roadName}</span>
                    <Badge status={road.congestionLevel} size="sm" />
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4">
                查看全部
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
