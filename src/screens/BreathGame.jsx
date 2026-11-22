// Oyun: Nefes Balonu (4-7-8 nefes egzersizi)
// 4 saniye nefes al, 7 saniye tut, 8 saniye ver. Balon nefesle birlikte şişer ve iner.
import { useEffect, useState } from 'react';
import Companion from '../components/Companion.jsx';
import { Yildiz } from '../components/Icons.jsx';
import { OyunUstu } from '../components/Ui.jsx';
import { git } from '../router.js';
import { useOyun } from '../state/GameContext.jsx';

const AL = 4, TUT = 7, VER = 8;
const TUR_SURESI = AL + TUT + VER; // 19 saniye
const TOPLAM_TUR = 4;
const TUR_XP = 15;

const HAZIRLIK = 3; // başlamadan önce 3 saniyelik geri sayım

function asama(saniye, t) {
  if (saniye < 0) return { ad: 'Hazır ol', kalan: -saniye, ipucu: 'Rahat otur, omuzlarını gevşet.' };
  if (t < AL) return { ad: 'Nefes al', kalan: AL - t, ipucu: 'Burnundan yavaşça nefes al, balon şişsin.' };
  if (t < AL + TUT) return { ad: 'Tut', kalan: AL + TUT - t, ipucu: 'Nefesini tut, balon gökyüzünde süzülsün.' };
  return { ad: 'Ver', kalan: TUR_SURESI - t, ipucu: 'Ağzından yavaşça ver, balon nazikçe insin.' };
}

export default function BreathGame() {
  const { durum, bolumBitir } = useOyun();
  const [saniye, setSaniye] = useState(-HAZIRLIK); // toplam geçen saniye (eksi: hazırlık)

  const biten = saniye < 0 ? 0 : Math.min(TOPLAM_TUR, Math.floor(saniye / TUR_SURESI));
  const hepsiBitti = biten >= TOPLAM_TUR;
  const t = saniye < 0 ? -1 : saniye % TUR_SURESI;
  const a = asama(saniye, t);
  const sisik = !hepsiBitti && t >= 0 && t < AL + TUT; // nefes alırken ve tutarken balon büyük

  useEffect(() => {
    if (hepsiBitti) return;
    const iv = setInterval(() => setSaniye((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, [hepsiBitti]);

  const bitir = () => {
    if (biten === 0) {
      git('/harita');
      return;
    }
    bolumBitir({
      bolumId: 'nefes',
      baslik: 'Nefes molası tamamlandı!',
      mesaj: `${biten} nefes turunu tamamladın. Bedenin sana teşekkür ediyor.`,
      xp: biten * TUR_XP,
      jeton: 15,
      rozet: biten >= TOPLAM_TUR ? 'nefes-ustasi' : null,
      gorev: { nefes: 1 },
      ogrenilenler: [{ ad: '4-7-8 nefesi', aciklama: '4 saniye al, 7 saniye tut, 8 saniye ver. Uzun nefes vermek bedeni yavaşlatır.' }]
    });
    git('/odul');
  };

  return (
    <main className="ekran" style={{ background: '#FFB98A' }}>
      <svg className="arka-plan alt" width="390" height="300" viewBox="0 0 390 300" aria-hidden="true">
        <circle cx="300" cy="80" r="70" fill="#FFE45E" />
        <path d="M0 160 Q80 120 170 152 T390 140 V300 H0 Z" fill="#7FD36B" />
        <path d="M0 200 Q120 170 240 198 T390 192 V300 H0 Z" fill="#4FB83E" />
      </svg>
      <svg className="arka-plan" width="390" height="320" viewBox="0 0 390 320" aria-hidden="true">
        <g className="suzul"><ellipse cx="70" cy="190" rx="40" ry="15" fill="#FFFFFF" /><ellipse cx="98" cy="178" rx="26" ry="16" fill="#FFFFFF" /></g>
        <g className="suzul ters"><ellipse cx="320" cy="270" rx="36" ry="13" fill="#FFFFFF" /><ellipse cx="300" cy="262" rx="20" ry="12" fill="#FFFFFF" /></g>
      </svg>

      <OyunUstu baslik="Nefes Balonu" altBaslik={<div className="alt-yazi">Tur {Math.min(biten + 1, TOPLAM_TUR)} / {TOPLAM_TUR}</div>}>
        <div style={{ display: 'flex', gap: 4 }} aria-label={`${biten} tur tamamlandı`}>
          {Array.from({ length: TOPLAM_TUR }, (_, k) => <Yildiz key={k} dolgu={k < biten ? '#FFC233' : '#FFFFFF'} />)}
        </div>
      </OyunUstu>

      <div className="balon-sahnesi">
        <div className="balon-govde" style={{ transform: `translateY(${sisik ? -20 : 30}px)`, transitionDuration: `${t < AL ? AL : VER}s` }}>
          <div className="balon-zarf" style={{ transform: `scale(${sisik ? 1 : 0.62})`, transitionDuration: `${t < AL ? AL : VER}s` }}>
            <svg width="230" height="250" viewBox="0 0 230 250" aria-hidden="true">
              <defs><clipPath id="zarf"><path d="M115 6 C176 6 214 52 214 108 C214 160 170 196 140 232 H90 C60 196 16 160 16 108 C16 52 54 6 115 6 Z" /></clipPath></defs>
              <g clipPath="url(#zarf)">
                <rect x="0" y="0" width="230" height="240" fill="var(--vurgu)" />
                {[[70, 50, 11], [150, 40, 9], [186, 88, 10], [44, 140, 9], [112, 150, 11], [170, 168, 9], [96, 200, 8]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#FFE45E" />)}
              </g>
              <path d="M115 6 C176 6 214 52 214 108 C214 160 170 196 140 232 H90 C60 196 16 160 16 108 C16 52 54 6 115 6 Z" fill="none" stroke="#2B2420" strokeWidth="5" strokeLinejoin="round" />
              <path d="M22 110 H208" stroke="#FFC233" strokeWidth="10" clipPath="url(#zarf)" />
              <ellipse cx="80" cy="60" rx="14" ry="24" fill="#FFFFFF" opacity=".35" />
            </svg>
          </div>
          <svg width="120" height="40" viewBox="0 0 120 40" aria-hidden="true" style={{ marginTop: -6 }}>
            <path d="M44 0 L50 40 M76 0 L70 40" stroke="#2B2420" strokeWidth="3" />
          </svg>
          <div className="sepet">
            <Companion id={durum.arkadas} genislik={64} className="sepetteki" />
            <div className="sepet-kutu" />
          </div>
        </div>
      </div>

      <div className="nefes-bilgi" aria-live="polite">
        {hepsiBitti ? (
          <>
            <div className="baslik-buyuk">Harika!</div>
            <div className="govde">4 turun hepsini tamamladın.</div>
          </>
        ) : (
          <>
            <div className="baslik-buyuk">{a.ad} · {a.kalan}</div>
            <div className="govde">{a.ipucu}</div>
          </>
        )}
        {biten > 0 && <div className="hap turuncu" style={{ marginTop: 10 }}>Kombo x{biten}</div>}
      </div>

      <div style={{ padding: '0 45px 30px', position: 'relative' }}>
        <button className="dugme beyaz buyuk" style={{ width: '100%' }} onClick={bitir}>
          {biten === 0 ? 'Haritaya dön' : 'Molayı bitir'}
        </button>
      </div>
    </main>
  );
}
