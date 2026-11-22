// Aydınlatma metni (KVKK): hangi veriler, neden, nerede, ne kadar süre, haklar ve silme.
// Hesap ekranından ve kayıt formundan açılır. Yol arkadaşı seçmeden de görülebilir.
import { git } from '../router.js';

const BOLUMLER = [
  {
    baslik: 'Bu uygulama nedir?',
    metin: [
      'AI Wellness Asistanı, Sistem Analizi ve Tasarımı-I dersi kapsamında geliştirilen bir öğrenci projesidir.',
      'Terapi ya da tıbbi tedavi yerine geçmez; teşhis koymaz, ilaç önermez.'
    ]
  },
  {
    baslik: 'Hesap açmazsan',
    metin: [
      'Hiçbir verin sunucuya gönderilmez. İlerlemen ve duygu günlüğün yalnızca kendi cihazında, tarayıcının hafızasında durur.',
      'Tarayıcı verilerini sildiğinde ya da "?" penceresinden "İlerlemeyi sıfırla" dediğinde bunlar da silinir.'
    ]
  },
  {
    baslik: 'Hesap açarsan hangi veriler saklanır?',
    liste: [
      'E-posta adresin ve şifren (şifre şifrelenmiş olarak saklanır, kimse göremez).',
      'Oyun ilerlemen: XP, jeton, rozetler, seçtiğin yol arkadaşı, odandaki eşyalar.',
      'Duygu günlüğün: ruh hâli puanı, seçtiğin duygular ve yazdığın kısa not.',
      'Kitap önerilerine tıklama kayıtların (hangi öneri, ne zaman).'
    ]
  },
  {
    baslik: 'Neden saklanır?',
    metin: [
      'Yalnızca ilerlemeni ve günlüğünü farklı cihazlardan görebilmen için. Veriler reklam, profilleme ya da satış amacıyla kullanılmaz.',
      'Tıklama kayıtları, önerilerin işe yarayıp yaramadığını toplu olarak görmek içindir.'
    ]
  },
  {
    baslik: 'Hukuki sebep: açık rıza',
    metin: [
      'Duygu günlüğü sağlıkla ilgili (özel nitelikli) kişisel veri sayılabilir. Bu yüzden hesap açarken açık rızan istenir.',
      'Rızanı istediğin zaman geri alabilirsin: hesabını silmen yeterli.'
    ]
  },
  {
    baslik: 'Veriler nerede ve kim görebilir?',
    liste: [
      'Veritabanı: Supabase, Avrupa Birliği (Frankfurt, Almanya) sunucuları.',
      'Site barındırma: Vercel ve GitHub Pages (yalnızca uygulamanın kendisi; kişisel verin bu sunucularda saklanmaz).',
      'Her kayıt satır düzeyinde güvenlikle (RLS) korunur: herkes yalnızca kendi verisini görebilir.'
    ]
  },
  {
    baslik: 'Yapay zeka',
    metin: [
      'Düşünce Defteri ve başlangıç planı için yazdığın metin, yapay zeka açıkken yalnızca o anki cevap için Anthropic\'in Claude modeline gönderilir ve uygulama tarafından saklanmaz.',
      'Şu an yapay zeka kapalıdır; cevaplar cihazındaki hazır metinlerden gelir ve hiçbir yere gönderilmez.'
    ]
  },
  {
    baslik: 'Ne kadar süre saklanır?',
    metin: ['Hesabını silene kadar. Hesabını sildiğinde tüm verilerin hemen ve kalıcı olarak silinir.']
  },
  {
    baslik: 'Hakların (KVKK madde 11)',
    liste: [
      'Verilerinin işlenip işlenmediğini ve hangi verilerin işlendiğini öğrenmek.',
      'Yanlış verilerin düzeltilmesini, verilerinin silinmesini istemek.',
      'Verilerinin hangi yerlere aktarıldığını öğrenmek.',
      'Rızanı geri almak.'
    ]
  },
  {
    baslik: 'Verilerimi nasıl silerim?',
    metin: ['Hesabım ekranında, giriş yapmışken "Hesabımı ve verilerimi sil" düğmesine bas. Onay verdiğinde hesabın ve tüm kayıtların kalıcı olarak silinir.']
  }
];

export default function PrivacyScreen() {
  return (
    <main className="ekran" style={{ background: '#DFF0FF' }}>
      <div className="oyun-ustu">
        <button className="kare-dugme" onClick={() => git('/hesap')} aria-label="Geri dön">‹</button>
        <div className="oyun-ustu-yazi"><div className="baslik-kucuk">Aydınlatma metni</div></div>
      </div>

      <div className="icerik-dolgu" style={{ gap: 12 }}>
        <p className="alt-yazi" style={{ margin: 0 }}>Kişisel verilerin nasıl işlendiğini kısa ve açık bir dille anlatıyoruz.</p>
        {BOLUMLER.map((b) => (
          <section key={b.baslik} className="beyaz-panel gizlilik-bolum" style={{ marginTop: 0 }}>
            <h2 className="gizlilik-baslik">{b.baslik}</h2>
            {b.metin?.map((m) => <p key={m} className="govde" style={{ margin: 0 }}>{m}</p>)}
            {b.liste && (
              <ul className="gizlilik-liste">
                {b.liste.map((m) => <li key={m} className="govde">{m}</li>)}
              </ul>
            )}
          </section>
        ))}
        <button className="dugme beyaz" onClick={() => git('/hesap')}>Hesabım'a dön</button>
      </div>
      <div style={{ flexGrow: 1, minHeight: 24 }} />
    </main>
  );
}
