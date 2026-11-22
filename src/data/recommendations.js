// Bölüm sonunda gösterilen affiliate (iş ortaklığı) önerileri.
//
// NASIL ÇALIŞIR?
// Bir mağazanın ortaklık programına katıldığında sana özel takip kodlu bir bağlantı verilir.
// O bağlantıyı aşağıdaki "url" alanına yapıştır. Kullanıcı tıklayıp ürünü alırsa komisyon kazanırsın.
// url boş olduğu sürece uygulama tıklamayı yalnızca kaydeder (geliştirme modu).
//
// ŞU AN: Hepsiburada'daki normal ürün sayfaları (komisyon yok).
// Hepsiburada "Link Gelir" programına katılınca her kitabın sana özel bağlantısını
// alıp aşağıdaki url'lerin yerine yapıştır ve ORTAKLIK_AKTIF'i true yap.
//
// Etik kural: ortaklık bağlantısı kullanılırken öneri her zaman "İş ortaklığı bağlantısı" etiketiyle gösterilir.
export const ORTAKLIK_AKTIF = false;

export const ONERILER = {
  dusunce: {
    id: 'kitap-dusunce-tuzaklari',
    baslik: 'Merak edersen: David D. Burns, "İyi Hissetmek" (düşünce tuzakları üzerine)',
    magaza: 'Hepsiburada',
    url: 'https://www.hepsiburada.com/iyi-hissetmek-david-burns-pm-HB00000XJONZ'
  },
  nefes: {
    id: 'kitap-nefes',
    baslik: 'Merak edersen: James Nestor, "Nefes" (nefesin bilimi üzerine)',
    magaza: 'Hepsiburada',
    url: 'https://www.hepsiburada.com/nefes-james-nestor-p-HBCV00000VW7LO'
  },
  huzur: {
    id: 'kitap-pozitif-psikoloji',
    baslik: 'Merak edersen: Martin Seligman, "Gerçek Mutluluk" (pozitif psikoloji üzerine)',
    magaza: 'Hepsiburada',
    url: 'https://www.hepsiburada.com/gercek-mutluluk-martin-e-p-seligman-pm-HB00000PYJA8'
  },
  bilgi: {
    id: 'kitap-bdt-giris',
    baslik: 'Merak edersen: Judith S. Beck, "Bilişsel Davranışçı Terapi: Temelleri ve Ötesi"',
    magaza: 'Hepsiburada',
    url: 'https://www.hepsiburada.com/bilissel-davranisci-terapi-temelleri-ve-otesi-cognitive-behavior-therapy-basics-and-judith-s-bec-pm-knobel38279'
  }
};
