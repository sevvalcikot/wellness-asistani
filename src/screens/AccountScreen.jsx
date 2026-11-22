// Hesabım: kayıt ol / giriş yap / çıkış yap
// Hesap açmak isteğe bağlıdır. Hesapla giriş yapınca ilerleme ve günlük başka cihazlarda da görünür.
import { useEffect, useState } from 'react';
import Companion from '../components/Companion.jsx';
import { git } from '../router.js';
import { useOyun } from '../state/GameContext.jsx';

const SENKRON_METNI = {
  bekliyor: 'Bağlanıyor…',
  kaydediliyor: 'Kaydediliyor…',
  tamam: 'Tüm verilerin hesabına kaydedildi.',
  hata: 'Şu an kaydedilemedi (internet yok olabilir). Verilerin bu cihazda duruyor, bağlantı gelince tekrar denenecek.'
};

export default function AccountScreen() {
  const { durum, hesap, senkron, hesapIslemleri, onayMesaji } = useOyun();
  const [mod, setMod] = useState('kayit');
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [riza, setRiza] = useState(false);
  const [bekliyor, setBekliyor] = useState(false);
  const [mesaj, setMesaj] = useState(null); // { tur: 'hata' | 'bilgi', metin }
  const [silmeAdimi, setSilmeAdimi] = useState(false); // "Emin misin?" adımı
  const [siliniyor, setSiliniyor] = useState(false);

  const hesabiSil = async () => {
    setSiliniyor(true);
    const r = await hesapIslemleri.sil();
    setSiliniyor(false);
    setSilmeAdimi(false);
    if (r.hata) return setMesaj({ tur: 'hata', metin: r.hata });
    setMod('kayit');
    setMesaj({ tur: 'bilgi', metin: 'Hesabın ve tüm verilerin kalıcı olarak silindi.' });
  };

  useEffect(() => {
    if (onayMesaji) setMesaj(onayMesaji);
  }, [onayMesaji]);

  const gonder = async (e) => {
    e.preventDefault();
    setMesaj(null);
    if (mod === 'kayit' && !riza) return setMesaj({ tur: 'hata', metin: 'Hesap açmak için aşağıdaki onay kutusunu işaretlemelisin.' });
    setBekliyor(true);
    const r = mod === 'kayit' ? await hesapIslemleri.kayit(email.trim(), sifre) : await hesapIslemleri.giris(email.trim(), sifre);
    setBekliyor(false);
    if (r.hata) return setMesaj({ tur: 'hata', metin: r.hata });
    if (r.onayGerekli) return setMesaj({ tur: 'bilgi', metin: 'Neredeyse bitti! E-postana gelen onay bağlantısına tıkla, sonra buradan giriş yap.' });
    setSifre('');
    setMesaj({ tur: 'bilgi', metin: r.sonuc === 'hesaptan-yuklendi' ? 'Hoş geldin! Hesabındaki ilerleme bu cihaza yüklendi.' : 'Hesabın hazır! Bu cihazdaki ilerlemen hesabına aktarıldı.' });
  };

  const geri = () => git(durum.arkadas ? '/oda' : '/baslangic');

  return (
    <main className="ekran" style={{ background: '#DFF0FF' }}>
      <div className="oyun-ustu">
        <button className="kare-dugme" onClick={geri} aria-label="Geri dön">‹</button>
        <div className="oyun-ustu-yazi"><div className="baslik-kucuk">Hesabım</div></div>
      </div>

      <div className="icerik-dolgu" style={{ gap: 16 }}>
        <div className="konusan" style={{ padding: 0 }}>
          <Companion id={durum.arkadas || 'bulut'} genislik={64} className="zipla-yavas" />
          <div className="balon">
            {hesap ? 'Hesabınla girdin. İlerlemen ve günlüğün artık hangi cihazdan girersen gir seninle.' : 'Hesap açarsan ilerlemen ve duygu günlüğün kaybolmaz, telefon değiştirsen bile devam edersin.'}
          </div>
        </div>

        {hesap ? (
          <section className="beyaz-panel" style={{ marginTop: 0 }}>
            <div className="ust-etiket" style={{ color: '#2E8A45' }}>GİRİŞ YAPILDI</div>
            <div className="govde" style={{ fontSize: 16, wordBreak: 'break-all' }}><b>{hesap.email}</b></div>
            {mesaj?.tur === 'bilgi' && <div className="kucuk-bildirim" role="status">{mesaj.metin}</div>}
            <div className="govde soluk" role="status">{SENKRON_METNI[senkron]}</div>
            <button className="dugme beyaz" onClick={hesapIslemleri.cikis}>Çıkış yap</button>
            <p className="alt-yazi" style={{ margin: 0 }}>Çıkış yapınca veriler bu cihazdan silinir ama hesabında güvende kalır.</p>
            {mesaj?.tur === 'hata' && <div className="kucuk-bildirim hata" role="alert">{mesaj.metin}</div>}
            {silmeAdimi ? (
              <div className="silme-onayi" role="group" aria-label="Hesap silme onayı">
                <div className="govde"><b>Emin misin?</b> Hesabın, oyun ilerlemen, duygu günlüğün ve tüm kayıtların kalıcı olarak silinir. Bu işlem geri alınamaz.</div>
                <button className="dugme tehlike" onClick={hesabiSil} disabled={siliniyor}>{siliniyor ? 'Siliniyor…' : 'Evet, kalıcı olarak sil'}</button>
                <button className="dugme beyaz" onClick={() => setSilmeAdimi(false)} disabled={siliniyor}>Vazgeç</button>
              </div>
            ) : (
              <button className="metin-dugme tehlike-yazi" onClick={() => { setMesaj(null); setSilmeAdimi(true); }}>Hesabımı ve verilerimi sil</button>
            )}
          </section>
        ) : (
          <section className="beyaz-panel" style={{ marginTop: 0, gap: 12 }}>
            <div className="sekmeler" role="tablist">
              <button role="tab" aria-selected={mod === 'kayit'} className={mod === 'kayit' ? 'secili' : ''} onClick={() => { setMod('kayit'); setMesaj(null); }}>Hesap aç</button>
              <button role="tab" aria-selected={mod === 'giris'} className={mod === 'giris' ? 'secili' : ''} onClick={() => { setMod('giris'); setMesaj(null); }}>Giriş yap</button>
            </div>
            <form onSubmit={gonder} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label htmlFor="hesap-email" className="legend" style={{ fontSize: 15 }}>E-posta</label>
              <input id="hesap-email" type="email" required autoComplete="email" className="metin-alani" value={email} onChange={(e) => setEmail(e.target.value)} />
              <label htmlFor="hesap-sifre" className="legend" style={{ fontSize: 15 }}>Şifre <span className="soluk" style={{ fontSize: 13 }}>(en az 6 karakter)</span></label>
              <input id="hesap-sifre" type="password" required minLength={6} autoComplete={mod === 'kayit' ? 'new-password' : 'current-password'} className="metin-alani" value={sifre} onChange={(e) => setSifre(e.target.value)} />
              {mod === 'kayit' && (
                <label className="onay-kutusu" htmlFor="hesap-riza">
                  <input id="hesap-riza" type="checkbox" checked={riza} onChange={(e) => setRiza(e.target.checked)} />
                  <span>Oyun ilerlememin ve duygu günlüğümün hesabımda saklanmasına açık rıza veriyorum. Bu verileri yalnızca ben görebilirim.</span>
                </label>
              )}
              {mod === 'kayit' && <a className="metin-baglanti" href="#gizlilik">Aydınlatma metnini oku</a>}
              {mesaj && <div className={'kucuk-bildirim' + (mesaj.tur === 'hata' ? ' hata' : '')} role={mesaj.tur === 'hata' ? 'alert' : 'status'}>{mesaj.metin}</div>}
              <button type="submit" className="dugme birincil" disabled={bekliyor}>{bekliyor ? 'Bekle…' : mod === 'kayit' ? 'Hesap aç' : 'Giriş yap'}</button>
            </form>
          </section>
        )}

        <p className="alt-yazi" style={{ margin: 0 }}>Veriler Supabase üzerinde, Avrupa Birliği'ndeki (Frankfurt) sunucularda saklanır. Hesap açmak zorunlu değildir; hesapsız da oynayabilirsin. <a className="metin-baglanti" href="#gizlilik">Aydınlatma metni</a></p>
      </div>
      <div style={{ flexGrow: 1, minHeight: 24 }} />
    </main>
  );
}
