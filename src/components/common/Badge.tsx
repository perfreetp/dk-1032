interface BadgeProps {
  status: 'normal' | 'warning' | 'error' | 'offline' | 'pending' | 'processing' | 'resolved' | 'closed' | 'smooth' | 'slow' | 'congested' | 'low' | 'medium' | 'high' | 'critical';
  label?: string;
  size?: 'sm' | 'md';
}

export default function Badge({ status, label, size = 'md' }: BadgeProps) {
  const getStatusConfig = () => {
    const configs: Record<string, { bg: string; text: string; label: string }> = {
      normal: { bg: 'bg-green-500/20', text: 'text-green-400', label: '正常' },
      smooth: { bg: 'bg-green-500/20', text: 'text-green-400', label: '畅通' },
      slow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: '缓慢' },
      congested: { bg: 'bg-red-500/20', text: 'text-red-400', label: '拥堵' },
      warning: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: '警告' },
      error: { bg: 'bg-red-500/20', text: 'text-red-400', label: '异常' },
      offline: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: '离线' },
      pending: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: '待处理' },
      processing: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: '处理中' },
      resolved: { bg: 'bg-green-500/20', text: 'text-green-400', label: '已解决' },
      closed: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: '已关闭' },
      low: { bg: 'bg-green-500/20', text: 'text-green-400', label: '低' },
      medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: '中' },
      high: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: '高' },
      critical: { bg: 'bg-red-500/20', text: 'text-red-400', label: '紧急' },
    };
    return configs[status] || configs.normal;
  };

  const config = getStatusConfig();
  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`${config.bg} ${config.text} ${sizeStyles} rounded-full font-medium inline-flex items-center gap-1`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.text.replace('text-', 'bg-')}`} />
      {label || config.label}
    </span>
  );
}
