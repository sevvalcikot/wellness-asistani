// Oyunun temel kuralları: seviye hesabı ve tarih yardımcıları.

export const SEVIYE_BASINA_XP = 200;

export const seviye = (xp) => Math.floor(xp / SEVIYE_BASINA_XP) + 1;
export const seviyeIlerleme = (xp) => xp % SEVIYE_BASINA_XP;

// Yerel saate göre "2026-11-17" biçiminde tarih
export function gunAnahtari(tarih = new Date()) {
  const y = tarih.getFullYear();
  const a = String(tarih.getMonth() + 1).padStart(2, '0');
  const g = String(tarih.getDate()).padStart(2, '0');
  return `${y}-${a}-${g}`;
}

export function dunAnahtari() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return gunAnahtari(d);
}

// Dizinin elemanlarını karıştırır (kopyası üzerinde)
export function karistir(dizi) {
  const k = dizi.slice();
  for (let i = k.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [k[i], k[j]] = [k[j], k[i]];
  }
  return k;
}
