import { useEffect, useState } from 'react';

/**
 * Revela `total` elementos uno a uno. Antes de cada elemento marcado en
 * `typingBefore` muestra el indicador de "escribiendo…".
 */
export function useSequence(
  total: number,
  { start = 0, delay = 1100, typingBefore = () => true }: {
    start?: number;
    delay?: number;
    typingBefore?: (index: number) => boolean;
  } = {},
) {
  const [visible, setVisible] = useState(start);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (visible >= total) {
      setTyping(false);
      return;
    }
    const showTyping = typingBefore(visible);
    setTyping(showTyping);
    const t = setTimeout(() => {
      setTyping(false);
      setVisible((v) => v + 1);
    }, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, total, delay]);

  return { visible, typing, done: visible >= total, reset: () => setVisible(start) };
}
