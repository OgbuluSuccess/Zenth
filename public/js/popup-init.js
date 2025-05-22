// Initialize Magnific Popup for login and signup forms
document.addEventListener('DOMContentLoaded', function() {
  // Check if jQuery and Magnific Popup are available
  if (window.jQuery && jQuery.fn.magnificPopup) {
    // Initialize login popup
    jQuery('.open-popup-link').magnificPopup({
      type: 'inline',
      midClick: true,
      mainClass: 'mfp-fade'
    });

    // Initialize signup popup
    jQuery('.open-signup-link').magnificPopup({
      type: 'inline',
      midClick: true,
      mainClass: 'mfp-fade'
    });

    // Initialize admin section toggle
    jQuery('.toggle-admin-section').on('click', function(e) {
      e.preventDefault();
      jQuery('.admin-register-section').slideToggle();
    });
  }
});
