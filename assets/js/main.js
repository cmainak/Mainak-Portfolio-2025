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
})();

/**
 * ===================================================================
 * NEW THEME TOGGLE SCRIPT (v7)
 * This new code runs separately and handles all pages.
 * ===================================================================
 */
document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Find all the elements ---
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  
  // --- Find elements that exist on ANY page ---
  const footer = document.getElementById('footer');

  // --- Find elements on index.html OR work.html ---
  const orbitTile = document.getElementById('project-orbit');
  const manageTile = document.getElementById('project-manage-wise');
  const orbitButton = orbitTile ? orbitTile.querySelector('a[style*="background: #fff"]') : null;
  const manageButton = manageTile ? manageTile.querySelector('a[style*="background: #fff"]') : null;
  const fwTitle = document.getElementById('featured-work-title'); // from index.html
  const fwLine = document.getElementById('featured-work-line'); // from index.html
  
  // ▼▼▼ ADDED FOR 'SMART TO-DO' TILE (from work.html) ▼▼▼
  const todoTile = document.getElementById('project-todo');
  const todoButtons = todoTile ? todoTile.querySelectorAll('a[style*="background: #fff"]') : [];

  // --- Find elements on about.html ---
  const aboutSection = document.getElementById('about');
  const aboutCard = document.getElementById('about-card');
  const aboutTitle = document.getElementById('about-title');
  const expTitle = document.getElementById('experience-title');
  const expLine = document.getElementById('experience-line');
  const toolsTitle = document.getElementById('tools-title');
  const toolsLine = document.getElementById('tools-line');

  // --- 2. Create the toggle function ---
  function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');

    if (currentTheme === 'dark') {
      // --- SWITCH TO LIGHT MODE ---
      htmlElement.removeAttribute('data-theme');
      
      // Change elements on ALL pages
      if (footer) footer.style.background = '#02437D';

      // Change elements ONLY on index.html/work.html
      if (orbitTile) {
        orbitTile.style.background = '#029444';
        orbitTile.style.color = '#fff';
      }
      if (manageTile) {
        manageTile.style.background = '#FFCD2A';
        manageTile.style.color = '#000';
      }
      if (orbitButton) {
        orbitButton.style.background = '#fff';
        orbitButton.style.color = '#111827';
      }
      if (manageButton) {
        manageButton.style.background = '#fff';
        manageButton.style.color = '#111827';
      }
      if (fwTitle) fwTitle.style.color = '#0f172a';
      if (fwLine) fwLine.style.background = '#0f172a';
      // ▼▼▼ ADDED FOR 'SMART TO-DO' TILE (from work.html) ▼▼▼
      if (todoTile) todoTile.style.background = '#111827'; // Stays dark
      todoButtons.forEach(btn => {
        btn.style.background = '#fff';
        btn.style.color = '#111827';
      });

      // Change elements ONLY on about.html
      if (aboutSection) {
         aboutSection.style.background = '#fff';
         aboutSection.style.color = '#1e293b';
      }
      if (aboutCard) aboutCard.style.background = '#ffffff';
      if (aboutTitle) aboutTitle.style.color = '#0f172a';
      if (expTitle) expTitle.style.color = '#0f172a';
      if (expLine) expLine.style.background = '#0f172a';
      if (toolsTitle) toolsTitle.style.color = '#0f172a';
      if (toolsLine) toolsLine.style.background = '#0f172a';


    } else {
      // --- SWITCH TO DARK MODE ---
      htmlElement.setAttribute('data-theme', 'dark');

      // Change elements on ALL pages
      if (footer) footer.style.background = '#012A52'; // Darker blue

      // Change elements ONLY on index.html/work.html
      if (orbitTile) {
        orbitTile.style.background = '#029444'; // Original Green
        orbitTile.style.color = '#fff'; // Original White Text
      }
      if (manageTile) {
        manageTile.style.background = '#FFCD2A'; // Original Yellow
        manageTile.style.color = '#000'; // Original Dark Text
      }
      if (orbitButton) {
        orbitButton.style.background = '#E0E0E0';
        orbitButton.style.color = '#121212';
      }
      if (manageButton) {
        manageButton.style.background = '#E0E0E0';
        manageButton.style.color = '#121212';
      }
      if (fwTitle) fwTitle.style.color = '#E0E0E0';
      if (fwLine) fwLine.style.background = '#E0E0E0';
      // ▼▼▼ ADDED FOR 'SMART TO-DO' TILE (from work.html) ▼▼▼
      if (todoTile) todoTile.style.background = '#111827'; // Stays dark
      todoButtons.forEach(btn => {
        btn.style.background = '#E0E0E0';
        btn.style.color = '#121212';
      });

      // Change elements ONLY on about.html
      if (aboutSection) {
        aboutSection.style.background = '#121212';
        aboutSection.style.color = '#C9D1D9';
      }
      if (aboutCard) aboutCard.style.background = '#1F1F1F'; // Dark card bg
      if (aboutTitle) aboutTitle.style.color = '#E0E0E0'; // Light text
      if (expTitle) expTitle.style.color = '#E0E0E0';
      if (expLine) expLine.style.background = '#E0E0E0';
      if (toolsTitle) toolsTitle.style.color = '#E0E0E0';
      if (toolsLine) toolsLine.style.background = '#E0E0E0';
    }
  }

  // --- 3. Add the click event listener ---
  if (themeToggle) { // Check if the button exists
    themeToggle.addEventListener('click', toggleTheme);
  }
});