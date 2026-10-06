import type { HTMLAttributes } from 'react';

export function Card({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-3xl border border-soft bg-surface-card ${className}`} {...rest} />;
}
