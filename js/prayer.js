// ==================== PRAYER MODULE (JADWAL SHOLAT) ====================
// Menggunakan API MyQuran v3 - Sumber resmi Kementerian Agama RI

window.PrayerModule = (function() {
  // ==================== STATE VARIABLES ====================
  let allCities = [];              // Daftar semua kota/kabupaten
  let currentCityId = null;       // ID kota yang sedang dipilih
  let prayerTimesData = {};        // Data jadwal sholat
  let iqamahActive = false;        // Status iqamah (sedang berlangsung atau tidak)
  let iqamahEndTime = null;        // Waktu berakhirnya iqamah
  let adzanEnabled = localStorage.getItem('adzanEnabled') === 'true';  // Status adzan ON/OFF
  let playedAdzanPrayers = {};     // Mencegah adzan berulang untuk sholat yang sama
  let sentNotificationPrayers = {}; // Mencegah notifikasi berulang
  let notifPermission = localStorage.getItem('notifPermission') === 'granted';
  
  // Mapping nama sholat untuk display
  const prayerNameMap = {
    'imsak': 'Imsak',
    'subuh': 'Subuh',
    'terbit': 'Terbit',
    'dhuha': 'Dhuha',
    'dzuhur': 'Dzuhur',
    'ashar': 'Ashar',
    'maghrib': 'Maghrib',
    'isya': 'Isya'
  };
  
  // Urutan sholat untuk menentukan next prayer (hanya yang fardhu)
  const fardhuOrder = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
  
  // Semua waktu sholat untuk ditampilkan (termasuk imsak, terbit, dhuha)
  const allPrayerTimes = [
    { name: 'Imsak', key: 'imsak', isFardhu: false },
    { name: 'Subuh', key: 'subuh', isFardhu: true },
    { name: 'Terbit', key: 'terbit', isFardhu: false },
    { name: 'Dhuha', key: 'dhuha', isFardhu: false },
    { name: 'Dzuhur', key: 'dzuhur', isFardhu: true },
    { name: 'Ashar', key: 'ashar', isFardhu: true },
    { name: 'Maghrib', key: 'maghrib', isFardhu: true },
    { name: 'Isya', key: 'isya', isFardhu: true }
  ];
  
  // ==================== HELPER FUNCTIONS ====================
  
  // Kirim notifikasi ke pengguna
  function sendNotification(title, body) {
    if (notifPermission && 'Notification' in window && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, { body: body, icon: '/favicon.ico', vibrate: [200, 100, 200] });
      });
    }
  }
  
  // Format waktu dari string ke Date object
  function timeStringToDate(timeStr) {
    if (!timeStr) return null;
    const now = new Date();
    const [hours, minutes] = timeStr.split(":").map(Number);
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
  }
  
  // Format countdown dari milliseconds ke HH:MM:SS
  function formatCountdown(ms) {
    if (ms <= 0) return "00:00:00";
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
  }
  
  // Cek apakah hari ini Jumat
  function isFridayToday() { 
    return new Date().getDay() === 5; 
  }
  
  // ==================== UI RENDERING ====================
  
  // Render grid jadwal sholat (SEMUA 8 WAKTU: Imsak, Subuh, Terbit, Dhuha, Dzuhur, Ashar, Maghrib, Isya)
  function renderPrayerScheduleGrid(jadwal) {
    const grid = document.getElementById('prayerGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    let delay = 0.05;
    
    for (let item of allPrayerTimes) {
      const timeValue = jadwal[item.key];
      if (timeValue) { // Hanya tampilkan jika data tersedia
        const card = document.createElement('div');
        card.className = 'prayer-box';
        card.setAttribute('data-prayer', item.key);
        card.setAttribute('data-is-fardhu', item.isFardhu);
        card.style.animation = `skewIn 0.5s ease-out ${delay}s both`;
        card.innerHTML = `
          <div class="name">${item.name}</div>
          <div class="time">${timeValue}</div>
          <div class="countdown">⌛ --:--:--</div>
        `;
        grid.appendChild(card);
        delay += 0.05;
      }
    }
  }
  
  // Render dropdown pilihan kota
  function renderCityOptions(cities) {
    const select = document.getElementById('citySelect');
    if (!select) return;
    
    select.innerHTML = '';
    if (!cities.length) { 
      select.innerHTML = '<option>Tidak ada kota ditemukan</option>'; 
      return; 
    }
    
    cities.sort((a, b) => a.lokasi.localeCompare(b.lokasi));
    
    for (let city of cities) {
      const option = document.createElement('option');
      option.value = city.id;
      option.textContent = city.lokasi;
      if (currentCityId && city.id == currentCityId) {
        option.selected = true;
      }
      select.appendChild(option);
    }
  }
  
  // ==================== API CALLS ====================
  
  // Load daftar semua kota dari API MyQuran v3
  async function loadCities() {
    try {
      const response = await fetch('https://api.myquran.com/v3/sholat/kabkota/semua');
      const result = await response.json();
      
      if (result.status && result.data) {
        allCities = result.data;
        renderCityOptions(allCities);
        
        // Load kota terakhir yang dipilih atau default Bandung
        const lastCityId = localStorage.getItem('lastCityId');
        if (lastCityId && allCities.some(c => c.id == lastCityId)) {
          selectCityById(lastCityId);
        } else {
          const defaultCity = allCities.find(c => c.lokasi.includes('BANDUNG')) || allCities[0];
          if (defaultCity) selectCityById(defaultCity.id);
        }
      } else {
        throw new Error('Gagal memuat data kota');
      }
    } catch(e) { 
      console.error('Error loading cities:', e);
      const select = document.getElementById('citySelect');
      if (select) select.innerHTML = '<option>Gagal memuat data kota. Refresh halaman.</option>';
    }
  }
  
  // Fetch jadwal sholat untuk kota tertentu
  async function fetchSchedule(cityId) {
    if (!cityId) return;
    
    currentCityId = cityId;
    localStorage.setItem('lastCityId', cityId);
    
    const grid = document.getElementById('prayerGrid');
    if (grid) {
      grid.innerHTML = '<div class="loading" style="grid-column:1/-1">🕋 Mengambil jadwal sholat ...</div>';
    }
    
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const period = `${year}-${month}-${day}`;
    const url = `https://api.myquran.com/v3/sholat/jadwal/${cityId}/${period}`;
    
    try {
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.status && result.data && result.data.jadwal && result.data.jadwal[period]) {
        const jadwal = result.data.jadwal[period];
        
        // Update info panel
        const locationDisplay = document.getElementById('locationDisplay');
        const dateDisplay = document.getElementById('dateDisplay');
        if (locationDisplay) {
          locationDisplay.innerHTML = `${result.data.kabko || "Kota terpilih"}${result.data.prov ? `, ${result.data.prov}` : ''}`;
        }
        if (dateDisplay) {
          dateDisplay.innerHTML = jadwal.tanggal || `${year}-${month}-${day}`;
        }
        
        prayerTimesData = jadwal;
        renderPrayerScheduleGrid(jadwal);
        updateAllCountdowns();
      } else {
        throw new Error('Data jadwal tidak valid');
      }
    } catch(e) {
      console.error('Error fetching schedule:', e);
      if (grid) {
        grid.innerHTML = '<div class="loading" style="grid-column:1/-1">⚠️ Gagal memuat jadwal. Silakan coba lagi.</div>';
      }
    }
  }
  
  // Pilih kota berdasarkan ID
  function selectCityById(cityId) {
    const select = document.getElementById('citySelect');
    if (!select) return;
    
    const option = Array.from(select.options).find(opt => opt.value == cityId);
    if (option) {
      option.selected = true;
      fetchSchedule(cityId);
    } else if (allCities.length) {
      fetchSchedule(allCities[0].id);
    }
  }
  
  // ==================== GEOLOCATION & DETEKSI KOTA TERDEKAT ====================
  
  // Koordinat kota-kota besar untuk deteksi jarak
  const cityCoordinates = {
    "JAKARTA": { lat: -6.2088, lon: 106.8456 },
    "BANDUNG": { lat: -6.9175, lon: 107.6191 },
    "SURABAYA": { lat: -7.2575, lon: 112.7521 },
    "SEMARANG": { lat: -6.9667, lon: 110.4167 },
    "MEDAN": { lat: 3.5952, lon: 98.6722 },
    "MAKASSAR": { lat: -5.1472, lon: 119.4327 },
    "YOGYAKARTA": { lat: -7.7956, lon: 110.3695 },
    "MALANG": { lat: -7.9797, lon: 112.6304 },
    "DENPASAR": { lat: -8.6705, lon: 115.2126 },
    "PALEMBANG": { lat: -2.9761, lon: 104.7754 },
    "BATAM": { lat: 1.1301, lon: 104.0531 },
    "PEKANBARU": { lat: 0.5071, lon: 101.4478 },
    "BOGOR": { lat: -6.5971, lon: 106.8060 },
    "BALIKPAPAN": { lat: -1.2379, lon: 116.8529 },
    "MANADO": { lat: 1.4748, lon: 124.8421 },
    "PONTIANAK": { lat: -0.0263, lon: 109.3425 },
    "BANJARMASIN": { lat: -3.3244, lon: 114.5910 },
    "PADANG": { lat: -0.9471, lon: 100.4172 },
    "CIREBON": { lat: -6.7064, lon: 108.5570 },
    "TANGERANG": { lat: -6.1783, lon: 106.6319 },
    "BEKASI": { lat: -6.2383, lon: 106.9756 },
    "DEPOK": { lat: -6.4025, lon: 106.7942 },
    "SOLO": { lat: -7.5507, lon: 110.8197 },
    "SAMARINDA": { lat: -0.5022, lon: 117.1536 },
    "KUPANG": { lat: -10.1772, lon: 123.6070 },
    "PALANGKA RAYA": { lat: -2.2070, lon: 113.9195 },
    "GORONTALO": { lat: 0.5435, lon: 123.0568 },
    "KENDARI": { lat: -3.9985, lon: 122.5126 },
    "PALU": { lat: -0.8972, lon: 119.8597 },
    "AMBON": { lat: -3.6554, lon: 128.1908 },
    "TERNATE": { lat: 0.7905, lon: 127.3817 },
    "JAYAPURA": { lat: -2.5337, lon: 140.7181 },
    "SORONG": { lat: -0.8815, lon: 131.2560 },
    "MANOKWARI": { lat: -0.8667, lon: 134.0667 },
    "MERAUKE": { lat: -8.4933, lon: 140.4018 },
    "TASIKMALAYA": { lat: -7.333333, lon: 108.233333 },
    "CIAMIS": { lat: -7.333333, lon: 108.366667 },
    "GARUT": { lat: -7.233333, lon: 107.9 },
    "KUNINGAN": { lat: -6.983333, lon: 108.483333 },
    "SUKABUMI": { lat: -6.933333, lon: 106.933333 },
    "SUMEDANG": { lat: -6.866667, lon: 107.933333 },
    "MAJALENGKA": { lat: -6.85, lon: 108.233333 },
    "CIANJUR": { lat: -6.816667, lon: 107.15 },
    "SUBANG": { lat: -6.566667, lon: 107.783333 },
    "PURWAKARTA": { lat: -6.55, lon: 107.45 },
    "INDRAMAYU": { lat: -6.333333, lon: 108.333333 },
    "KARAWANG": { lat: -6.3, lon: 107.316667 },
    "WONOGIRI": { lat: -7.833333, lon: 110.933333 },
    "CILACAP": { lat: -7.733333, lon: 109.016667 },
    "PURWOREJO": { lat: -7.716667, lon: 110.016667 },
    "KLATEN": { lat: -7.716667, lon: 110.616667 },
    "KEBUMEN": { lat: -7.683333, lon: 109.666667 },
    "SUKOHARJO": { lat: -7.7, lon: 110.85 },
    "KARANGANYAR": { lat: -7.6, lon: 110.95 },
    "BOYOLALI": { lat: -7.533333, lon: 110.6 },
    "BANYUMAS": { lat: -7.516667, lon: 109.3 },
    "MAGELANG": { lat: -7.5, lon: 110.233333 },
    "PURWOKERTO": { lat: -7.433333, lon: 109.233333 },
    "SRAGEN": { lat: -7.433333, lon: 111.033333 },
    "BANJARNEGARA": { lat: -7.4, lon: 109.7 },
    "PURBALINGGA": { lat: -7.4, lon: 109.366667 },
    "WONOSOBO": { lat: -7.366667, lon: 109.916667 },
    "SALATIGA": { lat: -7.333333, lon: 110.516667 },
    "TEMANGGUNG": { lat: -7.316667, lon: 110.183333 },
    "UNGARAN": { lat: -7.133333, lon: 110.416667 },
    "PURWODADI": { lat: -7.083333, lon: 110.916667 },
    "BLORA": { lat: -6.983333, lon: 111.433333 },
    "KENDAL": { lat: -6.933333, lon: 110.2 },
    "BATANG": { lat: -6.916667, lon: 109.733333 },
    "PEMALANG": { lat: -6.9, lon: 109.383333 },
    "DEMAK": { lat: -6.9, lon: 110.65 },
    "TEGAL": { lat: -6.883333, lon: 109.133333 },
    "BREBES": { lat: -6.866667, lon: 109.05 },
    "KUDUS": { lat: -6.816667, lon: 110.85 },
    "PATI": { lat: -6.766667, lon: 111.05 },
    "REMBANG": { lat: -6.716667, lon: 111.35 },
    "JEPARA": { lat: -6.6, lon: 110.683333 },
    "BANYUWANGI": { lat: -8.216667, lon: 114.383333 },
    "JEMBER": { lat: -8.183333, lon: 113.7 },
    "LUMAJANG": { lat: -8.133333, lon: 113.233333 },
    "BLITAR": { lat: -8.116667, lon: 112.166667 },
    "TULUNGAGUNG": { lat: -8.083333, lon: 111.916667 },
    "TRENGGALEK": { lat: -8.066667, lon: 111.716667 },
    "BONDOWOSO": { lat: -7.916667, lon: 113.833333 },
    "PONOROGO": { lat: -7.866667, lon: 111.483333 },
    "KEDIRI": { lat: -7.833333, lon: 112.033333 },
    "PROBOLINGGO": { lat: -7.766667, lon: 113.216667 },
    "SITUBONDO": { lat: -7.716667, lon: 114.016667 },
    "MAGETAN": { lat: -7.666667, lon: 111.333333 },
    "PASURUAN": { lat: -7.666667, lon: 112.9 },
    "MADIUN": { lat: -7.65, lon: 111.533333 },
    "NGANJUK": { lat: -7.616667, lon: 111.9 },
    "JOMBANG": { lat: -7.55, lon: 112.233333 },
    "MOJOKERTO": { lat: -7.483333, lon: 112.45 },
    "SIDOARJO": { lat: -7.466667, lon: 112.733333 },
    "NGAWI": { lat: -7.416667, lon: 111.45 },
    "GRESIK": { lat: -7.166667, lon: 112.666667 },
    "BOJONEGORO": { lat: -7.166667, lon: 111.9 },
    "LAMONGAN": { lat: -7.133333, lon: 112.416667 },
    "TUBAN": { lat: -6.9, lon: 112.066667 },
    "LHOKSEUMAWE": { lat: 5.183333, lon: 97.15 },
    "LANGSA": { lat: 4.483333, lon: 97.966667 },
    "BINJAI": { lat: 3.616667, lon: 98.5 },
    "PEMATANGSIANTAR": { lat: 2.966667, lon: 99.066667 },
    "TANJUNG BALAI": { lat: 2.966667, lon: 99.816667 },
    "TEBING TINGGI": { lat: 3.333333, lon: 99.166667 },
    "PADANG PANJANG": { lat: -0.466667, lon: 100.4 },
    "BUKIT TINGGI": { lat: -0.316667, lon: 100.383333 },
    "PAYAKUMBUH": { lat: -0.233333, lon: 100.633333 },
    "SAWAHLUNTO": { lat: -0.683333, lon: 100.783333 },
    "SOLOK": { lat: -0.8, lon: 100.666667 },
    "PARIAMAN": { lat: -0.633333, lon: 100.133333 },
    "PANGKALPINANG": { lat: -2.133333, lon: 106.116667 },
    "LUBUKLINGGAU": { lat: -3.3, lon: 102.866667 },
    "PRABUMULIH": { lat: -3.45, lon: 104.25 },
    "BATURAJA": { lat: -4.133333, lon: 104.183333 },
    "MARTAPURA": { lat: -4.333333, lon: 104.35 },
    "DUMAI": { lat: 1.683333, lon: 101.45 },
    "BENGKALIS": { lat: 1.483333, lon: 102.1 },
    "TANJUNG PINANG": { lat: 0.933333, lon: 104.45 },
    "METRO": { lat: -5.116667, lon: 105.316667 },
    "KOTABUMI": { lat: -4.833333, lon: 104.883333 },
    "PANDEGLANG": { lat: -6.333333, lon: 106.116667 },
    "RANGKASBITUNG": { lat: -6.366667, lon: 106.283333 },
    "SERANG": { lat: -6.133333, lon: 106.166667 },
    "CILEGON": { lat: -6.016667, lon: 106.05 },
    "SINGKAWANG": { lat: 0.916667, lon: 108.999999 },
    "KETAPANG": { lat: -1.866667, lon: 109.983333 },
    "SINTANG": { lat: 0.083333, lon: 111.5 },
    "SAMPIT": { lat: -2.55, lon: 112.966667 },
    "PANGKALANBUN": { lat: -2.7, lon: 111.633333 },
    "TARAKAN": { lat: 3.3, lon: 117.6 },
    "BITUNG": { lat: 1.45, lon: 125.2 },
    "KOTAMOBAGU": { lat: 0.733333, lon: 124.3 },
    "PARE-PARE": { lat: -4.016667, lon: 119.633333 },
    "PALOPO": { lat: -3.0, lon: 120.2 },
    "BAUBAU": { lat: -5.466667, lon: 122.616667 },
    "BIMA": { lat: -8.466667, lon: 118.733333 },
    "SUMBAWA BESAR": { lat: -8.5, lon: 117.433333 },
    "ENDE": { lat: -8.85, lon: 121.65 },
    "MAUMERE": { lat: -8.633333, lon: 122.233333 },
    "TUAL": { lat: -5.633333, lon: 132.783333 },
    "MASOHI": { lat: -3.233333, lon: 128.966667 },
    "WAMENA": { lat: -4.016667, lon: 138.9 },
    "BIAK": { lat: -1.2, lon: 136.083333 }
  };
  
  // Dapatkan koordinat dari nama kota
  function getCityCoordinates(cityName) {
    if (!cityName) return null;
    const upperName = cityName.toUpperCase();
    for (let [key, coord] of Object.entries(cityCoordinates)) {
      if (upperName.includes(key) || key.includes(upperName)) {
        return coord;
      }
    }
    return null;
  }
  
  // Hitung jarak antara dua koordinat (Haversine formula)
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  
  // Cari kota terdekat dari koordinat pengguna
  function findNearestCity(userLat, userLon) {
    let nearest = null;
    let minDistance = Infinity;
    
    for (let city of allCities) {
      const coords = getCityCoordinates(city.lokasi);
      if (coords) {
        const dist = getDistanceFromLatLonInKm(userLat, userLon, coords.lat, coords.lon);
        if (dist < minDistance) {
          minDistance = dist;
          nearest = city;
        }
      }
    }
    
    return { city: nearest, distance: minDistance };
  }
  
  // Deteksi lokasi pengguna dan cari kota terdekat
  async function detectNearestCity() {
    if (!allCities.length) {
      const geoMsg = document.getElementById('geoMessage');
      if (geoMsg) geoMsg.innerText = "⏳ Tunggu data kota dimuat...";
      return;
    }
    
    const geoMsg = document.getElementById('geoMessage');
    const nearbyInfo = document.getElementById('nearbyInfo');
    
    if (geoMsg) geoMsg.innerHTML = "📍 Mengakses GPS...";
    if (nearbyInfo) nearbyInfo.style.display = "none";
    
    if (!navigator.geolocation) {
      if (geoMsg) geoMsg.innerText = "⚠️ Browser tidak support GPS";
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        
        // Coba cari kota dari reverse geocoding terlebih dahulu
        try {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLat}&lon=${userLon}&accept-language=id`);
          const geoData = await geoRes.json();
          const cityName = geoData.address?.city || geoData.address?.town || geoData.address?.village || "";
          
          if (cityName) {
            const foundCity = allCities.find(c => 
              c.lokasi.toLowerCase().includes(cityName.toLowerCase()) || 
              cityName.toLowerCase().includes(c.lokasi.toLowerCase())
            );
            if (foundCity) {
              if (nearbyInfo) {
                nearbyInfo.style.display = "inline-block";
                nearbyInfo.innerHTML = `📍 Terdeteksi: ${foundCity.lokasi}`;
              }
              selectCityById(foundCity.id);
              if (geoMsg) geoMsg.innerHTML = `✅ ${foundCity.lokasi}`;
              return;
            }
          }
        } catch(e) {}
        
        // Fallback: cari kota terdekat berdasarkan koordinat
        const nearestResult = findNearestCity(userLat, userLon);
        if (nearestResult && nearestResult.city) {
          const distText = nearestResult.distance < 1 ? "< 1 km" : `${Math.round(nearestResult.distance)} km`;
          if (nearbyInfo) {
            nearbyInfo.style.display = "inline-block";
            nearbyInfo.innerHTML = `📍 Terdekat: ${nearestResult.city.lokasi} (${distText})`;
          }
          selectCityById(nearestResult.city.id);
          if (geoMsg) geoMsg.innerHTML = `✅ ${nearestResult.city.lokasi}`;
        } else {
          if (geoMsg) geoMsg.innerText = "⚠️ Tidak dapat menentukan kota, pilih manual";
        }
      },
      (error) => {
        let errMsg = "Gagal akses lokasi.";
        if (error.code === 1) errMsg = "Izin lokasi ditolak. Pilih kota manual.";
        if (geoMsg) geoMsg.innerText = `⚠️ ${errMsg}`;
      }
    );
  }
  
  // ==================== COUNTDOWN & NOTIFICATION ====================
  
  // Update semua countdown dan cek next prayer (hanya untuk sholat fardhu)
  function updateAllCountdowns() {
    const now = new Date();
    let minDiff = Infinity;
    let nextPrayer = null;
    let nextTimeDate = null;
    
    // Cari sholat fardhu berikutnya (Subuh, Dzuhur, Ashar, Maghrib, Isya)
    for (let key of fardhuOrder) {
      if (prayerTimesData[key]) {
        const pDate = timeStringToDate(prayerTimesData[key]);
        if (pDate) {
          const diff = pDate - now;
          if (diff > 0 && diff < minDiff) {
            minDiff = diff;
            nextPrayer = key;
            nextTimeDate = pDate;
          }
        }
      }
    }
    
    // Update hero section dengan next prayer (hanya fardhu)
    if (nextPrayer && nextTimeDate) {
      let displayName = prayerNameMap[nextPrayer];
      if (nextPrayer === 'dzuhur' && isFridayToday()) {
        displayName = 'Jum\'atan';
      }
      const remainingMs = nextTimeDate - now;
      const remainingSec = Math.floor(remainingMs / 1000);
      
      const nextPrayerHero = document.getElementById("nextPrayerHero");
      const nextPrayerNameHero = document.getElementById("nextPrayerNameHero");
      const nextPrayerCountdownHero = document.getElementById("nextPrayerCountdownHero");
      const statusBadge = document.getElementById("statusBadge");
      
      if (nextPrayerHero) nextPrayerHero.innerText = displayName;
      if (nextPrayerNameHero) nextPrayerNameHero.innerText = displayName;
      if (nextPrayerCountdownHero) nextPrayerCountdownHero.innerText = formatCountdown(remainingMs);
      if (statusBadge) {
        if (remainingSec > 3600) statusBadge.className = 'status-badge green';
        else if (remainingSec > 180) statusBadge.className = 'status-badge yellow';
        else statusBadge.className = 'status-badge red';
        statusBadge.innerHTML = `<i class="fas fa-hourglass-start"></i> Menuju ${displayName}`;
      }
      
      // Notifikasi 10 menit sebelum sholat
      const remainingMinutes = Math.floor(remainingMs / 60000);
      if (remainingMinutes === 10 && !sentNotificationPrayers[nextPrayer]) {
        sentNotificationPrayers[nextPrayer] = true;
        sendNotification('🕌 Pengingat Sholat', `⏰ ${displayName} akan masuk dalam 10 menit. Segera persiapkan diri!`);
        setTimeout(() => delete sentNotificationPrayers[nextPrayer], 600000);
      }
    } else {
      // Jika tidak ada sholat hari ini, cek Subuh besok
      const tomorrowSubuh = findTomorrowSubuh();
      if (tomorrowSubuh) {
        const remainingSec = Math.floor((tomorrowSubuh - now) / 1000);
        const statusBadge = document.getElementById("statusBadge");
        const nextPrayerHero = document.getElementById("nextPrayerHero");
        const nextPrayerNameHero = document.getElementById("nextPrayerNameHero");
        const nextPrayerCountdownHero = document.getElementById("nextPrayerCountdownHero");
        
        if (nextPrayerHero) nextPrayerHero.innerText = "Subuh";
        if (nextPrayerNameHero) nextPrayerNameHero.innerText = "Subuh (Besok)";
        if (nextPrayerCountdownHero) nextPrayerCountdownHero.innerText = formatCountdown(tomorrowSubuh - now);
        if (statusBadge) {
          statusBadge.innerHTML = `<i class="fas fa-hourglass-start"></i> Menuju Subuh (Besok)`;
          if (remainingSec > 3600) statusBadge.className = 'status-badge green';
          else if (remainingSec > 180) statusBadge.className = 'status-badge yellow';
          else statusBadge.className = 'status-badge red';
        }
      }
    }
    
    // Update countdown di SETIAP card sholat (termasuk Imsak, Terbit, Dhuha)
    document.querySelectorAll('.prayer-box').forEach(card => {
      const prayerKey = card.getAttribute('data-prayer');
      if (prayerKey && prayerTimesData[prayerKey]) {
        const prayerTime = timeStringToDate(prayerTimesData[prayerKey]);
        const countdownEl = card.querySelector('.countdown');
        if (countdownEl && prayerTime) {
          const diffMs = prayerTime - now;
          countdownEl.innerText = diffMs > 0 ? `⌛ ${formatCountdown(diffMs)}` : `✅ Selesai`;
        } else if (countdownEl) {
          countdownEl.innerText = `✅ Selesai`;
        }
      }
    });
    
    // Tandai card yang aktif (hanya untuk sholat fardhu yang menjadi next prayer)
    document.querySelectorAll('.prayer-box').forEach(card => card.classList.remove('active'));
    if (nextPrayer) {
      const target = document.querySelector(`.prayer-box[data-prayer="${nextPrayer}"]`);
      if (target) target.classList.add('active');
    }
  }
  
  // Cari jadwal Subuh besok
  function findTomorrowSubuh() {
    if (!prayerTimesData.subuh) return null;
    const now = new Date();
    const [hours, minutes] = prayerTimesData.subuh.split(":").map(Number);
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(hours, minutes, 0, 0);
    return tomorrow;
  }
  
  // ==================== ADZAN & IQAMAH ====================
  
  // Update tampilan tombol Adzan
  function updateAdzanUI() {
    const btn = document.getElementById("adzanToggle");
    if (!btn) return;
    
    if (adzanEnabled) { 
      btn.innerHTML = '<i class="fas fa-volume-up"></i> Adzan ON';
      btn.style.background = "var(--primary-cyan)";
      btn.style.color = "#000";
    } else { 
      btn.innerHTML = '<i class="fas fa-volume-mute"></i> Adzan OFF';
      btn.style.background = "rgba(0,0,0,0.4)";
      btn.style.color = "white";
    }
    localStorage.setItem('adzanEnabled', adzanEnabled);
  }
  
  // Aktifkan mode alert saat adzan
  function startAdzanAlertMode() {
    document.body.classList.add('adzan-alert-mode');
    setTimeout(() => {
      document.body.classList.remove('adzan-alert-mode');
    }, 60000);
  }
  
  // Putar adzan
  function playAdzan(prayer) {
    if (!adzanEnabled || playedAdzanPrayers[prayer]) return;
    
    playedAdzanPrayers[prayer] = true;
    const adzanAudio = document.getElementById('adzanAudio');
    if (adzanAudio) {
      adzanAudio.currentTime = 0;
      adzanAudio.play().catch(e => console.log('Adzan play error:', e));
    }
    startAdzanAlertMode();
    
    // Kirim notifikasi waktu sholat
    const prayerName = prayerNameMap[prayer] || prayer;
    sendNotification('🕌 Waktu Sholat', `📢 Waktu ${prayerName} telah masuk. Segera tunaikan sholat!`);
    
    // Reset setelah 1 menit
    setTimeout(() => { 
      delete playedAdzanPrayers[prayer]; 
    }, 60000);
  }
  
  // Cek trigger iqamah (3 menit setelah waktu sholat)
  function checkIqamahTrigger() {
    const now = new Date();
    
    for (let prayer of fardhuOrder) {
      if (prayerTimesData[prayer]) {
        const prayerTime = timeStringToDate(prayerTimesData[prayer]);
        if (prayerTime) {
          const diff = now - prayerTime;
          if (diff >= 0 && diff < 180000) { // 3 menit setelah waktu sholat
            if (!iqamahActive) {
              iqamahActive = true;
              iqamahEndTime = Date.now() + (180000 - diff);
              
              const iqamahNameEl = document.getElementById("iqamahPrayerName");
              const iqamahZone = document.getElementById("iqamahZone");
              
              if (iqamahNameEl) iqamahNameEl.innerText = `Sholat ${prayerNameMap[prayer]}`;
              if (iqamahZone) iqamahZone.classList.remove("iqamah-hidden");
              playAdzan(prayer);
            }
            return;
          }
        }
      }
    }
    
    // Jika tidak ada iqamah yang aktif, tutup panel
    if (iqamahActive) {
      iqamahActive = false;
      const iqamahZone = document.getElementById("iqamahZone");
      if (iqamahZone) iqamahZone.classList.add("iqamah-hidden");
    }
  }
  
  // Update timer iqamah (dipanggil setiap detik)
  function updateIqamahTimer() {
    if (iqamahActive && iqamahEndTime) {
      const remaining = iqamahEndTime - Date.now();
      const timerEl = document.getElementById("iqamahTimerDisplay");
      
      if (remaining <= 0) {
        iqamahActive = false;
        const iqamahZone = document.getElementById("iqamahZone");
        if (iqamahZone) iqamahZone.classList.add("iqamah-hidden");
      } else if (timerEl) {
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        timerEl.innerHTML = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
      }
    }
  }
  
  // ==================== FILTER PENCARIAN KOTA ====================
  
  // Filter dropdown kota berdasarkan keyword
  function filterCities(keyword) {
    if (!keyword) {
      renderCityOptions(allCities);
    } else {
      const filtered = allCities.filter(c => 
        c.lokasi.toLowerCase().includes(keyword.toLowerCase())
      );
      renderCityOptions(filtered);
    }
  }
  
  // ==================== INITIALIZATION ====================
  
  function init() {
    console.log('PrayerModule initialized');
    
    // Load data kota
    loadCities();
    
    // Set interval untuk countdown dan iqamah (setiap detik)
    setInterval(() => {
      updateAllCountdowns();
      updateIqamahTimer();
      checkIqamahTrigger();
    }, 1000);
    
    // Event listeners
    const detectBtn = document.getElementById('detectLocationBtn');
    if (detectBtn) {
      detectBtn.addEventListener('click', detectNearestCity);
    }
    
    const citySearch = document.getElementById('citySearch');
    if (citySearch) {
      citySearch.addEventListener('input', (e) => {
        filterCities(e.target.value);
      });
    }
    
    const citySelect = document.getElementById('citySelect');
    if (citySelect) {
      citySelect.addEventListener('change', (e) => {
        if (e.target.value) {
          fetchSchedule(e.target.value);
        }
      });
    }
    
    const adzanToggle = document.getElementById('adzanToggle');
    if (adzanToggle) {
      adzanToggle.addEventListener('click', () => {
        adzanEnabled = !adzanEnabled;
        updateAdzanUI();
        
        const adzanAudio = document.getElementById('adzanAudio');
        if (adzanEnabled && adzanAudio) {
          adzanAudio.play().catch(e => console.log);
        } else if (adzanAudio) {
          adzanAudio.pause();
        }
      });
    }
    
    // Set initial UI
    updateAdzanUI();
  }
  
  // ==================== PUBLIC API ====================
  
  return {
    init,
    updateCountdowns: updateAllCountdowns,
    getPrayerTimesData: () => prayerTimesData,
    refreshSchedule: () => { if (currentCityId) fetchSchedule(currentCityId); }
  };
})();