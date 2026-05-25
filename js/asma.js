// ==================== ASMAUL HUSNA MODULE ====================

window.AsmaModule = (function() {
  const fullAsmaulHusna = [
    { number: 1, name: "الرحمن", transliteration: "Ar-Rahman", translation: "Yang Maha Pengasih" },
    { number: 2, name: "الرحيم", transliteration: "Ar-Rahim", translation: "Yang Maha Penyayang" },
    { number: 3, name: "الملك", transliteration: "Al-Malik", translation: "Yang Maha Merajai" },
    { number: 4, name: "القدوس", transliteration: "Al-Quddus", translation: "Yang Maha Suci" },
    { number: 5, name: "السلام", transliteration: "As-Salam", translation: "Yang Maha Memberi Kesejahteraan" },
    { number: 6, name: "المؤمن", transliteration: "Al-Mu'min", translation: "Yang Maha Memberi Keamanan" },
    { number: 7, name: "المهيمن", transliteration: "Al-Muhaymin", translation: "Yang Maha Pemelihara" },
    { number: 8, name: "العزيز", transliteration: "Al-Aziz", translation: "Yang Maha Perkasa" },
    { number: 9, name: "الجبار", transliteration: "Al-Jabbar", translation: "Yang Maha Perkasa" },
    { number: 10, name: "المتكبر", transliteration: "Al-Mutakabbir", translation: "Yang Maha Megah" },
    { number: 11, name: "الخالق", transliteration: "Al-Khaliq", translation: "Yang Maha Pencipta" },
    { number: 12, name: "البارئ", transliteration: "Al-Bari'", translation: "Yang Maha Mengadakan" },
    { number: 13, name: "المصور", transliteration: "Al-Musawwir", translation: "Yang Maha Membentuk Rupa" },
    { number: 14, name: "الغفار", transliteration: "Al-Ghaffar", translation: "Yang Maha Pengampun" },
    { number: 15, name: "القهار", transliteration: "Al-Qahhar", translation: "Yang Maha Menundukkan" },
    { number: 16, name: "الوهاب", transliteration: "Al-Wahhab", translation: "Yang Maha Pemberi" },
    { number: 17, name: "الرزاق", transliteration: "Ar-Razzaq", translation: "Yang Maha Pemberi Rezeki" },
    { number: 18, name: "الفتاح", transliteration: "Al-Fattah", translation: "Yang Maha Pembuka" },
    { number: 19, name: "العليم", transliteration: "Al-Alim", translation: "Yang Maha Mengetahui" },
    { number: 20, name: "القابض", transliteration: "Al-Qabid", translation: "Yang Maha Menyempitkan" },
    { number: 21, name: "الباسط", transliteration: "Al-Basit", translation: "Yang Maha Melapangkan" },
    { number: 22, name: "الخافض", transliteration: "Al-Khafid", translation: "Yang Maha Merendahkan" },
    { number: 23, name: "الرافع", transliteration: "Ar-Rafi", translation: "Yang Maha Meninggikan" },
    { number: 24, name: "المعز", transliteration: "Al-Mu'izz", translation: "Yang Maha Memuliakan" },
    { number: 25, name: "المذل", transliteration: "Al-Mudhill", translation: "Yang Maha Menghinakan" },
    { number: 26, name: "السميع", transliteration: "As-Sami", translation: "Yang Maha Mendengar" },
    { number: 27, name: "البصير", transliteration: "Al-Basir", translation: "Yang Maha Melihat" },
    { number: 28, name: "الحكم", transliteration: "Al-Hakam", translation: "Yang Maha Menetapkan" },
    { number: 29, name: "العدل", transliteration: "Al-Adl", translation: "Yang Maha Adil" },
    { number: 30, name: "اللطيف", transliteration: "Al-Latif", translation: "Yang Maha Lembut" },
    { number: 31, name: "الخبير", transliteration: "Al-Khabir", translation: "Yang Maha Teliti" },
    { number: 32, name: "الحليم", transliteration: "Al-Halim", translation: "Yang Maha Penyantun" },
    { number: 33, name: "العظيم", transliteration: "Al-Azim", translation: "Yang Maha Agung" },
    { number: 34, name: "الغفور", transliteration: "Al-Ghafur", translation: "Yang Maha Pengampun" },
    { number: 35, name: "الشكور", transliteration: "Asy-Syakur", translation: "Yang Maha Pembalas Budi" },
    { number: 36, name: "العلي", transliteration: "Al-Aliyy", translation: "Yang Maha Tinggi" },
    { number: 37, name: "الكبير", transliteration: "Al-Kabir", translation: "Yang Maha Besar" },
    { number: 38, name: "الحفيظ", transliteration: "Al-Hafiz", translation: "Yang Maha Memelihara" },
    { number: 39, name: "المقيت", transliteration: "Al-Muqit", translation: "Yang Maha Pemberi Kekuatan" },
    { number: 40, name: "الحسيب", transliteration: "Al-Hasib", translation: "Yang Maha Membuat Perhitungan" },
    { number: 41, name: "الجليل", transliteration: "Al-Jalil", translation: "Yang Maha Luhur" },
    { number: 42, name: "الكريم", transliteration: "Al-Karim", translation: "Yang Maha Mulia" },
    { number: 43, name: "الرقيب", transliteration: "Ar-Raqib", translation: "Yang Maha Mengawasi" },
    { number: 44, name: "المجيب", transliteration: "Al-Mujib", translation: "Yang Maha Mengabulkan" },
    { number: 45, name: "الواسع", transliteration: "Al-Wasi", translation: "Yang Maha Luas" },
    { number: 46, name: "الحكيم", transliteration: "Al-Hakim", translation: "Yang Maha Bijaksana" },
    { number: 47, name: "الودود", transliteration: "Al-Wadud", translation: "Yang Maha Mengasihi" },
    { number: 48, name: "المجيد", transliteration: "Al-Majid", translation: "Yang Maha Mulia" },
    { number: 49, name: "الباعث", transliteration: "Al-Ba'its", translation: "Yang Maha Membangkitkan" },
    { number: 50, name: "الشهيد", transliteration: "Asy-Syahid", translation: "Yang Maha Menyaksikan" },
    { number: 51, name: "الحق", transliteration: "Al-Haqq", translation: "Yang Maha Benar" },
    { number: 52, name: "الوكيل", transliteration: "Al-Wakil", translation: "Yang Maha Mewakili" },
    { number: 53, name: "القوي", transliteration: "Al-Qawiyyu", translation: "Yang Maha Kuat" },
    { number: 54, name: "المتين", transliteration: "Al-Matin", translation: "Yang Maha Kokoh" },
    { number: 55, name: "الولي", transliteration: "Al-Waliyy", translation: "Yang Maha Melindungi" },
    { number: 56, name: "الحميد", transliteration: "Al-Hamid", translation: "Yang Maha Terpuji" },
    { number: 57, name: "المحصي", transliteration: "Al-Muhsi", translation: "Yang Maha Menghitung" },
    { number: 58, name: "المبدئ", transliteration: "Al-Mubdi'", translation: "Yang Maha Memulai" },
    { number: 59, name: "المعيد", transliteration: "Al-Mu'id", translation: "Yang Maha Mengembalikan" },
    { number: 60, name: "المحيي", transliteration: "Al-Muhyi", translation: "Yang Maha Menghidupkan" },
    { number: 61, name: "المميت", transliteration: "Al-Mumit", translation: "Yang Maha Mematikan" },
    { number: 62, name: "الحي", transliteration: "Al-Hayyu", translation: "Yang Maha Hidup" },
    { number: 63, name: "القيوم", transliteration: "Al-Qayyum", translation: "Yang Maha Mandiri" },
    { number: 64, name: "الواجد", transliteration: "Al-Wajid", translation: "Yang Maha Penemu" },
    { number: 65, name: "الماجد", transliteration: "Al-Majid", translation: "Yang Maha Mulia" },
    { number: 66, name: "الواحد", transliteration: "Al-Wahid", translation: "Yang Maha Esa" },
    { number: 67, name: "الأحد", transliteration: "Al-Ahad", translation: "Yang Maha Tunggal" },
    { number: 68, name: "الصمد", transliteration: "As-Samad", translation: "Yang Maha Dibutuhkan" },
    { number: 69, name: "القادر", transliteration: "Al-Qadir", translation: "Yang Maha Kuasa" },
    { number: 70, name: "المقتدر", transliteration: "Al-Muqtadir", translation: "Yang Maha Berkuasa" },
    { number: 71, name: "المقدم", transliteration: "Al-Muqaddim", translation: "Yang Maha Mendahulukan" },
    { number: 72, name: "المؤخر", transliteration: "Al-Mu'akhkhir", translation: "Yang Maha Mengakhirkan" },
    { number: 73, name: "الأول", transliteration: "Al-Awwal", translation: "Yang Maha Awal" },
    { number: 74, name: "الأخر", transliteration: "Al-Akhir", translation: "Yang Maha Akhir" },
    { number: 75, name: "الظاهر", transliteration: "Az-Zahir", translation: "Yang Maha Nyata" },
    { number: 76, name: "الباطن", transliteration: "Al-Batin", translation: "Yang Maha Tersembunyi" },
    { number: 77, name: "الوالي", transliteration: "Al-Wali", translation: "Yang Maha Memerintah" },
    { number: 78, name: "المتعالي", transliteration: "Al-Muta'ali", translation: "Yang Maha Tinggi" },
    { number: 79, name: "البر", transliteration: "Al-Barr", translation: "Yang Maha Penderma" },
    { number: 80, name: "التواب", transliteration: "At-Tawwab", translation: "Yang Maha Penerima Taubat" },
    { number: 81, name: "المنتقم", transliteration: "Al-Muntaqim", translation: "Yang Maha Pembalas" },
    { number: 82, name: "العفو", transliteration: "Al-Afuww", translation: "Yang Maha Pemaaf" },
    { number: 83, name: "الرؤوف", transliteration: "Ar-Ra'uf", translation: "Yang Maha Belas Kasih" },
    { number: 84, name: "مالك الملك", transliteration: "Malikul Mulk", translation: "Yang Maha Penguasa Kerajaan" },
    { number: 85, name: "ذو الجلال والإكرام", transliteration: "Dzul Jalali Wal Ikram", translation: "Yang Maha Memiliki Kebesaran dan Kemuliaan" },
    { number: 86, name: "المقسط", transliteration: "Al-Muqsit", translation: "Yang Maha Adil" },
    { number: 87, name: "الجامع", transliteration: "Al-Jami'", translation: "Yang Maha Mengumpulkan" },
    { number: 88, name: "الغني", transliteration: "Al-Ghaniyy", translation: "Yang Maha Kaya" },
    { number: 89, name: "المغني", transliteration: "Al-Mughni", translation: "Yang Maha Memberi Kekayaan" },
    { number: 90, name: "المانع", transliteration: "Al-Mani'", translation: "Yang Maha Mencegah" },
    { number: 91, name: "الضار", transliteration: "Ad-Darr", translation: "Yang Maha Memberi Derita" },
    { number: 92, name: "النافع", transliteration: "An-Nafi'", translation: "Yang Maha Memberi Manfaat" },
    { number: 93, name: "النور", transliteration: "An-Nur", translation: "Yang Maha Bercahaya" },
    { number: 94, name: "الهادي", transliteration: "Al-Hadi", translation: "Yang Maha Pemberi Petunjuk" },
    { number: 95, name: "البديع", transliteration: "Al-Badi'", translation: "Yang Maha Pencipta" },
    { number: 96, name: "الباقي", transliteration: "Al-Baqi", translation: "Yang Maha Kekal" },
    { number: 97, name: "الوارث", transliteration: "Al-Warits", translation: "Yang Maha Pewaris" },
    { number: 98, name: "الرشيد", transliteration: "Ar-Rasyid", translation: "Yang Maha Pandai" },
    { number: 99, name: "الصبور", transliteration: "As-Sabur", translation: "Yang Maha Sabar" }
  ];
  
  let asmaList = fullAsmaulHusna;
  
  function showSelectedAsma(asma) {
    const container = document.getElementById("selectedAsmaContainer");
    if (container) {
      container.innerHTML = `
        <div class="selected-asma-card">
          <div class="selected-asma-number">${asma.number} • ASMAUL HUSNA</div>
          <div class="selected-asma-arabic">${asma.name}</div>
          <div class="selected-asma-latin">${asma.transliteration.toUpperCase()}</div>
          <div class="selected-asma-meaning"><i class="fas fa-heart" style="color: var(--primary-cyan);"></i> Artinya: ${asma.translation}</div>
          <div class="selected-asma-badge"><i class="fas fa-praying-hands"></i> 99 Nama Allah</div>
        </div>
      `;
      container.classList.remove("hidden");
      container.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  
  function updateRandomAsma() {
    const random = asmaList[Math.floor(Math.random() * asmaList.length)];
    const box = document.getElementById("randomAsma");
    if(box) {
      box.style.opacity = 0.3;
      setTimeout(() => {
        const arabicEl = document.getElementById("randomAsmaArabic");
        const latinEl = document.getElementById("randomAsmaLatin");
        const meaningEl = document.getElementById("randomAsmaMeaning");
        if (arabicEl) arabicEl.innerText = random.name;
        if (latinEl) latinEl.innerText = random.transliteration;
        if (meaningEl) meaningEl.innerHTML = `<i class="fas fa-heart" style="color: var(--primary-cyan);"></i> Artinya: ${random.translation}`;
        box.style.opacity = 1;
      }, 150);
    }
  }
  
  function renderAsmaList(list) {
    let html = '';
    for (const item of list) {
      html += `<div class="asma-item" onclick='window.AsmaModule.showSelectedAsma(${JSON.stringify(item)})'>
        <div class="asma-header">
          <span class="asma-number">${item.number}.</span>
          <span class="asma-name-ar">${item.name}</span>
          <span class="asma-name-latin">(${item.transliteration})</span>
        </div>
        <div class="asma-meaning">${item.translation}</div>
      </div>`;
    }
    const asmaListEl = document.getElementById("asmaList");
    if (asmaListEl) asmaListEl.innerHTML = html;
  }
  
  function filterAsmaList(term) {
    const filtered = fullAsmaulHusna.filter(a => 
      a.name.toLowerCase().includes(term) || 
      a.transliteration.toLowerCase().includes(term) || 
      a.translation.toLowerCase().includes(term)
    );
    renderAsmaList(filtered);
  }
  
  function init() {
    console.log('AsmaModule init called');
    renderAsmaList(asmaList);
    updateRandomAsma();
    
    const randomAsmaBtn = document.getElementById("randomAsma");
    if (randomAsmaBtn) randomAsmaBtn.addEventListener("click", updateRandomAsma);
    
    const searchInput = document.getElementById("searchAsma");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase();
        filterAsmaList(term);
      });
    }
  }
  
  // Expose showSelectedAsma globally
  window.showSelectedAsma = showSelectedAsma;
  
  return { init, showSelectedAsma, updateRandomAsma, renderAsmaList, filterAsmaList };
})();