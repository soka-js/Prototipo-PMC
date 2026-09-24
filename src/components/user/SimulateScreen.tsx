import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Delete, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { cop } from '@/lib/format';
import { useAppStore } from '@/store/useAppStore';

const QUICK_AMOUNTS = [20000, 45000, 65000, 120000];
const MAX_DIGITS = 7;
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'] as const;

export function SimulateScreen() {
  const navigate = useNavigate();
  const simulateExpense = useAppStore((s) => s.simulateExpense);
  const dailyAvailable = useAppStore((s) => s.dailyAvailable);
  const [digits, setDigits] = useState('65000');
  const [pressed, setPressed] = useState<string | null>(null);

  const amount = Number(digits || '0');

  const press = useCallback((key: string) => {
    setPressed(key);
    setTimeout(() => setPressed(null), 120);
    setDigits((d) => {
      if (key === 'clear') return '';
      if (key === 'back') return d.slice(0, -1);
      if (d.length >= MAX_DIGITS) return d;
      if (d === '' && key === '0') return d;
      return d + key;
    });
  }, []);

  const submit = useCallback(() => {
    if (amount > 0) navigate(simulateExpense(amount));
  }, [amount, navigate, simulateExpense]);

  // Teclado físico
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === 'Backspace') press('back');
      else if (e.key === 'Escape') press('clear');
      else if (e.key === 'Enter') submit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [press, submit]);

  return (
    <div className="flex flex-1 flex-col">
      <ScreenHeader back="/user/home" />

      <div className="px-6">
        <h1 className="text-[26px] font-extrabold tracking-tight">¿Cuánto quieres gastar?</h1>
        <p className="mt-1.5 text-[15px] text-ink-muted">
          Calculamos si llegas tranquila al 30 de mes sin apretarte.
        </p>
      </div>

      <div className="flex flex-col items-center px-6 pt-8" aria-live="polite">
        <p className="tabular flex items-center text-[52px] font-extrabold leading-none tracking-[-0.03em]">
          <span className={amount === 0 ? 'text-ink-muted/50' : ''}>{cop(amount)}</span>
          <span className="ml-1 inline-block h-12 w-[3px] animate-blink rounded-full bg-primary" aria-hidden="true" />
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1.5 text-xs font-semibold text-primary-dark">
          <Sun size={14} />
          Tu disponible diario hoy es de {cop(dailyAvailable)}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-1.5 px-5">
        {QUICK_AMOUNTS.map((q) => {
          const active = amount === q;
          return (
            <button
              key={q}
              type="button"
              onClick={() => setDigits(String(q))}
              className={[
                'rounded-full border px-1 py-2 text-[13px] font-semibold transition-all duration-200 ease-out active:scale-95',
                active
                  ? 'border-primary bg-primary text-white'
                  : 'border-soft bg-surface-card text-ink hover:border-[#DCD7CE]',
              ].join(' ')}
            >
              {cop(q)}
            </button>
          );
        })}
      </div>

      <div className="mt-auto px-4 pb-5 pt-5">
        <div className="grid grid-cols-3 gap-1.5">
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => press(key)}
              aria-label={key === 'back' ? 'Borrar un dígito' : key === 'clear' ? 'Borrar todo' : key}
              className={[
                'flex h-[52px] items-center justify-center rounded-2xl text-2xl font-semibold transition-all duration-150 ease-out',
                'hover:bg-surface-subtle active:scale-95 active:bg-soft',
                pressed === key ? 'scale-95 bg-soft' : '',
                key === 'clear' ? 'text-sm font-semibold text-ink-muted' : 'text-ink',
              ].join(' ')}
            >
              {key === 'back' ? <Delete size={22} /> : key === 'clear' ? 'Borrar' : key}
            </button>
          ))}
        </div>
        <Button block className="mt-3" onClick={submit} disabled={amount === 0}>
          Ver si me alcanza
        </Button>
      </div>
    </div>
  );
}
