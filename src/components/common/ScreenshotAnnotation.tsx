import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download, X, MessageSquare, Circle, Trash2 } from 'lucide-react';

interface Annotation {
  id: string;
  type: 'text' | 'circle';
  x: number;
  y: number;
  content?: string;
  radius?: number;
}

interface ScreenshotAnnotationProps {
  targetRef: React.RefObject<HTMLElement>;
  onClose: () => void;
}

export default function ScreenshotAnnotation({ targetRef, onClose }: ScreenshotAnnotationProps) {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'text' | 'circle'>('text');
  const [textInput, setTextInput] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const captureScreenshot = async () => {
    if (targetRef.current) {
      try {
        const canvas = await html2canvas(targetRef.current, {
          backgroundColor: '#0a0f1a',
          scale: 2,
          useCORS: true,
        });
        const dataUrl = canvas.toDataURL('image/png');
        setScreenshot(dataUrl);
      } catch (error) {
        console.error('截图失败:', error);
      }
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === 'text') {
      const content = prompt('输入标注文字:');
      if (content) {
        setAnnotations((prev) => [
          ...prev,
          { id: `ann-${Date.now()}`, type: 'text', x, y, content },
        ]);
      }
    } else {
      const newCircle: Annotation = {
        id: `ann-${Date.now()}`,
        type: 'circle',
        x,
        y,
        radius: 30,
      };
      setAnnotations((prev) => [...prev, newCircle]);
      setIsDrawing(true);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const moveRect = canvas.getBoundingClientRect();
        const newRadius = Math.sqrt(
          Math.pow(moveEvent.clientX - moveRect.left - x, 2) +
            Math.pow(moveEvent.clientY - moveRect.top - y, 2)
        );
        setAnnotations((prev) =>
          prev.map((ann) =>
            ann.id === newCircle.id ? { ...ann, radius: newRadius } : ann
          )
        );
      };

      const handleMouseUp = () => {
        setIsDrawing(false);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
      };

      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
    }
  };

  const deleteAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((ann) => ann.id !== id));
  };

  const downloadAnnotatedImage = () => {
    if (!screenshot) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      if (ctx) {
        ctx.drawImage(img, 0, 0);

        const scaleX = img.width / (canvasRef.current?.width || img.width);
        const scaleY = img.height / (canvasRef.current?.height || img.height);

        annotations.forEach((ann) => {
          const x = ann.x * scaleX;
          const y = ann.y * scaleY;

          ctx.strokeStyle = '#ff4757';
          ctx.fillStyle = '#ff4757';
          ctx.lineWidth = 3;

          if (ann.type === 'circle') {
            ctx.beginPath();
            ctx.arc(x, y, (ann.radius || 30) * scaleX, 0, Math.PI * 2);
            ctx.stroke();
          } else if (ann.type === 'text' && ann.content) {
            ctx.font = 'bold 24px sans-serif';
            ctx.fillText(ann.content, x, y);
          }
        });

        const link = document.createElement('a');
        link.download = `标注截图_${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };

    img.src = screenshot;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[var(--color-bg-card)] rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h3 className="font-semibold">截图标注</h3>
          <button onClick={onClose} className="p-2 hover:bg-[var(--color-bg-hover)] rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-[var(--color-border)] flex items-center gap-4">
          {!screenshot ? (
            <button
              onClick={captureScreenshot}
              className="px-4 py-2 bg-[var(--color-accent)] text-[var(--color-primary)] rounded-lg font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              截取当前画面
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTool('text')}
                  className={`p-2 rounded-lg ${
                    currentTool === 'text'
                      ? 'bg-[var(--color-accent)] text-[var(--color-primary)]'
                      : 'bg-[var(--color-bg-dark)]'
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentTool('circle')}
                  className={`p-2 rounded-lg ${
                    currentTool === 'circle'
                      ? 'bg-[var(--color-accent)] text-[var(--color-primary)]'
                      : 'bg-[var(--color-bg-dark)]'
                  }`}
                >
                  <Circle className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 text-sm text-[var(--color-text-secondary)]">
                {currentTool === 'text' ? '点击画布添加文字标注' : '点击拖拽绘制圆形标注'}
              </div>
              <button
                onClick={downloadAnnotatedImage}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                下载
              </button>
            </>
          )}
        </div>

        <div className="flex-1 overflow-auto p-4">
          {screenshot ? (
            <div className="relative inline-block">
              <img src={screenshot} alt="截图" className="max-w-full" />
              <canvas
                ref={canvasRef}
                width={screenshot ? 1200 : 0}
                height={screenshot ? 675 : 0}
                className="absolute top-0 left-0 w-full h-full cursor-crosshair"
                onClick={handleCanvasClick}
              />
              {annotations.map((ann) => (
                <div
                  key={ann.id}
                  className="absolute"
                  style={{
                    left: ann.x,
                    top: ann.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {ann.type === 'text' ? (
                    <div className="relative group">
                      <span className="px-2 py-1 bg-red-500 text-white rounded text-sm font-bold shadow-lg">
                        {ann.content}
                      </span>
                      <button
                        onClick={() => deleteAnnotation(ann.id)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative group">
                      <div
                        className="border-2 border-red-500 rounded-full"
                        style={{
                          width: (ann.radius || 30) * 2,
                          height: (ann.radius || 30) * 2,
                          marginLeft: -(ann.radius || 30),
                          marginTop: -(ann.radius || 30),
                        }}
                      />
                      <button
                        onClick={() => deleteAnnotation(ann.id)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[var(--color-text-secondary)]">
              <div className="text-center">
                <p className="mb-2">点击下方按钮截取当前画面</p>
                <p className="text-sm">截取后可添加文字或圆形标注</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
