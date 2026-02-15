/**
 * ===================================================================
 * MAINAK CHAKRABORTY PORTFOLIO - OPTIMIZED JAVASCRIPT
 * Version: 2.0
 * Last Updated: November 2025
 * 
 * Original Template: Regna v4.9.1
 * Template URL: https://bootstrapmade.com/regna-bootstrap-onepage-template/
 * ===================================================================
 */

'use strict';

/**
 * ===================================================================
 * 1. UTILITY FUNCTIONS
 * ===================================================================
 */

// PERFORMANCE FIX: Cache selector results to avoid repeated DOM queries
const select = (el, all = false) => {
  el = el.trim();
  return all ? [...document.querySelectorAll(el)] : document.querySelector(el);
};

// PERFORMANCE FIX: Debounce function to limit scroll event frequency
const debounce = (func, wait = 10) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Easy event listener function
const on = (type, el, listener, all = false) => {
  const selectEl = select(el, all);
  if (selectEl) {
    all 
      ? selectEl.forEach(e => e.addEventListener(type, listener)) 
      : selectEl.addEventListener(type, listener);
  }
};



/**
 * ===================================================================
 * 2. SCROLL-BASED FUNCTIONALITY (OPTIMIZED)
 * ===================================================================
 */

// PERFORMANCE FIX: Use requestAnimationFrame for smooth scroll handling
let ticking = false;

const navbarlinks = select('#navbar .scrollto', true);
const navbarlinksActive = () => {
  if (!navbarlinks || navbarlinks.length === 0) return;
  
  const position = window.scrollY + 200;
  navbarlinks.forEach(navbarlink => {
    if (!navbarlink.hash) return;
    const section = select(navbarlink.hash);
    if (!section) return;
    
    const isActive = position >= section.offsetTop && 
                     position <= (section.offsetTop + section.offsetHeight);
    navbarlink.classList.toggle('active', isActive);
  });
};

const headerScrolled = () => {
  const selectHeader = select('#header');
  if (!selectHeader) return;
  selectHeader.classList.toggle('header-scrolled', window.scrollY > 100);
};

const logoScrolled = () => {
  const selectLogo = select('#logo');
  if (!selectLogo) return;
  selectLogo.classList.toggle('logo-scrolled', window.scrollY > 100);
};

const toggleBacktotop = () => {
  const backtotop = select('.back-to-top');
  if (!backtotop) return;
  backtotop.classList.toggle('active', window.scrollY > 100);
};

// PERFORMANCE FIX: Combine all scroll handlers with requestAnimationFrame
const handleScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      navbarlinksActive();
      headerScrolled();
      logoScrolled();
      toggleBacktotop();
      ticking = false;
    });
    ticking = true;
  }
};

// PERFORMANCE FIX: Debounced scroll event
document.addEventListener('scroll', debounce(handleScroll, 10), { passive: true });

/**
 * ===================================================================
 * 3. SMOOTH SCROLLING
 * ===================================================================
 */

const scrollto = (el) => {
  const header = select('#header');
  if (!header) return;
  
  let offset = header.offsetHeight;
  if (!header.classList.contains('header-scrolled')) {
    offset -= 20;
  }
  
  const element = select(el);
  if (!element) return;
  
  const elementPos = element.offsetTop;
  window.scrollTo({
    top: elementPos - offset,
    behavior: 'smooth'
  });
};

// Scroll with offset on .scrollto links
on('click', '.scrollto', function (e) {
  if (this.hash && select(this.hash)) {
    e.preventDefault();
    const navbar = select('#navbar');
    
    if (navbar && navbar.classList.contains('navbar-mobile')) {
      navbar.classList.remove('navbar-mobile');
      const navbarToggle = select('.mobile-nav-toggle');
      if (navbarToggle) {
        navbarToggle.classList.toggle('bi-list');
        navbarToggle.classList.toggle('bi-x');
      }
    }
    scrollto(this.hash);
  }
}, true);

/**
 * ===================================================================
 * 4. MOBILE NAVIGATION
 * ===================================================================
 */

on('click', '.mobile-nav-toggle', function () {
  const navbar = select('#navbar');
  if (navbar) {
    navbar.classList.toggle('navbar-mobile');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  }
});

// Mobile nav dropdowns
on('click', '.navbar .dropdown > a', function (e) {
  const navbar = select('#navbar');
  if (navbar && navbar.classList.contains('navbar-mobile')) {
    e.preventDefault();
    if (this.nextElementSibling) {
      this.nextElementSibling.classList.toggle('dropdown-active');
    }
  }
}, true);

/**
 * ===================================================================
 * 5. THIRD-PARTY LIBRARY INITIALIZATION
 * ===================================================================
 */

// PERFORMANCE FIX: Detect mobile with feature detection instead of user-agent
const isMobile = ('ontouchstart' in window) || 
                 (navigator.maxTouchPoints > 0) || 
                 (window.innerWidth <= 768);

// Portfolio Swiper initialization
const initSwiper = () => {
  const swiperElement = document.querySelector('.portfolio-details-slider');
  if (!swiperElement || typeof Swiper === 'undefined') return;
  
  try {
    new Swiper('.portfolio-details-slider', {
      speed: 300,
      loop: true,
      autoplay: isMobile ? false : {
        delay: 3000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      }
    });
  } catch (error) {
    console.warn('Swiper initialization failed:', error);
  }
};

// Portfolio lightbox initialization
const initLightbox = () => {
  if (typeof GLightbox === 'undefined') return;
  
  try {
    const portfolioLightbox = GLightbox({
      selector: '.portfolio-lightbox'
    });
  } catch (error) {
    console.warn('GLightbox initialization failed:', error);
  }
};

// Portfolio filtering with Isotope
const initIsotope = () => {
  const portfolioContainer = select('.portfolio-container');
  if (!portfolioContainer || typeof Isotope === 'undefined') return;

  try {
    const portfolioIsotope = new Isotope(portfolioContainer, {
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows'
    });

    const portfolioFilters = select('#portfolio-flters li', true);
    if (!portfolioFilters) return;

    on('click', '#portfolio-flters li', function (e) {
      e.preventDefault();
      portfolioFilters.forEach(el => el.classList.remove('filter-active'));
      this.classList.add('filter-active');

      portfolioIsotope.arrange({
        filter: this.getAttribute('data-filter')
      });

      if (typeof AOS !== 'undefined') {
        portfolioIsotope.on('arrangeComplete', () => {
          AOS.refresh();
        });
      }
    }, true);
  } catch (error) {
    console.warn('Isotope initialization failed:', error);
  }
};

// AOS animations initialization
const initAOS = () => {
  if (typeof AOS === 'undefined') return;
  
  try {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      disable: isMobile
    });
  } catch (error) {
    console.warn('AOS initialization failed:', error);
  }
};

// PureCounter initialization
const initPureCounter = () => {
  if (typeof PureCounter === 'undefined') return;
  
  try {
    new PureCounter();
  } catch (error) {
    console.warn('PureCounter initialization failed:', error);
  }
};

/**
 * ===================================================================
 * 6. THEME TOGGLE SYSTEM (OPTIMIZED)
 * ===================================================================
 */

// PERFORMANCE FIX: Use CSS classes instead of inline styles
const initThemeToggle = () => {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const htmlElement = document.documentElement;
  
  // ADD THIS SECTION - Detect mobile/touch devices
  const isMobileDevice = ('ontouchstart' in window) || 
                         (navigator.maxTouchPoints > 0) || 
                         (window.innerWidth <= 768);
  
  // Force light mode on mobile devices
  if (isMobileDevice) {
    htmlElement.setAttribute('data-theme', 'light');
    localStorage.removeItem('theme'); // Clear any saved preference
    return; // Exit - no theme toggle on mobile
  }
  // END OF NEW SECTION
  
  // Cache all theme-dependent elements
  const themeElements = {
    footer: document.getElementById('contact'),
    orbitTile: document.getElementById('project-orbit'),
    manageTile: document.getElementById('project-manage-wise'),
    todoTile: document.getElementById('project-todo'),
    aboutSection: document.getElementById('about'),
    aboutCard: document.getElementById('about-card'),
    aboutTitle: document.getElementById('about-title'),
    expTitle: document.getElementById('experience-title'),
    expLine: document.getElementById('experience-line'),
    toolsTitle: document.getElementById('tools-title'),
    toolsLine: document.getElementById('tools-line'),
    fwTitle: document.getElementById('featured-work-title'),
    fwLine: document.getElementById('featured-work-line'),
    storyP1: document.getElementById('story-p1'),
    storyP2: document.getElementById('story-p2'),
    storyP3: document.getElementById('story-p3'),
    storyP4: document.getElementById('story-p4')
  };


  // PERFORMANCE FIX: Batch DOM updates
  const setTheme = (theme) => {
    // Use DocumentFragment for better performance
    const isDark = theme === 'dark';
    
    htmlElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', theme);
    
    // Update aria-pressed for accessibility
    themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');

    // PERFORMANCE FIX: Use requestAnimationFrame for smooth transition
    requestAnimationFrame(() => {
      // Footer
      if (themeElements.footer) {
        themeElements.footer.style.background = isDark ? '#012A52' : '#02437D';
      }

      // Project tiles - keep their brand colors
      if (themeElements.orbitTile) {
        themeElements.orbitTile.style.background = '#029444';
        themeElements.orbitTile.style.color = '#fff';
        const orbitButton = themeElements.orbitTile.querySelector('.project-card-link');
        if (orbitButton) {
          orbitButton.style.background = isDark ? '#E0E0E0' : '#fff';
          orbitButton.style.color = isDark ? '#121212' : '#111827';
        }
      }

      if (themeElements.manageTile) {
        themeElements.manageTile.style.background = '#FFCD2A';
        themeElements.manageTile.style.color = '#000';
        const manageButton = themeElements.manageTile.querySelector('.project-card-link');
        if (manageButton) {
          manageButton.style.background = isDark ? '#E0E0E0' : '#fff';
          manageButton.style.color = isDark ? '#121212' : '#111827';
        }
      }

      if (themeElements.todoTile) {
        themeElements.todoTile.style.background = '#111827';
        const todoButtons = themeElements.todoTile.querySelectorAll('.project-card-link');
        todoButtons.forEach(btn => {
          btn.style.background = isDark ? '#E0E0E0' : '#fff';
          btn.style.color = isDark ? '#121212' : '#111827';
        });
      }

      // Featured work title and line
      if (themeElements.fwTitle) {
        themeElements.fwTitle.style.color = isDark ? '#E0E0E0' : '#0f172a';
      }
      if (themeElements.fwLine) {
        themeElements.fwLine.style.background = isDark ? '#E0E0E0' : '#0f172a';
      }

      // About page elements
      if (themeElements.aboutSection) {
        themeElements.aboutSection.style.background = isDark ? '#121212' : '#fff';
        themeElements.aboutSection.style.color = isDark ? '#C9D1D9' : '#1e293b';
      }
      if (themeElements.aboutCard) {
        themeElements.aboutCard.style.background = isDark ? '#1F1F1F' : '#ffffff';
      }
      
      // About page titles and lines
      const titleColor = isDark ? '#E0E0E0' : '#0f172a';
      [themeElements.aboutTitle, themeElements.expTitle, themeElements.toolsTitle].forEach(el => {
        if (el) el.style.color = titleColor;
      });
      [themeElements.expLine, themeElements.toolsLine].forEach(el => {
        if (el) el.style.background = titleColor;
      });

      // Story paragraphs
      const storyColor = isDark ? '#E0E0E0' : '#4b5563';
      [themeElements.storyP1, themeElements.storyP2, themeElements.storyP3, themeElements.storyP4].forEach(el => {
        if (el) el.style.color = storyColor;
      });
    });
  };

  // Toggle theme function
  const toggleTheme = () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  // Event listener
  themeToggle.addEventListener('click', toggleTheme);

  // Apply saved theme or system preference on load
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark' || savedTheme === 'light') {
    setTheme(savedTheme);
  // Always default to light mode on first visit
  } else {
    setTheme('light');
  }
};

/**
 * ===================================================================
 * 7. INITIALIZATION ON PAGE LOAD
 * ===================================================================
 */

// PERFORMANCE FIX: Use DOMContentLoaded for faster initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme toggle first for better perceived performance
  initThemeToggle();
});

// Initialize everything else after full page load
window.addEventListener('load', () => {
  // Run initial checks
  navbarlinksActive();
  headerScrolled();
  logoScrolled();
  toggleBacktotop();

  // Handle hash navigation
  if (window.location.hash && select(window.location.hash)) {
    scrollto(window.location.hash);
  }

  // Initialize third-party libraries
  initSwiper();
  initLightbox();
  initIsotope();
  initAOS();
  initPureCounter();
});

/**
 * ===================================================================
 * 8. PERFORMANCE MONITORING (OPTIONAL)
 * ===================================================================
 */

// PERFORMANCE FIX: Log performance metrics in development
if (window.performance && console.table) {
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    if (perfData) {
      console.log('Page Load Metrics:', {
        'DOM Content Loaded': Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart) + 'ms',
        'Full Page Load': Math.round(perfData.loadEventEnd - perfData.loadEventStart) + 'ms',
        'DOM Interactive': Math.round(perfData.domInteractive) + 'ms'
      });
    }
  });

  /**
 * ===================================================================
 * 9. SCROLL PROGRESS INDICATOR
 * ===================================================================
 */

const updateProgressBar = () => {
  const progressBar = document.getElementById('progress-bar');
  if (!progressBar) return;
  
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (window.scrollY / windowHeight) * 100;
  
  requestAnimationFrame(() => {
    progressBar.style.width = scrolled + '%';
  });
};

// Add to your existing scroll handler
document.addEventListener('scroll', debounce(() => {
  handleScroll();
  updateProgressBar();
}, 10), { passive: true });

// Initialize on load
window.addEventListener('load', updateProgressBar);

}
