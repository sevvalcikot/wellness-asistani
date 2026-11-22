// Huzur Adası haritasındaki bölümler. Sıra önemlidir: bir bölüm,
// kendinden önceki bölüm tamamlanınca açılır.
// x, y: haritadaki konum (390 x 560 boyutundaki harita çizimine göre).
// Yeni bölüm eklerken yakinda: true yazarsan haritada kilitli "yakında" olarak görünür.
export const BOLUMLER = [
  {
    id: 'tanisma',
    ad: 'Tanışma',
    yol: '/baslangic',
    x: 86, y: 412
  },
  {
    id: 'nefes',
    ad: 'Nefes Koyu',
    hedef: "Nefes Koyu'na", // konuşma balonunda: "Bugün Nefes Koyu'na gidelim mi?"
    davet: 'Birlikte sakinleşelim, balonu nefesinle uçuralım!',
    oyun: 'Nefes Balonu',
    yol: '/oyun/nefes',
    x: 192, y: 334
  },
  {
    id: 'dusunce',
    ad: 'Düşünce Ormanı',
    hedef: "Düşünce Ormanı'na",
    davet: 'Tuzak düşünceleri birlikte yakalayalım!',
    oyun: 'Düşünce Avcısı',
    yol: '/oyun/dusunce',
    x: 252, y: 226
  },
  {
    id: 'bilgi',
    ad: 'Bilgi Kulesi',
    hedef: "Bilgi Kulesi'ne",
    davet: 'Kat kat çıkıp yeni şeyler öğrenelim!',
    oyun: 'Bilgi Kulesi',
    yol: '/oyun/bilgi',
    x: 112, y: 144
  },
  {
    id: 'huzur',
    ad: 'Huzur Tepesi',
    hedef: "Huzur Tepesi'ne",
    davet: 'Bugünün güzel anlarını birlikte toplayalım!',
    oyun: 'Üç Güzel Şey',
    yol: '/oyun/huzur',
    x: 262, y: 104
  }
];

export const bolumBul = (id) => BOLUMLER.find((b) => b.id === id);
