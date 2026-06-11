import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, Clock, User, MapPin, AlertCircle, Plus, Save, Navigation, Send, Users } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { streets, departments } from '../../services/mockData';
import { useEventStore } from '../../stores/useEventStore';
import { Event, Dispatch } from '../../types';

export default function Events() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStreet, setSelectedStreet] = useState('全部街道');
  const [selectedType, setSelectedType] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [processAction, setProcessAction] = useState('');
  const [processRemark, setProcessRemark] = useState('');
  const [processProgress, setProcessProgress] = useState(50);
  const [dispatchForm, setDispatchForm] = useState({
    department: '',
    responsiblePerson: '',
    estimatedTime: '',
  });

  const { events, addEventRecord, updateEventStatus, createDispatch, setMapFocusPosition, setFocusedEventId } = useEventStore();

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStreet =
      selectedStreet === '全部街道' || event.street === selectedStreet;
    const matchesType = selectedType === 'all' || event.type === selectedType;

    let matchesDate = true;
    if (dateRange.start || dateRange.end) {
      const eventDate = new Date(event.createTime);
      if (dateRange.start) {
        matchesDate = matchesDate && eventDate >= new Date(dateRange.start);
      }
      if (dateRange.end) {
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && eventDate <= endDate;
      }
    }

    return matchesSearch && matchesStreet && matchesType && matchesDate;
  });

  const eventStats = {
    pending: events.filter((e) => e.status === 'pending').length,
    processing: events.filter((e) => e.status === 'processing').length,
    resolved: events.filter((e) => e.status === 'resolved').length,
    timeout: events.filter((e) => e.dispatch?.isTimeout).length,
  };

  useEffect(() => {
    if (highlightId) {
      const event = events.find((e) => e.id === highlightId);
      if (event) {
        setSelectedEvent(event);
      }
    }
  }, [highlightId, events]);

  useEffect(() => {
    if (selectedEvent) {
      const updatedEvent = events.find((e) => e.id === selectedEvent.id);
      if (updatedEvent) {
        setSelectedEvent(updatedEvent);
      }
    }
  }, [events, selectedEvent?.id]);

  const handleProcess = () => {
    if (!selectedEvent || !processAction) return;

    addEventRecord(selectedEvent.id, {
      operator: '值班人员',
      action: processAction,
      remark: processRemark,
    });

    const newProgress = Math.min(processProgress, 100);
    const newStatus: Event['status'] = newProgress === 100 ? 'resolved' : 'processing';

    updateEventStatus(selectedEvent.id, newStatus, newProgress);

    setShowProcessModal(false);
    setProcessAction('');
    setProcessRemark('');
    setProcessProgress(50);
  };

  const handleDispatch = () => {
    if (!selectedEvent || !dispatchForm.department || !dispatchForm.responsiblePerson || !dispatchForm.estimatedTime) {
      return;
    }

    createDispatch(selectedEvent.id, {
      department: dispatchForm.department,
      responsiblePerson: dispatchForm.responsiblePerson,
      estimatedTime: dispatchForm.estimatedTime,
      status: 'dispatched',
    });

    setShowDispatchModal(false);
    setDispatchForm({ department: '', responsiblePerson: '', estimatedTime: '' });
  };

  const handleLocateOnMap = (event: Event) => {
    setMapFocusPosition(event.position);
    setFocusedEventId(event.id);
    navigate(`/map?event=${event.id}`);
  };

  const getTimeoutStatus = (event: Event) => {
    if (!event.dispatch) return null;
    if (event.dispatch.isTimeout) return '超时';
    const now = new Date();
    const estimated = new Date(event.dispatch.estimatedTime);
    const remaining = estimated.getTime() - now.getTime();
    if (remaining < 0) return '即将超时';
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}小时${minutes}分`;
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
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-400">待处理</p>
            <p className="text-2xl font-bold text-blue-400">{eventStats.pending}</p>
          </div>
          <div className="px-4 py-2 bg-yellow-500/20 rounded-lg">
            <p className="text-xs text-yellow-400">处理中</p>
            <p className="text-2xl font-bold text-yellow-400">{eventStats.processing}</p>
          </div>
          <div className="px-4 py-2 bg-red-500/20 rounded-lg">
            <p className="text-xs text-red-400">超时</p>
            <p className="text-2xl font-bold text-red-400">{eventStats.timeout}</p>
          </div>
          <div className="px-4 py-2 bg-green-500/20 rounded-lg">
            <p className="text-xs text-green-400">已解决</p>
            <p className="text-2xl font-bold text-green-400">{eventStats.resolved}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
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
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                  className="px-3 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)]"
                />
                <span className="text-[var(--color-text-secondary)]">至</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                  className="px-3 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
            </div>
            <Button icon={<Filter className="w-4 h-4" />}>
              筛选 ({filteredEvents.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`p-4 bg-[var(--color-bg-dark)] rounded-lg hover:bg-[var(--color-bg-hover)] cursor-pointer transition-colors border-2 ${
                  highlightId === event.id ? 'border-[var(--color-accent)]' : 'border-transparent'
                }`}
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge status={event.level} />
                    <Badge status={event.status} />
                    {event.dispatch?.isTimeout && (
                      <Badge status="error" label="超时" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                  {event.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs">
                    {event.dispatch ? (
                      <>
                        <span className="text-[var(--color-text-secondary)]">
                          责任人: {event.dispatch.responsiblePerson}
                        </span>
                        <span className="text-[var(--color-text-secondary)]">
                          {event.dispatch.department}
                        </span>
                        {getTimeoutStatus(event) && (
                          <span className={`${event.dispatch.isTimeout ? 'text-red-400' : 'text-yellow-400'}`}>
                            {getTimeoutStatus(event)}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-[var(--color-text-secondary)]">
                        未派单
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
            {filteredEvents.length === 0 && (
              <div className="text-center py-12 text-[var(--color-text-secondary)]">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>没有找到符合条件的事件</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6" onClick={() => navigate('/events')}>
          <div className="bg-[var(--color-bg-card)] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[var(--color-border)]">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">{selectedEvent.title}</h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge status={selectedEvent.level} />
                    <Badge status={selectedEvent.status} />
                    {selectedEvent.dispatch?.isTimeout && (
                      <Badge status="error" label="超时" />
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<Navigation className="w-4 h-4" />}
                    onClick={() => handleLocateOnMap(selectedEvent)}
                  >
                    地图定位
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={<Send className="w-4 h-4" />}
                    onClick={() => setShowDispatchModal(true)}
                    disabled={!!selectedEvent.dispatch}
                  >
                    {selectedEvent.dispatch ? '已派单' : '协同派单'}
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => setShowProcessModal(true)}
                  >
                    添加处置
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/events')}>关闭</Button>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {selectedEvent.dispatch && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    协同派单信息
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[var(--color-text-secondary)]">处置部门</p>
                      <p className="font-medium">{selectedEvent.dispatch.department}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-text-secondary)]">负责人</p>
                      <p className="font-medium">{selectedEvent.dispatch.responsiblePerson}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-text-secondary)]">派单时间</p>
                      <p className="font-medium">{selectedEvent.dispatch.dispatchTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-text-secondary)]">预计完成</p>
                      <p className={`font-medium ${selectedEvent.dispatch.isTimeout ? 'text-red-400' : ''}`}>
                        {selectedEvent.dispatch.estimatedTime}
                        {selectedEvent.dispatch.isTimeout && ' ⚠️'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-text-secondary)]">派单状态</p>
                      <Badge status={selectedEvent.dispatch.status === 'completed' ? 'resolved' : selectedEvent.dispatch.status === 'processing' ? 'processing' : 'pending'} />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-text-secondary)]">超时状态</p>
                      <p className={`font-medium ${selectedEvent.dispatch.isTimeout ? 'text-red-400' : 'text-green-400'}`}>
                        {selectedEvent.dispatch.isTimeout ? '已超时' : '正常'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
                      <div key={record.id} className="p-3 bg-[var(--color-bg-dark)] rounded-lg border-l-4 border-[var(--color-accent)]">
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
            </div>
          </div>
        </div>
      )}

      {showProcessModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-6" onClick={() => setShowProcessModal(false)}>
          <div className="bg-[var(--color-bg-card)] rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-bold">添加处置记录</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  处置动作 *
                </label>
                <input
                  type="text"
                  value={processAction}
                  onChange={(e) => setProcessAction(e.target.value)}
                  placeholder="例如: 现场核查、已联系维修人员等"
                  className="w-full px-4 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  备注说明
                </label>
                <textarea
                  value={processRemark}
                  onChange={(e) => setProcessRemark(e.target.value)}
                  placeholder="可选的详细说明..."
                  rows={3}
                  className="w-full px-4 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg resize-none focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  处置进度
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={processProgress}
                    onChange={(e) => setProcessProgress(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-12">{processProgress}%</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[var(--color-border)] flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setShowProcessModal(false)}>
                取消
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                icon={<Save className="w-4 h-4" />}
                onClick={handleProcess}
                disabled={!processAction}
              >
                保存
              </Button>
            </div>
          </div>
        </div>
      )}

      {showDispatchModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-6" onClick={() => setShowDispatchModal(false)}>
          <div className="bg-[var(--color-bg-card)] rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-bold">协同派单</h2>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">选择处置部门和负责人</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  处置部门 *
                </label>
                <select
                  value={dispatchForm.department}
                  onChange={(e) => {
                    const dept = departments.find((d) => d.name === e.target.value);
                    setDispatchForm((prev) => ({
                      ...prev,
                      department: e.target.value,
                      responsiblePerson: dept?.contact || '',
                    }));
                  }}
                  className="w-full px-4 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                >
                  <option value="">请选择部门</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.icon} {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  负责人 *
                </label>
                <input
                  type="text"
                  value={dispatchForm.responsiblePerson}
                  onChange={(e) => setDispatchForm((prev) => ({ ...prev, responsiblePerson: e.target.value }))}
                  placeholder="输入负责人姓名"
                  className="w-full px-4 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  预计完成时间 *
                </label>
                <input
                  type="datetime-local"
                  value={dispatchForm.estimatedTime}
                  onChange={(e) => setDispatchForm((prev) => ({ ...prev, estimatedTime: e.target.value }))}
                  className="w-full px-4 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              {dispatchForm.department && (
                <div className="p-3 bg-[var(--color-bg-dark)] rounded-lg">
                  <p className="text-xs text-[var(--color-text-secondary)]">联系电话</p>
                  <p className="font-medium">
                    {departments.find((d) => d.name === dispatchForm.department)?.phone}
                  </p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-[var(--color-border)] flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setShowDispatchModal(false)}>
                取消
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                icon={<Send className="w-4 h-4" />}
                onClick={handleDispatch}
                disabled={!dispatchForm.department || !dispatchForm.responsiblePerson || !dispatchForm.estimatedTime}
              >
                确认派单
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
