// Oyun: Huzur Tepesi – Üç Güzel Şey
// Kullanıcı bugün iyi giden üç şeyi yazar; her biri tepedeki bir feneri yakar.
import { useState } from 'react';
import Companion from '../components/Companion.jsx';
import { KrizPenceresi, OyunUstu } from '../components/Ui.jsx';
import { krizVarMi } from '../data/safety.js';
import { git } from '../router.js';
import { useOyun } from '../state/GameContext.jsx';

const FENER_XP = 20;
const ORNEKLER = ['Sabah kahvem çok güzeldi.', 'Arkadaşım beni aradı.', 'Ödevimin bir kısmını bitirdim.', 'Güneşli havada yürüdüm.'];

function Fener({ yandi, i }) {
  return (
    <svg width="64" height="86" viewBox="0 0 64 86" aria-hidden="true" className={yandi ? 'pat' : ''} style={{ animationDelay: `${i * 0.1}s` }}>
      {yandi && <circle cx="32" cy="48" r="30" fill="#FFE45E" opacity=".45" className="isilti" />}
      <path d="M32 4 V14" stroke="#2B2420" strokeWidth="3" strokeLinecap="round" />
      <rect x="18" y="14" width="28" height="8" rx="3" fill="#2B2420" />
      <rect x="14" y="22" width="36" height="48" rx="12" fill={yandi ? '#FFC233' : '#FFF6D6'} stroke="#2B2420" strokeWidth="3" />
      {yandi && <path d="M32 36 c6 6 6 14 0 18 c-6 -4 -6 -12 0 -18z" fill="#FF7A59" />}
      <rect x="18" y="70" width="28" height="8" rx="3" fill="#2B2420" />
    </svg>
  );
}

export default function GratitudeGame() {
  const { durum, bolumBitir } = useOyun();
  const [liste, setListe] = useState([]);
  const [metin, setMetin] = useState('');
  const [kriz, setKriz] = useState(false);
  const bitti = liste.length >= 3;

  const ekle = (e) => {
    e.preventDefault();
    const t = metin.trim();
    if (t.length < 3 || bitti) return;
    if (krizVarMi(t)) return setKriz(true);
    setListe([...liste, t]);
    setMetin('');
  };

  const tamamla = () => {
    bolumBitir({
      bolumId: 'huzur',
      baslik: 'Huzur Tepesi tamamlandı!',
      mesaj: 'Üç feneri de yaktın. Bugünün güzel anları artık seninle.',
      xp: liste.length * FENER_XP,
      jeton: 20,
      rozet: 'huzur-bulucu',
      gorev: {},
      ogrenilenler: [{ ad: 'Üç güzel şey egzersizi', aciklama: 'Her gün iyi giden üç şeyi yazmak, dikkatini gün içindeki olumlu anlara yöneltmeye yardım eder.' }]
    });
    git('/odul');
  };

  return (
    <main className="ekran" style={{ background: '#FFD1B8' }}>
      <svg className="arka-plan alt" width="390" height="220" viewBox="0 0 390 220" aria-hidden="true">
        <path d="M0 120 Q120 40 230 90 T390 70 V220 H0 Z" fill="#B8E29A" />
        <path d="M0 170 Q140 120 260 150 T390 140 V220 H0 Z" fill="#8EDB6E" />
      </svg>

      <OyunUstu baslik="Huzur Tepesi" altBaslik={<div className="alt-yazi">Üç Güzel Şey · {liste.length} / 3</div>}>
        <div className="hap turuncu">+{liste.length * FENER_XP} XP</div>
      </OyunUstu>

      <div className="konusan">
        <Companion id={durum.arkadas} genislik={64} className="zipla-yavas" />
        <div className="balon">Bugün iyi giden üç şeyi yaz. Küçük şeyler de sayılır! Her biri bir fener yakacak.</div>
      </div>

      <div className="fenerler" aria-label={`${liste.length} fener yandı`}>
        {[0, 1, 2].map((i) => <Fener key={i} i={i} yandi={i < liste.length} />)}
      </div>

      <div className="icerik-dolgu" style={{ gap: 10 }}>
        {liste.map((t, i) => (
          <div key={i} className="plan-adimi pat"><span className="plan-no">{i + 1}</span><span>{t}</span></div>
        ))}

        {!bitti ? (
          <form onSubmit={ekle} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label htmlFor="guzel-sey" className="legend">{liste.length + 1}. güzel şey</label>
            <input id="guzel-sey" className="metin-alani" maxLength={140} value={metin} onChange={(e) => setMetin(e.target.value)} placeholder={`Örneğin: ${ORNEKLER[liste.length % ORNEKLER.length]}`} autoComplete="off" />
            <button type="submit" className="dugme birincil" disabled={metin.trim().length < 3}>Feneri yak</button>
          </form>
        ) : (
          <button className="dugme birincil buyuk pat" onClick={tamamla}>Bölümü bitir</button>
        )}
      </div>

      <div style={{ flexGrow: 1, minHeight: 24 }} />
      {kriz && <KrizPenceresi kapat={() => setKriz(false)} />}
    </main>
  );
}
