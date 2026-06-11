import { useState } from 'react';
import { Search, Filter, Clock, User, MapPin, AlertCircle } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { events, streets } from '../../services/mockData';

export default function Events() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStreet, setSelectedStreet] = useState('全部街道');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStreet =
      selectedStreet === '全部街道' || event.street === selectedStreet;
    const matchesType = selectedType === 'all' || event.type === selectedType;
    return matchesSearch && matchesStreet && matchesType;
  });

  const eventStats = {
    pending: events.filter((e) => e.status === 'pending').length,
    processing: events.filter((e) => e.status === 'processing').length,
    resolved: events.filter((e) => e.status === 'resolved').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">事件</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            事件处置与进度跟踪
          </p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-400">待处理</p>
            <p className="text-2xl font-bold text-blue-400">{eventStats.pending}</p>
          </div>
          <div className="px-4 py-2 bg-yellow-500/20 rounded-lg">
            <p className="text-xs text-yellow-400">处理中</p>
            <p className="text-2xl font-bold text-yellow-400">{eventStats.processing}</p>
          </div>
          <div className="px-4 py-2 bg-green-500/20 rounded-lg">
            <p className="text-xs text-green-400">已解决</p>
            <p className="text-2xl font-bold text-green-400">{eventStats.resolved}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索事件..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              <select
                value={selectedStreet}
                onChange={(e) => setSelectedStreet(e.target.value)}
                className="px-4 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)]"
              >
                {streets.map((street) => (
                  <option key={street} value={street}>
                    {street}
                  </option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)]"
              >
                <option value="all">全部类型</option>
                <option value="traffic">交通</option>
                <option value="pipeline">管网</option>
                <option value="environment">环境</option>
                <option value="safety">安全</option>
                <option value="other">其他</option>
              </select>
            </div>
            <Button icon={<Filter className="w-4 h-4" />}>筛选</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="p-4 bg-[var(--color-bg-dark)] rounded-lg hover:bg-[var(--color-bg-hover)] cursor-pointer transition-colors border border-transparent hover:border-[var(--color-accent)]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <AlertCircle className={`w-5 h-5 ${
                      event.level === 'critical' ? 'text-red-400' :
                      event.level === 'high' ? 'text-orange-400' :
                      event.level === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                    }`} />
                    <div>
                      <h3 className="font-medium mb-1">{event.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.street}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.createTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge status={event.level} />
                    <Badge status={event.status} />
                  </div>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                  {event.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-[var(--color-text-secondary)]">
                      报告人: {event.reporter}
                    </span>
                    {event.handler && (
                      <span className="text-[var(--color-text-secondary)] flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {event.handler}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      进度: {event.progress}%
                    </span>
                    <div className="w-24 h-2 bg-[var(--color-bg-card)] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          event.status === 'resolved' || event.status === 'closed'
                            ? 'bg-green-500'
                            : 'bg-[var(--color-accent)]'
                        }`}
                        style={{ width: `${event.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6" onClick={() => setSelectedEvent(null)}>
          <div className="bg-[var(--color-bg-card)] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[var(--color-border)]">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">{selectedEvent.title}</h2>
                  <div className="flex items-center gap-2">
                    <Badge status={selectedEvent.level} />
                    <Badge status={selectedEvent.status} />
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedEvent(null)}>关闭</Button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">事件描述</h3>
                <p className="text-[var(--color-text-primary)]">{selectedEvent.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">发生地点</h3>
                  <p className="text-[var(--color-text-primary)]">{selectedEvent.street}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">发生时间</h3>
                  <p className="text-[var(--color-text-primary)]">{selectedEvent.createTime}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">报告人</h3>
                  <p className="text-[var(--color-text-primary)]">{selectedEvent.reporter}</p>
                </div>
                {selectedEvent.handler && (
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">处理人</h3>
                    <p className="text-[var(--color-text-primary)]">{selectedEvent.handler}</p>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">处置进度</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-[var(--color-bg-dark)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-accent)] transition-all duration-300"
                      style={{ width: `${selectedEvent.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono">{selectedEvent.progress}%</span>
                </div>
              </div>
              {selectedEvent.records.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">处置记录</h3>
                  <div className="space-y-3">
                    {selectedEvent.records.map((record) => (
                      <div key={record.id} className="p-3 bg-[var(--color-bg-dark)] rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{record.operator}</span>
                          <span className="text-xs text-[var(--color-text-secondary)]">{record.createTime}</span>
                        </div>
                        <p className="text-sm text-[var(--color-accent)] mb-1">{record.action}</p>
                        {record.remark && (
                          <p className="text-xs text-[var(--color-text-secondary)]">{record.remark}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="primary" className="flex-1">处理</Button>
                <Button variant="secondary" className="flex-1">导出</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
