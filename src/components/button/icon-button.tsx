'use client';

import { ComponentType, ReactNode } from 'react';
import { type VariantProps } from 'class-variance-authority';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface IconButtonProps extends VariantProps<typeof buttonVariants> {
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  iconClassName?: string;
}

export function IconButton({
  icon: Icon,
  children,
  onClick,
  disabled = false,
  loading = false,
  className,
  variant = 'secondary',
  size = 'default',
  iconClassName,
}: IconButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn('w-full flex items-center gap-3', className)}
      variant={variant}
      size={size}
    >
      <Icon className={cn('text-neutral-700', iconClassName)} />
      {loading ? 'Loading...' : children}
    </Button>
  );
}
