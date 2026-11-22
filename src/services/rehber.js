// Rehber: Bulut'un geri bildirimleri ve kişisel plan.
//
// Tüm cevaplar kurallara ve hazır içeriklere dayanır (data/ klasörü ve bu dosyadaki listeler).
// İnternet bağlantısı gerektirmez, ücretsizdir ve her zaman aynı şekilde çalışır.
//
// GÜVENLİK: Kriz ifadesi yazılırsa { kriz: true } döner ve uygulama destek ekranını (112) gösterir.

import { krizVarMi } from '../data/safety.js';

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
  return ipucuBul(metin);
}

// ---------- Kişisel başlangıç planı (seçilen odağa göre sıralanır) ----------
const ODAK_SIRALARI = {
  'Sınav ve ders stresi': ['dusunce', 'nefes', 'bilgi'],
  'Kaygı ve endişe': ['nefes', 'dusunce', 'bilgi'],
  'Uyku ve yorgunluk': ['nefes', 'bilgi', 'dusunce'],
  'İlişkiler ve yalnızlık': ['dusunce', 'bilgi', 'nefes']
};
const OYUN_METINLERI = {
  nefes: 'Gün içinde gerildiğinde 1 nefes molası ver; bedenin yavaşladıkça zihnin de sakinleşir.',
  dusunce: 'Her gün bir tur Düşünce Avcısı oyna; kendini zorlayan düşünceleri fark etmeyi öğren.',
  bilgi: 'Haftada birkaç kez Bilgi Kulesi’ne çık; zihnin nasıl çalıştığını kısa bilgilerle keşfet.'
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

export async function kisiselPlan({ odak, sure, not }) {
  if (krizVarMi(`${odak} ${not}`)) return { kriz: true };
  return planOlustur(odak, sure);
}
