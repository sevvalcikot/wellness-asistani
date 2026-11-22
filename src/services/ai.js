// Yapay zeka katmanı (Claude Haiku 5.5, Hafta 10'da seçilen model) + yedek sistem.
//
// Uygulama yapay zekaya DOĞRUDAN istek atmaz; kendi sunucu fonksiyonumuza (api/yapay-zeka.js) gider.
// API anahtarı yalnızca sunucuda (Vercel ortam değişkeni ANTHROPIC_API_KEY) durur.
//
// YEDEK SİSTEM: Yapay zeka cevap veremezse (anahtar eklenmemiş, kredi bitmiş, internet yok,
// `npm run dev` ile yerelde çalışıyorsun vb.) her fonksiyon kurallara dayalı hazır cevaplara döner.
// Uygulama hiçbir zaman bozulmaz; cevabın kaynağı "kaynak" alanında belirtilir.
//
// GÜVENLİK: Kriz ifadesi yazılırsa yapay zeka hiç çağrılmaz; { kriz: true } döner ve
// uygulama destek ekranını (112) gösterir.

import { krizVarMi } from '../data/safety.js';
import { BOLUMLER } from '../data/levels.js';

async function sunucuyaSor(govde) {
  const kontrol = new AbortController();
  const zamanAsimi = setTimeout(() => kontrol.abort(), 20000);
  try {
    const cevap = await fetch('./api/yapay-zeka', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(govde),
      signal: kontrol.signal
    });
    return await cevap.json().catch(() => null);
  } catch {
    return null;
  } finally {
    clearTimeout(zamanAsimi);
  }
}

// ---------- Oyundaki hazır kartlar için geri bildirim ----------
export async function dusunceGeriBildirimi(kart, tuzakDedi) {
  const dogruMu = tuzakDedi === kart.tuzak;
  let baslik;
  if (dogruMu) {
    baslik = kart.tuzak ? `Yakaladın! Bu bir “${kart.tuzakAdi}” tuzağı.` : 'Doğru, bu gerçekçi bir düşünce!';
  } else {
    baslik = kart.tuzak ? `Aslında bu bir tuzak: “${kart.tuzakAdi}”.` : 'Bu sefer gerçekçiydi.';
  }
  return { dogruMu, baslik, aciklama: kart.aciklama, gercekci: kart.gercekci || null };
}

// ---------- Kullanıcının kendi yazdığı düşünce ----------
const IPUCLARI = [
  { kalip: /(her zaman|hiçbir zaman|hiç ?bir şey|asla|herkes|hiç kimse|hep )/i, tuzakAdi: 'Aşırı genelleme', aciklama: '"Her zaman, asla, herkes" gibi kesin kelimeler çoğu zaman tek bir olaydan büyük bir sonuç çıkardığımızın işaretidir.' },
  { kalip: /(mahvol|felaket|dünyanın sonu|her şey biter|bitti benim|berbat olacak)/i, tuzakAdi: 'Felaketleştirme', aciklama: 'Olabilecek en kötü sonucu, kesin olacakmış gibi düşünüyor olabilirsin.' },
  { kalip: /(bana kızgın|benden nefret|beni sevmiyor|kesin .*düşünüyor|aptal olduğumu)/i, tuzakAdi: 'Zihin okuma', aciklama: 'Başkasının ne düşündüğünü kanıt olmadan bildiğini varsayıyor olabilirsin.' },
  { kalip: /(ben bir|tam bir) (aptal|beceriksiz|başarısız|ezik)/i, tuzakAdi: 'Etiketleme', aciklama: 'Tek bir davranıştan kendine kalıcı bir etiket yapıştırıyor olabilirsin.' },
  { kalip: /(meliyim|malıyım|zorundayım)/i, tuzakAdi: 'Meli-malı düşüncesi', aciklama: 'Kendine katı kurallar koymak, uyamadığında suçluluğu büyütebilir.' }
];

function ipucuBul(metin) {
  const bulunan = IPUCLARI.find((i) => i.kalip.test(metin));
  if (bulunan) {
    return { tuzak: true, tuzakAdi: bulunan.tuzakAdi, aciklama: bulunan.aciklama, gercekci: null };
  }
  return {
    tuzak: null,
    tuzakAdi: null,
    aciklama: 'Kendine şunu sorabilirsin: Bu düşünceyi destekleyen ve desteklemeyen kanıtlar neler? Bir arkadaşın böyle düşünse ona ne derdin?',
    gercekci: null
  };
}

export async function kendiDusunceniAnaliz(metin) {
  if (krizVarMi(metin)) return { kriz: true };
  const veri = await sunucuyaSor({ tur: 'dusunce', metin });
  if (veri?.kriz) return { kriz: true };
  if (veri?.sonuc && typeof veri.sonuc.aciklama === 'string') return { ...veri.sonuc, kaynak: 'yapay-zeka' };
  return { ...ipucuBul(metin), kaynak: 'yedek' };
}

// ---------- Kişisel başlangıç planı (yedek: seçilen odağa göre sıralanır) ----------
const ODAK_SIRALARI = {
  'Sınav ve ders stresi': ['dusunce', 'nefes', 'bilgi'],
  'Kaygı ve endişe': ['nefes', 'dusunce', 'bilgi'],
  'Uyku ve yorgunluk': ['nefes', 'huzur', 'bilgi'],
  'İlişkiler ve yalnızlık': ['dusunce', 'huzur', 'nefes']
};
const OYUN_METINLERI = {
  nefes: 'Gün içinde gerildiğinde 1 nefes molası ver; bedenin yavaşladıkça zihnin de sakinleşir.',
  dusunce: 'Her gün bir tur Düşünce Avcısı oyna; kendini zorlayan düşünceleri fark etmeyi öğren.',
  bilgi: 'Haftada birkaç kez Bilgi Kulesi’ne çık; zihnin nasıl çalıştığını kısa bilgilerle keşfet.',
  huzur: 'Akşamları Huzur Tepesi’nde günün iyi giden üç şeyini yaz; günü olumlu bir notla kapat.'
};

const SURE_MESAJLARI = {
  '3 dakika': 'Günde 3 dakika bile fark yaratır; her gün bir oyunla başlayalım.',
  '5 dakika': 'Günde 5 dakika ile her gün bir oyun, haftada birkaç kez de bir bilgi katı yeterli.',
  '10 dakika': 'Günde 10 dakikan varsa her gün iki oyun oynayıp ilerlemeni hızlandırabilirsin.'
};

function planOlustur(odak, sure) {
  const sira = ODAK_SIRALARI[odak] || ['nefes', 'dusunce', 'bilgi'];
  return {
    mesaj: `Hoş geldin! Senin için küçük ve uygulanabilir bir başlangıç planı hazırladım. ${SURE_MESAJLARI[sure] || ''}`.trim(),
    adimlar: sira.map((oyun) => ({ oyun, metin: OYUN_METINLERI[oyun] }))
  };
}

const gecerliOyun = (o) => BOLUMLER.some((b) => b.id === o && b.yol);

export async function kisiselPlan({ odak, sure, not }) {
  if (krizVarMi(`${odak} ${not}`)) return { kriz: true };
  const veri = await sunucuyaSor({ tur: 'plan', odak, sure, not });
  if (veri?.kriz) return { kriz: true };
  const s = veri?.sonuc;
  if (s && typeof s.mesaj === 'string' && Array.isArray(s.adimlar)) {
    const adimlar = s.adimlar.filter((a) => gecerliOyun(a?.oyun) && typeof a.metin === 'string').slice(0, 3);
    if (adimlar.length) return { mesaj: s.mesaj, adimlar, kaynak: 'yapay-zeka' };
  }
  return { ...planOlustur(odak, sure), kaynak: 'yedek' };
}
