import { BatteryFull, Signal, Wifi } from 'lucide-react';

export function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`hidden h-11 shrink-0 items-center justify-between px-7 text-[13px] font-semibold sm:flex ${
        dark ? 'bg-wa-header text-white' : 'text-ink'
      }`}
      aria-hidden="true"
    >
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        <Signal size={14} strokeWidth={2.5} />
        <Wifi size={14} strokeWidth={2.5} />
        <BatteryFull size={18} strokeWidth={2} />
      </span>
    </div>
  );
}
