// Yol arkadaşı karakterlerinin çizimleri (SVG).
// uyku: true ise gözler kapalı çizilir (odada uyurken).

const INK = '#2B2420';

function Gozler({ x1, x2, y, r, uyku }) {
  if (uyku) {
    return (
      <path
        d={`M${x1 - 5} ${y} q5 4 10 0 M${x2 - 5} ${y} q5 4 10 0`}
        stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round"
      />
    );
  }
  return (
    <>
      <circle cx={x1} cy={y} r={r} fill={INK} />
      <circle cx={x2} cy={y} r={r} fill={INK} />
      <circle cx={x1 + 1.5} cy={y - 1.5} r="1.4" fill="#FFFFFF" />
      <circle cx={x2 + 1.5} cy={y - 1.5} r="1.4" fill="#FFFFFF" />
    </>
  );
}

export default function Companion({ id = 'bulut', genislik = 120, uyku = false, className, style }) {
  const yukseklik = Math.round((genislik * 90) / 120);
  const ortak = { width: genislik, height: yukseklik, viewBox: '0 0 120 90', className, style, 'aria-hidden': true };

  if (id === 'yaprak') {
    return (
      <svg {...ortak}>
        <path d="M60 6 C96 16 108 48 92 70 C80 86 40 86 28 70 C12 48 24 16 60 6 Z" fill="#8BD17C" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M60 12 V36" stroke="#5DA84E" strokeWidth="3" strokeLinecap="round" />
        <Gozler x1={50} x2={70} y={50} r={4.5} uyku={uyku} />
        <ellipse cx="42" cy="60" rx="5" ry="3" fill="#FF9F8A" />
        <ellipse cx="78" cy="60" rx="5" ry="3" fill="#FF9F8A" />
        <path d="M53 59 Q60 68 67 59" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === 'yildiz') {
    return (
      <svg {...ortak}>
        <path d="M60 6 L71 33 L100 35 L78 54 L85 83 L60 67 L35 83 L42 54 L20 35 L49 33 Z" fill="#FFD45C" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <Gozler x1={52} x2={68} y={46} r={4} uyku={uyku} />
        <ellipse cx="45" cy="55" rx="4.5" ry="2.6" fill="#FF9F8A" />
        <ellipse cx="75" cy="55" rx="4.5" ry="2.6" fill="#FF9F8A" />
        <path d="M54 55 Q60 61 66 55" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  // Varsayılan: Bulut
  return (
    <svg {...ortak}>
      <path d="M30 78 C12 78 6 62 16 52 C10 36 26 24 40 30 C46 14 70 10 80 26 C96 20 112 34 104 50 C116 58 110 78 94 78 Z" fill="#FFFFFF" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <Gozler x1={50} x2={72} y={52} r={4.5} uyku={uyku} />
      <ellipse cx="42" cy="62" rx="5" ry="3" fill="#FFB4A2" />
      <ellipse cx="80" cy="62" rx="5" ry="3" fill="#FFB4A2" />
      <path d="M55 61 Q61 67 67 61" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
