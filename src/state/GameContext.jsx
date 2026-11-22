// Oyunun tüm durumu (XP, jeton, rozetler, görevler...) burada tutulur.
// Ekranlar bu bilgilere useOyun() ile ulaşır.
import { createContext, useContext, useEffect, useReducer } from 'react';
import { durumuKaydet, durumuSil, durumuYukle } from '../services/storage.js';
import { BASLANGIC_JETONU, GOREV_BONUS_XP, GUNLUK_GOREVLER } from '../data/rewards.js';
import { dunAnahtari, gunAnahtari, seviye } from './rules.js';

const bosGorevler = () => ({
  tarih: gunAnahtari(),
  ilerleme: Object.fromEntries(GUNLUK_GOREVLER.map((g) => [g.id, 0])),
  bonusAlindi: false
});

const ilkDurum = () => ({
  surum: 1,
  arkadas: null, // seçilen yol arkadaşı: 'bulut' | 'yaprak' | 'yildiz'
  xp: 0,
  jeton: BASLANGIC_JETONU,
  seri: { gun: 0, sonGun: null },
  tamamlanan: [], // tamamlanan bölümlerin id'leri
  rozetler: [],
  esyalar: ['abajur'],
  gorevler: bosGorevler(),
  sonOdul: null, // son biten bölümün ödül özeti (ödül ekranı için)
  tiklamalar: [] // affiliate tıklama kayıtları (ileride veritabanına gidecek)
});

// Yeni bir gün başladıysa günlük görevleri sıfırla
function gunuKontrolEt(d) {
  if (d.gorevler.tarih === gunAnahtari()) return d;
  return { ...d, gorevler: bosGorevler() };
}

function seriyiGuncelle(seri) {
  const bugun = gunAnahtari();
  if (seri.sonGun === bugun) return seri;
  return { gun: seri.sonGun === dunAnahtari() ? seri.gun + 1 : 1, sonGun: bugun };
}

function reducer(durum, eylem) {
  const d = gunuKontrolEt(durum);
  switch (eylem.tur) {
    case 'ARKADAS_SEC': {
      const tamamlanan = d.tamamlanan.includes('tanisma') ? d.tamamlanan : [...d.tamamlanan, 'tanisma'];
      return { ...d, arkadas: eylem.id, tamamlanan };
    }

    case 'BOLUM_BITIR': {
      // o: { bolumId, baslik, mesaj, xp, jeton, rozet, gorev: { tuzak: 2 }, ogrenilenler: [] }
      const o = eylem.odul;
      const eskiSeviye = seviye(d.xp);

      const ilerleme = { ...d.gorevler.ilerleme };
      Object.entries(o.gorev || {}).forEach(([id, miktar]) => {
        const hedef = GUNLUK_GOREVLER.find((g) => g.id === id)?.hedef ?? 0;
        ilerleme[id] = Math.min(hedef, (ilerleme[id] || 0) + miktar);
      });
      const hepsiBitti = GUNLUK_GOREVLER.every((g) => ilerleme[g.id] >= g.hedef);
      const bonus = hepsiBitti && !d.gorevler.bonusAlindi ? GOREV_BONUS_XP : 0;

      const seri = seriyiGuncelle(d.seri);
      const yeniRozetler = [];
      if (o.rozet && !d.rozetler.includes(o.rozet)) yeniRozetler.push(o.rozet);
      if (seri.gun >= 7 && !d.rozetler.includes('yedi-gun')) yeniRozetler.push('yedi-gun');

      const xp = d.xp + o.xp + bonus;
      return {
        ...d,
        xp,
        jeton: d.jeton + o.jeton,
        seri,
        rozetler: [...d.rozetler, ...yeniRozetler],
        tamamlanan: d.tamamlanan.includes(o.bolumId) ? d.tamamlanan : [...d.tamamlanan, o.bolumId],
        gorevler: { ...d.gorevler, ilerleme, bonusAlindi: d.gorevler.bonusAlindi || bonus > 0 },
        sonOdul: { ...o, bonus, yeniRozetler, seviyeAtladi: seviye(xp) > eskiSeviye }
      };
    }

    case 'ESYA_AL': {
      const { esya } = eylem;
      if (d.esyalar.includes(esya.id) || d.jeton < esya.fiyat) return d;
      return { ...d, jeton: d.jeton - esya.fiyat, esyalar: [...d.esyalar, esya.id] };
    }

    case 'TIKLAMA_KAYDET':
      return { ...d, tiklamalar: [...d.tiklamalar, { oneri: eylem.oneriId, zaman: new Date().toISOString() }] };

    case 'SIFIRLA':
      return ilkDurum();

    default:
      return d;
  }
}

const OyunContext = createContext(null);

export function OyunSaglayici({ children }) {
  const [durum, gonder] = useReducer(reducer, null, () => gunuKontrolEt({ ...ilkDurum(), ...(durumuYukle() || {}) }));

  useEffect(() => {
    durumuKaydet(durum);
  }, [durum]);

  const eylemler = {
    arkadasSec: (id) => gonder({ tur: 'ARKADAS_SEC', id }),
    bolumBitir: (odul) => gonder({ tur: 'BOLUM_BITIR', odul }),
    esyaAl: (esya) => gonder({ tur: 'ESYA_AL', esya }),
    tiklamaKaydet: (oneriId) => gonder({ tur: 'TIKLAMA_KAYDET', oneriId }),
    sifirla: () => {
      durumuSil();
      gonder({ tur: 'SIFIRLA' });
    }
  };

  return <OyunContext.Provider value={{ durum, ...eylemler }}>{children}</OyunContext.Provider>;
}

export function useOyun() {
  const ctx = useContext(OyunContext);
  if (!ctx) throw new Error('useOyun, OyunSaglayici içinde kullanılmalı');
  return ctx;
}
