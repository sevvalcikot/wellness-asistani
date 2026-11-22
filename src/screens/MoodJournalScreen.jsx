// Duygu Günlüğü: her gün ruh hâlini kaydet, son 7 günü grafikte gör.
import { useState } from 'react';
import Companion from '../components/Companion.jsx';
import MoodFace from '../components/MoodFace.jsx';
import { AltMenu, KrizPenceresi } from '../components/Ui.jsx';
import { DUYGULAR, RUH_HALLERI, ruhHali } from '../data/moods.js';
import { krizVarMi } from '../data/safety.js';
import { useOyun } from '../state/GameContext.jsx';
import { GUNLUK_XP, gunAnahtari, sonGunler } from '../state/rules.js';

export default function MoodJournalScreen() {
  const { durum, gunlukKaydet } = useOyun();
  const bugunKaydi = durum.gunluk.find((g) => g.tarih === gunAnahtari());
  const [duzenle, setDuzenle] = useState(!bugunKaydi);
  const [deger, setDeger] = useState(bugunKaydi?.ruhHali ?? null);
  const [duygular, setDuygular] = useState(bugunKaydi?.duygular ?? []);
  const [not, setNot] = useState(bugunKaydi?.not ?? '');
  const [kriz, setKriz] = useState(false);

  const duyguSec = (d) => setDuygular((l) => (l.includes(d) ? l.filter((x) => x !== d) : [...l, d].slice(0, 3)));

  const kaydet = () => {
    if (!deger) return;
    if (krizVarMi(not)) setKriz(true); // yine de kaydedilir; ama önce destek penceresi gösterilir
    gunlukKaydet({ ruhHali: deger, duygular, not: not.trim() });
    setDuzenle(false);
  };

  return (
    <main className="ekran" style={{ background: '#FFF0C7' }}>
      <div className="oda-ustu">
        <div style={{ flexGrow: 1 }}>
          <h1 className="baslik-orta" style={{ fontSize: 24 }}>Duygu Günlüğü</h1>
          <div className="alt-yazi">Her gün bir dakikanı ayır, kendini fark et</div>
        </div>
        <Companion id={durum.arkadas} genislik={60} className="zipla-yavas" />
      </div>

      <div className="icerik-dolgu" style={{ paddingTop: 4, gap: 16 }}>
        {duzenle ? (
          <section className="beyaz-panel" style={{ marginTop: 0, gap: 14 }} aria-labelledby="bugun-baslik">
            <h2 id="bugun-baslik" className="baslik-orta">Bugün nasıl hissediyorsun?</h2>
            <div className="ruh-halleri" role="radiogroup" aria-label="Ruh hâli">
              {RUH_HALLERI.map((r) => (
                <button key={r.deger} role="radio" aria-checked={deger === r.deger} className={'ruh-hali' + (deger === r.deger ? ' secili' : '')} onClick={() => setDeger(r.deger)}>
                  <MoodFace deger={r.deger} boyut={42} />
                  <span>{r.ad}</span>
                </button>
              ))}
            </div>

            <fieldset className="soru-grubu">
              <legend style={{ fontSize: 16 }}>Hangi duygular ağır bastı? <span className="soluk" style={{ fontSize: 13 }}>(en çok 3)</span></legend>
              <div className="cip-listesi">
                {DUYGULAR.map((d) => (
                  <button key={d} className={'cip' + (duygular.includes(d) ? ' secili' : '')} aria-pressed={duygular.includes(d)} onClick={() => duyguSec(d)}>{d}</button>
                ))}
              </div>
            </fieldset>

            <label className="soru-grubu" htmlFor="gunluk-not">
              <span className="legend" style={{ fontSize: 16 }}>Bugünü bir cümleyle anlat <span className="soluk" style={{ fontSize: 13 }}>(isteğe bağlı)</span></span>
              <textarea id="gunluk-not" className="metin-alani" rows={2} maxLength={300} value={not} onChange={(e) => setNot(e.target.value)} placeholder="Örneğin: Sınavım iyi geçti ama çok yoruldum." />
            </label>

            <button className="dugme birincil" onClick={kaydet} disabled={!deger}>
              {bugunKaydi ? 'Güncelle' : `Kaydet (+${GUNLUK_XP} XP)`}
            </button>
          </section>
        ) : (
          <section className="beyaz-panel pat" style={{ marginTop: 0, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <MoodFace deger={bugunKaydi.ruhHali} boyut={52} />
            <div style={{ flexGrow: 1 }}>
              <div className="ust-etiket" style={{ color: '#2E8A45' }}>BUGÜN KAYDEDİLDİ</div>
              <div className="govde"><b>{ruhHali(bugunKaydi.ruhHali)?.ad}</b>{bugunKaydi.duygular.length ? ` · ${bugunKaydi.duygular.join(', ')}` : ''}</div>
              {bugunKaydi.not && <div className="govde soluk">“{bugunKaydi.not}”</div>}
            </div>
            <button className="hap beyaz" onClick={() => setDuzenle(true)}>Düzenle</button>
          </section>
        )}

        <HaftalikGrafik gunluk={durum.gunluk} />
      </div>

      <div style={{ flexGrow: 1, minHeight: 16 }} />
      <AltMenu aktif="gunluk" />
      {kriz && <KrizPenceresi kapat={() => setKriz(false)} />}
    </main>
  );
}

// Son 7 günün ruh hâli grafiği (çubuk yüksekliği = ruh hâli 1–5)
function HaftalikGrafik({ gunluk }) {
  const gunler = sonGunler(7).map((g) => ({ ...g, kayit: gunluk.find((k) => k.tarih === g.anahtar) }));
  const dolu = gunler.filter((g) => g.kayit);
  const ortalama = dolu.length ? dolu.reduce((t, g) => t + g.kayit.ruhHali, 0) / dolu.length : null;
  const sayac = {};
  dolu.forEach((g) => g.kayit.duygular.forEach((d) => { sayac[d] = (sayac[d] || 0) + 1; }));
  const enSik = Object.entries(sayac).sort((a, b) => b[1] - a[1])[0];

  const G = 320, Y = 150, ust = 10, alt = 26, sol = 26;
  const alan = Y - ust - alt;
  const sutun = (G - sol) / 7;
  const yKoord = (v) => ust + alan - (v / 5) * alan;

  return (
    <section className="beyaz-panel" style={{ marginTop: 0 }} aria-labelledby="hafta-baslik">
      <h2 id="hafta-baslik" className="baslik-orta">Son 7 gün</h2>
      <div style={{ overflowX: 'auto' }}>
        <svg width="100%" viewBox={`0 0 ${G} ${Y}`} role="img" aria-label={`Son 7 günün ruh hâli grafiği. ${dolu.length} gün kayıt var.`}>
          {[1, 3, 5].map((v) => (
            <g key={v}>
              <line x1={sol} x2={G} y1={yKoord(v)} y2={yKoord(v)} stroke="#E5DCC5" strokeWidth="1" />
              <text x={sol - 6} y={yKoord(v) + 4} textAnchor="end" fontSize="10" fontWeight="800" fill="#5B6472">{v}</text>
            </g>
          ))}
          {gunler.map((g, i) => {
            const x = sol + i * sutun + sutun * 0.2;
            const w = sutun * 0.6;
            const bugun = i === 6;
            return (
              <g key={g.anahtar}>
                {g.kayit ? (
                  <rect x={x} y={yKoord(g.kayit.ruhHali)} width={w} height={(g.kayit.ruhHali / 5) * alan} rx="7" fill={ruhHali(g.kayit.ruhHali).renk} stroke="#2B2420" strokeWidth="2" />
                ) : (
                  <rect x={x} y={ust + alan - 8} width={w} height="8" rx="4" fill="none" stroke="#C9CED6" strokeWidth="1.5" strokeDasharray="3 3" />
                )}
                <text x={x + w / 2} y={Y - 8} textAnchor="middle" fontSize="11" fontWeight={bugun ? 900 : 700} fill={bugun ? '#2B2420' : '#5B6472'}>{bugun ? 'Bugün' : g.kisa}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="govde">
        {dolu.length === 0
          ? 'Henüz kayıt yok. Bugünün kaydını ekleyince grafiğin burada oluşacak.'
          : <>Bu hafta <b>{dolu.length} gün</b> yazdın. Ortalama ruh hâlin: <b>{ruhHali(Math.round(ortalama)).ad}</b> ({ortalama.toFixed(1).replace('.', ',')} / 5).{enSik ? <> En sık duygun: <b>{enSik[0]}</b>.</> : null}</>}
      </div>
    </section>
  );
}
