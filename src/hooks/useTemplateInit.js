import { useEffect } from 'react';

const useTemplateInit = () => {
  useEffect(() => {
    // Initialize WOW.js
    if (typeof window !== 'undefined' && window.WOW) {
      new window.WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 0,
        mobile: true,
        live: true
      }).init();
    }

    // Handle preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 1000);
    }

    // Initialize other template scripts
    if (typeof window !== 'undefined' && window.jQuery) {
      const $ = window.jQuery;

      // Initialize classy nav
      if ($.fn.classyNav) {
        $('#dreamNav').classyNav();
      }

      // Sticky header
      $(window).on('scroll', function() {
        if ($(window).scrollTop() > 0) {
          $('.header-area').addClass('sticky');
        } else {
          $('.header-area').removeClass('sticky');
        }
      });
    }
  }, []);
};

export default useTemplateInit;
