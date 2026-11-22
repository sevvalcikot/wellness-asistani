// Uygulamanın başlangıç noktası
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { OyunSaglayici } from './state/GameContext.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OyunSaglayici>
      <App />
    </OyunSaglayici>
  </StrictMode>
);

// PWA: yalnızca yayınlanmış sürümde (npm run build) servis çalışanını kaydet.
// Bu sayede uygulama telefona yüklenebilir ve internet olmadan da açılabilir.
if (import.meta.env?.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
