import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ShieldCheck } from 'lucide-react';
import { COMMISSION_PER_CUSTOMER, DISCOUNTS, PRODUCTS } from '@/lib/data';
import { cop } from '@/lib/format';
import { useAppStore } from '@/store/useAppStore';
import { ChatBubble, DateChip, ReplyButtons, TypingBubble } from './whatsapp/ChatBubble';
import { WhatsAppChat } from './whatsapp/WhatsAppChat';

type Phase = 'asking' | 'ask' | 'sent' | 'done';

export function CreateOfferDiscountScreen() {
  const navigate = useNavigate();
  const product = useAppStore((s) => s.offer.product) ?? 'combo';
  const selectDiscount = useAppStore((s) => s.selectDiscount);
  const [phase, setPhase] = useState<Phase>('asking');
  const [discount, setDiscount] = useState<number | null>(null);

  useEffect(() => {
    const next: Partial<Record<Phase, Phase>> = { asking: 'ask', sent: 'done' };
    const to = next[phase];
    if (!to) return;
    const t = setTimeout(() => setPhase(to), phase === 'asking' ? 900 : 1400);
    return () => clearTimeout(t);
  }, [phase]);

  const choose = (d: number) => {
    if (discount !== null) return;
    setDiscount(d);
    selectDiscount(d);
    setPhase('sent');
  };

  const typing = phase === 'asking' || phase === 'sent';

  return (
    <WhatsAppChat back="/merchant/create-offer-1" status={typing ? 'escribiendo…' : 'cuenta de empresa'}>
      <DateChip>Lunes</DateChip>
      <ChatBubble from="bot" time="7:32 a. m.">
        ¿Sobre qué producto quieres activar la oferta?
      </ChatBubble>
      <ChatBubble from="me" time="7:33 a. m.">
        {PRODUCTS[product].label}
      </ChatBubble>

      {phase !== 'asking' && (
        <>
          <ChatBubble from="bot" time="7:33 a. m.">
            ¿Cuánto descuento quieres ofrecer?
          </ChatBubble>
          <ReplyButtons
            columns={3}
            buttons={DISCOUNTS.map((d) => ({
              label: `${d}%`,
              onClick: () => choose(d),
              selected: discount === d,
              disabled: discount !== null,
            }))}
          />
        </>
      )}

      {discount !== null && (
        <ChatBubble from="me" time="7:34 a. m.">
          {discount}%
        </ChatBubble>
      )}

      {typing && <TypingBubble />}

      {phase === 'done' && discount !== null && (
        <>
          <ChatBubble from="bot" time="7:34 a. m." wide flush>
            <div className="px-3 pt-2.5">
              <p>
                <strong className="font-semibold">Listo. Tu oferta está activa.</strong> Solo pagas por los
                clientes reales que lleguen a tu local.
              </p>
              <p className="mt-2 rounded-lg bg-[#F0F2F5] px-2.5 py-1.5 text-[13px] text-[#3B4A54]">
                {PRODUCTS[product].label} · {discount}% · antes de las 9:00 a. m. · 7 días
              </p>
            </div>
            <div className="mx-3 mb-1 mt-2 rounded-xl border border-[#CDE7DE] bg-[#F0FAF7] p-2.5">
              <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-wa-header">
                <ShieldCheck size={14} /> Modelo de Éxito Seguro
              </p>
              <p className="mt-1 text-[13.5px]">
                Comisión de {cop(COMMISSION_PER_CUSTOMER)} únicamente si el cliente paga con su tarjeta
                vinculada a CIFRA. Si nadie compra, pagas $0.
              </p>
            </div>
          </ChatBubble>
          <ReplyButtons
            buttons={[
              {
                label: 'Ver estado de campaña',
                icon: <BarChart3 size={16} />,
                onClick: () => navigate('/merchant/campaign-results'),
              },
            ]}
          />
        </>
      )}
    </WhatsAppChat>
  );
}
