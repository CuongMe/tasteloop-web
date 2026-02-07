// ============================================
// About.html Specific JavaScript
// ============================================

function initAboutPage() {
  // Fill all images with data-random-img attribute
  const randomImages = document.querySelectorAll('[data-random-img]');
  
  randomImages.forEach(img => {
    img.src = getRandomImage('about');
    img.alt = 'TastyLoop';
  });
}

// Initialize About Page
if (window.location.pathname.includes('about.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    initAboutPage();
  });
}
