import { MapPin, Video, Car, Droplets, Wind, Clock, AlertCircle, User, Phone, Navigation } from 'lucide-react';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import { MonitorPoint, Event } from '../../types';

interface PointDetailPanelProps {
  point: MonitorPoint;
  nearbyPoints: MonitorPoint[];
  relatedEvents: Event[];
  onEventClick: (eventId: string) => void;
  onLocateEvent: (event: Event) => void;
  onClose: () => void;
}

export default function PointDetailPanel({
  point,
  nearbyPoints,
  relatedEvents,
  onEventClick,
  onLocateEvent,
  onClose,
}: PointDetailPanelProps) {
  const getTypeIcon = (type: MonitorPoint['type']) => {
    switch (type) {
      case 'traffic':
        return <Car className="w-5 h-5 text-blue-400" />;
      case 'video':
        return <Video className="w-5 h-5 text-purple-400" />;
      case 'pipeline':
        return <Droplets className="w-5 h-5 text-cyan-400" />;
      case 'environment':
        return <Wind className="w-5 h-5 text-green-400" />;
      default:
        return <MapPin className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTypeName = (type: MonitorPoint['type']) => {
    switch (type) {
      case 'traffic':
        return '交通监控';
      case 'video':
        return '视频监控';
      case 'pipeline':
        return '管网监测';
      case 'environment':
        return '环境监测';
      default:
        return '未知';
    }
  };

  return (
    <div className="absolute top-4 right-4 w-96 max-h-[calc(100%-2rem)] bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] shadow-xl overflow-hidden flex flex-col">
      <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between bg-gradient-to-r from-[var(--color-accent)]/10 to-transparent">
        <div className="flex items-center gap-3">
          {getTypeIcon(point.type)}
          <div>
            <h3 className="font-bold text-lg">{point.name}</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">{getTypeName(point.type)}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          关闭
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[var(--color-bg-dark)] rounded-lg">
              <p className="text-xs text-[var(--color-text-secondary)] mb-1">状态</p>
              <Badge status={point.status} />
            </div>
            <div className="p-3 bg-[var(--color-bg-dark)] rounded-lg">
              <p className="text-xs text-[var(--color-text-secondary)] mb-1">坐标</p>
              <p className="text-sm font-mono">
                {point.position.lat.toFixed(4)}, {point.position.lng.toFixed(4)}
              </p>
            </div>
          </div>

          <div className="p-3 bg-[var(--color-bg-dark)] rounded-lg">
            <p className="text-xs text-[var(--color-text-secondary)] mb-2">监测数据</p>
            <div className="space-y-1 text-sm">
              {Object.entries(point.data).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">{key}</span>
                  <span className="font-mono">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-[var(--color-bg-dark)] rounded-lg">
            <p className="text-xs text-[var(--color-text-secondary)] mb-2 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              最后更新: {new Date(point.lastUpdate).toLocaleTimeString()}
            </p>
          </div>

          {nearbyPoints.length > 1 && (
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                <Navigation className="w-4 h-4" />
                周边监控点 ({nearbyPoints.length - 1})
              </h4>
              <div className="space-y-2">
                {nearbyPoints
                  .filter((p) => p.id !== point.id)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-2 bg-[var(--color-bg-dark)] rounded-lg flex items-center justify-between hover:bg-[var(--color-bg-hover)] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {getTypeIcon(p.type)}
                        <span className="text-sm">{p.name}</span>
                      </div>
                      <Badge status={p.status} size="sm" />
                    </div>
                  ))}
              </div>
            </div>
          )}

          {relatedEvents.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-red-400" />
                关联事件 ({relatedEvents.length})
              </h4>
              <div className="space-y-2">
                {relatedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg cursor-pointer hover:bg-red-500/20 transition-colors"
                    onClick={() => onEventClick(event.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-sm">{event.title}</span>
                      <Badge status={event.level} size="sm" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--color-text-secondary)]">{event.street}</span>
                      <div className="flex items-center gap-2">
                        <Badge status={event.status} size="sm" />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onLocateEvent(event);
                          }}
                        >
                          定位
                        </Button>
                      </div>
                    </div>
                    {event.dispatch && (
                      <div className="mt-2 pt-2 border-t border-red-500/20">
                        <div className="flex items-center gap-2 text-xs">
                          <User className="w-3 h-3" />
                          <span>{event.dispatch.responsiblePerson}</span>
                          <span className="text-[var(--color-text-secondary)]">·</span>
                          <span>{event.dispatch.department}</span>
                        </div>
                        {event.dispatch.isTimeout && (
                          <p className="text-xs text-red-400 mt-1">⚠️ 已超时</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            variant="primary"
            className="w-full"
            icon={<Phone className="w-4 h-4" />}
          >
            联系值班中心
          </Button>
        </div>
      </div>
    </div>
  );
}
