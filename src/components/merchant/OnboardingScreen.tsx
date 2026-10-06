import { useNavigate } from 'react-router-dom';
import { FileBarChart, RotateCcw } from 'lucide-react';
import { useSequence } from '@/lib/useSequence';
import { ChatBubble, DateChip, ReplyButtons, SystemNote, TypingBubble, type Sender } from './whatsapp/ChatBubble';
import { WhatsAppChat } from './whatsapp/WhatsAppChat';

const SCRIPT: { from: Sender; text: string; time: string }[] = [
  {
    from: 'bot',
    text: '¡Hola! Soy CIFRA. Te ayudo a traer clientes de tu cuadra sin pagar nada fijo. ¿Qué tipo de negocio tienes y qué productos vendes principalmente?',
    time: '10:14 a. m.',
  },
  {
    from: 'me',
    text: 'Tengo una tienda de barrio y cigarrería, vendo abarrotes, gaseosas, pan y café caliente.',
    time: '10:15 a. m.',
  },
  {
    from: 'bot',
    text: '¡Excelente! ¿En qué barrio y dirección aproximada de Bogotá estás ubicado?',
    time: '10:15 a. m.',
  },
  { from: 'me', text: 'Chapinero Central, por la carrera 13 con 54.', time: '10:16 a. m.' },
  {
    from: 'bot',
    text: 'Listo don Hernando, tu tienda quedó registrada en la zona Chapinero. Cero costos fijos ni registros.',
    time: '10:16 a. m.',
  },
];

export function OnboardingScreen() {
  const navigate = useNavigate();
  const { visible, typing, done, reset } = useSequence(SCRIPT.length, {
    delay: 1300,
    typingBefore: (i) => SCRIPT[i].from === 'bot',
  });

  return (
    <WhatsAppChat status={typing ? 'escribiendo…' : 'cuenta de empresa'}>
      <DateChip>Hoy</DateChip>
      <SystemNote>
        Los mensajes y las llamadas están cifrados de extremo a extremo. Esta es una cuenta de empresa.
      </SystemNote>

      {SCRIPT.slice(0, visible).map((m, i) => (
        <ChatBubble key={i} from={m.from} time={m.time}>
          {m.text}
        </ChatBubble>
      ))}
      {typing && <TypingBubble />}

      {done && (
        <ReplyButtons
          buttons={[
            {
              label: 'Ver mi primer reporte',
              icon: <FileBarChart size={16} />,
              onClick: () => navigate('/merchant/weekly-report'),
            },
            { label: 'Repetir alta', icon: <RotateCcw size={15} />, onClick: reset },
          ]}
        />
      )}
    </WhatsAppChat>
  );
}
