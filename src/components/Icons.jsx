// Uygulamada kullanılan küçük simgeler.
const INK = '#2B2420';

export const Yildiz = ({ boyut = 24, dolgu = '#FFFFFF', cizgi = INK }) => (
  <svg width={boyut} height={boyut} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8z" fill={dolgu} stroke={cizgi} strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const Jeton = ({ boyut = 18 }) => (
  <svg width={boyut} height={boyut} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="#FFC233" stroke={INK} strokeWidth="2" />
    <path d="M12 7v10M9 9.5h4.5a1.8 1.8 0 010 3.5H10.5a1.8 1.8 0 000 3.5H15" stroke={INK} strokeWidth="1.6" fill="none" strokeLinecap="round" />
  </svg>
);

export const Alev = ({ boyut = 16 }) => (
  <svg width={boyut} height={boyut + 2} viewBox="0 0 24 26" aria-hidden="true">
    <path d="M12 2c1 4 7 7 7 13a7 7 0 01-14 0c0-3 2-5 3-7 1 2 1 3 3 4 0-3-1-7 1-10z" fill="#FF7A59" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const Kapat = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const Kilit = ({ boyut = 22, renk = '#5B6472' }) => (
  <svg width={boyut} height={boyut} viewBox="0 0 24 24" fill="none" stroke={renk} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 018 0v3" />
  </svg>
);

export const Tik = ({ boyut = 14, renk = '#FFFFFF' }) => (
  <svg width={boyut} height={boyut} viewBox="0 0 24 24" fill="none" stroke={renk} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12l5 5L20 7" />
  </svg>
);

export const Ampul = ({ boyut = 16 }) => (
  <svg width={boyut} height={boyut} viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />
  </svg>
);

export const Kitap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6A4FD6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z" />
    <path d="M4 19V5" />
  </svg>
);

export const Tuzak = ({ boyut = 26, renk = '#D9472B' }) => (
  <svg width={boyut} height={boyut} viewBox="0 0 24 24" fill="none" stroke={renk} strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
    <path d="M3 18h18M5 18c0-5 3-9 7-9s7 4 7 9M8 18l2-4M16 18l-2-4M12 18v-5" />
  </svg>
);

export const Kalkan = ({ boyut = 30 }) => (
  <svg width={boyut} height={boyut} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const Ruzgar = ({ boyut = 26, renk = '#2F6FCB' }) => (
  <svg width={boyut} height={boyut} viewBox="0 0 24 24" fill="none" stroke={renk} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h11a3 3 0 10-3-3M3 12h15a3 3 0 11-3 3M3 16h7" />
  </svg>
);

export const Bilgi = ({ boyut = 26, renk = '#6A4FD6' }) => (
  <svg width={boyut} height={boyut} viewBox="0 0 24 24" fill="none" stroke={renk} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v6M12 7.5h.01" />
  </svg>
);

export const Oynat = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 5v14l11-7z" fill="#FFFFFF" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

export const NavHarita = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14M15 6v14" />
  </svg>
);
export const NavOyun = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="7" width="20" height="12" rx="5" /><path d="M7 11v4M5 13h4M16 12h.01M18 14h.01" />
  </svg>
);
export const NavOda = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" />
  </svg>
);

// Rozet simgesini adıyla seçmek için
export const RozetSimgesi = ({ simge }) => {
  if (simge === 'tuzak') return <Tuzak />;
  if (simge === 'nefes') return <Ruzgar />;
  if (simge === 'bilgi') return <Bilgi />;
  return <Alev boyut={22} />;
};
