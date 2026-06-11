import { useState } from 'react';
import { Layers, Star, Camera, Eye, EyeOff } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { favoriteAreas, monitorPoints, trafficData, pipelineData, environmentData } from '../../services/mockData';

export default function Map() {
  const [activeLayers, setActiveLayers] = useState({
    traffic: true,
    pipeline: true,
    environment: true,
    video: true,
  });
  const [favorites, setFavorites] = useState(favoriteAreas);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const filteredPoints = monitorPoints.filter((point) => {
    if (point.type === 'traffic' && !activeLayers.traffic) return false;
    if (point.type === 'pipeline' && !activeLayers.pipeline) return false;
    if (point.type === 'environment' && !activeLayers.environment) return false;
    if (point.type === 'video' && !activeLayers.video) return false;
    return true;
  });

  return (
    <div className="h-full flex gap-6 animate-fade-in">
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,212,255,0.1)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-center">
              <div className="text-8xl font-bold text-[var(--color-accent)] opacity-20 mb-2">3D</div>
              <p className="text-[var(--color-text-secondary)]">三维地图展示区域</p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                使用 Three.js 渲染三维城市模型
              </p>
            </div>
          </div>

          {filteredPoints.map((point, index) => (
            <div
              key={point.id}
              className={`
                absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer
                transition-all duration-300 hover:scale-125
                ${selectedPoint === point.id ? 'scale-125' : ''}
              `}
              style={{
                left: `${20 + (index * 15)}%`,
                top: `${30 + (index * 10)}%`,
              }}
              onClick={() => setSelectedPoint(point.id)}
            >
              <div className={`
                w-4 h-4 rounded-full border-2 border-white shadow-lg
                ${point.status === 'normal' ? 'bg-green-500' : ''}
                ${point.status === 'warning' ? 'bg-yellow-500 animate-pulse' : ''}
                ${point.status === 'error' ? 'bg-red-500 animate-pulse' : ''}
                ${point.status === 'offline' ? 'bg-gray-500' : ''}
              `}>
                <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-inherit" />
              </div>
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <div className="bg-[var(--color-bg-card)] px-2 py-1 rounded text-xs shadow-lg">
                  {point.name}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-6 left-6 bg-[var(--color-bg-card)] rounded-lg p-4 border border-[var(--color-border)]">
          <h3 className="text-sm font-semibold mb-3">图例</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-[var(--color-text-secondary)]">正常</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs text-[var(--color-text-secondary)]">警告</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-[var(--color-text-secondary)]">异常</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span className="text-xs text-[var(--color-text-secondary)]">离线</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-80 space-y-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Layers className="w-5 h-5" />
              图层控制
            </h3>
          </div>
          <div className="space-y-3">
            {Object.entries(activeLayers).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm capitalize">{key === 'video' ? '视频监控' : key === 'traffic' ? '交通' : key === 'pipeline' ? '管网' : '环境'}</span>
                <button
                  onClick={() => toggleLayer(key as keyof typeof activeLayers)}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${value ? 'bg-[var(--color-accent)] bg-opacity-20 text-[var(--color-accent)]' : 'bg-[var(--color-bg-dark)] text-[var(--color-text-secondary)]'}
                  `}
                >
                  {value ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 text-[var(--color-warning)]" />
              重点区域
            </h3>
            <Button size="sm" variant="ghost" icon={<Star className="w-4 h-4" />}>
              添加
            </Button>
          </div>
          <div className="space-y-2">
            {favorites.map((area) => (
              <div
                key={area.id}
                className="p-3 bg-[var(--color-bg-dark)] rounded-lg hover:bg-[var(--color-bg-hover)] cursor-pointer transition-colors"
              >
                <p className="font-medium text-sm">{area.name}</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  缩放: {area.zoom}x
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Camera className="w-5 h-5" />
              截图标注
            </h3>
          </div>
          <Button className="w-full" icon={<Camera className="w-4 h-4" />}>
            截图
          </Button>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">交通概况</h3>
          <div className="space-y-3">
            {trafficData.slice(0, 3).map((road) => (
              <div key={road.roadId} className="flex items-center justify-between">
                <span className="text-sm">{road.roadName}</span>
                <Badge status={road.congestionLevel} size="sm" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">管网状态</h3>
          <div className="space-y-3">
            {pipelineData.slice(0, 3).map((node) => (
              <div key={node.nodeId} className="flex items-center justify-between">
                <span className="text-sm">{node.nodeName}</span>
                <Badge status={node.hasAnomaly ? 'error' : 'normal'} size="sm" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
