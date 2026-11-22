// Ana ekran: Huzur Adası haritası + günlük görevler
import { useState } from 'react';
import Companion from '../components/Companion.jsx';
import { Kilit, Oynat, Tik, Yildiz } from '../components/Icons.jsx';
import { AltMenu, BilgiPenceresi, Hud } from '../components/Ui.jsx';
import { arkadasBul } from '../data/companions.js';
import { BOLUMLER } from '../data/levels.js';
import { GOREV_BONUS_XP, GUNLUK_GOREVLER } from '../data/rewards.js';
import { git } from '../router.js';
import { useOyun } from '../state/GameContext.jsx';

// Bir bölüm, kendinden önceki tamamlanınca açılır
export function bolumDurumu(tamamlanan, i) {
  const b = BOLUMLER[i];
  if (tamamlanan.includes(b.id)) return 'tamam';
  const acik = i === 0 || tamamlanan.includes(BOLUMLER[i - 1].id);
  if (!acik) return 'kilitli';
  if (b.yakinda) return 'yakinda';
  return 'simdi';
}

export default function MapScreen() {
  const { durum } = useOyun();
  const [bilgi, setBilgi] = useState(false);
  const arkadas = arkadasBul(durum.arkadas);
  const durumlar = BOLUMLER.map((_, i) => bolumDurumu(durum.tamamlanan, i));
  const simdiki = BOLUMLER.find((_, i) => durumlar[i] === 'simdi');
  // Yol arkadaşı, sıradaki bölümün yanında durur
  const konum = simdiki || BOLUMLER.filter((b) => !b.yakinda).slice(-1)[0];

  const tikla = (b, i) => {
    if (b.yol && (durumlar[i] === 'simdi' || durumlar[i] === 'tamam')) git(b.yol);
  };

  return (
    <main className="ekran" style={{ background: '#3FA9F5' }}>
      <Hud bilgiAc={() => setBilgi(true)} />

      <div className="konusma-balonu" role="status">
        {simdiki
          ? <>Bugün {simdiki.hedef} gidelim mi? {simdiki.davet}</>
          : <>Harika gidiyorsun! Huzur Tepesi çok yakında açılacak. Bu arada oyunları tekrar oynayabilirsin.</>}
        <div className="balon-imza">{arkadas.ad}</div>
      </div>

      <div className="harita-alani">
        <svg className="harita" viewBox="0 0 390 482" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Huzur Adası haritası">
          <g className="dalga" opacity="0.8">
            <path d="M20 40q10-8 20 0t20 0" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M320 440q10-8 20 0t20 0" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
          <path d="M36 128 C44 48 160 26 232 56 C318 34 382 112 362 204 C390 300 332 430 228 450 C138 476 40 438 30 346 C0 266 22 196 36 128 Z" fill="#FFE28A" stroke="#F5B942" strokeWidth="5" />
          <ellipse cx="120" cy="250" rx="80" ry="54" fill="#8EDB6E" />
          <ellipse cx="268" cy="330" rx="70" ry="50" fill="#8EDB6E" />
          <ellipse cx="200" cy="96" rx="76" ry="36" fill="#8EDB6E" />
          <path d="M86 412 C150 404 122 344 192 334 C272 322 302 272 252 224 C202 176 122 204 112 144 C104 96 200 84 262 104" stroke="#FFFFFF" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray="2 14" />
          {[[61, 292, 300], [321, 152, 160], [169, 182, 190], [211, 188, 196]].map(([x, y, g], i) => (
            <g key={i} className="salin"><rect x={x - 3} y={g} width="6" height="20" fill="#9A6B3F" /><circle cx={x} cy={y} r="15" fill="#7CC36E" /></g>
          ))}
          {[[140, 262, '#FF7A59'], [92, 232, '#FF9FD2'], [250, 300, '#B9A7FF'], [300, 346, '#FF7A59'], [176, 104, '#FF9FD2']].map(([x, y, c], i) => (
            <circle key={i} cx={x} cy={y} r="5.5" fill={c} stroke="#2B2420" strokeWidth="2" />
          ))}
          <path d="M278 382 l34 -26 l34 26 v34 h-68 z" fill="#FF9F8A" stroke="#2B2420" strokeWidth="3" strokeLinejoin="round" />
          <path d="M272 384 l40 -32 l40 32" stroke="#D9472B" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="303" y="394" width="16" height="22" rx="3" fill="#FFF4DE" stroke="#2B2420" strokeWidth="2.5" />

          {BOLUMLER.map((b, i) => (
            <HaritaDugumu key={b.id} b={b} durum={durumlar[i]} no={i + 1} onClick={() => tikla(b, i)} />
          ))}

          {/* Not: CSS animasyonu SVG'nin transform özelliğini ezdiği için konum ve animasyon ayrı <g>'lerde */}
          <g transform={`translate(${konum.x - 92} ${konum.y - 26})`} style={{ pointerEvents: 'none' }}>
            <g className="zipla-yavas"><Companion id={durum.arkadas} genislik={60} /></g>
          </g>
        </svg>

      </div>

      <section className="alt-tabaka gorev-tabakasi" style={{ background: '#FFF6D6' }}>
        <div className="satir-ara">
          <h2 className="baslik-orta">Günlük görevler</h2>
          <span style={{ fontSize: 12, fontWeight: 900, color: '#6A4FD6' }}>
            {durum.gorevler.bonusAlindi ? 'Bonus alındı!' : `Hepsini bitir: +${GOREV_BONUS_XP} XP`}
          </span>
        </div>
        {GUNLUK_GOREVLER.map((g) => {
          const ilerleme = durum.gorevler.ilerleme[g.id] || 0;
          const bitti = ilerleme >= g.hedef;
          return (
            <button key={g.id} className="gorev" style={{ background: g.renk }} onClick={() => git(g.yol)}>
              <span className={'gorev-kutu' + (bitti ? ' bitti' : '')}>{bitti && <Tik />}</span>
              <span className={'gorev-metin' + (bitti ? ' cizili' : '')}>{g.metin}</span>
              <span className="gorev-sayac">{bitti ? 'Tamam' : `${ilerleme} / ${g.hedef}`}</span>
            </button>
          );
        })}
        <AltMenu aktif="harita" />
      </section>

      {bilgi && <BilgiPenceresi kapat={() => setBilgi(false)} />}
    </main>
  );
}

function HaritaDugumu({ b, durum, no, onClick }) {
  const tiklanir = durum === 'simdi' || (durum === 'tamam' && b.yol);
  const etiket = `${no}. bölüm: ${b.ad}, ${{ tamam: 'tamamlandı', simdi: 'şimdi oyna', kilitli: 'kilitli', yakinda: 'yakında' }[durum]}`;
  const tus = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } };
  const r = durum === 'simdi' ? 34 : 27;
  const yazi = durum === 'yakinda' ? `${b.ad} · yakında` : b.ad;

  return (
    <g
      className={tiklanir ? 'dugum tiklanir' : 'dugum'}
      transform={`translate(${b.x} ${b.y})`}
      onClick={onClick}
      onKeyDown={tus}
      role={tiklanir ? 'button' : 'img'}
      tabIndex={tiklanir ? 0 : -1}
      aria-label={etiket}
    >
      {durum === 'simdi' && <circle className="halka" r="36" fill="none" stroke="#FFFFFF" strokeWidth="4" />}
      {durum !== 'kilitli' && durum !== 'yakinda' && <circle r={r} cy="4" fill="#2B2420" />}
      <circle
        r={r}
        fill={durum === 'tamam' ? '#FFC233' : durum === 'simdi' ? 'var(--vurgu)' : '#E3E8EF'}
        stroke={durum === 'kilitli' || durum === 'yakinda' ? '#8A94A3' : '#2B2420'}
        strokeWidth="3"
        strokeDasharray={durum === 'kilitli' || durum === 'yakinda' ? '6 5' : undefined}
      />
      {durum === 'tamam' && <g transform="translate(-13 -13)"><Yildiz boyut={26} /></g>}
      {durum === 'simdi' && <g transform="translate(-15 -15)"><Oynat /></g>}
      {(durum === 'kilitli' || durum === 'yakinda') && <g transform="translate(-11 -11)"><Kilit /></g>}
      <g transform={`translate(0 ${r + 16})`}>
        <rect x={-yazi.length * 3.4 - 8} y="-11" width={yazi.length * 6.8 + 16} height="20" rx="8" fill="#2B2420" />
        <text textAnchor="middle" y="3.5" fill="#FFFFFF" fontSize="11" fontWeight="900">{yazi}</text>
      </g>
    </g>
  );
}

