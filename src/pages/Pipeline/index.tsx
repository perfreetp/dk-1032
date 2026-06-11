import { Droplets, AlertCircle, CheckCircle2, Activity } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { pipelineData } from '../../services/mockData';

export default function Pipeline() {
  const anomalyNodes = pipelineData.filter((n) => n.hasAnomaly);
  const normalNodes = pipelineData.filter((n) => !n.hasAnomaly);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">管网</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            排水管网监测与异常告警
          </p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-red-500/20 rounded-lg">
            <p className="text-xs text-red-400">异常节点</p>
            <p className="text-2xl font-bold text-red-400">{anomalyNodes.length}</p>
          </div>
          <div className="px-4 py-2 bg-green-500/20 rounded-lg">
            <p className="text-xs text-green-400">正常节点</p>
            <p className="text-2xl font-bold text-green-400">{normalNodes.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Droplets className="w-5 h-5" />
                管网拓扑
              </h2>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-[var(--color-bg-dark)] rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Droplets className="w-16 h-16 text-[var(--color-accent)] opacity-20 mb-4 mx-auto" />
                    <p className="text-[var(--color-text-secondary)]">管网拓扑图展示区域</p>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                      使用 Three.js 渲染管网3D拓扑结构
                    </p>
                  </div>
                </div>
                
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                  <defs>
                    <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="1" />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 100 200 Q 200 200 300 300 T 500 300"
                    stroke="url(#pipeGradient)"
                    strokeWidth="4"
                    fill="none"
                    className="animate-pulse"
                  />
                  <path
                    d="M 300 300 Q 400 300 500 400 T 700 400"
                    stroke="url(#pipeGradient)"
                    strokeWidth="4"
                    fill="none"
                    className="animate-pulse"
                  />
                </svg>

                {pipelineData.map((node, index) => (
                  <div
                    key={node.nodeId}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${20 + index * 20}%`,
                      top: `${30 + (index % 3) * 20}%`,
                      zIndex: 2,
                    }}
                  >
                    <div className={`
                      w-4 h-4 rounded-full border-2 border-white shadow-lg
                      ${node.hasAnomaly ? 'bg-red-500 animate-pulse' : 'bg-green-500'}
                    `} />
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <div className="bg-[var(--color-bg-card)] px-2 py-1 rounded text-xs shadow-lg">
                        {node.nodeName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                异常节点
              </h2>
            </CardHeader>
            <CardContent>
              {anomalyNodes.length === 0 ? (
                <div className="text-center py-8 text-[var(--color-text-secondary)]">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-400" />
                  <p>暂无异常节点,所有管网运行正常</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {anomalyNodes.map((node) => (
                    <div
                      key={node.nodeId}
                      className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{node.nodeName}</h3>
                          <Badge status="error" />
                        </div>
                        <span className="text-xs text-red-400">
                          {node.anomalyType === 'water_ponding' ? '积水告警' :
                           node.anomalyType === 'manhole_cover' ? '井盖异常' : '管道泄漏'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-[var(--color-text-secondary)]">水位</p>
                          <p className="text-lg font-mono font-bold text-red-400">
                            {node.waterLevel}m
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[var(--color-text-secondary)]">管压</p>
                          <p className="text-lg font-mono font-bold">{node.pipePressure}MPa</p>
                        </div>
                      </div>
                      <Button variant="danger" size="sm" className="mt-3">
                        立即处理
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5" />
                实时监测
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pipelineData.slice(0, 4).map((node) => (
                  <div key={node.nodeId} className="p-3 bg-[var(--color-bg-dark)] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{node.nodeName}</span>
                      <Badge status={node.hasAnomaly ? 'error' : 'normal'} size="sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[var(--color-text-secondary)]">水位: </span>
                        <span className="font-mono">{node.waterLevel}m</span>
                      </div>
                      <div>
                        <span className="text-[var(--color-text-secondary)]">管压: </span>
                        <span className="font-mono">{node.pipePressure}MPa</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4">
                查看全部
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">积水点监测</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-red-400">西藏路南段</span>
                    <span className="text-xs text-red-400">告警</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">积水深度: 32cm</p>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-yellow-400">淮海路路口</span>
                    <span className="text-xs text-yellow-400">预警</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">积水深度: 18cm</p>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-green-400">南京东路</span>
                    <span className="text-xs text-green-400">正常</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">积水深度: 2cm</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">井盖异常</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">D区-003号井盖</span>
                    <Badge status="error" size="sm" />
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">倾斜角度: 25°</p>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">B区-007号井盖</span>
                    <Badge status="warning" size="sm" />
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">轻微位移</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-4">
                查看全部
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
