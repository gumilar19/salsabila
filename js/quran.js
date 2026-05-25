// ==================== QURAN MODULE (EQURAN.ID API) ====================

window.QuranModule = (function() {
  // ==================== CONFIG ====================
  const API_BASE = "https://equran.id/api/v2";
  
  // ==================== DOM ELEMENTS ====================
  let surahSelect, qariSelect, surahInfoContainer, ayatContainer;
  let audioContainer, surahAudioPlayer, surahAudioSource, ayatAudioPlayer;
  let resumeCard, resumeInfo, resumeBtn;
  let arabSlider, translationSlider, tafsirSlider;
  let prevBtn, nextBtn, refreshBtn;
  
  // ==================== STATE ====================
  let currentSurahId = 1;
  let currentAyats = [];
  let surahList = [];
  let tafsirData = {};
  let currentQari = '01';
  
  // ==================== HELPER FUNCTIONS ====================
  function showMessage(message, isError = false) {
    const msg = document.createElement("div");
    msg.style.position = "fixed";
    msg.style.top = "20px";
    msg.style.right = "20px";
    msg.style.zIndex = "9999";
    msg.style.background = isError ? "#dc2626" : "var(--primary-cyan, #00f2ff)";
    msg.style.color = "#000";
    msg.style.padding = "12px 18px";
    msg.style.borderRadius = "12px";
    msg.style.fontWeight = "600";
    msg.innerText = message;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2500);
  }
  
  // ==================== FONT SETTINGS ====================
  function loadFontSettings() {
    const arab = localStorage.getItem("quranArabSize") || 2;
    const translation = localStorage.getItem("quranTranslationSize") || 1;
    const tafsir = localStorage.getItem("quranTafsirSize") || 0.9;
    
    document.documentElement.style.setProperty("--arab-size", `${arab}rem`);
    document.documentElement.style.setProperty("--translation-size", `${translation}rem`);
    document.documentElement.style.setProperty("--tafsir-size", `${tafsir}rem`);
    
    if (arabSlider) arabSlider.value = arab;
    if (translationSlider) translationSlider.value = translation;
    if (tafsirSlider) tafsirSlider.value = tafsir;
  }
  
  function saveFontSettings() {
    if (arabSlider) localStorage.setItem("quranArabSize", arabSlider.value);
    if (translationSlider) localStorage.setItem("quranTranslationSize", translationSlider.value);
    if (tafsirSlider) localStorage.setItem("quranTafsirSize", tafsirSlider.value);
  }
  
  // ==================== RESUME READING ====================
  function updateResumeCard() {
    if (!resumeCard || !surahList.length) return;
    
    const data = JSON.parse(localStorage.getItem("quranLastReading"));
    if (!data) {
      resumeCard.style.display = "none";
      return;
    }
    
    const surah = surahList.find(s => s.nomor == data.surah);
    if (!surah) return;
    
    if (resumeInfo) {
      resumeInfo.innerHTML = `
        <strong>${surah.namaLatin}</strong> • Ayat ${data.ayat}
        ${data.manual ? '<br><small>🔖 Disimpan manual</small>' : ''}
      `;
    }
    resumeCard.style.display = "block";
  }
  
  function saveLastReading(surah, ayat, manual = false) {
    const data = { surah, ayat, manual, time: Date.now() };
    localStorage.setItem("quranLastReading", JSON.stringify(data));
    updateResumeCard();
    showMessage(manual ? "🔖 Bacaan terakhir disimpan" : "📖 Progress tersimpan");
  }
  
  // Expose bookmark function globally
  window.saveQuranBookmark = function(ayat) {
    saveLastReading(currentSurahId, ayat, true);
  };
  
  // ==================== LOAD SURAH LIST ====================
  async function loadSurahList() {
    if (!surahSelect) return;
    
    try {
      const response = await fetch(`${API_BASE}/surat`);
      const result = await response.json();
      surahList = result.data;
      
      surahSelect.innerHTML = "";
      surahList.forEach(surah => {
        const option = document.createElement("option");
        option.value = surah.nomor;
        option.textContent = `${surah.nomor}. ${surah.namaLatin}`;
        surahSelect.appendChild(option);
      });
      
      updateResumeCard();
      loadSurahDetail(currentSurahId);
    } catch(err) {
      console.error("Error loading surah list:", err);
      showMessage("Gagal memuat daftar surat", true);
    }
  }
  
  // ==================== LOAD TAFSIR ====================
  async function loadTafsir(id) {
    try {
      const response = await fetch(`${API_BASE}/tafsir/${id}`);
      const result = await response.json();
      
      if (result.data && result.data.tafsir) {
        result.data.tafsir.forEach(t => {
          tafsirData[t.ayat] = t.teks;
        });
        
        Object.entries(tafsirData).forEach(([k, v]) => {
          const el = document.querySelector(`.tafsir-content[data-ayat="${k}"]`);
          if (el) el.innerHTML = v;
        });
      }
    } catch(err) {
      console.log("Tafsir unavailable");
    }
  }
  
  // ==================== DISPLAY AYATS ====================
  function displayAyats(ayats) {
    if (!ayatContainer) return;
    
    ayatContainer.innerHTML = "";
    
    // Bismillah (kecuali Surah 1 dan 9)
    if (currentSurahId !== 1 && currentSurahId !== 9) {
      ayatContainer.innerHTML += `
        <div class="bismillah-card">
          <div class="bismillah-label">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
          <div class="bismillah-translit">Bismillāhir-raḥmānir-raḥīm</div>
          <div class="bismillah-translation">Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang</div>
        </div>
      `;
    }
    
    ayats.forEach(ayat => {
      ayatContainer.innerHTML += `
        <div id="ayat-${ayat.nomorAyat}" class="ayat-item">
          <div class="ayat-header">
            <span class="ayat-number">Ayat ${ayat.nomorAyat}</span>
          </div>
          <div class="arabic-text">${ayat.teksArab}</div>
          <div class="latin-text">${ayat.teksLatin || ""}</div>
          <div class="translation-text"><strong>Terjemahan:</strong><br>${ayat.teksIndonesia}</div>
          <div id="tafsir-${ayat.nomorAyat}" class="tafsir-text">
            <span class="tafsir-content" data-ayat="${ayat.nomorAyat}">Memuat tafsir...</span>
          </div>
          <div class="ayat-actions">
            <button class="play-ayat" data-ayat="${ayat.nomorAyat}">🔊 Play</button>
            <button class="btn-tafsir" data-ayat="${ayat.nomorAyat}">📖 Tafsir</button>
            <button class="btn-bookmark" data-ayat="${ayat.nomorAyat}">🔖 Simpan Bacaan</button>
          </div>
        </div>
      `;
    });
    
    // Attach event listeners to dynamically created buttons
    document.querySelectorAll('.play-ayat').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ayatNum = parseInt(btn.getAttribute('data-ayat'));
        playSingleAyat(ayatNum);
      });
    });
    
    document.querySelectorAll('.btn-tafsir').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ayatNum = parseInt(btn.getAttribute('data-ayat'));
        toggleTafsir(ayatNum);
      });
    });
    
    document.querySelectorAll('.btn-bookmark').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ayatNum = parseInt(btn.getAttribute('data-ayat'));
        saveLastReading(currentSurahId, ayatNum, true);
      });
    });
  }
  
  // ==================== PLAY SINGLE AYAT ====================
  function playSingleAyat(num) {
    const ayat = currentAyats.find(a => a.nomorAyat == num);
    if (ayat && ayat.audio && ayat.audio[currentQari]) {
      if (ayatAudioPlayer) {
        ayatAudioPlayer.src = ayat.audio[currentQari];
        ayatAudioPlayer.play().catch(e => console.log("Audio play error:", e));
      }
    } else {
      showMessage("Audio untuk ayat ini tidak tersedia", true);
    }
  }
  
  // ==================== TOGGLE TAFSIR ====================
  function toggleTafsir(num) {
    const el = document.getElementById(`tafsir-${num}`);
    if (el) el.classList.toggle("show");
  }
  
  // ==================== LOAD SURAH DETAIL ====================
  async function loadSurahDetail(id) {
    if (!ayatContainer) return;
    
    try {
      ayatContainer.innerHTML = `<div class="loading-spinner">⏳ Memuat surat...</div>`;
      tafsirData = {};
      
      const response = await fetch(`${API_BASE}/surat/${id}`);
      const result = await response.json();
      const surah = result.data;
      
      currentSurahId = id;
      currentAyats = surah.ayat || [];
      
      if (surahInfoContainer) {
        surahInfoContainer.innerHTML = `
          <div class="quran-surah-info">
            <div class="surah-name-ar">${surah.nama}</div>
            <h2>${surah.namaLatin}</h2>
            <p>${surah.arti} • ${surah.jumlahAyat} Ayat</p>
          </div>
        `;
      }
      
      displayAyats(currentAyats);
      setupSurahAudio(surah);
      loadTafsir(id);
      
      if (prevBtn && nextBtn) {
        prevBtn.style.display = "flex";
        nextBtn.style.display = "flex";
      }
      
    } catch(err) {
      console.error("Error loading surah detail:", err);
      showMessage("Gagal memuat surat", true);
      if (ayatContainer) ayatContainer.innerHTML = `<div class="loading-spinner">⚠️ Gagal memuat surat. Silakan coba lagi.</div>`;
    }
  }
  
  // ==================== AUDIO ====================
  function setupSurahAudio(surah) {
    if (!audioContainer || !surahAudioSource || !surahAudioPlayer) return;
    
    const qariMap = { '01': '01', '02': '02', '03': '03', '04': '04', '05': '05' };
    const qariCode = qariMap[currentQari] || '01';
    
    if (surah.audioFull && surah.audioFull[qariCode]) {
      surahAudioSource.src = surah.audioFull[qariCode];
      surahAudioPlayer.load();
      audioContainer.style.display = "block";
    } else {
      audioContainer.style.display = "none";
    }
  }
  
  // ==================== RESUME BUTTON ====================
  async function resumeReading() {
    const data = JSON.parse(localStorage.getItem("quranLastReading"));
    if (!data) return;
    
    if (surahSelect) surahSelect.value = data.surah;
    await loadSurahDetail(data.surah);
    
    setTimeout(() => {
      const ayat = document.getElementById(`ayat-${data.ayat}`);
      if (ayat) {
        ayat.scrollIntoView({ behavior: "smooth", block: "center" });
        ayat.classList.add("highlight");
        setTimeout(() => ayat.classList.remove("highlight"), 2000);
      }
    }, 500);
  }
  
  // ==================== INITIALIZATION ====================
  function init() {
    console.log("QuranModule initialized with equran.id API");
    
    // Get DOM elements
    surahSelect = document.getElementById("quran-surah-select");
    qariSelect = document.getElementById("quran-qari-select");
    surahInfoContainer = document.getElementById("quran-surah-info-container");
    ayatContainer = document.getElementById("quran-ayat-container");
    audioContainer = document.getElementById("quran-audio-container");
    surahAudioPlayer = document.getElementById("quran-surah-audio-player");
    surahAudioSource = document.getElementById("quran-surah-audio-source");
    ayatAudioPlayer = document.getElementById("quran-ayat-audio-player");
    resumeCard = document.getElementById("quran-resume-card");
    resumeInfo = document.getElementById("quran-resume-info");
    resumeBtn = document.getElementById("quran-resume-btn");
    arabSlider = document.getElementById("quran-arab-slider");
    translationSlider = document.getElementById("quran-translation-slider");
    tafsirSlider = document.getElementById("quran-tafsir-slider");
    prevBtn = document.getElementById("quran-prev-btn");
    nextBtn = document.getElementById("quran-next-btn");
    refreshBtn = document.getElementById("quran-refresh-btn");
    
    // Load font settings
    loadFontSettings();
    
    // Slider events
    if (arabSlider) {
      arabSlider.addEventListener("input", () => {
        document.documentElement.style.setProperty("--arab-size", `${arabSlider.value}rem`);
        saveFontSettings();
      });
    }
    if (translationSlider) {
      translationSlider.addEventListener("input", () => {
        document.documentElement.style.setProperty("--translation-size", `${translationSlider.value}rem`);
        saveFontSettings();
      });
    }
    if (tafsirSlider) {
      tafsirSlider.addEventListener("input", () => {
        document.documentElement.style.setProperty("--tafsir-size", `${tafsirSlider.value}rem`);
        saveFontSettings();
      });
    }
    
    // Surah select
    if (surahSelect) {
      surahSelect.addEventListener("change", (e) => {
        loadSurahDetail(parseInt(e.target.value));
      });
    }
    
    // Qari select
    if (qariSelect) {
      qariSelect.addEventListener("change", (e) => {
        currentQari = e.target.value;
        loadSurahDetail(currentSurahId);
      });
    }
    
    // Refresh button
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        loadSurahList();
      });
    }
    
    // Navigation buttons
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (currentSurahId > 1) {
          currentSurahId--;
          if (surahSelect) surahSelect.value = currentSurahId;
          loadSurahDetail(currentSurahId);
        }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (currentSurahId < 114) {
          currentSurahId++;
          if (surahSelect) surahSelect.value = currentSurahId;
          loadSurahDetail(currentSurahId);
        }
      });
    }
    
    // Resume button
    if (resumeBtn) {
      resumeBtn.addEventListener("click", resumeReading);
    }
    
    // Load initial data
    loadSurahList();
  }
  
  // Expose functions globally
  window.playSingleAyat = playSingleAyat;
  window.toggleTafsir = toggleTafsir;
  
  return { 
    init, 
    loadSurahDetail, 
    playSingleAyat, 
    toggleTafsir 
  };
})();