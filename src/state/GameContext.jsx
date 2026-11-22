// Oyunun tüm durumu (XP, jeton, rozetler, görevler...) burada tutulur.
// Ekranlar bu bilgilere useOyun() ile ulaşır.
import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { durumuKaydet, durumuSil, durumuYukle } from '../services/storage.js';
import { bekleyenOnayiTamamla, cikisYap, girisYap, hesabimiSil, sifreDegistir, sifreSifirlamaIste, kayitliOturum, kayitOl, sunucudanGetir, sunucuyaKaydet } from '../services/supabase.js';
import { BASLANGIC_JETONU, GOREV_BONUS_XP, GUNLUK_GOREVLER } from '../data/rewards.js';
import { GUNLUK_XP, dunAnahtari, gunAnahtari, seviye } from './rules.js';

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
  plan: null, // başlangıçta hazırlanan kişisel plan { mesaj, adimlar, kaynak }
  gunluk: [], // duygu günlüğü: [{ tarih: '2026-11-22', ruhHali: 1-5, duygular: [], not: '' }] (günde bir kayıt)
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

    case 'XP_EKLE': {
      // Bölüm bitirmeden küçük ödüller (ör. Düşünce Defteri): { xp, gorev }
      const ilerleme = { ...d.gorevler.ilerleme };
      Object.entries(eylem.gorev || {}).forEach(([id, miktar]) => {
        const hedef = GUNLUK_GOREVLER.find((g) => g.id === id)?.hedef ?? 0;
        ilerleme[id] = Math.min(hedef, (ilerleme[id] || 0) + miktar);
      });
      return { ...d, xp: d.xp + eylem.xp, seri: seriyiGuncelle(d.seri), gorevler: { ...d.gorevler, ilerleme } };
    }

    case 'GUNLUK_KAYDET': {
      // Aynı gün tekrar yazılırsa kayıt güncellenir. Günün ilk kaydı +10 XP.
      const k = { ...eylem.kayit, tarih: gunAnahtari() };
      const ilkKayit = !d.gunluk.some((g) => g.tarih === k.tarih);
      const gunluk = [...d.gunluk.filter((g) => g.tarih !== k.tarih), k].sort((a, b) => a.tarih.localeCompare(b.tarih)).slice(-120);
      return { ...d, gunluk, xp: d.xp + (ilkKayit ? GUNLUK_XP : 0), seri: seriyiGuncelle(d.seri) };
    }

    case 'PLAN_KAYDET':
      return { ...d, plan: eylem.plan };

    case 'ESYA_AL': {
      const { esya } = eylem;
      if (d.esyalar.includes(esya.id) || d.jeton < esya.fiyat) return d;
      return { ...d, jeton: d.jeton - esya.fiyat, esyalar: [...d.esyalar, esya.id] };
    }

    case 'TIKLAMA_KAYDET':
      return { ...d, tiklamalar: [...d.tiklamalar, { oneri: eylem.oneriId, zaman: new Date().toISOString() }] };

    case 'SUNUCUDAN_YUKLE':
      return gunuKontrolEt({ ...ilkDurum(), ...eylem.durum });

    case 'SIFIRLA':
      return ilkDurum();

    default:
      return d;
  }
}

// Hesaba giriş yapılınca: hesaptaki kayıt esas alınır; bu cihazdaki günlük ve tıklama kayıtları da eklenir
function birlestir(sunucu, yerel) {
  const gunler = new Map();
  [...(yerel.gunluk || []), ...(sunucu.gunluk || [])].forEach((g) => gunler.set(g.tarih, g));
  const tiklar = new Map();
  [...(sunucu.tiklamalar || []), ...(yerel.tiklamalar || [])].forEach((t) => tiklar.set(`${t.oneri}|${new Date(t.zaman).getTime()}`, t));
  return {
    ...sunucu,
    gunluk: [...gunler.values()].sort((a, b) => a.tarih.localeCompare(b.tarih)),
    tiklamalar: [...tiklar.values()]
  };
}

const OyunContext = createContext(null);

export function OyunSaglayici({ children }) {
  // Eski kayıtlarda olmayan alanlar ilkDurum'dan gelir (ör. sonradan eklenen gunluk)
  const [durum, gonder] = useReducer(reducer, null, () => gunuKontrolEt({ ...ilkDurum(), ...(durumuYukle() || {}) }));

  useEffect(() => {
    durumuKaydet(durum);
  }, [durum]);

  // ---------- Hesap (Supabase) ----------
  const [hesap, setHesap] = useState(() => kayitliOturum()?.kullanici || null);
  const [senkron, setSenkron] = useState('bekliyor'); // 'kaydediliyor' | 'tamam' | 'hata'

  // Giriş yapılmışsa her değişiklik 1,5 sn sonra hesaba kaydedilir
  useEffect(() => {
    if (!hesap) return;
    setSenkron('kaydediliyor');
    const zaman = setTimeout(async () => {
      try {
        await sunucuyaKaydet(durum);
        setSenkron('tamam');
      } catch {
        setSenkron('hata'); // internet yoksa veriler cihazda kalır, bir sonraki değişiklikte tekrar denenir
      }
    }, 1500);
    return () => clearTimeout(zaman);
  }, [durum, hesap]);

  const hesabaBaglan = async (oturum) => {
    const sunucu = await sunucudanGetir();
    if (sunucu) gonder({ tur: 'SUNUCUDAN_YUKLE', durum: birlestir(sunucu, durum) });
    setHesap(oturum.kullanici);
    return sunucu ? 'hesaptan-yuklendi' : 'cihazdan-aktarildi';
  };

  // E-postadaki bağlantıdan (onay ya da şifre sıfırlama) gelindiyse otomatik giriş yap
  const [onayMesaji, setOnayMesaji] = useState(null);
  const [sifreYenile, setSifreYenile] = useState(false); // şifre sıfırlama bağlantısından gelindi
  useEffect(() => {
    bekleyenOnayiTamamla().then(async (r) => {
      if (!r) return;
      if (r.hata) return setOnayMesaji({ tur: 'hata', metin: 'Onay bağlantısının süresi dolmuş olabilir. E-postanla giriş yapmayı dene.' });
      const sifirlama = r.tur === 'recovery';
      try {
        await hesabaBaglan(r.oturum);
      } catch {
        setHesap(r.oturum.kullanici);
      }
      if (sifirlama) {
        setSifreYenile(true);
        setOnayMesaji({ tur: 'bilgi', metin: 'Şimdi yeni şifreni belirle.' });
      } else {
        setOnayMesaji({ tur: 'bilgi', metin: 'E-postan onaylandı, giriş yapıldı. Hoş geldin!' });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hesapIslemleri = {
    kayit: async (email, sifre) => {
      const r = await kayitOl(email, sifre);
      if (r.oturum) return { ...r, sonuc: await hesabaBaglan(r.oturum) };
      return r;
    },
    giris: async (email, sifre) => {
      const r = await girisYap(email, sifre);
      if (r.oturum) {
        try {
          return { ...r, sonuc: await hesabaBaglan(r.oturum) };
        } catch {
          return { hata: 'Giriş yapıldı ama veriler alınamadı. İnternet bağlantını kontrol et.' };
        }
      }
      return r;
    },
    cikis: async () => {
      try {
        await sunucuyaKaydet(durum); // çıkmadan önce son hâli kaydet
      } catch {
        /* yok say */
      }
      await cikisYap();
      setHesap(null);
      setSifreYenile(false);
      durumuSil();
      gonder({ tur: 'SIFIRLA' }); // ortak cihazda başkası verileri görmesin; veriler hesapta güvende
    },
    sifreUnuttum: (email) => sifreSifirlamaIste(email),
    sifreDegistir: async (yeni) => {
      const r = await sifreDegistir(yeni);
      if (!r.hata) setSifreYenile(false);
      return r;
    },
    // KVKK: hesabı ve tüm verileri kalıcı olarak sil (hem sunucudan hem bu cihazdan)
    sil: async () => {
      const r = await hesabimiSil();
      if (r.hata) return r;
      setHesap(null);
      durumuSil();
      gonder({ tur: 'SIFIRLA' });
      return r;
    }
  };

  const eylemler = {
    arkadasSec: (id) => gonder({ tur: 'ARKADAS_SEC', id }),
    bolumBitir: (odul) => gonder({ tur: 'BOLUM_BITIR', odul }),
    esyaAl: (esya) => gonder({ tur: 'ESYA_AL', esya }),
    xpEkle: (xp, gorev) => gonder({ tur: 'XP_EKLE', xp, gorev }),
    planKaydet: (plan) => gonder({ tur: 'PLAN_KAYDET', plan }),
    gunlukKaydet: (kayit) => gonder({ tur: 'GUNLUK_KAYDET', kayit }),
    tiklamaKaydet: (oneriId) => gonder({ tur: 'TIKLAMA_KAYDET', oneriId }),
    sifirla: () => {
      durumuSil();
      gonder({ tur: 'SIFIRLA' });
    }
  };

  return <OyunContext.Provider value={{ durum, ...eylemler, hesap, senkron, hesapIslemleri, onayMesaji, sifreYenile }}>{children}</OyunContext.Provider>;
}

export function useOyun() {
  const ctx = useContext(OyunContext);
  if (!ctx) throw new Error('useOyun, OyunSaglayici içinde kullanılmalı');
  return ctx;
}
