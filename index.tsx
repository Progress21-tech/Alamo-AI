
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
// Service Worker registration disabled temporarily to avoid cross-origin errors in specific preview environments.
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('./sw.js')
//       .then(reg => console.log('Alámò Service Worker registered!', reg.scope))
//       .catch(err => console.error('Service Worker registration failed:', err));
//   });
// }
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
