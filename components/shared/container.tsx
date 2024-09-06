import { cn } from '@/lib/utils';
import React from 'react';

interface ContainerProps {
  className?: string;
}

export const Container: React.FC<React.PropsWithChildren<ContainerProps>> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('mx-auto max-w-[1280px]', className)}>{children}</div>
  );
};