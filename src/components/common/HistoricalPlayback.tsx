import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import Badge from './Badge';
import { Event } from '../../types';

interface PlaybackData {
  time: string;
  events: Event[];
}

interface HistoricalPlaybackProps {
  onClose: () => void;
}

export default function HistoricalPlayback({ onClose }: HistoricalPlaybackProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentHour, setCurrentHour] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackData, setPlaybackData] = useState<PlaybackData[]>([]);

  const generatePlaybackData = useCallback((date: Date) => {
    const data: PlaybackData[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const events: Event[] = [];
      const eventCount = Math.floor(Math.random() * 5) + 2;
      for (let i = 0; i < eventCount; i++) {
        const types: Event['type'][] = ['traffic', 'pipeline', 'environment', 'safety', 'other'];
        const statuses: Event['status'][] = ['pending', 'processing', 'resolved', 'closed'];
        const levels: Event['level'][] = ['low', 'medium', 'high', 'critical'];

        events.push({
          id: `playback-${hour}-${i}`,
          title: `历史事件 ${hour}:00 - ${i + 1}`,
          type: types[Math.floor(Math.random() * types.length)],
          level: levels[Math.floor(Math.random() * levels.length)],
          street: ['南京东路', '淮海中路', '延安路', '西藏路'][Math.floor(Math.random() * 4)],
          position: { lat: 31.23 + Math.random() * 0.05, lng: 121.47 + Math.random() * 0.05 },
          description: `模拟事件描述 ${hour}:00`,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          reporter: '系统自动生成',
          createTime: `${date.toISOString().slice(0, 10)} ${hour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00`,
          updateTime: `${date.toISOString().slice(0, 10)} ${hour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00`,
          progress: Math.floor(Math.random() * 100),
          records: [],
        });
      }
      data.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        events,
      });
    }
    return data;
  }, []);

  useEffect(() => {
    setPlaybackData(generatePlaybackData(selectedDate));
  }, [selectedDate, generatePlaybackData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentHour((prev) => {
          if (prev >= 23) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentData = playbackData[currentHour] || { time: '00:00', events: [] };

  const goToPrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
    setCurrentHour(0);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
    setCurrentHour(0);
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
      <div className="bg-[var(--color-bg-card)] rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h3 className="font-semibold">历史回放</h3>
          <button onClick={onClose} className="p-2 hover:bg-[var(--color-bg-hover)] rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={goToPrevDay}
              icon={<ChevronLeft className="w-4 h-4" />}
            >
              上一天
            </Button>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[var(--color-text-secondary)]" />
              <input
                type="date"
                value={selectedDate.toISOString().slice(0, 10)}
                onChange={(e) => {
                  setSelectedDate(new Date(e.target.value));
                  setCurrentHour(0);
                }}
                className="px-4 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg"
              />
            </div>
            <Button
              variant="ghost"
              onClick={goToNextDay}
              disabled={isToday}
              icon={<ChevronRight className="w-4 h-4" />}
            >
              下一天
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              icon={<SkipBack className="w-4 h-4" />}
              onClick={() => setCurrentHour(0)}
            >
              起始
            </Button>
            <Button
              variant="ghost"
              icon={<SkipForward className="w-4 h-4" />}
              onClick={() => setCurrentHour(23)}
            >
              末尾
            </Button>
            <Button
              variant={isPlaying ? 'danger' : 'primary'}
              icon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? '暂停' : '播放'}
            </Button>
          </div>
        </div>

        <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-dark)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--color-text-secondary)]">
              时间轴 - {currentHour.toString().padStart(2, '0')}:00
            </span>
            <span className="text-sm text-[var(--color-accent)]">
              {currentData.events.length} 个事件
            </span>
          </div>
          <div className="flex gap-1">
            {playbackData.map((data, index) => (
              <button
                key={index}
                onClick={() => setCurrentHour(index)}
                className={`flex-1 h-8 rounded transition-colors ${
                  currentHour === index
                    ? 'bg-[var(--color-accent)]'
                    : data.events.length > 3
                    ? 'bg-red-500/50'
                    : data.events.length > 0
                    ? 'bg-yellow-500/50'
                    : 'bg-green-500/30'
                } hover:opacity-80`}
                title={`${data.time} - ${data.events.length}个事件`}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <h4 className="font-semibold mb-4">
            {currentData.time} 事件列表 ({currentData.events.length}个)
          </h4>
          <div className="space-y-3">
            {currentData.events.map((event) => (
              <Card key={event.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium">{event.title}</h5>
                    <Badge status={event.level} size="sm" />
                    <Badge status={event.status} size="sm" />
                  </div>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {event.createTime}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                  {event.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    地点: {event.street}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      进度: {event.progress}%
                    </span>
                    <div className="w-20 h-1.5 bg-[var(--color-bg-dark)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-accent)]"
                        style={{ width: `${event.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
