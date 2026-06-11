import { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[var(--color-accent-hover)] shadow-lg hover:shadow-[var(--color-accent)] hover:shadow-lg',
    secondary: 'bg-[var(--color-bg-hover)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)]',
    danger: 'bg-[var(--color-danger)] text-white hover:bg-red-600 shadow-lg',
    success: 'bg-[var(--color-success)] text-white hover:bg-green-600 shadow-lg',
    ghost: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
