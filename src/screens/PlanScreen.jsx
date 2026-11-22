// Başlangıç 2. adım: kısa sorular + kişisel plan (yapay zeka; kapalıysa hazır plan)
import { useState } from 'react';
import Companion from '../components/Companion.jsx';
import { KaynakEtiketi, KrizPenceresi } from '../components/Ui.jsx';
import { arkadasBul } from '../data/companions.js';
import { bolumBul } from '../data/levels.js';
import { git } from '../router.js';
import { kisiselPlan } from '../services/ai.js';
import { useOyun } from '../state/GameContext.jsx';

const ODAKLAR = ['Sınav ve ders stresi', 'Kaygı ve endişe', 'Uyku ve yorgunluk', 'İlişkiler ve yalnızlık', 'Sadece merak ediyorum'];
const SURELER = ['3 dakika', '5 dakika', '10 dakika'];

export default function PlanScreen() {
  const { durum, planKaydet } = useOyun();
  const arkadas = arkadasBul(durum.arkadas);
  const [odak, setOdak] = useState(null);
  const [sure, setSure] = useState(null);
  const [not, setNot] = useState('');
  const [bekliyor, setBekliyor] = useState(false);
  const [plan, setPlan] = useState(null);
  const [kriz, setKriz] = useState(false);

  const hazirla = async () => {
    setBekliyor(true);
    const sonuc = await kisiselPlan({ odak, sure, not: not.trim() });
    setBekliyor(false);
    if (sonuc.kriz) return setKriz(true);
    setPlan(sonuc);
    planKaydet(sonuc);
  };

  return (
    <main className="ekran" style={{ background: '#C8F2B4' }}>
      <div style={{ padding: '44px 22px 0', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
        <div className="etiket sari">ADIM 2 / 2</div>
        <h1 className="baslik-buyuk" style={{ fontSize: 30 }}>{plan ? 'Senin planın hazır!' : 'Seni biraz tanıyalım'}</h1>
      </div>

      {!plan && (
        <div className="icerik-dolgu" style={{ gap: 18 }}>
          <div className="konusan" style={{ padding: 0 }}>
            <Companion id={durum.arkadas} genislik={64} className="zipla-yavas" />
            <div className="balon">Ben {arkadas.ad}. Üç kısa soru soracağım, sana uygun bir başlangıç planı hazırlayacağım.</div>
          </div>

          <fieldset className="soru-grubu">
            <legend>Bu aralar seni en çok ne yoruyor?</legend>
            <div className="cip-listesi">
              {ODAKLAR.map((o) => (
                <button key={o} className={'cip' + (odak === o ? ' secili' : '')} aria-pressed={odak === o} onClick={() => setOdak(o)}>{o}</button>
              ))}
            </div>
          </fieldset>

          <fieldset className="soru-grubu">
            <legend>Günde ne kadar vakit ayırabilirsin?</legend>
            <div className="cip-listesi">
              {SURELER.map((s) => (
                <button key={s} className={'cip' + (sure === s ? ' secili' : '')} aria-pressed={sure === s} onClick={() => setSure(s)}>{s}</button>
              ))}
            </div>
          </fieldset>

          <label className="soru-grubu" htmlFor="plan-not">
            <span className="legend">İstersen biraz daha anlat <span className="soluk">(isteğe bağlı)</span></span>
            <textarea id="plan-not" className="metin-alani" rows={3} maxLength={300} value={not} onChange={(e) => setNot(e.target.value)} placeholder="Örneğin: Final haftasındayım, akşamları kafamı toparlayamıyorum." />
          </label>

          <button className="dugme birincil buyuk" onClick={hazirla} disabled={!odak || !sure || bekliyor}>
            {bekliyor ? `${arkadas.ad} düşünüyor…` : 'Planımı hazırla'}
          </button>
          <button className="metin-dugme" onClick={() => git('/harita')}>Şimdilik geç</button>
        </div>
      )}

      {plan && (
        <div className="icerik-dolgu pat" style={{ gap: 14 }}>
          <div className="beyaz-panel" style={{ marginTop: 0 }}>
            <KaynakEtiketi kaynak={plan.kaynak} />
            <div className="govde" style={{ fontSize: 15 }}>{plan.mesaj}</div>
          </div>
          {plan.adimlar.map((a, i) => {
            const b = bolumBul(a.oyun);
            return (
              <div key={i} className="plan-adimi">
                <span className="plan-no">{i + 1}</span>
                <span><b>{b?.oyun}</b><br />{a.metin}</span>
              </div>
            );
          })}
          <button className="dugme birincil buyuk" style={{ marginTop: 6 }} onClick={() => git('/harita')}>Haritaya git</button>
        </div>
      )}

      <div style={{ flexGrow: 1, minHeight: 24 }} />
      {kriz && <KrizPenceresi kapat={() => setKriz(false)} />}
    </main>
  );
}
