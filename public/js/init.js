// Initialize WOW.js when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize WOW.js
  if (typeof WOW === 'function') {
    new WOW({
      boxClass: 'wow',
      animateClass: 'animated',
      offset: 0,
      mobile: true,
      live: true
    }).init();
  }

  // Remove preloader
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(function() {
      preloader.style.display = 'none';
    }, 1000);
  }
});
