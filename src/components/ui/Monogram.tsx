export function Monogram({
  text,
  bg = '#E8F4F2',
  fg = '#094C44',
  size = 44,
}: {
  text: string;
  bg?: string;
  fg?: string;
  size?: number;
}) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-2xl font-bold"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.36 }}
    >
      {text}
    </span>
  );
}
