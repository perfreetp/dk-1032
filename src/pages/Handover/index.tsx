import { useState } from 'react';
import { Users, Clock, FileText, CheckCircle } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function Handover() {
  const [shiftType, setShiftType] = useState<'day' | 'night'>('day');
  const [summary, setSummary] = useState('');
  const [remarks, setRemarks] = useState('');

  const pendingEvents: Array<{ id: string; title: string; handler: string; status: 'pending' | 'processing' | 'resolved' | 'closed' }> = [
    { id: 'evt-1', title: '延安路高架交通事故', handler: '张伟', status: 'processing' },
    { id: 'evt-2', title: '西藏路积水告警', handler: '待分配', status: 'pending' },
  ];

  const handleSubmit = () => {
    console.log('Submit handover:', { shiftType, summary, remarks, pendingEvents });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">值班交接</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            交接班记录与工作移交
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                交接记录
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    班次类型
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="shiftType"
                        value="day"
                        checked={shiftType === 'day'}
                        onChange={() => setShiftType('day')}
                        className="w-4 h-4"
                      />
                      <span>白班 (08:00 - 20:00)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="shiftType"
                        value="night"
                        checked={shiftType === 'night'}
                        onChange={() => setShiftType('night')}
                        className="w-4 h-4"
                      />
                      <span>夜班 (20:00 - 08:00)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    交班人
                  </label>
                  <input
                    type="text"
                    value="张伟"
                    readOnly
                    className="w-full px-4 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    接班人
                  </label>
                  <select className="w-full px-4 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg">
                    <option value="">请选择接班人</option>
                    <option value="user1">李娜</option>
                    <option value="user2">王强</option>
                    <option value="user3">赵敏</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    值班总结
                  </label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="请输入值班期间的工作总结..."
                    rows={4}
                    className="w-full px-4 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg resize-none focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    备注说明
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="请输入需要特别说明的事项..."
                    rows={3}
                    className="w-full px-4 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg resize-none focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>

                <Button onClick={handleSubmit} className="w-full" icon={<CheckCircle className="w-4 h-4" />}>
                  提交交接
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">待处理事件</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingEvents.map((event) => (
                  <div key={event.id} className="p-3 bg-[var(--color-bg-dark)] rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-sm">{event.title}</span>
                      <Badge status={event.status} size="sm" />
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      负责人: {event.handler}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5" />
                交接时间
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-secondary)]">当前时间</span>
                  <span className="font-mono">{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-secondary)]">交班时间</span>
                  <span className="font-mono">20:00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-secondary)]">剩余时间</span>
                  <span className="font-mono text-[var(--color-accent)]">3小时15分</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                值班人员
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-[var(--color-bg-dark)] rounded-lg">
                  <p className="font-medium text-sm">张伟</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">值班班长 · 白班</p>
                </div>
                <div className="p-3 bg-[var(--color-bg-dark)] rounded-lg">
                  <p className="font-medium text-sm">李娜</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">值班员 · 白班</p>
                </div>
                <div className="p-3 bg-[var(--color-bg-dark)] rounded-lg">
                  <p className="font-medium text-sm">王强</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">值班员 · 白班</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">历史交接记录</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-[var(--color-bg-dark)] rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">昨日夜班</span>
                    <Badge status="closed" size="sm" />
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">交班: 李明 → 接班: 张伟</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">2026-06-11 20:00</p>
                </div>
                <div className="p-3 bg-[var(--color-bg-dark)] rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">昨日白班</span>
                    <Badge status="closed" size="sm" />
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">交班: 张伟 → 接班: 李明</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">2026-06-11 08:00</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
