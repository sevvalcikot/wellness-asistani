// Oyun: Düşünce Avcısı
// Kullanıcı kartlardaki düşüncenin bir tuzak mı, yoksa gerçekçi mi olduğunu seçer.
import { useMemo, useState } from 'react';
import Companion from '../components/Companion.jsx';
import { Kalkan, Tuzak } from '../components/Icons.jsx';
import { OyunUstu } from '../components/Ui.jsx';
import { DUSUNCE_KARTLARI } from '../data/thoughts.js';
import { git } from '../router.js';
import { dusunceGeriBildirimi } from '../services/rehber.js';
import { useOyun } from '../state/GameContext.jsx';
import { karistir } from '../state/rules.js';

const DOGRU_XP = 20;
const YANLIS_XP = 5; // yanlış cevapta da küçük bir ödül: ceza yok
const BOLUM_JETONU = 25;

// Her oyunda 2 tuzak + 1 gerçekçi kart
function kartlariSec() {
  const tuzaklar = karistir(DUSUNCE_KARTLARI.filter((k) => k.tuzak)).slice(0, 2);
  const gercekci = karistir(DUSUNCE_KARTLARI.filter((k) => !k.tuzak)).slice(0, 1);
  return karistir([...tuzaklar, ...gercekci]);
}

export default function ThoughtGame() {
  const { durum, bolumBitir } = useOyun();
  const kartlar = useMemo(kartlariSec, []);
  const [sira, setSira] = useState(0);
  const [geri, setGeri] = useState(null); // geri bildirim
  const [sonuclar, setSonuclar] = useState([]); // her kart için { kart, dogruMu }

  const kart = kartlar[sira];
  const xp = sonuclar.reduce((t, s) => t + (s.dogruMu ? DOGRU_XP : YANLIS_XP), 0);
  const sonKart = sira === kartlar.length - 1;

  const cevapla = async (tuzakDedi) => {
    if (geri) return;
    const g = await dusunceGeriBildirimi(kart, tuzakDedi);
    setGeri(g);
    setSonuclar((s) => [...s, { kart, dogruMu: g.dogruMu }]);
  };

  const sonraki = () => {
    setGeri(null);
    setSira((s) => s + 1);
  };

  const bitir = () => {
    const yakalanan = sonuclar.filter((s) => s.kart.tuzak && s.dogruMu).length;
    const tuzakSayisi = kartlar.filter((k) => k.tuzak).length;
    bolumBitir({
      bolumId: 'dusunce',
      baslik: 'Düşünce Ormanı tamamlandı!',
      mesaj: `${tuzakSayisi} tuzaktan ${yakalanan} tanesini yakaladın.`,
      xp,
      jeton: BOLUM_JETONU,
      rozet: yakalanan >= 2 ? 'tuzak-avcisi' : null,
      gorev: { tuzak: yakalanan },
      ogrenilenler: kartlar.filter((k) => k.tuzak).map((k) => ({ ad: k.tuzakAdi, aciklama: k.aciklama }))
    });
    git('/odul');
  };

  return (
    <main className="ekran" style={{ background: '#A6E58A' }}>
      <svg className="arka-plan alt" width="390" height="160" viewBox="0 0 390 160" aria-hidden="true">
        <g className="salin"><rect x="26" y="96" width="10" height="40" fill="#9A6B3F" /><circle cx="31" cy="84" r="30" fill="#3E9E35" /></g>
        <g className="salin"><rect x="350" y="80" width="10" height="50" fill="#9A6B3F" /><circle cx="355" cy="66" r="34" fill="#3E9E35" /></g>
        <rect x="0" y="130" width="390" height="30" fill="#5DBB4A" />
        <rect x="90" y="112" width="8" height="18" fill="#FFF6D6" stroke="#2B2420" strokeWidth="2" />
        <path d="M80 114 a14 10 0 0 1 28 0 z" fill="#FF5A5A" stroke="#2B2420" strokeWidth="2" />
        <circle cx="150" cy="124" r="6" fill="#FF9FD2" stroke="#2B2420" strokeWidth="2" />
        <circle cx="230" cy="122" r="6" fill="#FFE45E" stroke="#2B2420" strokeWidth="2" />
      </svg>

      <OyunUstu
        baslik="Düşünce Avcısı"
        altBaslik={
          <div className="ilerleme-noktalari" aria-label={`Kart ${sira + 1} / ${kartlar.length}`}>
            {kartlar.map((_, k) => (
              <span key={k} style={{ background: k < sonuclar.length ? '#2E8A45' : k === sira ? '#FFC233' : '#FFFFFF' }} />
            ))}
          </div>
        }
      >
        <div className="hap turuncu pat" key={xp}>+{xp} XP</div>
      </OyunUstu>

      <div className="konusan">
        <Companion id={durum.arkadas} genislik={66} className="zipla-yavas" />
        <div className="balon">Bu düşünce bir <b style={{ color: '#D9472B' }}>tuzak</b> mı, yoksa <b style={{ color: '#2E8A45' }}>gerçekçi</b> mi?</div>
      </div>

      <div style={{ padding: '22px 26px 0', position: 'relative' }}>
        <div className="dusunce-karti dagit" key={kart.id}>
          <div className="etiket sari kucuk">DÜŞÜNCE KARTI {sira + 1} / {kartlar.length}</div>
          <div className="dusunce-metni">“{kart.metin}”</div>
        </div>
      </div>

      {!geri && (
        <div className="ikili-dugmeler">
          <button className="dugme-iri kirmizi" onClick={() => cevapla(true)}><Tuzak boyut={30} renk="#FFFFFF" /><span>Tuzak!</span></button>
          <button className="dugme-iri yesil" onClick={() => cevapla(false)}><Kalkan /><span>Gerçekçi</span></button>
        </div>
      )}

      {geri && (
        <div className="geri-bildirim pat" style={{ background: geri.dogruMu ? '#C9EFC9' : '#FFE1D6' }} role="status">
          <div className="baslik-orta">{geri.baslik} +{geri.dogruMu ? DOGRU_XP : YANLIS_XP} XP</div>
          <div className="govde">{geri.aciklama}</div>
          {geri.gercekci && <div className="beyaz-kutu">Daha gerçekçi hâli: “{geri.gercekci}”</div>}
          {sonKart
            ? <button className="dugme birincil" onClick={bitir}>Bölümü bitir</button>
            : <button className="dugme beyaz" onClick={sonraki}>Sonraki kart</button>}
        </div>
      )}
    </main>
  );
}
