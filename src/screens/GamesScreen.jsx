// Oyunlar sekmesi: açılmış oyunları tekrar oynamak için
import { Kilit, RozetSimgesi } from '../components/Icons.jsx';
import { AltMenu } from '../components/Ui.jsx';
import { BOLUMLER } from '../data/levels.js';
import { git } from '../router.js';
import { useOyun } from '../state/GameContext.jsx';
import { bolumDurumu } from './MapScreen.jsx';

const ACIKLAMALAR = {
  nefes: { metin: '4-7-8 nefesiyle balonu uçur, sakinleş.', renk: '#FFD9C2', simge: 'nefes' },
  dusunce: { metin: 'Düşünce tuzaklarını yakala, gerçekçi hâlini öğren.', renk: '#D7F5C8', simge: 'tuzak' },
  bilgi: { metin: 'Kat kat çık, psikoloji hakkında yeni şeyler öğren.', renk: '#E4DCFF', simge: 'bilgi' }
};

export default function GamesScreen() {
  const { durum } = useOyun();
  const oyunlar = BOLUMLER.map((b, i) => ({ b, d: bolumDurumu(durum.tamamlanan, i) })).filter(({ b }) => ACIKLAMALAR[b.id]);

  return (
    <main className="ekran" style={{ background: '#BFE6FF' }}>
      <div className="oda-ustu">
        <div>
          <h1 className="baslik-orta" style={{ fontSize: 24 }}>Oyunlar</h1>
          <div className="alt-yazi">Açtığın oyunları istediğin kadar tekrar oyna</div>
        </div>
      </div>
      <div className="icerik-dolgu" style={{ gap: 12 }}>
        {oyunlar.map(({ b, d }) => {
          const acik = d === 'simdi' || d === 'tamam';
          const a = ACIKLAMALAR[b.id];
          return (
            <button key={b.id} className={'oyun-karti' + (acik ? '' : ' kilitli')} style={{ background: acik ? a.renk : '#EEF1F5' }} onClick={() => acik && git(b.yol)} aria-disabled={!acik}>
              <span className="oyun-simge">{acik ? <RozetSimgesi simge={a.simge} /> : <Kilit />}</span>
              <span className="oyun-yazi">
                <b>{b.oyun}</b>
                <small>{acik ? a.metin : `${b.ad} haritada açılınca oynanabilir.`}</small>
              </span>
              {acik && <span className="oyun-git">{d === 'tamam' ? 'Tekrar' : 'Oyna'}</span>}
            </button>
          );
        })}
      </div>
      <div style={{ flexGrow: 1 }} />
      <AltMenu aktif="oyunlar" />
    </main>
  );
}
