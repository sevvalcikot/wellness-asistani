# AI Wellness Asistanı

Oyun oynayarak düşünce tuzaklarını ve nefes egzersizlerini öğreten, yapay zeka destekli iyi oluş uygulaması.
Sistem Analizi ve Tasarımı-I dersi, **Proje 02** kapsamında geliştiriliyor.

- **Ön yüz:** React
- **Mobil:** PWA (telefona "Ana ekrana ekle" ile yüklenir)
- **Derleme aracı:** Vite

---

## 1. Bilgisayarı hazırla (bir kez yapılır)

1. **Node.js** kur: <https://nodejs.org> adresinden **LTS** sürümünü indir ve kur.
2. Kurulduğunu kontrol et. Terminali aç (Mac'te: Spotlight → "Terminal") ve yaz:
   ```bash
   node -v
   ```
   `v20...` veya daha yüksek bir sayı görmelisin.
3. Kod düzenleyici olarak **Visual Studio Code** öneririm: <https://code.visualstudio.com>

## 2. Projeyi çalıştır

Zip dosyasını aç. Terminalde proje klasörüne git. Klasörü Terminal penceresine sürükleyip bırakırsan yolu kendisi yazar:

```bash
cd wellness-asistani
npm install      # gerekli paketleri indirir (sadece ilk seferde)
npm run dev      # uygulamayı başlatır
```

Terminalde çıkan `http://localhost:5173` adresini tarayıcıda aç.
Kodda bir şeyi değiştirip kaydettiğinde sayfa kendiliğinden yenilenir.

**Telefonda denemek için:** Telefon ve bilgisayar aynı Wi-Fi'de olsun. Terminalde yazan `Network: http://192.168...` adresini telefonun tarayıcısında aç.

Durdurmak için Terminal'de `Ctrl + C`.

## 3. Klasör yapısı (neyi nerede değiştiririm?)

```
src/
├── data/                 ← İÇERİKLER: kod bilmeden genişletebileceğin yer
│   ├── safety.js         Kriz ifadeleri listesi (güvenlik)
│   ├── moods.js          Duygu günlüğündeki ruh hâlleri ve duygular
│   ├── thoughts.js       Düşünce Avcısı kartları
│   ├── quiz.js           Bilgi Kulesi soruları
│   ├── levels.js         Haritadaki bölümler
│   ├── rewards.js        Günlük görevler, rozetler, dükkân eşyaları
│   ├── companions.js     Yol arkadaşları (Bulut, Yaprak, Yıldız)
│   └── recommendations.js  Affiliate önerileri (takip kodlu bağlantılar)
├── screens/              ← EKRANLAR
│   ├── Onboarding.jsx    Yol arkadaşını seç
│   ├── MapScreen.jsx     Huzur Adası haritası + günlük görevler
│   ├── ThoughtGame.jsx   Düşünce Avcısı
│   ├── BreathGame.jsx    Nefes Balonu (4-7-8 nefesi)
│   ├── QuizGame.jsx      Bilgi Kulesi
│   ├── GratitudeGame.jsx Huzur Tepesi: Üç Güzel Şey
│   ├── MoodJournalScreen.jsx Duygu Günlüğü + son 7 günün grafiği
│   ├── WinScreen.jsx     Bölüm sonu ödülleri
│   ├── RoomScreen.jsx    Yol arkadaşının odası + dükkân + rozetler
│   ├── GamesScreen.jsx   Oyunlar sekmesi + kişisel plan
│   ├── PlanScreen.jsx    Başlangıç 2. adım: kısa sorular + kişisel plan
│   ├── JournalScreen.jsx Düşünce Defteri (yapay zeka geri bildirimi)
│   └── AccountScreen.jsx Hesabım: kayıt ol / giriş yap / çıkış
├── components/           Tekrar kullanılan parçalar (karakter çizimleri, simgeler, üst çubuk, alt menü)
├── state/                Oyunun durumu: XP, jeton, seviye, görevler (GameContext.jsx, rules.js)
├── services/             Dış dünyayla konuşan katman
│   ├── storage.js        Cihazda saklama (tarayıcı)
│   ├── supabase.js       Hesap (kayıt/giriş) ve veritabanına kaydetme
│   └── ai.js             Yapay zeka (Claude Haiku 5.5) + yedek hazır cevaplar
├── config.js             Supabase bağlantı bilgileri
├── router.js             Hangi adreste hangi ekran (#harita, #oda, #oyun-nefes ...)
├── App.jsx               Ekranların listesi
├── main.jsx              Başlangıç noktası
└── styles.css            Tüm görünüm (renkler en üstte)
api/
└── yapay-zeka.js         Vercel sunucu fonksiyonu: yapay zekaya güvenli istek
public/
├── manifest.webmanifest  PWA tanımı (uygulama adı, simge, renk)
├── sw.js                 Servis çalışanı (internetsiz açılma)
└── icons/                Uygulama simgeleri
```

### İlk deneyebileceğin kolay değişiklikler
- **Yeni düşünce kartı ekle:** `src/data/thoughts.js` dosyasında bir kartı kopyala, metnini değiştir.
- **Yeni soru ekle:** `src/data/quiz.js` dosyasına bir kat ekle. Oyun "Kat 1 / 4" diye kendiliğinden günceller.
- **Ana rengi değiştir:** `src/styles.css` en üstündeki `--vurgu` değerini değiştir.
- **Dükkâna eşya ekle:** `src/data/rewards.js` içindeki `DUKKAN` listesine ekle (odada görünmesi için `RoomScreen.jsx` içine çizimini de eklemen gerekir).

## 4. Oyun kuralları (kodda nerede?)

| Kural | Değer | Dosya |
|---|---|---|
| Seviye başına XP | 200 | `state/rules.js` |
| Başlangıç jetonu | 100 (hoş geldin hediyesi) | `data/rewards.js` |
| Düşünce Avcısı | doğru +20 XP, yanlış +5 XP, bölüm sonu +25 jeton | `screens/ThoughtGame.jsx` |
| Nefes Balonu | tur başına +15 XP, +15 jeton | `screens/BreathGame.jsx` |
| Bilgi Kulesi | doğru +30 XP, yanlış +10 XP, +20 jeton, 2 ipucu | `screens/QuizGame.jsx` |
| Huzur Tepesi | fener başına +20 XP, +20 jeton | `screens/GratitudeGame.jsx` |
| Duygu Günlüğü | günün ilk kaydı +10 XP | `state/rules.js` |
| Düşünce Defteri | her kayıt +10 XP | `screens/JournalScreen.jsx` |
| Günlük görevlerin hepsi | +50 XP bonus | `data/rewards.js` |

**İlke: ödül var, ceza yok.** Yanlış cevap ya da kaçırılan gün hiçbir şey kaybettirmez. Jetonlar parayla satılmaz.

## 5. Yayınlama (herkesin açabileceği bir bağlantı)

```bash
npm run build    # dist/ klasörünü oluşturur
```

En kolay yol **Vercel**:
1. Projeyi GitHub'a yükle.
2. <https://vercel.com> → GitHub ile giriş → **Add New → Project** → bu depoyu seç → **Deploy**.
3. Vercel ayarları kendisi tanır (Framework: Vite). Sonunda `...vercel.app` diye bir adres verir.

**Yedek adres (GitHub Pages):** `.github/workflows/github-pages.yml` her gönderimde siteyi <https://sevvalcikot.github.io/wellness-asistani/> adresine de yükler. Bazı ağlar `vercel.app` adreslerini açamayabiliyor; o zaman bu adres kullanılır. Orada sunucu fonksiyonu olmadığı için yapay zeka her zaman hazır cevaplarla çalışır.

Telefonda bu adresi açıp **Paylaş → Ana Ekrana Ekle** (iPhone) ya da **⋮ → Uygulamayı yükle** (Android) dersen uygulama simgesiyle telefona yüklenir.

## 6. Yapay zeka (Claude Haiku 5.5) ve yedek sistem

Yapay zeka iki yerde kullanılıyor:
- **Başlangıç 2. adım:** Kullanıcının cevaplarına göre kişisel plan.
- **Düşünce Defteri:** Kullanıcının yazdığı düşüncedeki tuzağı bulma.

Nasıl çalışıyor:
- Uygulama yapay zekaya doğrudan gitmez; `api/yapay-zeka.js` adlı Vercel sunucu fonksiyonuna gider.
- API anahtarı sadece Vercel'de, `ANTHROPIC_API_KEY` ortam değişkeninde durur. **Anahtarı asla koda yazma.**
- **Yedek sistem:** Anahtar yoksa, kredi bittiyse ya da internet yoksa uygulama kurallara dayalı hazır cevaplara döner. Cevabın üstünde "Hazır cevap" etiketi görünür. Şu an maliyet kontrolü için bu modda çalışıyor.
- **Güvenlik:** `src/data/safety.js` dosyasındaki kriz ifadelerinden biri yazılırsa yapay zeka hiç çağrılmaz. Kullanıcıya destek penceresi (112) gösterilir.

**Yapay zekayı açmak için:**
1. console.anthropic.com'dan kredi yükle (en az 5 dolar, 1 yıl geçerli).
2. Bir API anahtarı oluştur.
3. Vercel → proje → Settings → Environment Variables bölümüne `ANTHROPIC_API_KEY` adıyla ekle.
4. Projeyi yeniden yayınla (Redeploy).

> Not: `npm run dev` ile yerelde çalışırken sunucu fonksiyonu çalışmaz; uygulama yedek cevaplarla açılır. Bu normaldir.

## 7. Kullanıcı hesabı ve veritabanı (Supabase)

- Supabase projesi: `wellness-asistani` (Frankfurt, ücretsiz plan). Bağlantı bilgisi `src/config.js` içinde.
  - Oradaki anahtar herkese açık (publishable) türdendir; veriyi koruyan şey RLS kurallarıdır.
  - Gizli `service_role` anahtarını asla koda yazma.
- Tablolar:
  - `ilerleme`: kullanıcı başına XP, jeton, yol arkadaşı ve oyun durumu.
  - `duygu_gunlugu`: günde bir kayıt.
  - `affiliate_tiklamalar`: öneri tıklamaları.
- Her tabloda RLS açık: herkes yalnızca kendi satırlarını görebilir ve değiştirebilir.
- Hesap açmak isteğe bağlı. Hesapsız oynayan birinin ilerlemesi sadece kendi cihazında durur.
- Giriş yapılınca her değişiklik 1,5 saniye içinde hesaba kaydedilir (`src/services/supabase.js`).
- Kayıt olurken kullanıcıdan açık rıza alınır (KVKK: duygu günlüğü sağlıkla ilgili veri sayılabilir).
- **Şifremi unuttum / şifre değiştir:** "Şifremi unuttum" şu an **kapalı** (`src/config.js` → `SIFRE_SIFIRLAMA_AKTIF = false`), çünkü kendi e-posta servisi bağlı değil. Açılırsa giriş sekmesinde sıfırlama bağlantısı gönderir; bağlantıdan gelen kullanıcıya "Yeni şifre" formu açılır. Giriş yapmışken "Şifremi değiştir" de aynı formu kullanır.
  - Herkese mail gidebilmesi için Supabase → Authentication → Emails → SMTP Settings'te projenin Gmail hesabı bağlanır (`smtp.gmail.com`, port `465`, Gmail **uygulama şifresi**). Uygulama şifresi yalnızca Supabase'e girilir, koda asla yazılmaz.
- **Aydınlatma metni:** `#gizlilik` adresinde (`src/screens/PrivacyScreen.jsx`). Hangi veri, neden, nerede, ne kadar süre, KVKK hakları.
- **Hesabı silme:** Hesabım → "Hesabımı ve verilerimi sil". Veritabanındaki `hesabimi_sil()` fonksiyonu yalnızca giriş yapan kişinin kendi hesabını siler; bağlı tüm tablolar (`ON DELETE CASCADE`) birlikte silinir.
  - Supabase güvenlik denetimi bu fonksiyon için bir uyarı gösterir ("giriş yapmış kullanıcı çalıştırabilir"). Bu bilerek yapıldı: fonksiyon yalnızca `auth.uid()` ile kişinin kendi hesabına dokunur.
- **E-posta onayı:** Onay bağlantısı kullanıcıyı kaydolduğu siteye geri getirir ve otomatik giriş yaptırır. Bunun için Supabase → Authentication → URL Configuration'da:
  - **Site URL:** `https://wellness-asistani.vercel.app`
  - **Redirect URLs:** `https://wellness-asistani.vercel.app/**` ve `https://sevvalcikot.github.io/wellness-asistani/**`
  - Supabase'in ücretsiz e-posta servisi saatte çok az e-posta gönderir ve yalnızca proje ekibindeki adreslere ulaşır. Herkesin hesap açabilmesi için ya **Confirm email** kapatılır ya da kendi e-posta servisi (SMTP) bağlanır.

## 8. Sonraki adımlar (yol haritası)

Sunumdaki sistem mimarisiyle aynı sırada:

1. **Yapay zekayı aç:** API kredisi yükleyip anahtarı Vercel'e ekle (bkz. bölüm 6). Kod hazır.
2. **Affiliate**
   - Öneriler şu an Hepsiburada'daki normal kitap sayfalarına gidiyor (komisyon yok).
   - Hepsiburada "Link Gelir" programına katıl, her kitabın sana özel bağlantısını `data/recommendations.js` içine yaz ve `ORTAKLIK_AKTIF` değerini `true` yap.

> Bu uygulama terapi ya da tıbbi tedavi yerine geçmez. Uygulama içindeki "?" düğmesinde bu bilgi ve acil durum (112) notu yer alır.
