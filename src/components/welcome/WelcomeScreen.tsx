import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { LogoMark } from '@/components/ui/Logo';

const STEPS = [
  'Conecta una cuenta, sin dar la clave',
  'Mira tu disponible',
  'Pregunta si puedes hacer un gasto',
  'Revisa qué estás pagando sin usar',
];

/** Portada pública (QR del jurado). Página completa, fuera del PhoneFrame y de la barra de demo. */
export function WelcomeScreen() {
  return (
    <div className="min-h-full bg-[#F4F1EC]">
      <main className="mx-auto flex w-full max-w-xl animate-fade-up flex-col px-6 pb-12 pt-10 sm:pt-16">
        <span className="inline-flex items-center gap-2">
          <LogoMark />
          <span className="text-lg font-extrabold tracking-tight text-ink">CIFRA</span>
        </span>

        <h1 className="mt-10 text-[2rem] font-extrabold leading-[1.12] tracking-tight text-ink sm:text-[2.6rem]">
          Tu banco te dice cuánto tienes.{' '}
          <span className="text-primary">CIFRA te dice cuánto puedes gastar.</span>
        </h1>

        <p className="mt-6 text-base leading-relaxed text-ink-muted">
          <strong className="font-bold text-ink">41 de las 48 personas</strong> que entrevistamos se
          quedaron sin plata antes de lo que esperaban.{' '}
          <strong className="font-bold text-ink">40</strong> no llevan ningún registro que les dé una
          cifra.
        </p>

        <div className="mt-8 rounded-2xl border border-[#DDD8CF] bg-[#FBF9F5] p-5">
          <p className="text-base font-semibold leading-snug text-ink">
            Una sola cifra: lo que entró, menos lo que ya está comprometido, menos lo que vas a
            gastar antes de tu próximo ingreso.
          </p>
        </div>

        <section aria-labelledby="recorrido" className="mt-10">
          <p id="recorrido" className="text-sm leading-relaxed text-ink-muted">
            Prototipo navegable con un caso de ejemplo. No necesitas cuenta ni contraseña. El
            recorrido toma dos minutos.
          </p>
          <ol className="mt-4 space-y-2">
            {STEPS.map((step, i) => (
              <li
                key={step}
                className="flex items-center gap-3 rounded-xl border border-[#DDD8CF] bg-[#FBF9F5] px-4 py-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-ink">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <Link
          to="/user/connect"
          className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-base font-semibold text-white shadow-[0_8px_20px_-8px_rgba(14,110,99,0.55)] transition-all duration-200 ease-out hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          Empezar el recorrido
          <ArrowRight size={18} />
        </Link>

        <Link
          to="/merchant/onboarding"
          className="mt-5 self-center text-sm font-medium text-ink-muted underline decoration-[#DDD8CF] underline-offset-4 transition-colors hover:text-primary"
        >
          Ver el lado del negocio
        </Link>
      </main>
    </div>
  );
}
