/**
 * Zynith Investment Platform - Custom JavaScript
 * This file contains custom scripts for the Zynith Investment Platform
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Admin registration toggle functionality
    const adminToggle = document.querySelector('.toggle-admin-section');
    if (adminToggle) {
        adminToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const adminSection = document.querySelector('.admin-register-section');
            if (adminSection) {
                if (adminSection.style.display === 'none' || adminSection.style.display === '') {
                    adminSection.style.display = 'block';
                } else {
                    adminSection.style.display = 'none';
                }
            }
        });
    }

    // Fix for signup button text
    const signupBtn = document.querySelector('#main_Signup_form button.dream-btn');
    if (signupBtn && signupBtn.textContent.trim() === 'Login') {
        signupBtn.textContent = 'Sign Up';
    }

    // Fix for signup link in login form
    const loginFormSignupLink = document.querySelector('#login-popup .col-12.col-sm-7 a');
    if (loginFormSignupLink) {
        loginFormSignupLink.classList.add('open-signup-link');
        loginFormSignupLink.setAttribute('href', '#signup-popup');
    }

    // Investment type tabs functionality (for investment pages)
    const investmentTabs = document.querySelectorAll('.investment-tab');
    if (investmentTabs.length > 0) {
        investmentTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                investmentTabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show corresponding content
                const target = this.getAttribute('data-target');
                document.querySelectorAll('.investment-content').forEach(content => {
                    content.style.display = 'none';
                });
                document.querySelector(target).style.display = 'block';
            });
        });
    }

    // Portfolio chart initialization (if Chart.js is loaded and canvas exists)
    if (typeof Chart !== 'undefined') {
        const portfolioCanvas = document.getElementById('portfolioChart');
        if (portfolioCanvas) {
            const ctx = portfolioCanvas.getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Portfolio Value',
                        data: [10000, 11200, 10800, 11500, 12300, 12100, 13400, 14200, 14800, 15500, 16200, 17000],
                        backgroundColor: 'rgba(33, 211, 151, 0.2)',
                        borderColor: '#21d397',
                        borderWidth: 2,
                        pointBackgroundColor: '#21d397',
                        tension: 0.4
                    }, {
                        label: 'Market Benchmark',
                        data: [10000, 10400, 10600, 11000, 11200, 11500, 12000, 12400, 12800, 13200, 13600, 14000],
                        backgroundColor: 'rgba(116, 80, 254, 0.2)',
                        borderColor: '#7450fe',
                        borderWidth: 2,
                        pointBackgroundColor: '#7450fe',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Portfolio Performance'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            });
        }
    }

    // Crypto price ticker simulation
    const cryptoPriceElements = document.querySelectorAll('.crypto-price');
    if (cryptoPriceElements.length > 0) {
        // Simulate price changes every 3 seconds
        setInterval(() => {
            cryptoPriceElements.forEach(element => {
                const currentPrice = parseFloat(element.getAttribute('data-price'));
                const change = (Math.random() - 0.5) * 0.02; // Random change between -1% and +1%
                const newPrice = currentPrice * (1 + change);
                
                // Update price and styling
                element.setAttribute('data-price', newPrice.toFixed(2));
                element.textContent = '$' + newPrice.toFixed(2);
                
                // Add up/down class based on price change
                if (change > 0) {
                    element.classList.remove('crypto-price-down');
                    element.classList.add('crypto-price-up');
                } else {
                    element.classList.remove('crypto-price-up');
                    element.classList.add('crypto-price-down');
                }
            });
        }, 3000);
    }
});
