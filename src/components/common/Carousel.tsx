import { useState, useEffect } from 'react';
import { X, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const pages = [
  { path: '/', name: '总览', icon: '📊' },
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
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pages.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % pages.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + pages.length) % pages.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isFullscreen]);

  const handlePageClick = (index: number) => {
    const page = pages[index];
    navigate(page.path);
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

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="w-full h-full relative">
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">
              {pages[currentIndex].icon} {pages[currentIndex].name}
            </h2>
            <span className="text-white/60 text-sm">
              {currentIndex + 1} / {pages.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
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
          {pages.map((page, index) => (
            <button
              key={page.path}
              onClick={() => handlePageClick(index)}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentIndex === index
                  ? 'bg-[var(--color-accent)] text-[var(--color-primary)] font-bold'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {page.icon}
            </button>
          ))}
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-accent)] transition-all duration-[10000ms] linear"
              style={{ width: `${((Date.now() % 10000) / 10000) * 100}%` }}
            />
          </div>
          <p className="text-white/60 text-xs text-center mt-2">
            按 ← → 键切换 · ESC 退出
          </p>
        </div>

        <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-dark)]">
          <iframe
            src={pages[currentIndex].path}
            className="w-full h-full border-0"
            title={pages[currentIndex].name}
          />
        </div>
      </div>
    </div>
  );
}
