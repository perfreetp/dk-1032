import { Bell, User, Settings, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { alerts } from '../../services/mockData';

export default function Header() {
  const [showAlerts, setShowAlerts] = useState(false);

  const criticalAlerts = alerts.filter((a) => a.level === 'critical' || a.level === 'high');

  return (
    <header className="h-16 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse" />
          <span className="text-sm text-[var(--color-text-secondary)]">
            系统运行正常
          </span>
        </div>
        <button className="p-2 hover:bg-[var(--color-bg-hover)] rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4 text-[var(--color-text-secondary)]" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="relative p-2 hover:bg-[var(--color-bg-hover)] rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-[var(--color-text-secondary)]" />
            {criticalAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-danger)] rounded-full animate-pulse" />
            )}
          </button>

          {showAlerts && (
            <div className="absolute right-0 mt-2 w-80 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 animate-fade-in">
              <div className="p-4 border-b border-[var(--color-border)]">
                <h3 className="font-semibold text-[var(--color-text-primary)]">
                  告警信息
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  {criticalAlerts.length}条紧急告警待处理
                </p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {criticalAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 border-b border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-[var(--color-text-primary)]">
                        {alert.title}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          alert.level === 'critical'
                            ? 'bg-[var(--color-danger)] text-white'
                            : 'bg-[var(--color-warning)] text-white'
                        }`}
                      >
                        {alert.level === 'critical' ? '紧急' : '重要'}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                      {alert.description}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {alert.time} · {alert.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button className="p-2 hover:bg-[var(--color-bg-hover)] rounded-lg transition-colors">
          <Settings className="w-5 h-5 text-[var(--color-text-secondary)]" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-[var(--color-border)]">
          <div className="text-right">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              值班人员
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              张伟 · 值班班长
            </p>
          </div>
          <div className="w-10 h-10 bg-[var(--color-accent)] bg-opacity-20 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-[var(--color-accent)]" />
          </div>
        </div>
      </div>
    </header>
  );
}
