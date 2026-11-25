// Supabase bağlantı bilgileri.
// Bu anahtar "publishable" (herkese açık) türdedir; tarayıcıda durması güvenlidir.
// Verileri koruyan şey veritabanındaki RLS kurallarıdır: her kullanıcı yalnızca kendi satırlarını görebilir.
// (Gizli "service_role" anahtarı ASLA buraya yazılmaz.)
export const SUPABASE_URL = 'https://isxhrsynzavpqtfjqvaj.supabase.co';
export const SUPABASE_ANAHTAR = 'sb_publishable_taIHKbTfUnq-5RDynmw0fQ_RBgSf_Nt';

// "Şifremi unuttum" bağlantısı. Kapalı, çünkü herkese mail gidebilmesi için Supabase'e
// kendi e-posta servisi (SMTP) bağlanmalı. Bağlanırsa true yapman yeterli (README §7).
export const SIFRE_SIFIRLAMA_AKTIF = false;
