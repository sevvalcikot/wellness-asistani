// Yapay zeka katmanı.
//
// ŞİMDİ: Geri bildirimler data/thoughts.js içindeki hazır metinlerden geliyor.
//
// SONRA (Hafta 10'da seçilen model: Claude Haiku 5.5):
//   Uygulama, yapay zeka şirketine DOĞRUDAN istek atmayacak. Bunun yerine kendi sunucumuzdaki
//   bir fonksiyona (Supabase Edge Function) istek atacak. API anahtarı yalnızca o sunucuda durur,
//   böylece uygulamanın kodunu inceleyen biri anahtarı çalamaz.
//
//   Örnek (ileride):
//     const cevap = await fetch('https://<proje>.supabase.co/functions/v1/geri-bildirim', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${oturumAnahtari}` },
//       body: JSON.stringify({ dusunce: kart.metin, kullaniciCevabi: tuzakDedi })
//     }).then((r) => r.json());
//
// GÜVENLİK: Sunucu tarafında kriz ifadeleri kontrol edilecek. Böyle bir durumda yapay zeka
// sohbete devam etmeyecek, kullanıcıyı profesyonel desteğe ve 112'ye yönlendirecek.

export async function dusunceGeriBildirimi(kart, tuzakDedi) {
  const dogruMu = tuzakDedi === kart.tuzak;
  let baslik;
  if (dogruMu) {
    baslik = kart.tuzak ? `Yakaladın! Bu bir “${kart.tuzakAdi}” tuzağı.` : 'Doğru, bu gerçekçi bir düşünce!';
  } else {
    baslik = kart.tuzak ? `Aslında bu bir tuzak: “${kart.tuzakAdi}”.` : 'Bu sefer gerçekçiydi.';
  }
  return {
    dogruMu,
    baslik,
    aciklama: kart.aciklama,
    gercekci: kart.gercekci || null
  };
}
