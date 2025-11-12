'use client';

import { ComponentProps, ComponentType } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

// Tips: ComponentProps<typeof Button> -> 引用元であるButtonコンポーネントで定義しているpropsを全て継承し、onClick, disabled, variant, size, classNameなど使えるようにする
interface IconButtonProps extends ComponentProps<typeof Button> {
  icon: ComponentType<{ className?: string }>;
  isPending?: boolean;
  iconClassName?: string;
}

export function IconButton({
  icon: Icon,
  isPending = false,
  disabled,
  className,
  iconClassName = 'text-neutral-700',
  children,
  ...props
}: IconButtonProps) {
  return (
    <Button disabled={disabled || isPending} className={cn('flex items-center gap-3', className)} {...props}>
      <Icon className={iconClassName} />
      {isPending ? <Spinner /> : children}
    </Button>
  );
}
