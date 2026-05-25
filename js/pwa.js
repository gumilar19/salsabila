// ==================== PWA MODULE ====================

window.PWAModule = (function() {
  let deferredPrompt = null;
  let isPWAInstalled = false;
  let notifPermission = localStorage.getItem('notifPermission') === 'granted';
  
  function sendNotification(title, body) {
    if (notifPermission && 'Notification' in window && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, { body: body });
      });
    }
  }
  
  async function requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        notifPermission = true;
        localStorage.setItem('notifPermission', 'granted');
        document.getElementById('notifBanner').classList.add('hidden-banner');
        sendNotification('SALSABILA', '✅ Notifikasi diaktifkan! Pengingat sholat aktif.');
      }
    }
  }
  
  function init() {
    // PWA Install
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      document.getElementById('pwaBanner').classList.remove('hidden-banner');
    });
    
    window.addEventListener('appinstalled', () => {
      isPWAInstalled = true;
      deferredPrompt = null;
      document.getElementById('pwaBanner').classList.add('hidden-banner');
    });
    
    document.getElementById('confirmInstall')?.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') isPWAInstalled = true;
        deferredPrompt = null;
        document.getElementById('pwaBanner').classList.add('hidden-banner');
      }
    });
    
    document.getElementById('dismissPWA')?.addEventListener('click', () => {
      document.getElementById('pwaBanner').classList.add('hidden-banner');
    });
    
    document.getElementById('installPWA')?.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') isPWAInstalled = true;
        deferredPrompt = null;
      } else if (!isPWAInstalled) {
        alert('Klik menu browser (3 titik) → Install App / Install SALSABILA');
      }
    });
    
    // Notification Permission
    document.getElementById('enableNotif')?.addEventListener('click', requestNotificationPermission);
    document.getElementById('dismissNotif')?.addEventListener('click', () => {
      document.getElementById('notifBanner').classList.add('hidden-banner');
    });
    
    if ('Notification' in window && Notification.permission === 'default' && !localStorage.getItem('notifPermission')) {
      setTimeout(() => document.getElementById('notifBanner').classList.remove('hidden-banner'), 3000);
    }
    if ('Notification' in window && Notification.permission === 'granted') {
      notifPermission = true;
    }
    
    // Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker registered'))
        .catch(err => console.log('SW registration failed:', err));
    }
  }
  
  return { init };
})();