// Oyun: Bilgi Kulesi
// Her katta önce kısa bir bilgi kartı okunur, sonra bir soru cevaplanır.
import { useState } from 'react';
import { Ampul } from '../components/Icons.jsx';
import { OyunUstu } from '../components/Ui.jsx';
import { BILGI_KATLARI } from '../data/quiz.js';
import { git } from '../router.js';
import { useOyun } from '../state/GameContext.jsx';

const DOGRU_XP = 30;
const YANLIS_XP = 10;
const ROZET_RENKLERI = ['#FFB4A2', '#FFE45E', '#9BE0F2'];
const HARFLER = ['A', 'B', 'C', 'D'];

export default function QuizGame() {
  const { bolumBitir } = useOyun();
  const [kat, setKat] = useState(0);
  const [secim, setSecim] = useState(null);
  const [ipucu, setIpucu] = useState(2);
  const [elenen, setElenen] = useState([]); // ipucuyla elenen seçenekler
  const [dogrular, setDogrular] = useState(0);

  const k = BILGI_KATLARI[kat];
  const cevaplandi = secim !== null;
  const dogruMu = secim === k.dogru;
  const sonKat = kat === BILGI_KATLARI.length - 1;

  const sec = (i) => {
    if (cevaplandi || elenen.includes(i)) return;
    setSecim(i);
    if (i === k.dogru) setDogrular((d) => d + 1);
  };

  const ipucuKullan = () => {
    if (ipucu === 0 || cevaplandi) return;
    const yanlislar = k.secenekler.map((_, i) => i).filter((i) => i !== k.dogru && !elenen.includes(i));
    if (yanlislar.length <= 1) return;
    setElenen([...elenen, yanlislar[Math.floor(Math.random() * yanlislar.length)]]);
    setIpucu(ipucu - 1);
  };

  const devam = () => {
    if (!sonKat) {
      setKat(kat + 1);
      setSecim(null);
      setElenen([]);
      return;
    }
    const toplamDogru = dogrular;
    bolumBitir({
      bolumId: 'bilgi',
      baslik: 'Bilgi Kulesi’nin tepesindesin!',
      mesaj: `${BILGI_KATLARI.length} sorudan ${toplamDogru} tanesini bildin.`,
      xp: toplamDogru * DOGRU_XP + (BILGI_KATLARI.length - toplamDogru) * YANLIS_XP,
      jeton: 20,
      rozet: toplamDogru === BILGI_KATLARI.length ? 'bilgi-kasifi' : null,
      gorev: { bilgi: 1 },
      ogrenilenler: BILGI_KATLARI.map((q) => ({ ad: q.kavram, aciklama: q.aciklama }))
    });
    git('/odul');
  };

  return (
    <main className="ekran" style={{ background: '#B9A7FF', padding: '0 0 28px' }}>
      <OyunUstu baslik="Bilgi Kulesi" altBaslik={<div className="alt-yazi">Kat {kat + 1} / {BILGI_KATLARI.length}</div>}>
        <button className="hap sari" onClick={ipucuKullan} disabled={ipucu === 0 || cevaplandi} aria-label="İpucu kullan: bir yanlış seçeneği ele">
          <Ampul /> {ipucu} ipucu
        </button>
      </OyunUstu>

      <div className="icerik-dolgu" key={kat}>
        <div className="bilgi-karti pat">
          <div className="parlama-kap"><div className="parlama" /><div className="parlama-ic"><Ampul boyut={20} /></div></div>
          <div>
            <div className="ust-etiket" style={{ color: '#6A4FD6' }}>BİLİYOR MUYDUN?</div>
            <div className="govde">{k.bilgi}</div>
          </div>
        </div>

        <h1 className="baslik-soru">{k.soru}</h1>

        <div className="secenekler">
          {k.secenekler.map((s, i) => {
            let arka = '#FFFFFF', rozet = ROZET_RENKLERI[i % 3], yazi = '#2B2420';
            if (cevaplandi && i === k.dogru) { arka = '#C9EFC9'; rozet = '#2E8A45'; yazi = '#FFFFFF'; }
            else if (cevaplandi && i === secim) { arka = '#FFE1D6'; rozet = '#D9472B'; yazi = '#FFFFFF'; }
            const elendi = elenen.includes(i);
            return (
              <button key={i} className={'secenek' + (elendi ? ' elendi' : '')} style={{ background: arka }} onClick={() => sec(i)} disabled={elendi || cevaplandi} aria-pressed={secim === i}>
                <span className="secenek-harf" style={{ background: rozet, color: yazi }}>{HARFLER[i]}</span>
                <span className="secenek-metin">{s}</span>
              </button>
            );
          })}
        </div>

        {cevaplandi && (
          <div className="geri-bildirim pat" style={{ background: dogruMu ? '#C9EFC9' : '#FFE1D6', margin: 0 }} role="status">
            <div className="baslik-orta">
              {dogruMu ? `Süper! Bir kat yükseldin. +${DOGRU_XP} XP` : `Neredeyse! Doğru cevap ${HARFLER[k.dogru]}. +${YANLIS_XP} XP`}
            </div>
            <div className="govde">{k.aciklama}</div>
          </div>
        )}
      </div>

      <div style={{ flexGrow: 1 }} />
      <div style={{ padding: '16px 18px 0' }}>
        <button className="dugme mor buyuk" style={{ width: '100%' }} onClick={devam} disabled={!cevaplandi}>
          {!cevaplandi ? 'Bir cevap seç' : sonKat ? 'Kulenin tepesine çık' : 'Sonraki kata çık'}
        </button>
      </div>
    </main>
  );
}
