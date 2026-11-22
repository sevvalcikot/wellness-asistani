// Birden fazla ekranda kullanılan küçük arayüz parçaları.
import { useState } from 'react';
import { git } from '../router.js';
import { useOyun } from '../state/GameContext.jsx';
import { SEVIYE_BASINA_XP, seviye, seviyeIlerleme } from '../state/rules.js';
import { Alev, Jeton, Kapat, NavHarita, NavOda, NavOyun } from './Icons.jsx';

// Üst bilgi çubuğu: seviye, XP çubuğu, jeton ve seri
export function Hud({ bilgiAc }) {
  const { durum } = useOyun();
  const ilerleme = seviyeIlerleme(durum.xp);
  return (
    <div className="hud">
      <div className="hud-seviye" aria-label={`Seviye ${seviye(durum.xp)}`}>
        <span>SEVİYE</span>
        <b>{seviye(durum.xp)}</b>
      </div>
      <div className="hud-xp">
        <div className="cubuk"><div className="cubuk-dolu" style={{ width: `${(ilerleme / SEVIYE_BASINA_XP) * 100}%` }} /></div>
        <span>{ilerleme} / {SEVIYE_BASINA_XP} XP</span>
      </div>
      <div className="hap sari" aria-label={`${durum.jeton} jeton`}><Jeton />{durum.jeton}</div>
      <div className="hap pembe" aria-label={`${durum.seri.gun} günlük seri`}><Alev />{durum.seri.gun}</div>
      {bilgiAc && (
        <button className="hap beyaz yuvarlak" onClick={bilgiAc} aria-label="Uygulama hakkında">?</button>
      )}
    </div>
  );
}

// Oyun ekranlarının üst kısmı: kapat düğmesi + başlık
export function OyunUstu({ baslik, altBaslik, children }) {
  return (
    <div className="oyun-ustu">
      <button className="kare-dugme" onClick={() => git('/harita')} aria-label="Haritaya dön"><Kapat /></button>
      <div className="oyun-ustu-yazi">
        <div className="baslik-kucuk">{baslik}</div>
        {altBaslik}
      </div>
      {children}
    </div>
  );
}

// Alt menü
export function AltMenu({ aktif }) {
  const ogeler = [
    { id: 'harita', ad: 'Harita', simge: <NavHarita /> },
    { id: 'oyunlar', ad: 'Oyunlar', simge: <NavOyun /> },
    { id: 'oda', ad: 'Odam', simge: <NavOda /> }
  ];
  return (
    <nav className="alt-menu" aria-label="Ana menü">
      {ogeler.map((o) => (
        <button key={o.id} className={o.id === aktif ? 'aktif' : ''} onClick={() => git('/' + o.id)} aria-current={o.id === aktif ? 'page' : undefined}>
          {o.simge}
          {o.ad}
        </button>
      ))}
    </nav>
  );
}

// "?" düğmesiyle açılan bilgi penceresi: güvenlik notu + ilerlemeyi sıfırlama
export function BilgiPenceresi({ kapat }) {
  const { sifirla } = useOyun();
  const [emin, setEmin] = useState(false);
  return (
    <div className="perde" onClick={kapat}>
      <div className="pencere" role="dialog" aria-modal="true" aria-labelledby="bilgi-baslik" onClick={(e) => e.stopPropagation()}>
        <h2 id="bilgi-baslik">Uygulama hakkında</h2>
        <p>Bu uygulama oyunlarla iyi oluşu desteklemek ve psikolojik bilgi öğretmek için tasarlandı. <b>Terapi ya da tıbbi tedavi yerine geçmez.</b></p>
        <p>Kendini uzun süredir kötü hissediyorsan bir uzmana danışmak iyi gelebilir. <b>Acil bir durumda 112'yi ara.</b></p>
        <p className="soluk">Şimdilik tüm ilerlemen yalnızca bu cihazda saklanıyor.</p>
        <div className="pencere-dugmeler">
          {emin ? (
            <button className="dugme ikincil" onClick={() => { sifirla(); kapat(); git('/'); }}>Evet, her şeyi sil</button>
          ) : (
            <button className="dugme ikincil" onClick={() => setEmin(true)}>İlerlemeyi sıfırla</button>
          )}
          <button className="dugme birincil" onClick={kapat}>Tamam</button>
        </div>
      </div>
    </div>
  );
}

// Cevabın nereden geldiğini gösteren küçük etiket (şeffaflık için)
export function KaynakEtiketi({ kaynak }) {
  if (!kaynak) return null;
  const yz = kaynak === 'yapay-zeka';
  return (
    <span className={'kaynak-etiketi' + (yz ? ' yz' : '')}>
      {yz ? 'Yapay zeka cevabı' : 'Hazır cevap (yapay zeka şu an kapalı)'}
    </span>
  );
}

// Kriz ifadesi algılandığında gösterilen destek penceresi.
// Burada yapay zeka devreye girmez; kullanıcı gerçek insanlara yönlendirilir.
export function KrizPenceresi({ kapat }) {
  return (
    <div className="perde" onClick={kapat}>
      <div className="pencere kriz" role="alertdialog" aria-modal="true" aria-labelledby="kriz-baslik" onClick={(e) => e.stopPropagation()}>
        <h2 id="kriz-baslik">Yalnız değilsin</h2>
        <p>Yazdıkların çok zor bir an yaşıyor olabileceğini gösteriyor. Bu konuda bir uygulamadan çok daha fazlasını hak ediyorsun: gerçek bir insanla konuşmak.</p>
        <p><b>Kendini güvende hissetmiyorsan hemen 112'yi ara.</b></p>
        <p>Güvendiğin bir arkadaşına, aile üyene ya da bir ruh sağlığı uzmanına şu an nasıl hissettiğini anlatmak da iyi bir ilk adım olabilir.</p>
        <a className="kriz-numara" href="tel:112" aria-label="112 Acil Çağrı Merkezini ara">112</a>
        <button className="dugme birincil" style={{ width: '100%', marginTop: 12 }} onClick={kapat}>Anladım</button>
      </div>
    </div>
  );
}
