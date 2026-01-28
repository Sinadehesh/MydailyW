/*
 * Educational Empire Hub - Main JavaScript
 * Core functionality, scroll effects, and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollProgress();
    initScrollAnimations();
    initCounters();
    initThemeSwitcher();
    initSmoothScroll();
    initParallax();
    initRippleButtons();
});

/* ===================================
   NAVIGATION
   =================================== */

function initNavigation() {
    const nav = document.getElementById('nav');
    const hamburger = document.getElementById('navHamburger');
    const menu = document.getElementById('navMenu');

    // Scroll behavior
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class for styling
        if (currentScroll > 50) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // Mobile menu toggle
    if (hamburger && menu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('is-open');
            menu.classList.toggle('is-open');
            document.body.style.overflow = menu.classList.contains('is-open') ? 'hidden' : '';
        });

        // Close menu on link click
        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('is-open');
                menu.classList.remove('is-open');
                document.body.style.overflow = '';
            });
        });
    }
}

/* ===================================
   SCROLL PROGRESS
   =================================== */

function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    }, { passive: true });
}

/* ===================================
   SCROLL ANIMATIONS
   =================================== */

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-scroll], [data-scroll-stagger]');

    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // Trigger counter animation if present
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => animateCounter(counter));
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

/* ===================================
   COUNTER ANIMATION
   =================================== */

function initCounters() {
    // Counters are animated when they become visible via intersection observer
}

function animateCounter(counter) {
    if (counter.dataset.animated) return;
    counter.dataset.animated = 'true';

    const target = parseInt(counter.dataset.target) || parseInt(counter.textContent);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += step;
        if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target + '+';
        }
    };

    updateCounter();
}

/* ===================================
   THEME SWITCHER
   =================================== */

function initThemeSwitcher() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const themes = ['renaissance', 'impressionist', 'art-deco', 'contemporary'];
    let currentIndex = 0;

    // Load saved theme
    const saved = localStorage.getItem('theme');
    if (saved && themes.includes(saved)) {
        currentIndex = themes.indexOf(saved);
        document.documentElement.dataset.theme = saved;
    }

    toggle.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % themes.length;
        const newTheme = themes[currentIndex];

        document.documentElement.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);

        // Visual feedback
        toggle.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            toggle.style.transform = 'rotate(0deg)';
        }, 300);
    });
}

/* ===================================
   SMOOTH SCROLL
   =================================== */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const navHeight = document.getElementById('nav')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* ===================================
   PARALLAX EFFECTS
   =================================== */

function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (!parallaxElements.length) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;

                parallaxElements.forEach(el => {
                    const speed = parseFloat(el.dataset.parallax) || 0.5;
                    const yPos = -(scrollY * speed);
                    el.style.transform = `translateY(${yPos}px)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/* ===================================
   RIPPLE EFFECT ON BUTTONS
   =================================== */

function initRippleButtons() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

/* ===================================
   ADDITIONAL UTILITIES
   =================================== */

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
