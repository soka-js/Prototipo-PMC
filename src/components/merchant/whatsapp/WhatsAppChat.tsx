import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, Camera, Mic, MoreVertical, Paperclip, Phone, SendHorizontal, Smile, Video } from 'lucide-react';
import { LogoMark } from '@/components/ui/Logo';

function ChatHeader({ status, back }: { status: string; back?: string }) {
  const navigate = useNavigate();
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 bg-wa-header px-2 text-white">
      <button
        type="button"
        aria-label="Volver"
        onClick={() => (back ? navigate(back) : navigate(-1))}
        className="rounded-full p-1.5 transition-colors hover:bg-white/10"
      >
        <ArrowLeft size={20} />
      </button>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
        <LogoMark size={24} />
      </span>
      <div className="min-w-0 flex-1 leading-tight">
        <p className="flex items-center gap-1 whitespace-nowrap text-[15px] font-semibold">
          CIFRA Negocios
          <BadgeCheck size={15} className="shrink-0 fill-[#25D366] text-wa-header" />
        </p>
        <p className="truncate text-xs text-white/75">{status}</p>
      </div>
      <Video size={20} className="mx-1 shrink-0 opacity-90" aria-hidden="true" />
      <Phone size={18} className="mx-1 shrink-0 opacity-90" aria-hidden="true" />
      <MoreVertical size={20} className="shrink-0 opacity-90" aria-hidden="true" />
    </header>
  );
}

export function ChatInput({
  onSend,
  suggestions,
}: {
  onSend?: (text: string) => void;
  suggestions?: string[];
}) {
  const [text, setText] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!onSend || !text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <div className="shrink-0 pb-3 sm:pb-5">
      {onSend && suggestions && suggestions.length > 0 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-2 pb-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSend(s)}
              className="shrink-0 rounded-full border border-wa-teal/30 bg-white px-3 py-1.5 text-xs font-medium text-wa-header transition-all duration-200 hover:bg-[#F0FAF7] active:scale-95"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <form onSubmit={submit} className="flex items-end gap-1.5 px-2">
        <div className="flex h-11 flex-1 items-center gap-2 rounded-full bg-white px-3 shadow-sm">
          <Smile size={20} className="text-[#8696A0]" aria-hidden="true" />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!onSend}
            placeholder="Mensaje"
            aria-label="Escribe un mensaje"
            className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#8696A0] disabled:cursor-not-allowed"
          />
          <Paperclip size={19} className="text-[#8696A0]" aria-hidden="true" />
          <Camera size={19} className="text-[#8696A0]" aria-hidden="true" />
        </div>
        <button
          type="submit"
          aria-label={text ? 'Enviar' : 'Nota de voz'}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-wa-teal text-white transition-transform duration-150 active:scale-90"
        >
          {text ? <SendHorizontal size={19} /> : <Mic size={19} />}
        </button>
      </form>
    </div>
  );
}

/** Contenedor completo de chat estilo WhatsApp: encabezado, fondo con patrón y barra de entrada. */
export function WhatsAppChat({
  children,
  footer,
  status = 'cuenta de empresa',
  back,
}: {
  children: ReactNode;
  footer?: ReactNode;
  status?: string;
  back?: string;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  // Baja al último mensaje cada vez que cambia el contenido del chat.
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const toBottom = () => el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    const observer = new MutationObserver(toBottom);
    observer.observe(el, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader status={status} back={back} />
      <div ref={bodyRef} className="wa-pattern no-scrollbar flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-3">
        {children}
      </div>
      <div className="wa-pattern">{footer ?? <ChatInput />}</div>
    </div>
  );
}
