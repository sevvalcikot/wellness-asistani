# Wellness Asistanı

Oyun oynayarak düşünce tuzaklarını ve nefes egzersizlerini öğreten, affiliate gelir modelli iyi oluş uygulaması.
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
│   ├── WinScreen.jsx     Bölüm sonu ödülleri
│   ├── RoomScreen.jsx    Yol arkadaşının odası + dükkân + rozetler
│   └── GamesScreen.jsx   Oyunlar sekmesi
├── components/           Tekrar kullanılan parçalar (karakter çizimleri, simgeler, üst çubuk, alt menü)
├── state/                Oyunun durumu: XP, jeton, seviye, görevler (GameContext.jsx, rules.js)
├── services/             Dış dünyayla konuşan katman
│   ├── storage.js        Veri saklama (şimdi: tarayıcı, sonra: Supabase)
│   └── rehber.js         Bulut'un geri bildirimleri ve kişisel plan (kurallara dayalı)
├── router.js             Hangi adreste hangi ekran (#harita, #oda, #oyun-nefes ...)
├── App.jsx               Ekranların listesi
├── main.jsx              Başlangıç noktası
└── styles.css            Tüm görünüm (renkler en üstte)
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

Telefonda bu adresi açıp **Paylaş → Ana Ekrana Ekle** (iPhone) ya da **⋮ → Uygulamayı yükle** (Android) dersen uygulama simgesiyle telefona yüklenir.

## 6. Güvenlik

- `src/data/safety.js` dosyasında kriz ifadeleri listesi var.
- Plan ya da Düşünce Defteri'ne bu ifadelerden biri yazılırsa uygulama destek penceresini gösterir: 112 ve güvendiği kişilerle konuşma önerisi.
- Uygulama terapi yerine geçmez. Bu bilgi "?" düğmesindeki pencerede de yazar.

## 7. Sonraki adımlar (yol haritası)

Sunumdaki sistem mimarisiyle aynı sırada:

1. **Supabase'i bağla**
   - Kullanıcı girişi (kayıt / giriş).
   - `services/storage.js` içindeki iki fonksiyonu veritabanına yazacak şekilde değiştir.
   - Tablolar: `kullanicilar`, `ilerleme`, `dusunce_kartlari`, `rozetler`, `affiliate_tiklamalar`.
3. **Duygu günlüğü ve haftalık duygu grafiği** (gereksinim analizindeki zorunlu madde).
4. **Affiliate**
   - Bir mağazanın ortaklık programına katıl.
   - Takip kodlu bağlantıları `data/recommendations.js` içine yaz.
5. **Huzur Tepesi**
   - 5. bölümü tasarla.
   - `data/levels.js` içinde `yakinda: true` satırını kaldır ve yeni oyun ekranını ekle.

> Bu uygulama terapi ya da tıbbi tedavi yerine geçmez. Uygulama içindeki "?" düğmesinde bu bilgi ve acil durum (112) notu yer alır.
