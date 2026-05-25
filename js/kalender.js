// ==================== KALENDER MODULE (AlAdhan API) ====================

window.KalenderModule = (function() {
  let kalenderDate = new Date();
  let kalenderMethod = 'UAQ';
  let kalenderCache = {};
  
  async function fetchAlAdhanCalendar(year, month, method) {
    const cacheKey = `${year}_${month}_${method}`;
    if (kalenderCache[cacheKey]) return kalenderCache[cacheKey];
    try {
      const url = `https://api.aladhan.com/v1/gToHCalendar/${month}/${year}?calendarMethod=${method}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.code === 200 && data.data) {
        kalenderCache[cacheKey] = data.data;
        return data.data;
      }
      return null;
    } catch(e) { 
      console.error('Calendar fetch error:', e);
      return null; 
    }
  }
  
  async function renderKalender() {
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;
    grid.innerHTML = '<div class="calendar-loading"><i class="fas fa-spinner fa-pulse"></i> Memuat kalender...</div>';
    
    const year = kalenderDate.getFullYear();
    const month = kalenderDate.getMonth() + 1;
    const startDayOfWeek = new Date(year, kalenderDate.getMonth(), 1).getDay();
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const monthYearEl = document.getElementById('monthYearDisplay');
    if (monthYearEl) monthYearEl.innerHTML = `${monthNames[kalenderDate.getMonth()]} ${year}`;
    
    const weekdays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const weekdayContainer = document.getElementById('weekdaysHeader');
    if (weekdayContainer) {
      weekdayContainer.innerHTML = weekdays.map(day => `<div class="weekday-cell">${day}</div>`).join('');
    }
    
    const calendarData = await fetchAlAdhanCalendar(year, month, kalenderMethod);
    if (!calendarData) {
      grid.innerHTML = '<div class="calendar-loading">Gagal memuat data</div>';
      return;
    }
    
    const daysInMonth = new Date(year, kalenderDate.getMonth() + 1, 0).getDate();
    const prevMonthDays = new Date(year, kalenderDate.getMonth(), 0).getDate();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    
    let html = '';
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      html += `<div class="calendar-day other-month"><div class="day-number">${prevMonthDays - i}</div><div class="hijri-date">-</div></div>`;
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const gregorianDate = `${String(day).padStart(2,'0')}-${String(month).padStart(2,'0')}-${year}`;
      const dayData = calendarData.find(d => d.gregorian.date === gregorianDate);
      const isToday = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}` === todayStr;
      let hijriText = dayData ? `${dayData.hijri.day} ${dayData.hijri.month.en}` : '-';
      html += `<div class="calendar-day ${isToday ? 'today' : ''}"><div class="day-number">${day}</div><div class="hijri-date">${hijriText}</div></div>`;
    }
    const totalCells = Math.ceil((startDayOfWeek + daysInMonth) / 7) * 7;
    for (let i = 1; i <= totalCells - (startDayOfWeek + daysInMonth); i++) {
      html += `<div class="calendar-day other-month"><div class="day-number">${i}</div><div class="hijri-date">-</div></div>`;
    }
    grid.innerHTML = html;
  }
  
  async function convertCEtoHijri() {
    const inputDate = document.getElementById('ceToHijri').value;
    if (!inputDate) { showConvertResult('Masukkan tanggal Masehi', true); return; }
    const [year, month, day] = inputDate.split('-');
    const url = `https://api.aladhan.com/v1/gToH/${day}-${month}-${year}?calendarMethod=${kalenderMethod}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.code === 200 && data.data) {
        const hijri = data.data.hijri;
        showConvertResult(`${inputDate} (M) = ${hijri.day} ${hijri.month.en} ${hijri.year} H`, false);
      } else throw new Error();
    } catch(e) { showConvertResult('Gagal konversi', true); }
  }
  
  async function convertHijriToCE() {
    let hijriDate = document.getElementById('hijriToCe').value.trim();
    if (!hijriDate) { showConvertResult('Masukkan tanggal Hijriah (DD-MM-YYYY)', true); return; }
    if (!/^\d{2}-\d{2}-\d{4}$/.test(hijriDate)) { showConvertResult('Format harus DD-MM-YYYY', true); return; }
    const url = `https://api.aladhan.com/v1/hToG/${hijriDate}?calendarMethod=${kalenderMethod}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.code === 200 && data.data) {
        const gregorian = data.data.gregorian;
        showConvertResult(`${hijriDate} (H) = ${gregorian.day} ${gregorian.month.en} ${gregorian.year} M`, false);
      } else throw new Error();
    } catch(e) { showConvertResult('Gagal konversi', true); }
  }
  
  function showConvertResult(msg, isError) {
    const resultDiv = document.getElementById('convertResult');
    if (resultDiv) {
      resultDiv.textContent = msg;
      resultDiv.classList.remove('hidden');
      resultDiv.style.background = isError ? 'rgba(255,0,60,0.2)' : 'rgba(0,242,255,0.2)';
      setTimeout(() => resultDiv.classList.add('hidden'), 4000);
    }
  }
  
  function init() {
    console.log('KalenderModule init called');
    renderKalender();
    
    const calPrev = document.getElementById('calPrev');
    const calNext = document.getElementById('calNext');
    const calToday = document.getElementById('calToday');
    const calMethod = document.getElementById('calMethod');
    const convertBtn = document.getElementById('convertDateBtn');
    
    if (calPrev) calPrev.addEventListener('click', () => {
      kalenderDate.setMonth(kalenderDate.getMonth() - 1);
      renderKalender();
    });
    if (calNext) calNext.addEventListener('click', () => {
      kalenderDate.setMonth(kalenderDate.getMonth() + 1);
      renderKalender();
    });
    if (calToday) calToday.addEventListener('click', () => {
      kalenderDate = new Date();
      renderKalender();
    });
    if (calMethod) calMethod.addEventListener('change', (e) => {
      kalenderMethod = e.target.value;
      kalenderCache = {};
      renderKalender();
    });
    if (convertBtn) convertBtn.addEventListener('click', () => {
      if (document.getElementById('ceToHijri').value) convertCEtoHijri();
      else if (document.getElementById('hijriToCe').value) convertHijriToCE();
      else showConvertResult('Pilih salah satu tanggal', true);
    });
  }
  
  return { init, renderKalender };
})();