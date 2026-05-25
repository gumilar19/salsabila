// ==================== DZIKIR MODULE ====================

window.DzikirModule = (function() {
  let dzikirCount = localStorage.getItem('dzikirCount') ? parseInt(localStorage.getItem('dzikirCount')) : 0;
  let notifPermission = localStorage.getItem('notifPermission') === 'granted';
  
  function vibrateShort() {
    if ('vibrate' in navigator) navigator.vibrate(50);
  }
  
  function vibrateLong() {
    if ('vibrate' in navigator) navigator.vibrate([200, 100, 200, 100, 300]);
  }
  
  function sendNotification(title, body) {
    if (notifPermission && 'Notification' in window && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, { body: body });
      });
    }
  }
  
  function updateCounterDisplay() {
    const counterEl = document.getElementById('counterValue');
    if (counterEl) counterEl.textContent = dzikirCount;
    localStorage.setItem('dzikirCount', dzikirCount);
  }
  
  function createRippleEffect(event) {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = event.clientX + 'px';
    ripple.style.top = event.clientY + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  }
  
  function addDzikir(event) {
    dzikirCount++;
    updateCounterDisplay();
    createRippleEffect(event);
    vibrateShort();
    
    if (dzikirCount === 33 || dzikirCount === 100 || dzikirCount === 333 || dzikirCount === 500 || dzikirCount === 1000) {
      vibrateLong();
      sendNotification('✨ Pencapaian Dzikir ✨', `Mabruk! Anda telah mencapai ${dzikirCount} x dzikir.`);
    }
    
    const counterEl = document.getElementById('counterValue');
    if (counterEl) {
      counterEl.style.transform = 'scale(1.1)';
      setTimeout(() => { counterEl.style.transform = 'scale(1)'; }, 150);
    }
  }
  
  function resetDzikir() {
    dzikirCount = 0;
    updateCounterDisplay();
    const counterEl = document.getElementById('counterValue');
    if (counterEl) {
      counterEl.style.opacity = '0.5';
      setTimeout(() => { counterEl.style.opacity = '1'; }, 200);
    }
  }
  
  function init() {
    updateCounterDisplay();
    document.getElementById('dzikirButton')?.addEventListener('click', addDzikir);
    document.getElementById('resetButton')?.addEventListener('click', resetDzikir);
  }
  
  return { init, addDzikir, resetDzikir };
})();