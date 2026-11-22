// Duygu günlüğündeki seçenekler.
// deger: 1 (çok zor) – 5 (harika). Grafikte bu sayı kullanılır.
export const RUH_HALLERI = [
  { deger: 1, ad: 'Çok zor', renk: '#9DB4E0' },
  { deger: 2, ad: 'Zor', renk: '#C4D3F0' },
  { deger: 3, ad: 'İdare eder', renk: '#FFE45E' },
  { deger: 4, ad: 'İyi', renk: '#C8F2B4' },
  { deger: 5, ad: 'Harika', renk: '#8EDB6E' }
];

export const DUYGULAR = ['Mutlu', 'Sakin', 'Minnettar', 'Heyecanlı', 'Yorgun', 'Kaygılı', 'Üzgün', 'Öfkeli', 'Yalnız', 'Stresli'];

export const ruhHali = (deger) => RUH_HALLERI.find((r) => r.deger === deger);
