import { useState } from 'react';
import { User, Lock, LogIn } from 'lucide-react';
import Button from '../../components/common/Button';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login:', { username, password });
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-accent)] mb-2">
            城市运行驾驶舱
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            数字孪生城市智能管理平台
          </p>
        </div>

        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-6 text-center">用户登录</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  className="w-full pl-12 pr-4 py-3 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full pl-12 pr-4 py-3 bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-[var(--color-border)] bg-[var(--color-bg-dark)]" />
                <span className="text-[var(--color-text-secondary)]">记住密码</span>
              </label>
              <a href="#" className="text-[var(--color-accent)] hover:underline">
                忘记密码?
              </a>
            </div>

            <Button onClick={handleLogin} className="w-full" icon={<LogIn className="w-4 h-4" />}>
              登录
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
            <p className="text-xs text-center text-[var(--color-text-secondary)]">
              演示账号: admin / admin123
            </p>
          </div>
        </div>

        <p className="text-xs text-center text-[var(--color-text-secondary)] mt-6">
          © 2026 城运中心 版权所有
        </p>
      </div>
    </div>
  );
}
