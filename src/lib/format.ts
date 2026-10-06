/** Formatea un número como pesos colombianos: 420000 -> "$420.000". */
export function cop(value: number): string {
  const sign = value < 0 ? '-' : '';
  const digits = Math.abs(Math.round(value))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${sign}$${digits}`;
}

/** Redondea a la centena más cercana (18.333 -> 18.300). */
export const roundToHundreds = (value: number) => Math.round(value / 100) * 100;

/** Redondea al millar más cercano. */
export const roundToThousands = (value: number) => Math.round(value / 1000) * 1000;
