// ==================== MAIN ENTRY POINT ====================

document.addEventListener('DOMContentLoaded', function() {
  console.log('SALSABILA Dashboard Loaded');
  
  
    // ==================== INISIALISASI SEMUA MODUL ====================
  if (window.DzikirModule) window.DzikirModule.init();
  if (window.PrayerModule) window.PrayerModule.init();
  if (window.QuranModule) window.QuranModule.init();  // <-- PASTIKAN INI ADA
  if (window.AsmaModule) window.AsmaModule.init();
  if (window.KalenderModule) window.KalenderModule.init();
  if (window.QiblaModule) window.QiblaModule.init();
  if (window.DoaModule) window.DoaModule.init();
  if (window.ThemeModule) window.ThemeModule.init();
  if (window.PWAModule) window.PWAModule.init();
  
  // ==================== NAVIGASI TAB ====================
  const sections = ['jadwalSection', 'quranSection', 'asmaSection', 'kalenderSection', 'dzikirSection', 'qiblaSection','doaSection'];
  
  // Fungsi untuk switch tab
  function switchToTab(sectionId) {
    // Hide all sections
    sections.forEach(s => {
      const el = document.getElementById(s);
      if (el) el.classList.add('hidden');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.remove('hidden');
    
    // Update active class on nav buttons
    document.querySelectorAll('.nav-item[data-section]').forEach(btn => {
      const btnSection = btn.dataset.section + 'Section';
      if (btnSection === sectionId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Refresh specific module when its tab is opened
    if (sectionId === 'kalenderSection' && window.KalenderModule) {
      window.KalenderModule.renderKalender();
    }
    if (sectionId === 'qiblaSection' && window.QiblaModule) {
      window.QiblaModule.updateDirection();
    }
  }
  
  // Attach event listeners to nav buttons
  document.querySelectorAll('.nav-item[data-section]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const section = btn.dataset.section + 'Section';
      switchToTab(section);
    });
  });
  
  // ==================== FOOTER NAVIGATION ====================
  document.querySelectorAll('.footer-column ul li a').forEach(link => {
    link.addEventListener('click', (e) => {
      const section = link.dataset.section;
      if (section) {
        e.preventDefault();
        switchToTab(section + 'Section');
      }
    });
  });
  
  // ==================== PARTICLES ====================
  createParticles();
  
  // ==================== CLOCK ====================
  updateClock();
  
  // ==================== WEATHER & LOCATION ====================
  fetchWeather();
  initLocation();
  
  // ==================== INTERVALS ====================
  setInterval(() => {
    updateClock();
    if (window.PrayerModule && window.PrayerModule.updateCountdowns) {
      window.PrayerModule.updateCountdowns();
    }
  }, 1000);
  
  setInterval(fetchWeather, 600000);
  
  document.getElementById('currentYear').innerText = new Date().getFullYear();
});

// ==================== FUNGSI GLOBAL ====================

function createParticles() {
  const container = document.getElementById('particles');
  if(!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 35; i++) {
    let p = document.createElement('div');
    p.className = 'particle';
    let size = Math.random() * 5 + 2;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}vw`;
    p.style.animationDelay = `${Math.random() * 10}s`;
    p.style.animationDuration = `${Math.random() * 8 + 6}s`;
    container.appendChild(p);
  }
}

function updateClock() {
  const now = new Date();
  const clockEl = document.getElementById("liveClockHero");
  if (clockEl) clockEl.innerHTML = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
  const dateEl = document.getElementById("dateInfo");
  if (dateEl) dateEl.innerHTML = now.toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' });
}

async function fetchWeather() {
  try {
    const lat = window.currentLat || -6.8906;
    const lon = window.currentLon || 107.6135;
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
    const data = await res.json();
    if (data.current_weather) {
      const condition = data.current_weather.weathercode <= 3 ? "Cerah" : "Berawan";
      const descEl = document.getElementById("weatherDesc");
      if (descEl) descEl.innerHTML = condition;
      const tempEl = document.getElementById("weatherTemp");
      if (tempEl) tempEl.innerHTML = `${Math.round(data.current_weather.temperature)}°C`;
    }
  } catch(e) {}
}

function getIndonesiaTimezone(lon) {
  if (lon >= 95 && lon < 108) return "WIB";
  if (lon >= 108 && lon < 120) return "WITA";
  return "WIT";
}

async function initLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      window.currentLat = pos.coords.latitude;
      window.currentLon = pos.coords.longitude;
      window.currentTimezone = getIndonesiaTimezone(window.currentLon);
      try {
        const rev = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${window.currentLat}&lon=${window.currentLon}&accept-language=id`);
        const data = await rev.json();
        window.currentCityOnly = data.address?.city || data.address?.town || "Bandung";
      } catch(e) { window.currentCityOnly = "Bandung"; }
      const locEl = document.getElementById("locationInfo");
      if (locEl) locEl.innerHTML = `${window.currentCityOnly}, ${window.currentTimezone}`;
      if (window.QiblaModule) window.QiblaModule.updateDirection();
    }, () => { 
      const locEl = document.getElementById("locationInfo");
      if (locEl) locEl.innerHTML = `Bandung, WIB`;
    });
  }
}

function timeStringToDate(timeStr) {
  const now = new Date();
  const [hours, minutes] = timeStr.split(":").map(Number);
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
}

function formatCountdown(ms) {
  if (ms <= 0) return "00:00:00";
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

function isFridayToday() { return new Date().getDay() === 5; }

// Export global functions
window.timeStringToDate = timeStringToDate;
window.formatCountdown = formatCountdown;
window.isFridayToday = isFridayToday;
window.getIndonesiaTimezone = getIndonesiaTimezone;