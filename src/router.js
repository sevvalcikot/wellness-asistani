// Çok küçük bir sayfa yönlendirici (router).
// Adres çubuğundaki # işaretinden sonraki kısmı okur: .../#harita, .../#oyun-nefes gibi.
// Kod içinde yollar "/oyun/nefes" biçiminde yazılır; adres çubuğunda "#oyun-nefes" olarak görünür.
// Hash kullanmak, uygulamanın her türlü statik sunucuda (Vercel, GitHub Pages) ek ayar olmadan çalışmasını sağlar.
import { useEffect, useState } from 'react';

const hashtenYola = (h) => '/' + h.replace(/^#\/?/, '').replace(/-/g, '/');
const yoldanHashe = (yol) => yol.replace(/^\//, '').replace(/\//g, '-');

const oku = () => (window.location.hash ? hashtenYola(window.location.hash) : '/');

export function useYol() {
  const [yol, setYol] = useState(oku);
  useEffect(() => {
    const degisti = () => {
      setYol(oku());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', degisti);
    return () => window.removeEventListener('hashchange', degisti);
  }, []);
  return yol;
}

export function git(yol) {
  if (oku() === yol) return;
  window.location.hash = yoldanHashe(yol);
}
