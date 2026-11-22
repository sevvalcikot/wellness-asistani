// 1. ekran: Yol arkadaşını seç
import { useState } from 'react';
import Companion from '../components/Companion.jsx';
import { ARKADASLAR, arkadasBul } from '../data/companions.js';
import { git } from '../router.js';
import { useOyun } from '../state/GameContext.jsx';

export default function Onboarding() {
  const { durum, arkadasSec } = useOyun();
  const [secili, setSecili] = useState(durum.arkadas || 'bulut');
  const a = arkadasBul(secili);

  const basla = () => {
    arkadasSec(secili);
    git(durum.plan ? '/harita' : '/plan'); // ilk kez geliyorsa 2. adım: kişisel plan
  };

  return (
    <main className="ekran" style={{ background: '#7EC8F8' }}>
      <svg className="arka-plan" width="390" height="230" viewBox="0 0 390 230" aria-hidden="true">
        <g className="don"><circle cx="322" cy="70" r="30" fill="#FFD45C" /><path d="M322 26v-10M322 124v-10M278 70h-10M376 70h-10M291 39l-7-7M360 108l-7-7M291 101l-7 7M360 32l-7 7" stroke="#FFC233" strokeWidth="5" strokeLinecap="round" /></g>
        <g className="suzul"><ellipse cx="70" cy="80" rx="36" ry="14" fill="#FFFFFF" /><ellipse cx="96" cy="68" rx="24" ry="15" fill="#FFFFFF" /></g>
      </svg>

      <div className="ust-bosluk" style={{ padding: '52px 24px 0', display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
        <div className="etiket sari">ADIM 1 / 2</div>
        <h1 className="baslik-buyuk" style={{ maxWidth: 270 }}>Yolculuğa hazır mısın?</h1>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: '#1F2A36', fontWeight: 700 }}>
          Sana eşlik edecek bir yol arkadaşı seç. Birlikte görevler yapacak, büyüyecek ve yeni şeyler öğreneceksiniz.
        </p>
      </div>

      <div className="sahne-orta">
        <div className="zipla" key={secili}>
          <Companion id={secili} genislik={180} />
        </div>
        <div className="golge" />
        <div className="isim-karti">
          <div className="baslik-orta">{a.ad}</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#5B6472' }}>{a.ozellik}</div>
        </div>
      </div>

      <section className="alt-tabaka" style={{ background: '#FFD6E7' }}>
        <div style={{ fontSize: 14, fontWeight: 900 }}>Yol arkadaşın</div>
        <div className="uclu-izgara">
          {ARKADASLAR.map((k) => (
            <button
              key={k.id}
              className={'secim-karti' + (secili === k.id ? ' secili' : '')}
              style={{ background: k.kartRengi }}
              aria-pressed={secili === k.id}
              onClick={() => setSecili(k.id)}
            >
              <Companion id={k.id} genislik={58} />
              <span>{k.ad}</span>
            </button>
          ))}
        </div>
        <div style={{ flexGrow: 1 }} />
        <button className="dugme birincil buyuk" onClick={basla}>Maceraya başla</button>
      </section>
    </main>
  );
}
