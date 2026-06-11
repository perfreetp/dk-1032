import { FileText, Download, History, BookOpen, Calendar } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { emergencyPlans } from '../../services/mockData';
import ReactECharts from 'echarts-for-react';

export default function Report() {
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

  const eventTypeOption = {
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
        name: '事件类型',
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
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 35, name: '交通', itemStyle: { color: '#00d4ff' } },
          { value: 25, name: '管网', itemStyle: { color: '#2ed573' } },
          { value: 20, name: '环境', itemStyle: { color: '#ffa502' } },
          { value: 15, name: '安全', itemStyle: { color: '#ff4757' } },
          { value: 5, name: '其他', itemStyle: { color: '#a0aec0' } },
        ],
      },
    ],
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
          <Button icon={<Download className="w-4 h-4" />} variant="primary">
            导出日报
          </Button>
          <Button icon={<History className="w-4 h-4" />} variant="secondary">
            历史回放
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-[var(--color-text-secondary)] mb-1">本周事件</p>
          <p className="text-3xl font-bold text-[var(--color-accent)]">83</p>
          <p className="text-xs text-green-400 mt-1">较上周 -12%</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-[var(--color-text-secondary)] mb-1">本周处置</p>
          <p className="text-3xl font-bold text-green-400">75</p>
          <p className="text-xs text-green-400 mt-1">处置率 90.4%</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-[var(--color-text-secondary)] mb-1">平均响应</p>
          <p className="text-3xl font-bold text-yellow-400">15分钟</p>
          <p className="text-xs text-green-400 mt-1">较上周 -3分钟</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-[var(--color-text-secondary)] mb-1">本月累计</p>
          <p className="text-3xl font-bold text-orange-400">356</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">事件总数</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              本周事件统计
            </h2>
          </CardHeader>
          <CardContent>
            <ReactECharts option={dailyReportOption} style={{ height: '300px' }} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">事件类型分布</h2>
          </CardHeader>
          <CardContent>
            <ReactECharts option={eventTypeOption} style={{ height: '300px' }} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              日报生成
            </h2>
            <div className="flex gap-2">
              <input
                type="date"
                className="px-4 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)]"
              />
              <Button variant="primary" icon={<Download className="w-4 h-4" />}>
                生成
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--color-bg-dark)] rounded-lg">
              <p className="text-sm text-[var(--color-text-secondary)] mb-2">2026-06-11 日报</p>
              <p className="text-xs text-[var(--color-text-secondary)] mb-3">共12个事件,11个已处置</p>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">查看</Button>
                <Button size="sm" variant="ghost" icon={<Download className="w-3 h-3" />}>下载</Button>
              </div>
            </div>
            <div className="p-4 bg-[var(--color-bg-dark)] rounded-lg">
              <p className="text-sm text-[var(--color-text-secondary)] mb-2">2026-06-10 日报</p>
              <p className="text-xs text-[var(--color-text-secondary)] mb-3">共8个事件,8个已处置</p>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">查看</Button>
                <Button size="sm" variant="ghost" icon={<Download className="w-3 h-3" />}>下载</Button>
              </div>
            </div>
            <div className="p-4 bg-[var(--color-bg-dark)] rounded-lg">
              <p className="text-sm text-[var(--color-text-secondary)] mb-2">2026-06-09 日报</p>
              <p className="text-xs text-[var(--color-text-secondary)] mb-3">共15个事件,14个已处置</p>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">查看</Button>
                <Button size="sm" variant="ghost" icon={<Download className="w-3 h-3" />}>下载</Button>
              </div>
            </div>
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
    </div>
  );
}
