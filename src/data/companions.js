// Yol arkadaşları. Yeni bir karakter eklemek için bu listeye bir nesne ekle
// ve components/Companion.jsx içine çizimini ekle.
export const ARKADASLAR = [
  {
    id: 'bulut',
    ad: 'Bulut',
    ozellik: 'Sakin ve meraklı',
    iyelik: "Bulut'un", // "Bulut'un odası" gibi yerlerde kullanılır
    kartRengi: '#BFE6FF'
  },
  {
    id: 'yaprak',
    ad: 'Yaprak',
    ozellik: 'Neşeli ve enerjik',
    iyelik: "Yaprak'ın",
    kartRengi: '#C8F2B4'
  },
  {
    id: 'yildiz',
    ad: 'Yıldız',
    ozellik: 'Cesur ve parlak',
    iyelik: "Yıldız'ın",
    kartRengi: '#FFE45E'
  }
];

export const arkadasBul = (id) => ARKADASLAR.find((a) => a.id === id) || ARKADASLAR[0];
