// Yol arkadaşının odası: jetonlarla eşya alınır, rozetler görünür
import { useState } from 'react';
import Companion from '../components/Companion.jsx';
import { Jeton, Kilit, RozetSimgesi } from '../components/Icons.jsx';
import { AltMenu } from '../components/Ui.jsx';
import { arkadasBul } from '../data/companions.js';
import { DUKKAN, ROZETLER } from '../data/rewards.js';
import { git } from '../router.js';
import { useOyun } from '../state/GameContext.jsx';
import { seviye } from '../state/rules.js';

export default function RoomScreen() {
  const { durum, esyaAl, hesap } = useOyun();
  const [mesaj, setMesaj] = useState('');
  const arkadas = arkadasBul(durum.arkadas);
  const var_ = (id) => durum.esyalar.includes(id);
  const sev = seviye(durum.xp);

  const al = (e) => {
    if (var_(e.id)) return;
    if (e.minSeviye && sev < e.minSeviye) return setMesaj(`${e.ad} için Seviye ${e.minSeviye} olmalısın.`);
    if (durum.jeton < e.fiyat) return setMesaj(`${e.fiyat - durum.jeton} jeton daha lazım. Görev yaparak kazanabilirsin!`);
    esyaAl(e);
    setMesaj(`${e.ad} odaya eklendi!`);
  };

  return (
    <main className="ekran" style={{ background: '#FFD6E7' }}>
      <div className="oda-ustu">
        <div style={{ flexGrow: 1 }}>
          <h1 className="baslik-orta" style={{ fontSize: 24 }}>{arkadas.iyelik} odası</h1>
          <div className="alt-yazi">Kazandığın jetonlarla odanı süsle</div>
        </div>
        <div className="hap beyaz buyuk-hap" aria-label={`${durum.jeton} jeton`}><Jeton boyut={20} />{durum.jeton}</div>
        <button className="hap beyaz buyuk-hap" onClick={() => git('/hesap')} aria-label={hesap ? 'Hesabım' : 'Hesap aç ya da giriş yap'}>{hesap ? 'Hesabım' : 'Giriş'}</button>
      </div>

      <div className="oda">
        <svg width="100%" height="100%" viewBox="0 0 348 324" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {[[150, 40, '#FFE45E'], [170, 120, '#FF9FD2'], [140, 190, '#FFE45E'], [330, 150, '#FF9FD2']].map(([x, y, c], i) => <circle key={i} cx={x} cy={y} r="5" fill={c} />)}
          <rect x="0" y="232" width="348" height="92" fill="#F2C27B" />
          <path d="M0 232 H348" stroke="#2B2420" strokeWidth="3" />
          {/* gece penceresi */}
          <rect x="196" y="34" width="118" height="100" rx="14" fill="#3B3F7A" stroke="#2B2420" strokeWidth="3" />
          <circle cx="286" cy="62" r="13" fill="#FFF4C2" /><circle cx="292" cy="58" r="11" fill="#3B3F7A" />
          <circle className="parilti" cx="222" cy="58" r="2.5" fill="#FFFFFF" />
          <circle className="parilti" cx="246" cy="98" r="2" fill="#FFFFFF" style={{ animationDelay: '.6s' }} />
          <path d="M255 34 V134 M196 84 H314" stroke="#2B2420" strokeWidth="3" />
          {/* kitaplık */}
          <rect x="22" y="70" width="96" height="162" rx="8" fill="#C98B4E" stroke="#2B2420" strokeWidth="3" />
          <path d="M22 124 H118 M22 178 H118" stroke="#2B2420" strokeWidth="3" />
          <rect x="32" y="88" width="12" height="36" fill="#D9472B" stroke="#2B2420" strokeWidth="2" /><rect x="46" y="94" width="10" height="30" fill="#2F6FCB" stroke="#2B2420" strokeWidth="2" />
          <rect x="58" y="86" width="14" height="38" fill="#FFC233" stroke="#2B2420" strokeWidth="2" /><rect x="76" y="98" width="10" height="26" fill="#2E8A45" stroke="#2B2420" strokeWidth="2" />
          <rect x="34" y="146" width="12" height="32" fill="#6A4FD6" stroke="#2B2420" strokeWidth="2" /><rect x="48" y="150" width="12" height="28" fill="#FF9F8A" stroke="#2B2420" strokeWidth="2" />
          {var_('cicek') && (
            <g className="pat">
              <path d="M86 178 l6 -20 h16 l6 20 z" fill="#E7A67E" stroke="#2B2420" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M100 158 C88 140 92 130 98 126 C104 136 104 148 100 158 Z M102 158 C110 142 118 140 124 142 C120 152 112 158 102 158 Z" fill="#7CC36E" stroke="#2B2420" strokeWidth="2" />
            </g>
          )}
          {var_('abajur') && (
            <g>
              <circle className="isilti" cx="300" cy="182" r="34" fill="#FFE29A" />
              <path d="M286 156 h28 l8 26 h-44 z" fill="#FF9F8A" stroke="#2B2420" strokeWidth="3" strokeLinejoin="round" />
              <path d="M300 182 V228 M288 230 h24" stroke="#2B2420" strokeWidth="4" strokeLinecap="round" />
            </g>
          )}
          {var_('akvaryum') && (
            <g className="pat">
              <rect x="20" y="248" width="76" height="52" rx="8" fill="#9ED3F2" stroke="#2B2420" strokeWidth="3" />
              <path d="M40 274 q8 -8 16 0 q-8 8 -16 0 z M56 274 l6 -5 v10 z" fill="#FF7A59" stroke="#2B2420" strokeWidth="1.5" />
              <circle cx="78" cy="262" r="3" fill="#FFFFFF" /><circle cx="82" cy="254" r="2" fill="#FFFFFF" />
            </g>
          )}
          <ellipse cx="174" cy="282" rx="120" ry="24" fill="#D9472B" opacity=".85" />
          <ellipse cx="174" cy="282" rx="90" ry="16" fill="none" stroke="#FFC233" strokeWidth="4" strokeDasharray="6 8" />
          <ellipse cx="170" cy="266" rx="54" ry="14" fill="#8B6CEF" stroke="#2B2420" strokeWidth="3" />
          {var_('isiklar') && (
            <g className="pat">
              <path d="M8 14 Q90 42 174 18 Q258 42 340 14" stroke="#2B2420" strokeWidth="2" fill="none" />
              {[[40, 26, '#FFC233'], [90, 32, '#FF9F8A'], [140, 26, '#9ED3F2'], [210, 26, '#C9EFC9'], [260, 32, '#FFC233'], [310, 26, '#FF9F8A']].map(([x, y, c], i) => (
                <circle key={i} className="parilti" cx={x} cy={y} r="6" fill={c} stroke="#2B2420" strokeWidth="2" style={{ animationDelay: `${i * 0.25}s` }} />
              ))}
            </g>
          )}
        </svg>
        <div className="oda-karakter zipla-yavas"><Companion id={durum.arkadas} genislik={104} uyku /></div>
        <div className="zz" style={{ left: '62%', top: '58%' }}>z</div>
        <div className="zz" style={{ left: '65%', top: '54%', fontSize: 14, animationDelay: '1.2s' }}>z</div>
      </div>

      <div className="icerik-dolgu" style={{ paddingTop: 16, gap: 10 }}>
        <div className="satir-ara">
          <h2 className="baslik-orta">Dükkân</h2>
          <span className="alt-yazi" style={{ fontSize: 12 }}>Jetonlar yalnızca görevlerle kazanılır</span>
        </div>
        <div className="dukkan">
          {DUKKAN.filter((e) => e.fiyat > 0 || var_(e.id)).map((e) => {
            const sahip = var_(e.id);
            const kilitli = !sahip && e.minSeviye && sev < e.minSeviye;
            return (
              <button key={e.id} className={'esya' + (sahip ? ' sahip' : '') + (kilitli ? ' kilitli' : '')} onClick={() => al(e)} aria-disabled={sahip || kilitli}>
                {kilitli && <Kilit boyut={20} />}
                <span className="esya-ad">{e.ad}</span>
                <span className="esya-durum">{sahip ? 'Odanda' : kilitli ? `Seviye ${e.minSeviye}` : <><Jeton boyut={14} /> {e.fiyat} · Al</>}</span>
              </button>
            );
          })}
        </div>
        {mesaj && <div className="kucuk-bildirim" role="status">{mesaj}</div>}

        <h2 className="baslik-orta" style={{ marginTop: 6 }}>Rozetlerim</h2>
        <div className="rozetler">
          {ROZETLER.map((r) => {
            const var2 = durum.rozetler.includes(r.id);
            return (
              <div key={r.id} className="rozet" title={r.nasil}>
                <div className={'rozet-daire' + (var2 ? '' : ' bos')} style={{ background: var2 ? r.renk : 'transparent' }}>
                  {var2 ? <RozetSimgesi simge={r.simge} /> : <Kilit boyut={20} renk="#8A94A3" />}
                </div>
                <span style={{ color: var2 ? '#2B2420' : '#5B6472' }}>{r.ad}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ flexGrow: 1 }} />
      <AltMenu aktif="oda" />
    </main>
  );
}
