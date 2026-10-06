export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="12" cy="16" r="8" fill="#0E6E63" fillOpacity="0.9" />
      <circle cx="20" cy="16" r="8" fill="#6FB8AE" fillOpacity="0.85" />
    </svg>
  );
}

export function Logo({ suffix, light = false }: { suffix?: string; light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark />
      <span className={`text-base font-bold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
        CIFRA
        {suffix && (
          <span className={`ml-1 font-medium ${light ? 'text-white/70' : 'text-ink-muted'}`}>
            {suffix}
          </span>
        )}
      </span>
    </span>
  );
}
