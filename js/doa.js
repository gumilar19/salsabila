// ==================== DO'A MODULE ====================

window.DoaModule = (function() {
  // ==================== CONFIG ====================
  const API_URL = 'https://equran.id/api/doa';
  let doaList = [];
  let filteredDoa = [];
  
  // ==================== DOM ELEMENTS ====================
  let doaGrid, searchInput, loadingEl, emptyEl, modal, modalTitle, modalArabic, modalLatin, modalTranslation, modalDescription;
  
  // ==================== FETCH DOA ====================
  async function fetchDoa() {
    if (!doaGrid) return;
    
    loadingEl.style.display = 'flex';
    doaGrid.style.display = 'none';
    emptyEl.style.display = 'none';
    
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      
      const rawData = Array.isArray(result) ? result : (result.data || []);
      
      doaList = rawData.map(item => ({
        id: item.id,
        nama: item.nama,
        arabic: item.ar,
        latin: item.tr || item.latin || "",
        artinya: item.idn || item.artinya || "",
        keterangan: item.tentang || item.keterangan || "Doa shahih yang diajarkan Rasulullah ﷺ."
      }));
      
      filteredDoa = [...doaList];
      renderDoa(filteredDoa);
      
    } catch(err) {
      console.error('Error fetching doa:', err);
      loadingEl.innerHTML = `
        <div class="doa-empty">
          <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
          <p>Gagal memuat data doa. Silakan refresh halaman.</p>
        </div>
      `;
    }
  }
  
  // ==================== RENDER DOA ====================
  function renderDoa(data) {
    loadingEl.style.display = 'none';
    
    if (!data || data.length === 0) {
      doaGrid.style.display = 'none';
      emptyEl.style.display = 'flex';
      return;
    }
    
    doaGrid.style.display = 'grid';
    emptyEl.style.display = 'none';
    
    doaGrid.innerHTML = '';
    
    data.forEach(doa => {
      const card = document.createElement('div');
      card.className = 'doa-card';
      card.setAttribute('data-doa-id', doa.id);
      card.onclick = () => openModal(doa);
      
      card.innerHTML = `
        <div class="doa-card-badge">📖 DO'A SHAHIH</div>
        <div class="doa-card-title">${escapeHtml(doa.nama)}</div>
        <div class="doa-card-arabic">${doa.arabic}</div>
        <div class="doa-card-meaning">${escapeHtml(doa.artinya.substring(0, 100))}${doa.artinya.length > 100 ? '...' : ''}</div>
      `;
      
      doaGrid.appendChild(card);
    });
  }
  
  // ==================== SEARCH DOA ====================
  function searchDoa(keyword) {
    if (!keyword.trim()) {
      filteredDoa = [...doaList];
    } else {
      const lowerKeyword = keyword.toLowerCase();
      filteredDoa = doaList.filter(item =>
        item.nama.toLowerCase().includes(lowerKeyword) ||
        item.artinya.toLowerCase().includes(lowerKeyword) ||
        (item.latin && item.latin.toLowerCase().includes(lowerKeyword))
      );
    }
    renderDoa(filteredDoa);
  }
  
  // ==================== OPEN MODAL ====================
  function openModal(doa) {
    modalTitle.textContent = doa.nama;
    modalArabic.innerHTML = doa.arabic;
    modalLatin.textContent = doa.latin || '—';
    modalTranslation.textContent = doa.artinya;
    modalDescription.innerHTML = doa.keterangan.replace(/\n/g, '<br><br>');
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  
  // ==================== CLOSE MODAL ====================
  function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
  
  // ==================== ESCAPE HTML ====================
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // ==================== INITIALIZATION ====================
  function init() {
    console.log('DoaModule initialized');
    
    // Get DOM elements
    doaGrid = document.getElementById('doaGrid');
    searchInput = document.getElementById('doaSearch');
    loadingEl = document.getElementById('doaLoading');
    emptyEl = document.getElementById('doaEmpty');
    modal = document.getElementById('doaModal');
    modalTitle = document.getElementById('doaModalTitle');
    modalArabic = document.getElementById('doaModalArabic');
    modalLatin = document.getElementById('doaModalLatin');
    modalTranslation = document.getElementById('doaModalTranslation');
    modalDescription = document.getElementById('doaModalDescription');
    
    // Search event
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchDoa(e.target.value);
      });
    }
    
    // Close modal on backdrop click
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
      
      // Close button
      const closeBtn = document.getElementById('doaModalClose');
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      
      // ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
      });
    }
    
    // Fetch data
    fetchDoa();
  }
  
  return { init, searchDoa, closeModal };
})();