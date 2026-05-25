// ==================== QIBLA MODULE ====================

window.QiblaModule = (function() {
  let qiblaBaseAngle = 295;
  
  function updateDirection() {
    const kaabaLat = 21.4225, kaabaLon = 39.8262;
    const phi1 = (window.currentLat || -6.8906) * Math.PI/180;
    const phi2 = kaabaLat * Math.PI/180;
    const deltaLambda = (kaabaLon - (window.currentLon || 107.6135)) * Math.PI/180;
    const x = Math.sin(deltaLambda) * Math.cos(phi2);
    const y = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
    let angle = Math.atan2(x, y) * 180 / Math.PI;
    qiblaBaseAngle = (angle + 360) % 360;
    
    const desc = document.getElementById("qiblaDirection");
    if(desc) desc.innerHTML = `Arah Kiblat: ${Math.round(qiblaBaseAngle)}° dari Utara`;
    const needle = document.getElementById("compassNeedle");
    if(needle) needle.style.transform = `rotate(${qiblaBaseAngle}deg)`;
    
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.alpha !== null && needle) {
          needle.style.transform = `rotate(${(qiblaBaseAngle - e.alpha + 360) % 360}deg)`;
        }
      });
    }
  }
  
  function init() {
    updateDirection();
    const compassZone = document.getElementById('compassContainer');
    if(compassZone) {
      compassZone.addEventListener('mousemove', (e) => {
        const needle = document.getElementById("compassNeedle");
        if(!needle) return;
        const rect = compassZone.getBoundingClientRect();
        const x = e.clientX - rect.left - (rect.width/2);
        const y = e.clientY - rect.top - (rect.height/2);
        needle.style.transform = `rotate(${qiblaBaseAngle}deg) rotateX(${-y * 0.25}deg) rotateY(${x * 0.25}deg) translateZ(20px)`;
      });
      compassZone.addEventListener('mouseleave', () => {
        const needle = document.getElementById("compassNeedle");
        if(needle) needle.style.transform = `rotate(${qiblaBaseAngle}deg)`;
      });
    }
  }
  
  return { init, updateDirection };
})();