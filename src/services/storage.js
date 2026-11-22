// Veri saklama katmanı.
//
// ŞİMDİ: Veriler tarayıcının localStorage'ında, yani yalnızca bu cihazda tutuluyor.
// SONRA: Bu iki fonksiyonun içi Supabase (PostgreSQL) çağrılarıyla değiştirilecek.
// Uygulamanın geri kalanı yalnızca bu dosyayı kullandığı için başka bir yeri değiştirmek gerekmeyecek.

const ANAHTAR = 'wellness-asistani:durum';

export function durumuYukle() {
  try {
    const ham = localStorage.getItem(ANAHTAR);
    return ham ? JSON.parse(ham) : null;
  } catch {
    return null; // gizli sekme vb. durumlarda depolama kapalı olabilir
  }
}

export function durumuKaydet(durum) {
  try {
    localStorage.setItem(ANAHTAR, JSON.stringify(durum));
  } catch {
    /* depolama kullanılamıyorsa uygulama yine çalışır, sadece ilerleme saklanmaz */
  }
}

export function durumuSil() {
  try {
    localStorage.removeItem(ANAHTAR);
  } catch {
    /* yok say */
  }
}
