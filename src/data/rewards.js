// Günlük görevler, rozetler ve dükkân eşyaları.
// İlke: ödül var, ceza yok. Kaçırılan görev hiçbir şey kaybettirmez.

export const GUNLUK_GOREVLER = [
  { id: 'nefes', metin: '1 nefes molası yap', hedef: 1, renk: '#C8F2B4', yol: '/oyun/nefes' },
  { id: 'tuzak', metin: '2 tuzak düşünce yakala', hedef: 2, renk: '#FFD6C9', yol: '/oyun/dusunce' },
  { id: 'bilgi', metin: 'Bir bilgi kartı oku', hedef: 1, renk: '#DCD2FF', yol: '/oyun/bilgi' }
];
export const GOREV_BONUS_XP = 50;

export const ROZETLER = [
  { id: 'tuzak-avcisi', ad: 'Tuzak Avcısı', renk: '#FFE1D6', simge: 'tuzak', nasil: 'Bir oyunda en az 2 tuzak yakala' },
  { id: 'nefes-ustasi', ad: 'Nefes Ustası', renk: '#DFF0FF', simge: 'nefes', nasil: '4 nefes turunu tamamla' },
  { id: 'bilgi-kasifi', ad: 'Bilgi Kaşifi', renk: '#EEE8FF', simge: 'bilgi', nasil: 'Bilgi Kulesi’nde tüm soruları bil' },
  { id: 'huzur-bulucu', ad: 'Huzur Bulucu', renk: '#FFE9C7', simge: 'huzur', nasil: 'Huzur Tepesi’nde üç feneri yak' },
  { id: 'yedi-gun', ad: '7 gün seri', renk: '#FFF0C7', simge: 'seri', nasil: '7 gün üst üste uygulamaya gel' }
];

// fiyat: jeton. minSeviye: bu seviyeye gelmeden satın alınamaz.
// Jetonlar yalnızca görevlerle kazanılır, parayla satılmaz.
export const DUKKAN = [
  { id: 'abajur', ad: 'Abajur', fiyat: 0 },
  { id: 'isiklar', ad: 'Yıldız ışıkları', fiyat: 80 },
  { id: 'cicek', ad: 'Saksı çiçeği', fiyat: 40 },
  { id: 'akvaryum', ad: 'Akvaryum', fiyat: 150, minSeviye: 3 }
];

export const BASLANGIC_JETONU = 100; // hoş geldin hediyesi
