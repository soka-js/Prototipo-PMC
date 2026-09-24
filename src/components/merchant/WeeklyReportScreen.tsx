import { Link, useNavigate } from 'react-router-dom';
import { Coffee, Lightbulb, Plus, TrendingUp } from 'lucide-react';
import { MERCHANT } from '@/lib/data';
import { ChatBubble, DateChip, ReplyButtons } from './whatsapp/ChatBubble';
import { WhatsAppChat } from './whatsapp/WhatsAppChat';

const LINES = [
  {
    Icon: TrendingUp,
    lead: 'Esta semana en tu zona:',
    text: 'Se consumió 30% más pan en las mañanas.',
  },
  {
    Icon: Coffee,
    lead: 'Estás dejando pasar:',
    text: '40 personas de tu cuadra compraron café en otro barrio.',
  },
  {
    Icon: Lightbulb,
    lead: 'Sugerencia recomendada:',
    text: 'Prueba un descuento en café con pan antes de las 9:00 am.',
  },
];

export function WeeklyReportScreen() {
  const navigate = useNavigate();

  return (
    <WhatsAppChat back="/merchant/onboarding">
      <DateChip>Lunes</DateChip>

      <ChatBubble from="bot" time="7:30 a. m." wide flush>
        <div className="bg-[#E7F3EF] px-3 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-wa-header">
            Reporte semanal · {MERCHANT.zone}
          </p>
          <p className="text-[15px] font-bold">Buenos días, {MERCHANT.owner}</p>
        </div>
        <ul className="space-y-3 px-3 py-3">
          {LINES.map(({ Icon, lead, text }) => (
            <li key={lead} className="flex gap-2.5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F0F2F5] text-wa-header">
                <Icon size={15} />
              </span>
              <p>
                <strong className="font-semibold">{lead}</strong> {text}
              </p>
            </li>
          ))}
        </ul>
        <div className="border-t border-black/5 px-3 py-2">
          <Link
            to="/merchant/dashboard"
            className="text-[13.5px] font-medium text-[#027EB5] hover:underline"
          >
            Ver tendencias de tu zona (resumen web) →
          </Link>
        </div>
      </ChatBubble>

      <ReplyButtons
        buttons={[
          {
            label: 'Crear oferta',
            icon: <Plus size={17} strokeWidth={2.6} />,
            onClick: () => navigate('/merchant/create-offer-1'),
          },
        ]}
      />
    </WhatsAppChat>
  );
}
