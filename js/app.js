/* app — entry point: install prompt, service worker, startup, global error guard */
let deferredInstall = null;
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
function installCard() {
  if (isStandalone()) return '';
  if (deferredInstall) return `<div class="card"><button class="btn" data-a="install">📲 ${t('install')}</button></div>`;
  if (isIOS) return `<div class="card"><b>📲 ${t('install')}</b><p class="sub">${t('iosHint')}</p></div>`;
  return '';
}
A.install = async () => { if (!deferredInstall) return; deferredInstall.prompt(); try { await deferredInstall.userChoice; } catch (e) {} deferredInstall = null; render(); };
addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; if (S.tab === 'settings') render(); });
addEventListener('appinstalled', () => { deferredInstall = null; render(); });
addEventListener('error', () => toast('⚠️'));
addEventListener('unhandledrejection', () => toast('⚠️'));
try { render(); if (!storageOk) toast(t('eStore')); }
catch (e) { console.error(e); $('#app').innerHTML = '<div class="empty">⚠️ Error — please reload.</div>'; }
if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(e => console.warn('SW registration failed', e)));
