import type { ReactNode } from 'react';

type Tone = 'primary' | 'terracotta' | 'neutral' | 'amber';

const TONES: Record<Tone, string> = {
  primary: 'bg-primary-light text-primary-dark',
  terracotta: 'bg-terracotta-light text-terracotta',
  neutral: 'bg-surface-subtle text-ink-muted',
  amber: 'bg-[#FDF3E1] text-[#8A5A12]',
};

export function Pill({
  tone = 'primary',
  icon,
  children,
  className = '',
}: {
  tone?: Tone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${TONES[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
