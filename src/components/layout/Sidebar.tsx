import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Car,
  Droplets,
  Wind,
  AlertCircle,
  FileText,
  Users,
  Star,
} from 'lucide-react';
import { favoriteAreas } from '../../services/mockData';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: '总览' },
  { path: '/map', icon: Map, label: '地图' },
  { path: '/traffic', icon: Car, label: '交通' },
  { path: '/pipeline', icon: Droplets, label: '管网' },
  { path: '/environment', icon: Wind, label: '环境' },
  { path: '/events', icon: AlertCircle, label: '事件' },
  { path: '/report', icon: FileText, label: '报表' },
  { path: '/handover', icon: Users, label: '交接班' },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-[var(--color-bg-card)] border-r border-[var(--color-border)] flex flex-col h-full">
      <div className="p-6 border-b border-[var(--color-border)]">
        <h1 className="text-xl font-bold text-[var(--color-accent)] flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6" />
          城市运行驾驶舱
        </h1>
        <p className="text-xs text-[var(--color-text-secondary)] mt-2">
          实时监控 · 智能分析 · 精准决策
        </p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-[var(--color-accent)] bg-opacity-10 text-[var(--color-accent)] border-l-4 border-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'
                }`
              }
            >
              <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-2 px-4 mb-4">
            <Star className="w-4 h-4 text-[var(--color-warning)]" />
            <span className="text-sm font-semibold text-[var(--color-text-secondary)]">
              重点区域
            </span>
          </div>
          <div className="space-y-1">
            {favoriteAreas.map((area) => (
              <button
                key={area.id}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] rounded-lg transition-colors"
              >
                <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full" />
                {area.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-[var(--color-border)]">
        <div className="bg-[var(--color-bg-dark)] rounded-lg p-3">
          <p className="text-xs text-[var(--color-text-secondary)]">
            当前时间
          </p>
          <p className="text-sm font-mono text-[var(--color-accent)] mt-1">
            {new Date().toLocaleString('zh-CN')}
          </p>
        </div>
      </div>
    </div>
  );
}
