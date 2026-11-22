// Güvenlik: kriz ifadelerini algılama.
// Kullanıcının yazdığı metinde bu ifadelerden biri varsa
// uygulama doğrudan destek ekranını (112) gösterir.

const KRIZ_KALIPLARI = [
  'intihar',
  'kendimi öldür',
  'kendimi oldur',
  'ölmek istiyorum',
  'olmek istiyorum',
  'yaşamak istemiyorum',
  'yasamak istemiyorum',
  'canıma kıy',
  'canima kiy',
  'hayatıma son',
  'hayatima son',
  'kendime zarar',
  'kendimi kes',
  'bileklerimi',
  'ölsem daha iyi',
  'olsem daha iyi',
  'yok olmak istiyorum'
];

export function krizVarMi(metin) {
  if (!metin) return false;
  const kucuk = String(metin).toLocaleLowerCase('tr');
  return KRIZ_KALIPLARI.some((k) => kucuk.includes(k));
}
