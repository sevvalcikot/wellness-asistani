// Hangi adreste hangi ekranın gösterileceği burada belirlenir.
import { useEffect } from 'react';
import { git, useYol } from './router.js';
import { useOyun } from './state/GameContext.jsx';
import BreathGame from './screens/BreathGame.jsx';
import GamesScreen from './screens/GamesScreen.jsx';
import GratitudeGame from './screens/GratitudeGame.jsx';
import JournalScreen from './screens/JournalScreen.jsx';
import MapScreen from './screens/MapScreen.jsx';
import MoodJournalScreen from './screens/MoodJournalScreen.jsx';
import Onboarding from './screens/Onboarding.jsx';
import PlanScreen from './screens/PlanScreen.jsx';
import QuizGame from './screens/QuizGame.jsx';
import RoomScreen from './screens/RoomScreen.jsx';
import ThoughtGame from './screens/ThoughtGame.jsx';
import WinScreen from './screens/WinScreen.jsx';

const EKRANLAR = {
  '/baslangic': Onboarding,
  '/plan': PlanScreen,
  '/defter': JournalScreen,
  '/harita': MapScreen,
  '/oyunlar': GamesScreen,
  '/oda': RoomScreen,
  '/gunluk': MoodJournalScreen,
  '/oyun/dusunce': ThoughtGame,
  '/oyun/nefes': BreathGame,
  '/oyun/bilgi': QuizGame,
  '/oyun/huzur': GratitudeGame,
  '/odul': WinScreen
};

export default function App() {
  const yol = useYol();
  const { durum } = useOyun();

  // Yol arkadaşı seçilmediyse önce başlangıç ekranı; bilinmeyen adresler haritaya gider
  const hedef = !durum.arkadas ? '/baslangic' : EKRANLAR[yol] ? yol : '/harita';
  useEffect(() => {
    if (hedef !== yol) git(hedef);
  }, [hedef, yol]);

  const Ekran = EKRANLAR[hedef];
  return (
    <div className="telefon">
      <Ekran key={hedef} />
    </div>
  );
}
