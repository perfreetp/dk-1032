import { useState, useEffect } from 'react';
import { X, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CarouselConfig } from '../../types';

const allPages = [
  { path: '/', name: '总览', icon: '📊' },
  { path: '/map', name: '地图', icon: '🗺️' },
  { path: '/traffic', name: '交通', icon: '🚗' },
  { path: '/pipeline', name: '管网', icon: '🔧' },
  { path: '/environment', name: '环境', icon: '🌿' },
  { path: '/events', name: '事件', icon: '📋' },
  { path: '/report', name: '报表', icon: '📈' },
];

interface CarouselProps {
  onClose: () => void;
}

export default function Carousel({ onClose }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [config, setConfig] = useState<CarouselConfig | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedConfig = localStorage.getItem('activeCarouselConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
      } catch (e) {
        setConfig(null);
      }
    }
  }, []);

  useEffect(() => {
    if (!config) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % config.pages.length);
    }, config.interval * 1000);

    return () => clearInterval(interval);
  }, [config]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight') {
        if (config) {
          setCurrentIndex((prev) => (prev + 1) % config.pages.length);
        }
      } else if (e.key === 'ArrowLeft') {
        if (config) {
          setCurrentIndex((prev) => (prev - 1 + config.pages.length) % config.pages.length);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isFullscreen, config]);

  const handlePageClick = (index: number) => {
    if (!config) return;
    const pagePath = config.pages[index];
    navigate(pagePath);
    onClose();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (!config) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="text-center text-white">
          <p className="mb-4">请先在报表页面配置轮播方案</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[var(--color-accent)] text-[var(--color-primary)] rounded-lg"
          >
            关闭
          </button>
        </div>
      </div>
    );
  }

  const currentPagePath = config.pages[currentIndex];
  const currentPage = allPages.find((p) => p.path === currentPagePath) || allPages[0];

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="w-full h-full relative">
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">
              {currentPage.icon} {currentPage.name}
            </h2>
            <span className="text-white/60 text-sm">
              {currentIndex + 1} / {config.pages.length}
            </span>
            {config.name && (
              <span className="px-2 py-1 bg-white/10 rounded text-sm text-white/80">
                {config.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-sm">
              {config.interval}秒/页
            </span>
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Maximize2 className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-10">
          {config.pages.map((pagePath, index) => {
            const page = allPages.find((p) => p.path === pagePath);
            if (!page) return null;

            return (
              <button
                key={index}
                onClick={() => handlePageClick(index)}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  currentIndex === index
                    ? 'bg-[var(--color-accent)] text-[var(--color-primary)] font-bold'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <span>{page.icon}</span>
                <span className="hidden md:inline">{page.name}</span>
              </button>
            );
          })}
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-accent)] transition-all linear"
              style={{
                width: `${((Date.now() % (config.interval * 1000)) / (config.interval * 1000)) * 100}%`,
                transitionDuration: '1s',
              }}
            />
          </div>
          <p className="text-white/60 text-xs text-center mt-2">
            按 ← → 键切换 · ESC 退出
          </p>
        </div>

        <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-dark)]">
          <iframe
            src={currentPagePath}
            className="w-full h-full border-0"
            title={currentPage.name}
          />
        </div>
      </div>
    </div>
  );
}
