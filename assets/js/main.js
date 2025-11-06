/**
* Template Name: Regna - v4.9.1
* Template URL: https://bootstrapmade.com/regna-bootstrap-onepage-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    return all ? [...document.querySelectorAll(el)] : document.querySelector(el);
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    const selectEl = select(el, all);
    if (selectEl) {
      all ? selectEl.forEach(e => e.addEventListener(type, listener)) : selectEl.addEventListener(type, listener);
    }
  }

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener);
  }

  /**
   * Navbar links active state on scroll
   */
  const navbarlinks = select('#navbar .scrollto', true);
  const navbarlinksActive = () => {
    const position = window.scrollY + 200;
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return;
      const section = select(navbarlink.hash);
      if (!section) return;
      navbarlink.classList.toggle('active',
        position >= section.offsetTop &&
        position <= (section.offsetTop + section.offsetHeight));
    });
  }

  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    const header = select('#header');
    let offset = header.offsetHeight;
    if (!header.classList.contains('header-scrolled')) {
      offset -= 20;
    }
    const elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    });
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  const headerScrolled = () => {
    const selectHeader = select('#header');
    if (!selectHeader) return;
    selectHeader.classList.toggle('header-scrolled', window.scrollY > 100);
  }

  /**
   * Toggle .logo-scrolled class to #logo when page is scrolled
   */
  const logoScrolled = () => {
    const selectLogo = select('#logo');
    if (!selectLogo) return;
    selectLogo.classList.toggle('logo-scrolled', window.scrollY > 100);
  }

  /**
   * Back to top button
   */
  const toggleBacktotop = () => {
    const backtotop = select('.back-to-top');
    if (!backtotop) return;
    backtotop.classList.toggle('active', window.scrollY > 100);
  }

  onscroll(document, headerScrolled);
  onscroll(document, logoScrolled);
  onscroll(document, toggleBacktotop);

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function () {
    select('#navbar').classList.toggle('navbar-mobile');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  });

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function (e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault();
      this.nextElementSibling.classList.toggle('dropdown-active');
    }
  }, true);

  /**
   * Scroll with offset on .scrollto links
   */
  on('click', '.scrollto', function (e) {
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

  /**
   * Portfolio details slider init
   */
  const initSwiper = () => {
    new Swiper('.portfolio-details-slider', {
      speed: isMobile ? 300 : 300,
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
  }

  /**
   * Portfolio lightbox
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * On window load: consolidate everything
   */
  window.addEventListener('load', () => {
    navbarlinksActive();
    headerScrolled();
    logoScrolled();
    toggleBacktotop();

    if (window.location.hash && select(window.location.hash)) {
      scrollto(window.location.hash);
    }

    initSwiper();

    // Portfolio filtering with Isotope
    const portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      const portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      const portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function (e) {
        e.preventDefault();
        portfolioFilters.forEach(el => el.classList.remove('filter-active'));
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });

        portfolioIsotope.on('arrangeComplete', () => {
          AOS.refresh();
        });
      }, true);
    }

    // AOS animations
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      disable: isMobile
    });

    // PureCounter Init
    new PureCounter();
  });
  /**
 * Theme Toggle Dark/Light Mode
 * (With specific overrides for inline styles)
 */
document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Find all the elements ---
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  
  // Find the elements with inline styles
  const orbitTile = document.getElementById('project-orbit');
  const manageTile = document.getElementById('project-manage-wise');
  const footer = document.getElementById('footer');
  
  // Find the "View Case Study" buttons inside the tiles
  // We use querySelector to find the <a> tag with a specific inline style
  const orbitButton = document.querySelector('#project-orbit a[style*="background: #fff"]');
  const manageButton = document.querySelector('#project-manage-wise a[style*="background: #fff"]');

  // --- 2. Create the toggle function ---
  function toggleTheme() {
    // Check what the current theme is
    const currentTheme = htmlElement.getAttribute('data-theme');

    if (currentTheme === 'dark') {
      // --- SWITCH TO LIGHT MODE ---
      htmlElement.removeAttribute('data-theme');
      
      // Change inline styles back to light mode
      if (orbitTile) {
        orbitTile.style.background = '#029444';
        orbitTile.style.color = '#fff';
      }
      if (manageTile) {
        manageTile.style.background = '#FFCD2A';
        manageTile.style.color = '#000';
      }
      if (footer) {
        footer.style.background = '#02437D';
      }
      if (orbitButton) {
        orbitButton.style.background = '#fff';
        orbitButton.style.color = '#111827';
      }
       if (manageButton) {
        manageButton.style.background = '#fff';
        manageButton.style.color = '#111827';
      }

    } else {
      // --- SWITCH TO DARK MODE ---
      htmlElement.setAttribute('data-theme', 'dark');

      // Change inline styles to new dark mode colors
      if (orbitTile) {
        orbitTile.style.background = '#013D20'; // Darker green
        orbitTile.style.color = '#E0E0E0';
      }
      if (manageTile) {
        manageTile.style.background = '#4D3E00'; // Darker yellow/brown
        manageTile.style.color = '#E0E0E0';
      }
      if (footer) {
        footer.style.background = '#012A52'; // Darker blue
      }
      // Also change the "View Case Study" buttons
      if (orbitButton) {
        orbitButton.style.background = '#E0E0E0'; // Light gray
        orbitButton.style.color = '#121212';   // Dark text
      }
      if (manageButton) {
        manageButton.style.background = '#E0E0E0'; // Light gray
        manageButton.style.color = '#121212';   // Dark text
      }
    }
  }

  // --- 3. Add the click event listener ---
  if (themeToggle) { // Check if the button exists
    themeToggle.addEventListener('click', toggleTheme);
  }

});

})();
