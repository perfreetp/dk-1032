import { useState, useMemo, useEffect } from 'react';
import { FileText, Download, History, BookOpen, Calendar, BarChart3, Settings } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { streets, emergencyPlans, events, carouselConfigs as initialCarouselConfigs } from '../../services/mockData';
import { useEventStore } from '../../stores/useEventStore';
import HistoricalPlayback from '../../components/common/HistoricalPlayback';
import CarouselConfigPanel from '../../components/common/CarouselConfigPanel';
import Carousel from '../../components/common/Carousel';
import ReactECharts from 'echarts-for-react';
import { CarouselConfig } from '../../types';

export default function Report() {
  const [showPlayback, setShowPlayback] = useState(false);
  const [showCarouselConfig, setShowCarouselConfig] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const [exportDate, setExportDate] = useState(new Date().toISOString().slice(0, 10));
  const [customFilters, setCustomFilters] = useState({
    street: '全部街道',
    type: 'all',
    status: 'all',
    startDate: '',
    endDate: '',
  });

  const { events: storeEvents } = useEventStore();
  const allEvents = useMemo(() => {
    const merged = [...events];
    storeEvents.forEach(e => {
      if (!merged.find(me => me.id === e.id)) {
        merged.push(e);
      }
    });
    return merged;
  }, [storeEvents]);

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      const matchesStreet = customFilters.street === '全部街道' || event.street === customFilters.street;
      const matchesType = customFilters.type === 'all' || event.type === customFilters.type;
      const matchesStatus = customFilters.status === 'all' || event.status === customFilters.status;
      
      let matchesDate = true;
      if (customFilters.startDate || customFilters.endDate) {
        const eventDate = new Date(event.createTime);
        if (customFilters.startDate) {
          matchesDate = matchesDate && eventDate >= new Date(customFilters.startDate);
        }
        if (customFilters.endDate) {
          const endDate = new Date(customFilters.endDate);
          endDate.setHours(23, 59, 59, 999);
          matchesDate = matchesDate && eventDate <= endDate;
        }
      }
      
      return matchesStreet && matchesType && matchesStatus && matchesDate;
    });
  }, [allEvents, customFilters]);

  const statistics = useMemo(() => {
    return {
      total: filteredEvents.length,
      byType: {
        traffic: filteredEvents.filter((e) => e.type === 'traffic').length,
        pipeline: filteredEvents.filter((e) => e.type === 'pipeline').length,
        environment: filteredEvents.filter((e) => e.type === 'environment').length,
        safety: filteredEvents.filter((e) => e.type === 'safety').length,
        other: filteredEvents.filter((e) => e.type === 'other').length,
      },
      byStatus: {
        pending: filteredEvents.filter((e) => e.status === 'pending').length,
        processing: filteredEvents.filter((e) => e.status === 'processing').length,
        resolved: filteredEvents.filter((e) => e.status === 'resolved').length,
        closed: filteredEvents.filter((e) => e.status === 'closed').length,
      },
      byLevel: {
        critical: filteredEvents.filter((e) => e.level === 'critical').length,
        high: filteredEvents.filter((e) => e.level === 'high').length,
        medium: filteredEvents.filter((e) => e.level === 'medium').length,
        low: filteredEvents.filter((e) => e.level === 'low').length,
      },
      byStreet: streets.slice(1).map((street) => ({
        name: street,
        count: filteredEvents.filter((e) => e.street === street).length,
      })),
      withDispatch: filteredEvents.filter((e) => e.dispatch).length,
      timeout: filteredEvents.filter((e) => e.dispatch?.isTimeout).length,
      avgProgress: filteredEvents.length > 0 
        ? Math.round(filteredEvents.reduce((sum, e) => sum + e.progress, 0) / filteredEvents.length) 
        : 0,
    };
  }, [filteredEvents]);

  const handlePlayCarousel = (config: CarouselConfig) => {
    setShowCarouselConfig(false);
    setShowCarousel(true);
  };

  const dailyReportOption = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['事件数', '处置数'],
      textStyle: { color: '#a0aec0' },
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { lineStyle: { color: '#2d3748' } },
      axisLabel: { color: '#a0aec0' },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#2d3748' } },
      axisLabel: { color: '#a0aec0' },
      splitLine: { lineStyle: { color: '#2d3748' } },
    },
    series: [
      {
        name: '事件数',
        type: 'bar',
        data: [12, 15, 10, 18, 14, 8, 6],
        itemStyle: { color: '#ff4757' },
      },
      {
        name: '处置数',
        type: 'bar',
        data: [10, 14, 9, 16, 13, 7, 6],
        itemStyle: { color: '#2ed573' },
      },
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  };

  const customChartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      data: ['交通', '管网', '环境', '安全', '其他'],
      textStyle: { color: '#a0aec0' },
    },
    xAxis: {
      type: 'category',
      data: statistics.byStreet.map((s) => s.name),
      axisLine: { lineStyle: { color: '#2d3748' } },
      axisLabel: { color: '#a0aec0', rotate: 30 },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#2d3748' } },
      axisLabel: { color: '#a0aec0' },
      splitLine: { lineStyle: { color: '#2d3748' } },
    },
    series: [
      {
        name: '交通',
        type: 'bar',
        stack: 'total',
        data: statistics.byStreet.map((s) => filteredEvents.filter((e) => e.street === s.name && e.type === 'traffic').length),
        itemStyle: { color: '#00d4ff' },
      },
      {
        name: '管网',
        type: 'bar',
        stack: 'total',
        data: statistics.byStreet.map((s) => filteredEvents.filter((e) => e.street === s.name && e.type === 'pipeline').length),
        itemStyle: { color: '#2ed573' },
      },
      {
        name: '环境',
        type: 'bar',
        stack: 'total',
        data: statistics.byStreet.map((s) => filteredEvents.filter((e) => e.street === s.name && e.type === 'environment').length),
        itemStyle: { color: '#ffa502' },
      },
      {
        name: '安全',
        type: 'bar',
        stack: 'total',
        data: statistics.byStreet.map((s) => filteredEvents.filter((e) => e.street === s.name && e.type === 'safety').length),
        itemStyle: { color: '#ff4757' },
      },
      {
        name: '其他',
        type: 'bar',
        stack: 'total',
        data: statistics.byStreet.map((s) => filteredEvents.filter((e) => e.street === s.name && e.type === 'other').length),
        itemStyle: { color: '#a0aec0' },
      },
    ],
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
  };

  const statusPieOption = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: '#a0aec0' },
    },
    series: [
      {
        name: '处置状态',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#0a0f1a',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        data: [
          { value: statistics.byStatus.pending, name: '待处理', itemStyle: { color: '#3b82f6' } },
          { value: statistics.byStatus.processing, name: '处理中', itemStyle: { color: '#f59e0b' } },
          { value: statistics.byStatus.resolved, name: '已解决', itemStyle: { color: '#10b981' } },
          { value: statistics.byStatus.closed, name: '已关闭', itemStyle: { color: '#6b7280' } },
        ],
      },
    ],
  };

  const generateCustomReport = () => {
    const date = new Date(exportDate);
    const filterDesc = [
      customFilters.street !== '全部街道' ? `街道: ${customFilters.street}` : null,
      customFilters.type !== 'all' ? `类型: ${customFilters.type}` : null,
      customFilters.status !== 'all' ? `状态: ${customFilters.status}` : null,
      customFilters.startDate ? `开始: ${customFilters.startDate}` : null,
      customFilters.endDate ? `结束: ${customFilters.endDate}` : null,
    ].filter(Boolean).join(' | ');

    const reportContent = `
自定义统计报告
日期: ${date.toLocaleDateString('zh-CN')}
生成时间: ${new Date().toLocaleString('zh-CN')}
筛选条件: ${filterDesc || '全部'}
========================================

一、统计概览
----------------------------------------
筛选后事件总数: ${statistics.total} 个
已派单事件: ${statistics.withDispatch} 个
超时事件: ${statistics.timeout} 个
平均处置进度: ${statistics.avgProgress}%

二、事件类型分布
----------------------------------------
- 交通类: ${statistics.byType.traffic} 个
- 管网类: ${statistics.byType.pipeline} 个
- 环境类: ${statistics.byType.environment} 个
- 安全类: ${statistics.byType.safety} 个
- 其他类: ${statistics.byType.other} 个

三、处置状态分布
----------------------------------------
- 待处理: ${statistics.byStatus.pending} 个
- 处理中: ${statistics.byStatus.processing} 个
- 已解决: ${statistics.byStatus.resolved} 个
- 已关闭: ${statistics.byStatus.closed} 个

四、事件级别分布
----------------------------------------
- 紧急: ${statistics.byLevel.critical} 个
- 高: ${statistics.byLevel.high} 个
- 中: ${statistics.byLevel.medium} 个
- 低: ${statistics.byLevel.low} 个

五、各街道统计
----------------------------------------
${statistics.byStreet.map((s) => `${s.name}: ${s.count}个`).join('\n')}

六、筛选后事件列表
----------------------------------------
${filteredEvents.slice(0, 20).map((e) => `[${e.status}] ${e.title} - ${e.street} (${e.createTime})`).join('\n')}
${filteredEvents.length > 20 ? `\n... 共 ${filteredEvents.length} 个事件` : ''}

七、核心指标
----------------------------------------
- 交通流量: ${Math.floor(Math.random() * 5000) + 10000} 辆/小时
- 管网压力: ${(Math.random() * 0.3 + 0.3).toFixed(2)} MPa
- 空气质量指数: ${Math.floor(Math.random() * 40) + 40} AQI
- 监控在线率: ${(Math.random() * 5 + 95).toFixed(1)}%

值班人员: 张伟
审核人员: 李明
`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `统计报告_${date.toISOString().slice(0, 10)}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">报表</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            数据统计与日报导出
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            icon={<Settings className="w-4 h-4" />}
            variant="secondary"
            onClick={() => setShowCarouselConfig(true)}
          >
            轮播配置
          </Button>
          <Button
            icon={<Download className="w-4 h-4" />}
            variant="primary"
            onClick={generateCustomReport}
          >
            导出报告
          </Button>
          <Button
            icon={<History className="w-4 h-4" />}
            variant="secondary"
            onClick={() => setShowPlayback(true)}
          >
            历史回放
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            自定义统计筛选
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-2">街道</label>
              <select
                value={customFilters.street}
                onChange={(e) => setCustomFilters((prev) => ({ ...prev, street: e.target.value }))}
                className="w-full px-3 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg text-sm"
              >
                <option value="全部街道">全部街道</option>
                {streets.slice(1).map((street) => (
                  <option key={street} value={street}>{street}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-2">事件类型</label>
              <select
                value={customFilters.type}
                onChange={(e) => setCustomFilters((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg text-sm"
              >
                <option value="all">全部类型</option>
                <option value="traffic">交通</option>
                <option value="pipeline">管网</option>
                <option value="environment">环境</option>
                <option value="safety">安全</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-2">处置状态</label>
              <select
                value={customFilters.status}
                onChange={(e) => setCustomFilters((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg text-sm"
              >
                <option value="all">全部状态</option>
                <option value="pending">待处理</option>
                <option value="processing">处理中</option>
                <option value="resolved">已解决</option>
                <option value="closed">已关闭</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-2">开始日期</label>
              <input
                type="date"
                value={customFilters.startDate}
                onChange={(e) => setCustomFilters((prev) => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-2">结束日期</label>
              <input
                type="date"
                value={customFilters.endDate}
                onChange={(e) => setCustomFilters((prev) => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-[var(--color-accent)]/10 rounded-lg">
            <span className="text-sm">
              当前筛选结果: <span className="font-bold text-[var(--color-accent)]">{filteredEvents.length}</span> 个事件
            </span>
            <Button size="sm" variant="primary" icon={<Download className="w-4 h-4" />} onClick={generateCustomReport}>
              导出筛选结果
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <p className="text-sm text-[var(--color-text-secondary)] mb-1">事件总数</p>
          <p className="text-2xl font-bold text-[var(--color-accent)]">{statistics.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-[var(--color-text-secondary)] mb-1">已派单</p>
          <p className="text-2xl font-bold text-blue-400">{statistics.withDispatch}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-[var(--color-text-secondary)] mb-1">超时</p>
          <p className="text-2xl font-bold text-red-400">{statistics.timeout}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-[var(--color-text-secondary)] mb-1">处理中</p>
          <p className="text-2xl font-bold text-yellow-400">{statistics.byStatus.processing}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-[var(--color-text-secondary)] mb-1">已解决</p>
          <p className="text-2xl font-bold text-green-400">{statistics.byStatus.resolved}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-[var(--color-text-secondary)] mb-1">平均进度</p>
          <p className="text-2xl font-bold text-orange-400">{statistics.avgProgress}%</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">按街道统计</h2>
          </CardHeader>
          <CardContent>
            <ReactECharts option={customChartOption} style={{ height: '300px' }} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">处置状态分布</h2>
          </CardHeader>
          <CardContent>
            <ReactECharts option={statusPieOption} style={{ height: '300px' }} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            日报生成
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { date: '2026-06-11', events: 12, resolved: 11 },
              { date: '2026-06-10', events: 8, resolved: 8 },
              { date: '2026-06-09', events: 15, resolved: 14 },
            ].map((report, idx) => (
              <div key={idx} className="p-4 bg-[var(--color-bg-dark)] rounded-lg">
                <p className="text-sm text-[var(--color-text-secondary)] mb-2">{report.date} 日报</p>
                <p className="text-xs text-[var(--color-text-secondary)] mb-3">
                  共{report.events}个事件,{report.resolved}个已处置
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">查看</Button>
                  <Button size="sm" variant="ghost" icon={<Download className="w-3 h-3" />}>
                    下载
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            方案预案
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyPlans.map((plan) => (
              <div
                key={plan.id}
                className="p-4 bg-[var(--color-bg-dark)] rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium mb-1">{plan.name}</h3>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                        {plan.type}
                      </span>
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                        {plan.level}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                  {plan.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    更新: {plan.updateTime}
                  </span>
                  <Button size="sm" variant="ghost">
                    查看详情
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showPlayback && <HistoricalPlayback onClose={() => setShowPlayback(false)} />}
      {showCarouselConfig && <CarouselConfigPanel onClose={() => setShowCarouselConfig(false)} onPlay={handlePlayCarousel} />}
      {showCarousel && <Carousel onClose={() => setShowCarousel(false)} />}
    </div>
  );
}
