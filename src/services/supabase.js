// Supabase bağlantısı: kullanıcı hesabı (Auth) ve veritabanı (PostgreSQL, REST üzerinden).
// Ek kütüphane kullanmadan, doğrudan Supabase'in REST adreslerine istek atar.
//
// Tablolar (Supabase'de):
//   ilerleme              → kullanıcı başına tek satır: arkadas, xp, jeton, durum (jsonb)
//   duygu_gunlugu         → günde bir kayıt: tarih, ruh_hali, duygular, notu
//   affiliate_tiklamalar  → öneri tıklamaları (gelir raporu)
// Hepsi RLS ile korunur: herkes yalnızca kendi verisini görür.

import { SUPABASE_ANAHTAR, SUPABASE_URL } from '../config.js';

const OTURUM_ANAHTARI = 'wellness-asistani:oturum';

// ---------- Oturum (giriş bilgisi) saklama ----------
function oturumOku() {
  try {
    const ham = localStorage.getItem(OTURUM_ANAHTARI);
    return ham ? JSON.parse(ham) : null;
  } catch {
    return null;
  }
}
function oturumYaz(o) {
  try {
    if (o) localStorage.setItem(OTURUM_ANAHTARI, JSON.stringify(o));
    else localStorage.removeItem(OTURUM_ANAHTARI);
  } catch {
    /* yok say */
  }
}
function oturumuDuzenle(veri) {
  if (!veri?.access_token) return null;
  return {
    access_token: veri.access_token,
    refresh_token: veri.refresh_token,
    expires_at: veri.expires_at || Math.floor(Date.now() / 1000) + (veri.expires_in || 3600),
    kullanici: { id: veri.user.id, email: veri.user.email }
  };
}

// Supabase hata mesajlarını Türkçe ve anlaşılır hâle getir
function hataMetni(veri, durum) {
  const m = `${veri?.msg || veri?.error_description || veri?.message || ''} ${veri?.error_code || veri?.code || ''}`.toLowerCase();
  if (m.includes('invalid login') || m.includes('invalid_credentials')) return 'E-posta ya da şifre hatalı.';
  if (m.includes('already registered') || m.includes('user_already_exists')) return 'Bu e-postayla zaten bir hesap var. Giriş yapmayı dene.';
  if (m.includes('email not confirmed') || m.includes('email_not_confirmed')) return 'E-postanı henüz onaylamadın. Gelen kutundaki bağlantıya tıkla.';
  if (m.includes('password') && (m.includes('6') || m.includes('weak'))) return 'Şifre en az 6 karakter olmalı.';
  if (m.includes('same_password') || m.includes('different from the old')) return 'Yeni şifre eskisinden farklı olmalı.';
  if (m.includes('reauthentication') || m.includes('session_not_found') || m.includes('jwt')) return 'Bağlantının süresi dolmuş. Şifre sıfırlamayı yeniden iste.';
  if (m.includes('rate limit') || durum === 429) return 'Çok fazla deneme yapıldı. Biraz bekleyip tekrar dene.';
  if (m.includes('invalid') && m.includes('email')) return 'Geçerli bir e-posta adresi yaz.';
  return 'Bir sorun oluştu. İnternet bağlantını kontrol edip tekrar dene.';
}

async function authIstegi(yol, govde, token, method = 'POST') {
  try {
    const cevap = await fetch(`${SUPABASE_URL}/auth/v1/${yol}`, {
      method,
      headers: {
        apikey: SUPABASE_ANAHTAR,
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(govde || {})
    });
    const veri = await cevap.json().catch(() => ({}));
    return { ok: cevap.ok, durum: cevap.status, veri };
  } catch {
    return { ok: false, durum: 0, veri: {} };
  }
}

// ---------- Hesap işlemleri ----------
// Onay e-postasındaki bağlantı kullanıcıyı kaydolduğu sayfaya geri getirsin
// (Supabase'de "Redirect URLs" listesinde olmalı; yoksa Site URL'e gider)
const geriDonusAdresi = () => window.location.origin + window.location.pathname;

export async function kayitOl(email, sifre) {
  const r = await authIstegi(`signup?redirect_to=${encodeURIComponent(geriDonusAdresi())}`, { email, password: sifre });
  if (!r.ok) return { hata: hataMetni(r.veri, r.durum) };
  const oturum = oturumuDuzenle(r.veri);
  if (!oturum) return { onayGerekli: true }; // e-posta onayı açıksa önce onaylanmalı
  oturumYaz(oturum);
  return { oturum };
}

export async function girisYap(email, sifre) {
  const r = await authIstegi('token?grant_type=password', { email, password: sifre });
  if (!r.ok) return { hata: hataMetni(r.veri, r.durum) };
  const oturum = oturumuDuzenle(r.veri);
  oturumYaz(oturum);
  return { oturum };
}

export async function cikisYap() {
  const o = oturumOku();
  if (o) await authIstegi('logout', {}, o.access_token);
  oturumYaz(null);
}

// Şifremi unuttum: e-postaya sıfırlama bağlantısı gönderir.
// Güvenlik gereği Supabase, o e-postayla hesap olmasa da "tamam" der (kimin üye olduğu anlaşılmasın).
export async function sifreSifirlamaIste(email) {
  const r = await authIstegi(`recover?redirect_to=${encodeURIComponent(geriDonusAdresi())}`, { email });
  if (!r.ok) return { hata: hataMetni(r.veri, r.durum) };
  return { tamam: true };
}

// Giriş yapmış kullanıcının şifresini değiştirir (sıfırlama bağlantısından gelince de bu kullanılır)
export async function sifreDegistir(yeniSifre) {
  const o = await gecerliOturum();
  if (!o) return { hata: 'Oturumun kapanmış. Tekrar giriş yap.' };
  const r = await authIstegi('user', { password: yeniSifre }, o.access_token, 'PUT');
  if (!r.ok) return { hata: hataMetni(r.veri, r.durum) };
  return { tamam: true };
}

// KVKK: hesabı ve hesaptaki tüm verileri kalıcı olarak siler (veritabanındaki hesabimi_sil fonksiyonu).
// Başarılı olursa cihazdaki oturum da silinir. Hata olursa { hata } döner.
export async function hesabimiSil() {
  try {
    await rest('rpc/hesabimi_sil', { method: 'POST', govde: {} });
    oturumYaz(null);
    return { tamam: true };
  } catch {
    return { hata: 'Hesap silinemedi. İnternet bağlantını kontrol edip tekrar dene.' };
  }
}

// Süresi dolmak üzereyse oturumu yeniler; giriş yoksa null döner
export async function gecerliOturum() {
  const o = oturumOku();
  if (!o) return null;
  if (o.expires_at - 60 > Date.now() / 1000) return o;
  const r = await authIstegi('token?grant_type=refresh_token', { refresh_token: o.refresh_token });
  if (!r.ok) {
    if (r.durum >= 400 && r.durum < 500) oturumYaz(null); // yenileme reddedildi: tekrar giriş gerekir
    return r.durum >= 400 && r.durum < 500 ? null : o;
  }
  const yeni = oturumuDuzenle(r.veri);
  oturumYaz(yeni);
  return yeni;
}

export const kayitliOturum = () => oturumOku();

// ---------- E-posta onayından dönüş ----------
// E-postadaki bağlantı (hesap onayı ya da şifre sıfırlama) kullanıcıyı
// ".../#access_token=...&refresh_token=...&type=..." adresine getirir.
// Uygulama açılmadan ÖNCE bu bilgiyi adresten alıp saklarız ve adresi #hesap yaparız
// (giriş bilgisi adres çubuğunda kalmasın, yönlendirici de şaşırmasın).
let bekleyenOnay = null;

export function adrestekiOnayiAl() {
  const h = window.location.hash || '';
  if (!h.includes('access_token=') && !h.includes('error=')) return;
  const p = new URLSearchParams(h.replace(/^#\/?/, ''));
  bekleyenOnay = p.get('access_token')
    ? { access_token: p.get('access_token'), refresh_token: p.get('refresh_token'), expires_in: Number(p.get('expires_in')) || 3600, tur: p.get('type') }
    : { hata: true };
  history.replaceState(null, '', `${window.location.pathname}${window.location.search}#hesap`);
}

// Saklanan bilgiyle oturumu tamamlar: kullanıcı bilgisini Supabase'den alır, oturumu kaydeder
export async function bekleyenOnayiTamamla() {
  const b = bekleyenOnay;
  bekleyenOnay = null;
  if (!b || b.hata) return b ? { hata: true } : null;
  try {
    const cevap = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_ANAHTAR, Authorization: `Bearer ${b.access_token}` }
    });
    if (!cevap.ok) return { hata: true };
    const user = await cevap.json();
    const oturum = oturumuDuzenle({ ...b, user });
    oturumYaz(oturum);
    return { oturum, tur: b.tur }; // tur: 'signup' (e-posta onayı) | 'recovery' (şifre sıfırlama)
  } catch {
    return { hata: true };
  }
}

// ---------- Veritabanı (REST) ----------
async function rest(yol, { method = 'GET', govde, prefer } = {}) {
  const o = await gecerliOturum();
  if (!o) throw new Error('oturum-yok');
  const cevap = await fetch(`${SUPABASE_URL}/rest/v1/${yol}`, {
    method,
    headers: {
      apikey: SUPABASE_ANAHTAR,
      Authorization: `Bearer ${o.access_token}`,
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {})
    },
    body: govde ? JSON.stringify(govde) : undefined
  });
  if (!cevap.ok) throw new Error(`rest-${cevap.status}`);
  return cevap.status === 204 ? null : cevap.json().catch(() => null);
}

// Uygulama durumunu sunucudaki tablolara uygun parçalara ayırır
function durumuParcala(kullaniciId, d) {
  const { arkadas, xp, jeton, gunluk = [], tiklamalar = [], sonOdul, ...kalan } = d;
  return {
    ilerleme: { kullanici_id: kullaniciId, arkadas, xp, jeton, durum: kalan, guncellendi: new Date().toISOString() },
    gunluk: gunluk.map((g) => ({ kullanici_id: kullaniciId, tarih: g.tarih, ruh_hali: g.ruhHali, duygular: g.duygular || [], notu: g.not || null })),
    tiklamalar: tiklamalar.map((t) => ({ kullanici_id: kullaniciId, oneri_id: t.oneri, zaman: t.zaman }))
  };
}

export async function sunucuyaKaydet(d) {
  const o = await gecerliOturum();
  if (!o) return;
  const p = durumuParcala(o.kullanici.id, d);
  await rest('ilerleme', { method: 'POST', govde: p.ilerleme, prefer: 'resolution=merge-duplicates,return=minimal' });
  if (p.gunluk.length) await rest('duygu_gunlugu', { method: 'POST', govde: p.gunluk, prefer: 'resolution=merge-duplicates,return=minimal' });
  if (p.tiklamalar.length) await rest('affiliate_tiklamalar?on_conflict=kullanici_id,oneri_id,zaman', { method: 'POST', govde: p.tiklamalar, prefer: 'resolution=ignore-duplicates,return=minimal' });
}

// Sunucudaki kaydı uygulama durumuna çevirir; hesapta hiç kayıt yoksa null
export async function sunucudanGetir() {
  const [satirlar, gunluk, tiklamalar] = await Promise.all([
    rest('ilerleme?select=*'),
    rest('duygu_gunlugu?select=*&order=tarih.asc'),
    rest('affiliate_tiklamalar?select=oneri_id,zaman&order=zaman.asc')
  ]);
  const s = satirlar?.[0];
  if (!s) return null;
  return {
    ...s.durum,
    arkadas: s.arkadas,
    xp: s.xp,
    jeton: s.jeton,
    gunluk: (gunluk || []).map((g) => ({ tarih: g.tarih, ruhHali: g.ruh_hali, duygular: g.duygular || [], not: g.notu || '' })),
    tiklamalar: (tiklamalar || []).map((t) => ({ oneri: t.oneri_id, zaman: t.zaman }))
  };
}
