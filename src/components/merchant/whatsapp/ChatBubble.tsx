import type { ReactNode } from 'react';
import { CheckCheck, Pause, Play } from 'lucide-react';
import { useState } from 'react';

export type Sender = 'bot' | 'me';

export function ChatBubble({
  from,
  time,
  children,
  wide = false,
  flush = false,
}: {
  from: Sender;
  time: string;
  children: ReactNode;
  /** Ocupa casi todo el ancho (tarjetas ricas). */
  wide?: boolean;
  /** Sin padding interno (para tarjetas con imagen o secciones). */
  flush?: boolean;
}) {
  const mine = from === 'me';
  return (
    <div className={`flex animate-fade-up ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={[
          'relative rounded-xl text-[14.5px] leading-snug text-[#111B21] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]',
          mine ? 'rounded-tr-none bg-wa-sent' : 'rounded-tl-none bg-wa-received',
          wide ? 'w-[92%]' : 'max-w-[82%]',
          flush ? 'overflow-hidden' : 'px-2.5 pb-1.5 pt-1.5',
        ].join(' ')}
      >
        {children}
        <span
          className={`flex items-center justify-end gap-1 text-[11px] text-[#667781] ${
            flush ? 'px-2.5 pb-1.5' : '-mb-0.5 mt-0.5'
          }`}
        >
          {time}
          {mine && <CheckCheck size={15} className="text-wa-check" aria-label="Leído" />}
        </span>
      </div>
    </div>
  );
}

export interface ReplyButton {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

/** Botones de respuesta rápida pegados bajo un mensaje, como en WhatsApp Business. */
export function ReplyButtons({ buttons, columns = 1 }: { buttons: ReplyButton[]; columns?: 1 | 3 }) {
  return (
    <div className={`grid w-[82%] animate-fade-up gap-1 ${columns === 3 ? 'grid-cols-3' : 'grid-cols-1'}`}>
      {buttons.map((b) => (
        <button
          key={b.label}
          type="button"
          onClick={b.onClick}
          disabled={b.disabled}
          className={[
            'flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[14px] font-semibold shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] transition-all duration-200 ease-out active:scale-[0.97]',
            b.selected ? 'bg-wa-teal text-white' : 'bg-white text-[#027EB5] hover:bg-[#F5F6F6]',
            'disabled:cursor-default disabled:active:scale-100',
            b.disabled && !b.selected ? 'opacity-60' : '',
          ].join(' ')}
        >
          {b.icon}
          {b.label}
        </button>
      ))}
    </div>
  );
}

export function DateChip({ children }: { children: ReactNode }) {
  return (
    <div className="my-1 flex justify-center">
      <span className="rounded-lg bg-white/90 px-3 py-1 text-[11.5px] font-medium uppercase text-[#54656F] shadow-sm">
        {children}
      </span>
    </div>
  );
}

export function SystemNote({ children }: { children: ReactNode }) {
  return (
    <div className="my-1 flex justify-center">
      <span className="max-w-[88%] rounded-lg bg-[#FFF5C4] px-3 py-1.5 text-center text-[11.5px] leading-snug text-[#54656F] shadow-sm">
        {children}
      </span>
    </div>
  );
}

export function TypingBubble() {
  return (
    <div className="flex animate-fade-up justify-start" aria-label="Escribiendo">
      <div className="flex gap-1 rounded-xl rounded-tl-none bg-white px-3.5 py-3 shadow-sm">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            className="h-2 w-2 animate-bounce rounded-full bg-[#8696A0]"
            style={{ animationDelay: `${d}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

const WAVE = [6, 10, 16, 8, 20, 12, 18, 7, 14, 22, 10, 16, 6, 12, 18, 9, 14, 8, 11, 5, 9, 13];

export function VoiceNote({ duration, transcript }: { duration: string; transcript: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="w-60">
      <div className="flex items-center gap-2 py-1">
        <button
          type="button"
          aria-label={playing ? 'Pausar nota de voz' : 'Reproducir nota de voz'}
          onClick={() => {
            setPlaying(true);
            setTimeout(() => setPlaying(false), 2000);
          }}
          className="text-[#54656F]"
        >
          {playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
        </button>
        <div className="flex h-6 flex-1 items-center gap-[2px]" aria-hidden="true">
          {WAVE.map((h, i) => (
            <span
              key={i}
              className={`w-[3px] rounded-full transition-colors duration-300 ${
                playing ? 'bg-wa-teal' : 'bg-[#8FA79C]'
              }`}
              style={{ height: h }}
            />
          ))}
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F1E4D6] text-xs font-bold text-[#7A4B2A]">
          H
        </span>
      </div>
      <p className="text-[11px] text-[#667781]">{duration}</p>
      <p className="mt-1 border-t border-black/5 pt-1 text-[13px] italic text-[#3B4A54]">“{transcript}”</p>
    </div>
  );
}
