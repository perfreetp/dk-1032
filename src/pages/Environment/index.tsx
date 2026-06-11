import { Wind, Cloud, Thermometer, Droplets, Volume2 } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { environmentData } from '../../services/mockData';
import ReactECharts from 'echarts-for-react';

export default function Environment() {
  const avgAqi = Math.round(
    environmentData.reduce((sum, s) => sum + s.aqi, 0) / environmentData.length
  );

  const getAqiLevel = (aqi: number) => {
    if (aqi <= 50) return { label: '优', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (aqi <= 100) return { label: '良', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (aqi <= 150) return { label: '轻度', color: 'text-orange-400', bg: 'bg-orange-500/20' };
    if (aqi <= 200) return { label: '中度', color: 'text-red-400', bg: 'bg-red-500/20' };
    return { label: '重度', color: 'text-purple-400', bg: 'bg-purple-500/20' };
  };

  const aqiOption = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['AQI', 'PM2.5', 'PM10'],
      textStyle: { color: '#a0aec0' },
    },
    xAxis: {
      type: 'category',
      data: environmentData.map((s) => s.stationName),
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
        name: 'AQI',
        type: 'line',
        data: environmentData.map((s) => s.aqi),
        smooth: true,
        lineStyle: { color: '#00d4ff', width: 3 },
        itemStyle: { color: '#00d4ff' },
        areaStyle: { color: 'rgba(0, 212, 255, 0.1)' },
      },
      {
        name: 'PM2.5',
        type: 'line',
        data: environmentData.map((s) => s.pm25),
        smooth: true,
        lineStyle: { color: '#2ed573', width: 2 },
        itemStyle: { color: '#2ed573' },
      },
      {
        name: 'PM10',
        type: 'line',
        data: environmentData.map((s) => s.pm10),
        smooth: true,
        lineStyle: { color: '#ffa502', width: 2 },
        itemStyle: { color: '#ffa502' },
      },
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  };

  const noiseOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    xAxis: {
      type: 'category',
      data: environmentData.map((s) => s.stationName),
      axisLine: { lineStyle: { color: '#2d3748' } },
      axisLabel: { color: '#a0aec0' },
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLine: { lineStyle: { color: '#2d3748' } },
      axisLabel: { color: '#a0aec0', formatter: '{value} dB' },
      splitLine: { lineStyle: { color: '#2d3748' } },
    },
    series: [
      {
        name: '噪声',
        type: 'bar',
        data: environmentData.map((s) => s.noise),
        itemStyle: {
          color: (params: any) => {
            const value = params.value;
            if (value < 60) return '#2ed573';
            if (value < 70) return '#ffa502';
            return '#ff4757';
          },
        },
        barWidth: '50%',
      },
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">环境</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            空气质量、噪声与气象监测
          </p>
        </div>
        <div className={`px-6 py-3 rounded-lg ${getAqiLevel(avgAqi).bg}`}>
          <p className="text-xs text-[var(--color-text-secondary)]">区域平均AQI</p>
          <p className={`text-4xl font-bold ${getAqiLevel(avgAqi).color}`}>{avgAqi}</p>
          <p className={`text-sm font-medium ${getAqiLevel(avgAqi).color}`}>
            {getAqiLevel(avgAqi).label}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {environmentData.map((station) => (
          <Card key={station.stationId} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">{station.stationName}</h3>
              <Badge status={station.aqi <= 100 ? 'normal' : station.aqi <= 150 ? 'warning' : 'error'} size="sm" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-text-secondary)] flex items-center gap-1">
                  <Wind className="w-3 h-3" /> AQI
                </span>
                <span className="font-mono font-bold">{station.aqi}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">PM2.5</span>
                <span className="font-mono">{station.pm25} μg/m³</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">PM10</span>
                <span className="font-mono">{station.pm10} μg/m³</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-text-secondary)] flex items-center gap-1">
                  <Volume2 className="w-3 h-3" /> 噪声
                </span>
                <span className={`font-mono ${station.noise > 70 ? 'text-red-400' : 'text-[var(--color-text-primary)]'}`}>
                  {station.noise} dB
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">空气质量趋势</h2>
          </CardHeader>
          <CardContent>
            <ReactECharts option={aqiOption} style={{ height: '300px' }} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">噪声监测</h2>
          </CardHeader>
          <CardContent>
            <ReactECharts option={noiseOption} style={{ height: '300px' }} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            气象数据
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[var(--color-bg-dark)] rounded-lg text-center">
              <Thermometer className="w-8 h-8 mx-auto mb-2 text-red-400" />
              <p className="text-2xl font-bold">{environmentData[0].temperature}°C</p>
              <p className="text-xs text-[var(--color-text-secondary)]">温度</p>
            </div>
            <div className="p-4 bg-[var(--color-bg-dark)] rounded-lg text-center">
              <Droplets className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <p className="text-2xl font-bold">{environmentData[0].humidity}%</p>
              <p className="text-xs text-[var(--color-text-secondary)]">湿度</p>
            </div>
            <div className="p-4 bg-[var(--color-bg-dark)] rounded-lg text-center">
              <Wind className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <p className="text-2xl font-bold">{environmentData[0].windSpeed}m/s</p>
              <p className="text-xs text-[var(--color-text-secondary)]">风速</p>
            </div>
            <div className="p-4 bg-[var(--color-bg-dark)] rounded-lg text-center">
              <Cloud className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
              <p className="text-2xl font-bold">{environmentData[0].windDirection}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">风向</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
