import { useState, useRef } from 'react';
import { Layers, Star, Camera, Eye, EyeOff, Monitor } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import CityScene from '../../components/map/CityScene';
import ScreenshotAnnotation from '../../components/common/ScreenshotAnnotation';
import { favoriteAreas, monitorPoints, trafficData, pipelineData } from '../../services/mockData';

export default function Map() {
  const [activeLayers, setActiveLayers] = useState({
    traffic: true,
    pipeline: true,
    environment: true,
    video: true,
  });
  const [favorites, setFavorites] = useState(favoriteAreas);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [showScreenshot, setShowScreenshot] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

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
    <div className="h-full flex gap-6 animate-fade-in" ref={mapContainerRef}>
      <div className="flex-1 relative rounded-lg overflow-hidden">
        <CityScene
          points={filteredPoints}
          selectedPoint={selectedPoint}
          onPointClick={setSelectedPoint}
        />

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

        <div className="absolute top-6 left-6 bg-[var(--color-bg-card)] rounded-lg p-4 border border-[var(--color-border)]">
          <h3 className="text-sm font-semibold mb-2">操作提示</h3>
          <div className="text-xs text-[var(--color-text-secondary)] space-y-1">
            <p>🖱️ 左键拖拽 - 旋转视角</p>
            <p>🖱️ 右键拖拽 - 平移视图</p>
            <p>🔍 滚轮 - 缩放地图</p>
            <p>点击标记点 - 查看详情</p>
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
            {[
              { key: 'traffic' as const, label: '交通监控', icon: '🚗' },
              { key: 'pipeline' as const, label: '管网监测', icon: '🔧' },
              { key: 'environment' as const, label: '环境监测', icon: '🌿' },
              { key: 'video' as const, label: '视频监控', icon: '📹' },
            ].map(({ key, label, icon }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <span>{icon}</span> {label}
                </span>
                <button
                  onClick={() => toggleLayer(key)}
                  className={`
                    p-2 rounded-lg transition-colors flex items-center gap-1 text-xs
                    ${activeLayers[key] ? 'bg-[var(--color-accent)] bg-opacity-20 text-[var(--color-accent)]' : 'bg-[var(--color-bg-dark)] text-[var(--color-text-secondary)]'}
                  `}
                >
                  {activeLayers[key] ? (
                    <>
                      <Eye className="w-4 h-4" /> 显示
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4" /> 隐藏
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 p-2 bg-[var(--color-bg-dark)] rounded text-xs text-[var(--color-text-secondary)]">
            当前可见点位: {filteredPoints.length} 个
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
          <Button
            className="w-full"
            icon={<Camera className="w-4 h-4" />}
            onClick={() => setShowScreenshot(true)}
          >
            截取当前画面
          </Button>
          <p className="text-xs text-[var(--color-text-secondary)] mt-2">
            截取后可添加文字或图形标注并下载
          </p>
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

      {showScreenshot && (
        <ScreenshotAnnotation
          targetRef={mapContainerRef}
          onClose={() => setShowScreenshot(false)}
        />
      )}
    </div>
  );
}
