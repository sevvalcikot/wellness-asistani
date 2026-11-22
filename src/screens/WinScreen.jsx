// Bölüm sonu ödül ekranı
import { useEffect, useState } from 'react';
import { Kitap, RozetSimgesi, Yildiz } from '../components/Icons.jsx';
import { arkadasBul } from '../data/companions.js';
import { ONERILER } from '../data/recommendations.js';
import { ROZETLER } from '../data/rewards.js';
import { git } from '../router.js';
import { useOyun } from '../state/GameContext.jsx';
import { SEVIYE_BASINA_XP, seviye, seviyeIlerleme } from '../state/rules.js';

const KONFETI = [
  [20, '#D9472B', 0], [64, '#2F6FCB', 0.7], [110, '#FFC233', 1.6], [158, '#2E8A45', 0.3], [204, '#6A4FD6', 2.1],
  [252, '#D9472B', 1.1], [296, '#FFC233', 2.6], [340, '#2F6FCB', 1.9], [362, '#2E8A45', 0.9]
];

export default function WinScreen() {
  const { durum, tiklamaKaydet } = useOyun();
  const [bildirim, setBildirim] = useState('');
  const o = durum.sonOdul;

  useEffect(() => {
    if (!o) git('/harita');
  }, [o]);
  useEffect(() => {
    if (!bildirim) return;
    const z = setTimeout(() => setBildirim(''), 3500);
    return () => clearTimeout(z);
  }, [bildirim]);

  if (!o) return null;

  const arkadas = arkadasBul(durum.arkadas);
  const kalan = SEVIYE_BASINA_XP - seviyeIlerleme(durum.xp);
  const oneri = ONERILER[o.bolumId];
  const rozet = ROZETLER.find((r) => r.id === o.rozet);
  const yeniRozet = rozet && o.yeniRozetler.includes(rozet.id);

  const oneriTikla = () => {
    tiklamaKaydet(oneri.id); // ileride veritabanındaki affiliate_tiklamalar tablosuna yazılacak
    if (oneri.url) window.open(oneri.url, '_blank', 'noopener,noreferrer');
    else setBildirim('Tıklama kaydedildi. Ortaklık bağlantısı henüz eklenmedi (data/recommendations.js).');
  };

  return (
    <main className="ekran kazanc" style={{ background: '#FFD93D' }}>
      <div className="konfeti-alani" aria-hidden="true">
        {KONFETI.map(([x, c, gecikme], i) => (
          <span key={i} className="konfeti" style={{ left: x, background: c, animationDelay: `${gecikme}s` }} />
        ))}
      </div>

      <div className="madalya-alani">
        <svg className="isinlar don" width="180" height="180" viewBox="0 0 180 180" aria-hidden="true">
          <path d="M90 90 L90 0 L110 4 Z M90 90 L170 50 L176 70 Z M90 90 L150 160 L132 172 Z M90 90 L30 164 L14 150 Z M90 90 L2 70 L8 50 Z M90 90 L40 12 L60 4 Z" fill="#FFF1A8" />
        </svg>
        <div className="madalya pat zipla-yavas"><Yildiz boyut={56} /></div>
      </div>
      <div className="uc-yildiz">
        {[0, 1, 2].map((k) => <span key={k} className="pat" style={{ animationDelay: `${0.3 + k * 0.2}s` }}><Yildiz boyut={34} dolgu="#FF7A59" /></span>)}
      </div>

      <h1 className="baslik-buyuk" style={{ textAlign: 'center', marginTop: 8, fontSize: 28 }}>{o.baslik}</h1>
      <p className="ortali-metin">{arkadas.ad} seninle gurur duyuyor. {o.mesaj}</p>

      <div className="odul-izgara">
        <div className="odul-kart pat" style={{ background: '#D9CCFF', animationDelay: '.4s' }}>
          <b style={{ color: '#4D36A8' }}>+{o.xp + o.bonus}</b><span>XP{o.bonus ? ' (görev bonusu dahil)' : ''}</span>
        </div>
        <div className="odul-kart pat" style={{ background: '#FFC8B8', animationDelay: '.55s' }}>
          <b style={{ color: '#8A3B12' }}>+{o.jeton}</b><span>jeton</span>
        </div>
        <div className="odul-kart pat" style={{ background: rozet ? '#BDF2C8' : '#FFFFFF', animationDelay: '.7s' }}>
          {rozet ? <><RozetSimgesi simge={rozet.simge} /><span>{rozet.ad}{yeniRozet ? '' : ' (zaten sende)'}</span></> : <><b style={{ color: '#5B6472' }}>–</b><span>Rozet için tekrar dene</span></>}
        </div>
      </div>

      <div className="seviye-satiri">
        <div className="satir-ara" style={{ fontSize: 12, fontWeight: 900 }}>
          <span>Seviye {seviye(durum.xp)}{o.seviyeAtladi ? ' · Seviye atladın!' : ''}</span>
          <span>Seviye {seviye(durum.xp) + 1}'e {kalan} XP kaldı</span>
        </div>
        <div className="cubuk kalin"><div className="cubuk-dolu mor dolarak" style={{ width: `${(seviyeIlerleme(durum.xp) / SEVIYE_BASINA_XP) * 100}%` }} /></div>
      </div>

      <div className="beyaz-panel">
        <div className="ust-etiket" style={{ color: '#2E8A45' }}>BUGÜN ÖĞRENDİKLERİN</div>
        {o.ogrenilenler.map((g) => (
          <div key={g.ad} className="govde"><b>{g.ad}:</b> {g.aciklama}</div>
        ))}
      </div>

      {oneri && (
        <button className="oneri" onClick={oneriTikla}>
          <span className="oneri-simge"><Kitap /></span>
          <span className="oneri-metin">
            <b>{oneri.baslik}</b>
            <small>{oneri.magaza} · İş ortaklığı bağlantısı</small>
          </span>
        </button>
      )}

      <div style={{ flexGrow: 1, minHeight: 12 }} />
      <div className="ikili-dugmeler alt">
        <button className="dugme beyaz" onClick={() => git('/oda')}>Odamı süsle</button>
        <button className="dugme birincil" onClick={() => git('/harita')}>Haritaya dön</button>
      </div>

      {bildirim && <div className="bildirim" role="status">{bildirim}</div>}
    </main>
  );
}
