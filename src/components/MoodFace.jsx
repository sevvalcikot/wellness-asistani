// Ruh hâli yüzü: 1 (çok zor) – 5 (harika). Ağız eğrisi değere göre değişir.
import { ruhHali } from '../data/moods.js';

const INK = '#2B2420';

export default function MoodFace({ deger, boyut = 44 }) {
  const r = ruhHali(deger);
  const egri = (deger - 3) * 4; // eksi: aşağı kıvrık, artı: gülümseme
  return (
    <svg width={boyut} height={boyut} viewBox="0 0 44 44" aria-hidden="true">
      <circle cx="22" cy="22" r="19" fill={r?.renk || '#FFFFFF'} stroke={INK} strokeWidth="2.5" />
      <circle cx="15.5" cy="18" r="2.6" fill={INK} />
      <circle cx="28.5" cy="18" r="2.6" fill={INK} />
      <path d={`M14 ${29 - egri / 2} Q22 ${29 + egri} 30 ${29 - egri / 2}`} stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}
