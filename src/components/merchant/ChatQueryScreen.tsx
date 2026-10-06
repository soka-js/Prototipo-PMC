import { useEffect, useState } from 'react';
import { Coffee, Cookie, Store } from 'lucide-react';
import { useSequence } from '@/lib/useSequence';
import { ChatBubble, DateChip, TypingBubble, VoiceNote } from './whatsapp/ChatBubble';
import { ChatInput, WhatsAppChat } from './whatsapp/WhatsAppChat';

const PEAK_ANSWER = 'Entre 7 y 9 de la mañana, y otra vez a las 6 de la tarde.';

function reply(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('hora')) return PEAK_ANSWER;
  if (q.includes('oferta') || q.includes('campaña'))
    return 'Tu oferta de Combo Café con Pan lleva 23 clientes nuevos. Pagaste $46.000 en total y 9 ya volvieron.';
  if (q.includes('vende') || q.includes('más') || q.includes('mas'))
    return 'En tu zona lo que más sale es pan y café (38%), luego bebidas y lácteos (27%).';
  return 'Buena pregunta. La reviso con los datos de tu cuadra y te cuento en el reporte del lunes.';
}

interface Extra {
  from: 'me' | 'bot';
  text: string;
}

function now() {
  const d = new Date();
  const h = d.getHours();
  return `${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')} ${h < 12 ? 'a. m.' : 'p. m.'}`;
}

export function ChatQueryScreen() {
  const intro = useSequence(2, { start: 0, delay: 1200 });
  const [extra, setExtra] = useState<(Extra & { time: string })[]>([]);
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => {
      setExtra((e) => [...e, { from: 'bot', text: reply(pending), time: now() }]);
      setPending(null);
    }, 1300);
    return () => clearTimeout(t);
  }, [pending]);

  const send = (text: string) => {
    if (pending) return;
    setExtra((e) => [...e, { from: 'me', text, time: now() }]);
    setPending(text);
  };

  const typing = intro.typing || pending !== null;

  return (
    <WhatsAppChat
      back="/merchant/campaign-results"
      status={typing ? 'escribiendo…' : 'cuenta de empresa'}
      footer={
        <ChatInput
          onSend={intro.done ? send : undefined}
          suggestions={['¿Qué se vende más?', '¿Cómo va mi oferta?']}
        />
      }
    >
      <DateChip>Hoy</DateChip>

      <ChatBubble from="me" time="5:48 p. m.">
        <VoiceNote duration="0:04" transcript="¿a qué hora compran más por acá?" />
      </ChatBubble>

      {intro.visible >= 1 && (
        <ChatBubble from="bot" time="5:48 p. m.">
          {PEAK_ANSWER}
        </ChatBubble>
      )}

      {intro.visible >= 2 && (
        <ChatBubble from="bot" time="5:48 p. m." wide flush>
          <div className="px-3 pt-2.5">
            <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-wa-header">
              <Store size={14} /> Consejo de barrio
            </p>
          </div>
          <ul className="space-y-2 px-3 py-2 text-[14px]">
            <li className="flex gap-2">
              <Coffee size={16} className="mt-0.5 shrink-0 text-[#8A5A2B]" />
              <span>
                <strong className="font-semibold">En la mañana:</strong> pan recién horneado y café para
                llevar.
              </span>
            </li>
            <li className="flex gap-2">
              <Cookie size={16} className="mt-0.5 shrink-0 text-[#8A5A2B]" />
              <span>
                <strong className="font-semibold">Al caer la tarde:</strong> snacks y bebidas.
              </span>
            </li>
          </ul>
        </ChatBubble>
      )}

      {extra.map((m, i) => (
        <ChatBubble key={i} from={m.from} time={m.time}>
          {m.text}
        </ChatBubble>
      ))}

      {typing && <TypingBubble />}
    </WhatsAppChat>
  );
}
