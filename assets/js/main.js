/**
* Optimized Mobile Performance Version
* Maintains all original functionality
*/
(function() {
  "use strict";

  // Throttle function for scroll events
  const throttle = (func, limit) => {
    let lastFunc, lastRan;
    return function() {
      const context = this, args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  };

  // Selector helper with caching
  const select = (el, all = false) => {
    el = el.trim();
    if (all) return [...document.querySelectorAll(el)];
    return document.querySelector(el);
  };

  // Event listener with passive handling
  const on = (type, el, listener, all = false) => {
    const elements = select(el, all);
    if (!elements.length) return;
    const options = ['touchstart', 'touchmove', 'wheel'].includes(type) ? { passive: true } : false;
    elements.forEach(e => e.addEventListener(type, listener, options));
  };

  // Mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Scroll handling
  const handleScroll = throttle(() => {
    // Header scroll class
    const header = select('#header');
    if (header) header.classList.toggle('header-scrolled', window.scrollY > 100);

    // Back to top button
    const backtotop = select('.back-to-top');
    if (backtotop) backtotop.classList.toggle('active', window.scrollY > 100);

    // Navbar links active state
    const navbarlinks = select('#navbar .scrollto', true);
    const scrollPos = window.scrollY + 200;
    
    navbarlinks.forEach(link => {
      if (!link.hash) return;
      const section = select(link.hash);
      if (!section) return;
      link.classList.toggle('active', 
        scrollPos >= section.offsetTop && 
        scrollPos <= (section.offsetTop + section.offsetHeight)
      );
    });
  }, 100);

  // Initialize scroll handlers
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('load', handleScroll);

  // Smooth scroll function
  const scrollto = (el) => {
    const element = select(el);
    if (!element) return;
    const header = select('#header');
    const offset = header.offsetHeight - (header.classList.contains('header-scrolled') ? 20 : 0);
    
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
  };

  // Mobile nav toggle
  on('click', '.mobile-nav-toggle', function(e) {
    const navbar = select('#navbar');
    navbar.classList.toggle('navbar-mobile');
    this.classList.toggle('bi-x');
    this.classList.toggle('bi-list');
  });

  // Mobile nav dropdowns
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault();
      this.nextElementSibling.classList.toggle('dropdown-active');
    }
  }, true);

  // Scrollto links
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault();
      const navbar = select('#navbar');
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile');
        const navbarToggle = select('.mobile-nav-toggle');
        navbarToggle.classList.toggle('bi-list');
        navbarToggle.classList.toggle('bi-x');
      }
      scrollto(this.hash);
    }
  }, true);

  // Hash link handling
  window.addEventListener('load', () => {
    if (window.location.hash && select(window.location.hash)) {
      scrollto(window.location.hash);
    }
  });

  // Portfolio initialization
  const initPortfolio = () => {
    const portfolioContainer = select('.portfolio-container');
    if (!portfolioContainer) return;

    new Isotope(portfolioContainer, {
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows',
      transitionDuration: isMobile ? '0s' : '0.5s'
    });

    const portfolioFilters = select('#portfolio-flters li', true);
    on('click', '#portfolio-flters li', function(e) {
      e.preventDefault();
      portfolioFilters.forEach(el => el.classList.remove('filter-active'));
      this.classList.add('filter-active');
      portfolioContainer.isotope({ filter: this.dataset.filter });
    }, true);
  };

  // Initialize GLightbox
  const lightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  // Initialize Swiper
  const initSwiper = () => {
    new Swiper('.portfolio-details-slider', {
      speed: 400,
      loop: !isMobile,
      autoplay: isMobile ? false : { delay: 5000 },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      }
    });
  };

  // Initialize AOS
  const initAOS = () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      disable: isMobile
    });
  };

  // Initialize PureCounter
  const initCounters = () => {
    new PureCounter();
  };

  // Load event handling
  window.addEventListener('load', () => {
    initPortfolio();
    initSwiper();
    initAOS();
    initCounters();
    
    // Delay non-critical animations
    if (!isMobile) {
      setTimeout(() => AOS.refresh(), 500);
    }
  });

  // Logo scroll handling
  const selectLogo = select('#logo');
  if (selectLogo) {
    const logoScrolled = () => {
      selectLogo.classList.toggle('logo-scrolled', window.scrollY > 100);
    };
    window.addEventListener('scroll', throttle(logoScrolled, 100));
    logoScrolled();
  }

  // Native smooth scroll fallback
  if ('scrollBehavior' in document.documentElement.style) {
    document.documentElement.style.scrollBehavior = 'smooth';
    window.addEventListener('beforeunload', () => {
      document.documentElement.style.scrollBehavior = 'auto';
    });
  }

})();