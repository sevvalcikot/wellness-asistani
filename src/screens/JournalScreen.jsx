// Düşünce Defteri: kullanıcı kendi düşüncesini yazar, Bulut ipuçlarıyla değerlendirir.
import { useState } from 'react';
import Companion from '../components/Companion.jsx';
import { KrizPenceresi, OyunUstu } from '../components/Ui.jsx';
import { arkadasBul } from '../data/companions.js';
import { kendiDusunceniAnaliz } from '../services/rehber.js';
import { useOyun } from '../state/GameContext.jsx';

const DEFTER_XP = 10;

export default function JournalScreen() {
  const { durum, xpEkle } = useOyun();
  const arkadas = arkadasBul(durum.arkadas);
  const [metin, setMetin] = useState('');
  const [bekliyor, setBekliyor] = useState(false);
  const [sonuc, setSonuc] = useState(null);
  const [kriz, setKriz] = useState(false);

  const sor = async (e) => {
    e.preventDefault();
    if (metin.trim().length < 3 || bekliyor) return;
    setBekliyor(true);
    const s = await kendiDusunceniAnaliz(metin.trim());
    setBekliyor(false);
    if (s.kriz) return setKriz(true);
    setSonuc(s);
    xpEkle(DEFTER_XP, s.tuzak ? { tuzak: 1 } : {});
  };

  const yeniden = () => {
    setSonuc(null);
    setMetin('');
  };

  return (
    <main className="ekran" style={{ background: '#D7F5C8' }}>
      <OyunUstu baslik="Düşünce Defteri" altBaslik={<div className="alt-yazi">Kendi düşünceni yakala</div>}>
        <div className="hap turuncu">+{DEFTER_XP} XP</div>
      </OyunUstu>

      <div className="icerik-dolgu" style={{ gap: 16 }}>
        <div className="konusan" style={{ padding: 0 }}>
          <Companion id={durum.arkadas} genislik={64} className="zipla-yavas" />
          <div className="balon">Aklını kurcalayan bir düşünceyi yaz. Birlikte bakalım: bir tuzak mı, yoksa gerçekçi mi?</div>
        </div>

        {!sonuc && (
          <form onSubmit={sor} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label htmlFor="defter-metin" className="legend">Düşüncen</label>
            <textarea id="defter-metin" className="metin-alani" rows={4} maxLength={300} value={metin} onChange={(e) => setMetin(e.target.value)} placeholder="Örneğin: Sunumda herkes benimle dalga geçecek." />
            <div className="alt-yazi" style={{ textAlign: 'right' }}>{metin.length} / 300</div>
            <button type="submit" className="dugme birincil buyuk" disabled={metin.trim().length < 3 || bekliyor}>
              {bekliyor ? `${arkadas.ad} düşünüyor…` : `${arkadas.ad}'a sor`}
            </button>
            <p className="alt-yazi" style={{ margin: 0 }}>Kişisel bilgilerini (isim, adres, telefon) yazmamanı öneririz.</p>
          </form>
        )}

        {sonuc && (
          <div className="geri-bildirim pat" style={{ margin: 0, background: sonuc.tuzak ? '#FFE1D6' : '#C9EFC9' }} role="status">
            <div className="beyaz-kutu" style={{ fontWeight: 700 }}>“{metin.trim()}”</div>
            <div className="baslik-orta">
              {sonuc.tuzak === true ? `Bir tuzak olabilir: ${sonuc.tuzakAdi || 'düşünce tuzağı'}` : sonuc.tuzak === false ? 'Bu oldukça gerçekçi bir düşünce' : 'Birlikte düşünelim'}
            </div>
            <div className="govde">{sonuc.aciklama}</div>
            {sonuc.gercekci && <div className="beyaz-kutu">Daha dengeli hâli: “{sonuc.gercekci}”</div>}
            <button className="dugme beyaz" onClick={yeniden}>Başka bir düşünce yaz</button>
          </div>
        )}
      </div>

      <div style={{ flexGrow: 1, minHeight: 24 }} />
      {kriz && <KrizPenceresi kapat={() => setKriz(false)} />}
    </main>
  );
}
