// Initialize counter animations
document.addEventListener('DOMContentLoaded', function() {
  // Check if jQuery and counterUp are available
  if (window.jQuery && jQuery.fn.counterUp) {
    jQuery('.counter').counterUp({
      delay: 10,
      time: 2000
    });
  } else {
    // Fallback for counter animation if counterUp is not available
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
      const target = parseInt(counter.innerText.replace(/[^0-9]/g, ''), 10);
      const increment = target / 100;
      let current = 0;
      
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.innerText = Math.ceil(current);
          setTimeout(updateCounter, 20);
        } else {
          counter.innerText = target;
        }
      };
      
      updateCounter();
    });
  }
});
