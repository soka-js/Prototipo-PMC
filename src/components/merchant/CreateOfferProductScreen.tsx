import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PRODUCTS } from '@/lib/data';
import { useSequence } from '@/lib/useSequence';
import { useAppStore, type MerchantProduct } from '@/store/useAppStore';
import { ChatBubble, DateChip, TypingBubble } from './whatsapp/ChatBubble';
import { WhatsAppChat } from './whatsapp/WhatsAppChat';

export function CreateOfferProductScreen() {
  const navigate = useNavigate();
  const selectProduct = useAppStore((s) => s.selectProduct);
  const current = useAppStore((s) => s.offer.product);
  const { visible, typing } = useSequence(1, { delay: 900 });

  const choose = (p: MerchantProduct) => {
    selectProduct(p);
    navigate('/merchant/create-offer-2');
  };

  return (
    <WhatsAppChat back="/merchant/weekly-report" status={typing ? 'escribiendo…' : 'cuenta de empresa'}>
      <DateChip>Lunes</DateChip>
      <ChatBubble from="bot" time="7:30 a. m.">
        <strong className="font-semibold">Sugerencia recomendada:</strong> Prueba un descuento en café con
        pan antes de las 9:00 am.
      </ChatBubble>
      <ChatBubble from="me" time="7:32 a. m.">
        + Crear oferta
      </ChatBubble>

      {typing && <TypingBubble />}
      {visible > 0 && (
        <ChatBubble from="bot" time="7:32 a. m." wide flush>
          <p className="px-3 pb-2 pt-2.5 font-medium">¿Sobre qué producto quieres activar la oferta?</p>
          <ul className="border-t border-black/5">
            {(Object.keys(PRODUCTS) as MerchantProduct[]).map((key) => {
              const p = PRODUCTS[key];
              return (
                <li key={key} className="border-b border-black/5 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => choose(key)}
                    className={`flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors duration-200 hover:bg-[#F5F6F6] active:bg-[#E9EDEF] ${
                      current === key ? 'bg-[#F0FAF7]' : ''
                    }`}
                  >
                    <span className="flex-1">
                      <span className="block text-[14.5px] font-semibold text-[#027EB5]">{p.label}</span>
                      {p.highlight && (
                        <span className="block text-[12px] font-medium text-[#8A5A12]">{p.highlight}</span>
                      )}
                      <span className="block text-[12px] text-[#667781]">{p.hint}</span>
                    </span>
                    <ChevronRight size={16} className="text-[#8696A0]" />
                  </button>
                </li>
              );
            })}
          </ul>
        </ChatBubble>
      )}
    </WhatsAppChat>
  );
}
