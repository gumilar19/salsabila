// ==================== THEME MODULE ====================

window.ThemeModule = (function() {
  let currentTheme = localStorage.getItem('theme') || 'dark';
  
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const themeBtn = document.getElementById("themeToggle");
    if(themeBtn) themeBtn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i> Tema' : '<i class="fas fa-moon"></i> Tema';
  }
  
  function toggleTheme() {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    currentTheme = localStorage.getItem('theme') || 'dark';
  }
  
  function init() {
    setTheme(currentTheme);
    document.getElementById("themeToggle")?.addEventListener("click", toggleTheme);
  }
  
  return { init, setTheme, toggleTheme };
})();