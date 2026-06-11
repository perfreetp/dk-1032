import { useState } from 'react';
import { X, Play, Plus, Trash2, Check, Clock } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { carouselConfigs as initialConfigs } from '../../services/mockData';
import { CarouselConfig } from '../../types';

interface CarouselConfigPanelProps {
  onClose: () => void;
  onPlay?: (config: CarouselConfig) => void;
}

const allPages = [
  { path: '/', name: '总览', icon: '📊' },
  { path: '/map', name: '地图', icon: '🗺️' },
  { path: '/traffic', name: '交通', icon: '🚗' },
  { path: '/pipeline', name: '管网', icon: '🔧' },
  { path: '/environment', name: '环境', icon: '🌿' },
  { path: '/events', name: '事件', icon: '📋' },
  { path: '/report', name: '报表', icon: '📈' },
];

export default function CarouselConfigPanel({ onClose, onPlay }: CarouselConfigPanelProps) {
  const [configs, setConfigs] = useState<CarouselConfig[]>(() => {
    const saved = localStorage.getItem('carouselConfigs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialConfigs;
      }
    }
    return initialConfigs;
  });
  const [selectedConfig, setSelectedConfig] = useState<CarouselConfig | null>(null);
  const [editingConfig, setEditingConfig] = useState<CarouselConfig | null>(null);
  const [newConfigName, setNewConfigName] = useState('');
  const [newConfigPages, setNewConfigPages] = useState<string[]>([]);
  const [newConfigInterval, setNewConfigInterval] = useState(10);

  const handleCreateConfig = () => {
    if (!newConfigName || newConfigPages.length === 0) return;

    const newConfig: CarouselConfig = {
      id: `carousel-${Date.now()}`,
      name: newConfigName,
      pages: newConfigPages,
      interval: newConfigInterval,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    const updatedConfigs = [...configs, newConfig];
    setConfigs(updatedConfigs);
    localStorage.setItem('carouselConfigs', JSON.stringify(updatedConfigs));
    setNewConfigName('');
    setNewConfigPages([]);
    setNewConfigInterval(10);
  };

  const handleDeleteConfig = (configId: string) => {
    const updatedConfigs = configs.filter((c) => c.id !== configId);
    setConfigs(updatedConfigs);
    localStorage.setItem('carouselConfigs', JSON.stringify(updatedConfigs));
    if (selectedConfig?.id === configId) {
      setSelectedConfig(null);
    }
  };

  const handleTogglePage = (path: string) => {
    if (editingConfig) {
      if (editingConfig.pages.includes(path)) {
        setEditingConfig({
          ...editingConfig,
          pages: editingConfig.pages.filter((p) => p !== path),
        });
      } else {
        setEditingConfig({
          ...editingConfig,
          pages: [...editingConfig.pages, path],
        });
      }
    } else {
      if (newConfigPages.includes(path)) {
        setNewConfigPages(newConfigPages.filter((p) => p !== path));
      } else {
        setNewConfigPages([...newConfigPages, path]);
      }
    }
  };

  const handleSaveConfig = () => {
    if (!editingConfig) return;

    const updatedConfigs = configs.map((c) => (c.id === editingConfig.id ? editingConfig : c));
    setConfigs(updatedConfigs);
    localStorage.setItem('carouselConfigs', JSON.stringify(updatedConfigs));
    setEditingConfig(null);
  };

  const handleApplyConfig = (config: CarouselConfig) => {
    localStorage.setItem('activeCarouselConfig', JSON.stringify(config));
    if (onPlay) {
      onPlay(config);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
      <div className="bg-[var(--color-bg-card)] rounded-lg max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h3 className="font-semibold text-lg">轮播配置</h3>
          <button onClick={onClose} className="p-2 hover:bg-[var(--color-bg-hover)] rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <div className="w-1/3 border-r border-[var(--color-border)] p-4 overflow-y-auto">
            <h4 className="font-semibold mb-4">播放方案列表</h4>
            <div className="space-y-2">
              {configs.map((config) => (
                <div
                  key={config.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConfig?.id === config.id
                      ? 'bg-[var(--color-accent)]/20 border border-[var(--color-accent)]'
                      : 'bg-[var(--color-bg-dark)] hover:bg-[var(--color-bg-hover)]'
                  }`}
                  onClick={() => setSelectedConfig(config)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{config.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConfig(config.id);
                      }}
                      className="p-1 hover:bg-red-500/20 rounded text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                    <span>{config.pages.length}个页面</span>
                    <span>·</span>
                    <span>{config.interval}秒/页</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
              <h5 className="font-medium mb-3">创建新方案</h5>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newConfigName}
                  onChange={(e) => setNewConfigName(e.target.value)}
                  placeholder="方案名称"
                  className="w-full px-3 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg text-sm"
                />
                <div>
                  <label className="block text-xs text-[var(--color-text-secondary)] mb-2">
                    <Clock className="w-3 h-3 inline mr-1" />
                    停留时间(秒)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={newConfigInterval}
                    onChange={(e) => setNewConfigInterval(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg text-sm"
                  />
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={handleCreateConfig}
                  disabled={!newConfigName || newConfigPages.length === 0}
                >
                  创建方案
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <h4 className="font-semibold mb-4">
              {editingConfig ? `编辑: ${editingConfig.name}` : selectedConfig ? selectedConfig.name : '选择方案查看详情'}
            </h4>

            {(editingConfig || selectedConfig) && !editingConfig && (
              <div className="mb-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingConfig(selectedConfig)}
                >
                  编辑方案
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="ml-2"
                  icon={<Play className="w-4 h-4" />}
                  onClick={() => handleApplyConfig(selectedConfig)}
                >
                  立即播放
                </Button>
              </div>
            )}

            {editingConfig && (
              <div className="mb-4 flex gap-2">
                <Button variant="primary" size="sm" icon={<Check className="w-4 h-4" />} onClick={handleSaveConfig}>
                  保存修改
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditingConfig(null)}>
                  取消
                </Button>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">选择页面</label>
              <div className="grid grid-cols-2 gap-2">
                {allPages.map((page) => {
                  const isSelected = editingConfig
                    ? editingConfig.pages.includes(page.path)
                    : selectedConfig?.pages.includes(page.path);
                  const isEditing = !!editingConfig;

                  return (
                    <button
                      key={page.path}
                      onClick={() => isEditing && handleTogglePage(page.path)}
                      disabled={!isEditing}
                      className={`p-3 rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)]'
                          : 'bg-[var(--color-bg-dark)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
                      } ${isEditing ? 'cursor-pointer hover:border-[var(--color-accent)]' : 'cursor-default'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{page.icon}</span>
                        <span className="font-medium">{page.name}</span>
                        {isSelected && <Check className="w-4 h-4 ml-auto" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {(editingConfig || selectedConfig) && (
              <div className="p-4 bg-[var(--color-bg-dark)] rounded-lg">
                <h5 className="font-medium mb-3">方案信息</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">方案名称</span>
                    <span>{editingConfig?.name || selectedConfig?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">页面数量</span>
                    <span>{editingConfig?.pages.length || selectedConfig?.pages.length}个</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">停留间隔</span>
                    <span>{editingConfig?.interval || selectedConfig?.interval}秒/页</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">创建时间</span>
                    <span>{editingConfig?.createdAt || selectedConfig?.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">预计总时长</span>
                    <span>
                      {((editingConfig?.pages.length || selectedConfig?.pages.length) *
                        (editingConfig?.interval || selectedConfig?.interval)) /
                        60}
                      分钟
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-text-secondary)] mb-2">页面顺序</p>
                  <div className="flex flex-wrap gap-2">
                    {(editingConfig?.pages || selectedConfig?.pages).map((pagePath) => {
                      const page = allPages.find((p) => p.path === pagePath);
                      return page ? (
                        <span
                          key={pagePath}
                          className="px-2 py-1 bg-[var(--color-bg-card)] rounded text-xs"
                        >
                          {page.icon} {page.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            )}

            {!selectedConfig && !editingConfig && (
              <div className="h-full flex items-center justify-center text-[var(--color-text-secondary)]">
                <div className="text-center">
                  <p>从左侧选择一个方案</p>
                  <p className="text-sm mt-2">或创建新的播放方案</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
