(function () {
  "use strict";

  // Check if we are running in browser
  if (typeof window === "undefined" || typeof document === "undefined") return;

  // Add styles to head
  const style = document.createElement('style');
  style.id = 'capsule-navigation-styles';
  style.textContent = `
    /* ================= SCROLL PROGRESS BAR STYLES ================= */
    .scroll-progress-container {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 3px !important;
      background: transparent !important;
      z-index: 99999 !important;
      pointer-events: none !important;
    }

    .scroll-progress-bar {
      height: 100% !important;
      width: 0% !important;
      background: #C4956A !important; /* Premium AUNA Gold */
      box-shadow: 0 1px 10px rgba(196, 149, 106, 0.6) !important;
      transition: width 0.1s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }

    /* ================= CAPSULE NAVIGATION STYLES ================= */
    @media (min-width: 861px) {
      /* Reset standard nav styles if any */
      nav, #nav, nav#nav {
        all: unset;
        position: fixed !important;
        top: 24px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        width: 90% !important;
        max-width: 1040px !important;
        height: 64px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 0 18px 0 32px !important;
        border-radius: 99px !important;
        z-index: 1000 !important;
        box-shadow: 0 12px 36px rgba(15, 13, 10, 0.04) !important;
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
        font-family: 'Inter', sans-serif !important;
        box-sizing: border-box !important;
        pointer-events: auto !important;
      }

      /* Frosted Glass - Theme Specific Fallbacks */
      nav#nav, .capsule-nav-light {
        background: rgba(250, 250, 248, 0.8) !important;
        backdrop-filter: blur(20px) saturate(140%) !important;
        -webkit-backdrop-filter: blur(20px) saturate(140%) !important;
        border: 1px solid rgba(15, 13, 10, 0.08) !important;
      }

      /* Deep dark glass for pages with dark theme */
      body[style*="background: #0F0D0A"] nav#nav,
      body[style*="background:#0F0D0A"] nav#nav,
      body[class*="dark"] nav#nav,
      .capsule-nav-dark {
        background: rgba(15, 13, 10, 0.82) !important;
        backdrop-filter: blur(20px) saturate(140%) !important;
        -webkit-backdrop-filter: blur(20px) saturate(140%) !important;
        border: 1px solid rgba(232, 229, 219, 0.09) !important;
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.35) !important;
      }

      /* Compact mode on scroll */
      nav#nav.scrolled {
        top: 14px !important;
        height: 56px !important;
        background: rgba(250, 250, 248, 0.92) !important;
        box-shadow: 0 16px 40px rgba(15, 13, 10, 0.07) !important;
      }

      body[style*="background: #0F0D0A"] nav#nav.scrolled,
      body[style*="background:#0F0D0A"] nav#nav.scrolled,
      body[class*="dark"] nav#nav.scrolled {
        background: rgba(15, 13, 10, 0.92) !important;
        box-shadow: 0 20px 48px rgba(0, 0, 0, 0.45) !important;
      }

      /* Wordmark logo */
      nav#nav .wordmark {
        font-family: 'Fraunces', serif !important;
        font-weight: 500 !important;
        font-size: 21px !important;
        letter-spacing: 0.04em !important;
        text-decoration: none !important;
        transition: color 0.3s ease !important;
        display: block !important;
      }

      nav#nav, nav#nav a {
        color: #0F0D0A !important;
      }

      body[style*="background: #0F0D0A"] nav#nav,
      body[style*="background: #0F0D0A"] nav#nav a,
      body[style*="background:#0F0D0A"] nav#nav,
      body[style*="background:#0F0D0A"] nav#nav a,
      body[class*="dark"] nav#nav,
      body[class*="dark"] nav#nav a {
        color: #E8E5DB !important;
      }

      /* Links container */
      nav#nav .nav-links {
        display: flex !important;
        gap: 28px !important;
        font-size: 13.5px !important;
        font-weight: 500 !important;
        align-items: center !important;
      }

      nav#nav .nav-links a {
        text-decoration: none !important;
        position: relative !important;
        opacity: 0.7 !important;
        transition: opacity 0.3s ease, color 0.3s ease !important;
        padding: 8px 0 !important;
      }

      nav#nav .nav-links a:hover, nav#nav .nav-links a.active {
        opacity: 1 !important;
      }

      nav#nav .nav-links a::after {
        content: '' !important;
        position: absolute !important;
        bottom: 2px !important;
        left: 0 !important;
        width: 100% !important;
        height: 1.5px !important;
        background: #C4956A !important; /* Gold accent */
        transform: scaleX(0) !important;
        transform-origin: right !important;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }

      nav#nav .nav-links a:hover::after, nav#nav .nav-links a.active::after {
        transform: scaleX(1) !important;
        transform-origin: left !important;
      }

      /* Right actions container */
      nav#nav .nav-right-container {
        display: flex !important;
        align-items: center !important;
        gap: 20px !important;
      }

      nav#nav .nav-time {
        font-family: 'JetBrains Mono', monospace !important;
        font-size: 11.5px !important;
        letter-spacing: 0.1em !important;
        opacity: 0.6 !important;
      }

      /* Premium Pill Button inside Nav */
      nav#nav .btn-nav {
        font-family: 'Inter', sans-serif !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        letter-spacing: 0.02em !important;
        color: #fff !important;
        background: #C4956A !important;
        border: none !important;
        padding: 10px 22px !important;
        border-radius: 99px !important;
        text-decoration: none !important;
        cursor: pointer !important;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        box-shadow: 0 4px 14px rgba(196, 149, 106, 0.2) !important;
      }

      body[style*="background: #0F0D0A"] nav#nav .btn-nav,
      body[style*="background:#0F0D0A"] nav#nav .btn-nav,
      body[class*="dark"] nav#nav .btn-nav {
        color: #0F0D0A !important;
        background: #E8E5DB !important;
        box-shadow: 0 4px 14px rgba(232, 229, 219, 0.15) !important;
      }

      nav#nav .btn-nav:hover {
        transform: translateY(-1.5px) !important;
        box-shadow: 0 6px 20px rgba(196, 149, 106, 0.35) !important;
      }

      body[style*="background: #0F0D0A"] nav#nav .btn-nav:hover,
      body[style*="background:#0F0D0A"] nav#nav .btn-nav:hover,
      body[class*="dark"] nav#nav .btn-nav:hover {
        box-shadow: 0 6px 20px rgba(232, 229, 219, 0.35) !important;
        background: #fff !important;
      }

      /* Hide standard hamburger and backup links */
      .hamburger-btn, .preorder-btn {
        display: none !important;
      }
    }

    /* ================= MOBILE BOTTOM NAVIGATION ================= */
    @media (max-width: 860px) {
      /* Hide standard top header nav */
      nav, #nav, nav#nav {
        display: none !important;
      }

      .mobile-bottom-nav {
        position: fixed !important;
        bottom: 24px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        width: calc(100% - 32px) !important;
        max-width: 420px !important;
        background: rgba(15, 13, 10, 0.94) !important;
        backdrop-filter: blur(20px) saturate(140%) !important;
        -webkit-backdrop-filter: blur(20px) saturate(140%) !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        border-radius: 99px !important;
        padding: 8px 16px !important;
        display: flex !important;
        justify-content: space-around !important;
        align-items: center !important;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4) !important;
        z-index: 2000 !important;
        box-sizing: border-box !important;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease !important;
      }

      .mobile-bottom-nav.nav-hidden {
        transform: translate(-50%, 100px) !important;
        opacity: 0;
      }

      .mobile-nav-item {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 3px !important;
        color: rgba(255, 255, 255, 0.5) !important;
        font-size: 9.5px !important;
        font-family: 'Inter', sans-serif !important;
        font-weight: 500 !important;
        letter-spacing: 0.04em !important;
        text-transform: uppercase !important;
        text-decoration: none !important;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
        padding: 6px 12px !important;
        border-radius: 24px !important;
      }

      .mobile-nav-item svg {
        width: 19px !important;
        height: 19px !important;
        stroke: currentColor !important;
        stroke-width: 1.8 !important;
        fill: none !important;
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }

      .mobile-nav-item:active, .mobile-nav-item.active {
        color: #C4956A !important; /* Premium Gold */
      }

      .mobile-nav-item.active svg {
        transform: translateY(-2px) scale(1.1) !important;
      }
    }

    /* ================= PRECISION INTERACTIVE SPECS & MODAL STYLES ================= */
    #precision .spec {
      cursor: pointer !important;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
      position: relative !important;
    }
    #precision .spec::after {
      content: '+' !important;
      position: absolute !important;
      top: 14px !important;
      right: 0 !important;
      font-family: var(--mono), monospace !important;
      font-size: 14px !important;
      color: var(--accent) !important;
      opacity: 0 !important;
      transition: transform 0.3s ease, opacity 0.3s ease !important;
      transform: translateY(2px) !important;
    }
    #precision .spec:hover {
      border-top-color: var(--accent) !important;
      padding-left: 6px !important;
    }
    #precision .spec:hover::after {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    /* Modal Overlay */
    .spec-modal-overlay {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100vh !important;
      background: rgba(10, 9, 8, 0.85) !important;
      backdrop-filter: blur(12px) !important;
      -webkit-backdrop-filter: blur(12px) !important;
      z-index: 100000 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      opacity: 0 !important;
      pointer-events: none !important;
      transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
      padding: 20px !important;
    }
    .spec-modal-overlay.active {
      opacity: 1 !important;
      pointer-events: auto !important;
    }

    /* Modal Box */
    .spec-modal-box {
      background: #11100e !important;
      border: 1px solid rgba(196, 149, 106, 0.2) !important;
      border-radius: 16px !important;
      width: 100% !important;
      max-width: 500px !important;
      padding: 40px !important;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5) !important;
      position: relative !important;
      transform: scale(0.9) translateY(20px) !important;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
      color: #f7f6f5 !important;
    }
    .spec-modal-overlay.active .spec-modal-box {
      transform: scale(1) translateY(0) !important;
    }

    /* Close Button */
    .spec-modal-close {
      position: absolute !important;
      top: 24px !important;
      right: 24px !important;
      background: none !important;
      border: none !important;
      cursor: pointer !important;
      padding: 8px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      color: rgba(255, 255, 255, 0.4) !important;
      transition: all 0.3s ease !important;
    }
    .spec-modal-close:hover {
      color: var(--accent) !important;
      transform: rotate(90deg) !important;
    }
    .spec-modal-close svg {
      width: 16px !important;
      height: 16px !important;
      stroke: currentColor !important;
      stroke-width: 2 !important;
      fill: none !important;
    }

    /* Modal Content */
    .spec-modal-eyebrow {
      font-family: var(--mono), monospace !important;
      font-size: 11px !important;
      letter-spacing: 0.1em !important;
      text-transform: uppercase !important;
      color: var(--accent) !important;
      margin-bottom: 12px !important;
    }
    .spec-modal-title {
      font-family: var(--serif), serif !important;
      font-size: 28px !important;
      font-weight: 400 !important;
      line-height: 1.2 !important;
      margin-bottom: 16px !important;
      color: #ffffff !important;
    }
    .spec-modal-value {
      font-family: var(--mono), monospace !important;
      font-size: 36px !important;
      font-weight: 500 !important;
      color: var(--accent) !important;
      margin-bottom: 24px !important;
      padding-bottom: 16px !important;
      border-bottom: 1px solid rgba(196, 149, 106, 0.15) !important;
    }
    .spec-modal-description {
      font-size: 14.5px !important;
      line-height: 1.8 !important;
      color: rgba(255, 255, 255, 0.7) !important;
      margin-bottom: 24px !important;
    }

    /* Decorative SVG Gauge */
    .spec-modal-graphic {
      width: 100% !important;
      height: 60px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin-top: 24px !important;
      opacity: 0.4 !important;
    }
  `;
  document.head.appendChild(style);

  // Handle active class detection
  function getActiveRoute() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('about')) return 'about';
    if (path.includes('collections')) return 'collections';
    if (path.includes('contact')) return 'contact';
    if (path.includes('craftsmanship')) return 'craftsmanship';
    if (path.includes('heritage')) return 'heritage';
    if (path.includes('technology')) return 'technology';
    if (path.includes('meridian')) return 'collections'; // Nest under collections
    return 'index';
  }

  const activeRoute = getActiveRoute();

  // Create or rewrite navigation structure
  function initNavigation() {
    let navElement = document.getElementById('nav');
    
    // Fallback if element doesn't exist
    if (!navElement) {
      navElement = document.createElement('nav');
      navElement.id = 'nav';
      document.body.prepend(navElement);
    }

    // Clean out previous nodes
    navElement.innerHTML = '';
    navElement.className = 'capsule-nav';

    // Inject Desktop elements
    const logoLink = document.createElement('a');
    logoLink.href = 'index.html';
    logoLink.className = 'wordmark';
    logoLink.textContent = 'AUNA';
    navElement.appendChild(logoLink);

    const linksContainer = document.createElement('div');
    linksContainer.className = 'nav-links';
    
    const menuItems = [
      { name: 'Home', url: 'index.html', route: 'index' },
      { name: 'Collections', url: 'collections.html', route: 'collections' },
      { name: 'Heritage', url: 'heritage.html', route: 'heritage' },
      { name: 'Craftsmanship', url: 'craftsmanship.html', route: 'craftsmanship' },
      { name: 'Technology', url: 'technology.html', route: 'technology' },
      { name: 'Contact', url: 'contact.html', route: 'contact' }
    ];

    menuItems.forEach(item => {
      const a = document.createElement('a');
      a.href = item.url;
      a.textContent = item.name;
      if (activeRoute === item.route) {
        a.className = 'active';
      }
      linksContainer.appendChild(a);
    });
    navElement.appendChild(linksContainer);

    const rightContainer = document.createElement('div');
    rightContainer.className = 'nav-right-container';

    const timeReadout = document.createElement('div');
    timeReadout.className = 'nav-time';
    timeReadout.id = 'navTimeDynamic';
    timeReadout.textContent = '—:—:— LOCAL';
    rightContainer.appendChild(timeReadout);

    const preorderBtn = document.createElement('a');
    preorderBtn.href = 'collections.html';
    preorderBtn.className = 'btn-nav';
    preorderBtn.innerHTML = '<span>Explore</span>';
    rightContainer.appendChild(preorderBtn);

    navElement.appendChild(rightContainer);

    // Create Mobile Bottom Navigation
    const mobileBottomNav = document.createElement('div');
    mobileBottomNav.className = 'mobile-bottom-nav';
    mobileBottomNav.id = 'mobileBottomNav';
    mobileBottomNav.innerHTML = `
      <a href="index.html" class="mobile-nav-item ${activeRoute === 'index' ? 'active' : ''}">
        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10"/></svg>
        <span>Home</span>
      </a>
      <a href="collections.html" class="mobile-nav-item ${activeRoute === 'collections' ? 'active' : ''}">
        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
        <span>Catalog</span>
      </a>
      <a href="heritage.html" class="mobile-nav-item ${activeRoute === 'heritage' ? 'active' : ''}">
        <svg viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <span>Heritage</span>
      </a>
      <a href="craftsmanship.html" class="mobile-nav-item ${activeRoute === 'craftsmanship' ? 'active' : ''}">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        <span>Craft</span>
      </a>
      <a href="contact.html" class="mobile-nav-item ${activeRoute === 'contact' ? 'active' : ''}">
        <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        <span>Contact</span>
      </a>
    `;
    document.body.appendChild(mobileBottomNav);

    // Create Scroll Progress Bar
    let progressContainer = document.getElementById('scrollProgressContainer');
    if (!progressContainer) {
      progressContainer = document.createElement('div');
      progressContainer.id = 'scrollProgressContainer';
      progressContainer.className = 'scroll-progress-container';
      progressContainer.innerHTML = '<div id="scrollProgressBar" class="scroll-progress-bar"></div>';
      document.body.appendChild(progressContainer);
    }

    // Scroll handlers
    let lastScrollY = window.scrollY;

    function updateScrollProgress() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      const progressBar = document.getElementById('scrollProgressBar');
      if (progressBar) {
        progressBar.style.width = progress + '%';
      }
    }

    window.addEventListener('scroll', () => {
      // Toggle sticky scrolled state for top nav
      navElement.classList.toggle('scrolled', window.scrollY > 40);

      // Hide bottom mobile nav on scroll down, show on scroll up
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        mobileBottomNav.classList.add('nav-hidden');
      } else {
        mobileBottomNav.classList.remove('nav-hidden');
      }
      lastScrollY = currentScrollY;

      // Update scroll progress bar
      updateScrollProgress();
    }, { passive: true });

    // Initial progress update on load
    updateScrollProgress();

    // Live clock updater
    function updateClock() {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      const text = `${hh}:${mm}:${ss} LOCAL`;
      
      const el = document.getElementById('navTimeDynamic');
      if (el) el.textContent = text;
      
      // Update any standard navTime element too for compatibility
      const oldTime = document.getElementById('navTime');
      if (oldTime) oldTime.textContent = text;
    }

    // Create Precision Specs Modal Elements
    let specModalOverlay = document.getElementById('specModalOverlay');
    if (!specModalOverlay) {
      specModalOverlay = document.createElement('div');
      specModalOverlay.id = 'specModalOverlay';
      specModalOverlay.className = 'spec-modal-overlay';
      specModalOverlay.innerHTML = `
        <div class="spec-modal-box">
          <button class="spec-modal-close" aria-label="Close modal">
            <svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <div class="spec-modal-eyebrow">Technical Specification</div>
          <div class="spec-modal-title" id="specModalTitle">Specification</div>
          <div class="spec-modal-value" id="specModalValue">00</div>
          <div class="spec-modal-description" id="specModalDescription">Deeper technical context...</div>
          <div class="spec-modal-graphic" id="specModalGraphic"></div>
        </div>
      `;
      document.body.appendChild(specModalOverlay);

      // Event listeners to close
      const closeBtn = specModalOverlay.querySelector('.spec-modal-close');
      closeBtn.addEventListener('click', () => {
        specModalOverlay.classList.remove('active');
      });
      specModalOverlay.addEventListener('click', (e) => {
        if (e.target === specModalOverlay) {
          specModalOverlay.classList.remove('active');
        }
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && specModalOverlay.classList.contains('active')) {
          specModalOverlay.classList.remove('active');
        }
      });
    }

    // Specification Details Data
    const specDetails = {
      'case diameter': {
        title: 'Case Diameter',
        description: "Engineered for versatile ergonomics, our 40mm case diameter profile offers an optimal presence on the wrist. Designed to seamlessly balance classic proportions with modern wearability, it sits comfortably under a dress shirt cuff while maintaining a commanding, refined stance. The lug-to-lug distance is calculated to ensure the strap contours naturally around any wrist size.",
        svg: `<svg viewBox="0 0 100 24" fill="none" stroke="#C4956A" stroke-width="1.2" style="width: 120px; height: 30px;"><circle cx="50" cy="12" r="10" stroke-dasharray="2 2"/><line x1="20" y1="12" x2="35" y2="12"/><line x1="65" y1="12" x2="80" y2="12"/><path d="M20 9v6M80 9v6"/><line x1="35" y1="12" x2="38" y2="9"/><line x1="35" y1="12" x2="38" y2="15"/><line x1="65" y1="12" x2="62" y2="9"/><line x1="65" y1="12" x2="62" y2="15"/></svg>`
      },
      'case thickness': {
        title: 'Case Thickness',
        description: "Achieving a slim 11.8mm thickness while housing a full self-winding mechanical rotor requires precise spatial engineering. Our custom case construction integrates the bezel, central frame, and exhibition caseback in a cohesive, low-profile architecture. Every fraction of a millimeter has been optimized to offer a luxurious, flush feel without compromising on structural integrity or shock-absorption capabilities.",
        svg: `<svg viewBox="0 0 100 24" fill="none" stroke="#C4956A" stroke-width="1.2" style="width: 120px; height: 30px;"><rect x="42" y="5" width="16" height="14" rx="2"/><line x1="25" y1="5" x2="75" y2="5" stroke-dasharray="3 3"/><line x1="25" y1="19" x2="75" y2="19" stroke-dasharray="3 3"/><line x1="30" y1="5" x2="30" y2="19"/><path d="M27 8l3-3 3 3M27 16l3 3 3-3"/></svg>`
      },
      'water resistance': {
        title: 'Water Resistance',
        description: "Rated to 10 atmospheres, our watches are designed to withstand 100 meters of water pressure. This rating is achieved through advanced custom synthetic gaskets, a double-O-ring crown sealing system, and a securely threaded exhibition caseback. It ensures complete protection against splashes, swimming, and recreational snorkeling, merging technical sports watch capability with dress watch elegance.",
        svg: `<svg viewBox="0 0 100 24" fill="none" stroke="#C4956A" stroke-width="1.2" style="width: 120px; height: 30px;"><path d="M10 12q10 -5 20 0 t20 0 t20 0 t20 0" stroke-dasharray="2 2"/><path d="M10 16q10 -5 20 0 t20 0 t20 0 t20 0"/></svg>`
      },
      'accuracy': {
        title: 'Chronometric Accuracy',
        description: "Each movement is carefully adjusted in five positions and temperature ranges to ensure chronometer-grade precision of ±2 seconds per day. This exceeds standard mechanical movement tolerances. A high-quality balance wheel and a thermal-treated hairspring work in unison to resist environmental influences, ensuring your timepiece remains impeccably precise.",
        svg: `<svg viewBox="0 0 100 24" fill="none" stroke="#C4956A" stroke-width="1.2" style="width: 120px; height: 30px;"><circle cx="50" cy="12" r="10"/><path d="M50 5v14M41 12h18"/><circle cx="50" cy="12" r="2" fill="#C4956A"/></svg>`
      },
      'front & back crystal': {
        title: 'Sapphire Crystal',
        description: "Both the front dial glass and the exhibition caseback display are cut from premium, scratch-resistant synthetic sapphire crystal. Grown under high-temperature conditions and rated 9 on the Mohs hardness scale (second only to diamond), it features a multi-layer inner anti-reflective (AR) coating. This ensures absolute clarity, minimizing glare and revealing the detailed mechanical ballet inside.",
        svg: `<svg viewBox="0 0 100 24" fill="none" stroke="#C4956A" stroke-width="1.2" style="width: 120px; height: 30px;"><path d="M35 12 L50 4 L65 12 L50 20 Z"/><line x1="35" y1="12" x2="65" y2="12"/><line x1="50" y1="4" x2="50" y2="20"/></svg>`
      },
      'crystal': {
        title: 'Sapphire Crystal',
        description: "Both the front dial glass and the exhibition caseback display are cut from premium, scratch-resistant synthetic sapphire crystal. Grown under high-temperature conditions and rated 9 on the Mohs hardness scale (second only to diamond), it features a multi-layer inner anti-reflective (AR) coating. This ensures absolute clarity, minimizing glare and revealing the detailed mechanical ballet inside.",
        svg: `<svg viewBox="0 0 100 24" fill="none" stroke="#C4956A" stroke-width="1.2" style="width: 120px; height: 30px;"><path d="M35 12 L50 4 L65 12 L50 20 Z"/><line x1="35" y1="12" x2="65" y2="12"/><line x1="50" y1="4" x2="50" y2="20"/></svg>`
      },
      'power reserve': {
        title: 'Power Reserve',
        description: "Powered by a high-efficiency mainspring housed within an optimized barrel, the automatic movement delivers a reliable 42-hour power reserve. Whether powered by the natural motion of your wrist or wound manually via the tactile crown, the mainspring maintains a consistent torque output to ensure accuracy throughout the entire wind cycle.",
        svg: `<svg viewBox="0 0 100 24" fill="none" stroke="#C4956A" stroke-width="1.2" style="width: 120px; height: 30px;"><path d="M30 17 A15 15 0 1 1 70 17" stroke-dasharray="2 2"/><path d="M30 17 A15 15 0 0 1 65 8"/><path d="M60 8 l7 0 l-3 6"/></svg>`
      }
    };

    // Attach click listeners to any spec inside #precision
    function setupPrecisionModal() {
      const precisionSection = document.getElementById('precision');
      if (!precisionSection) return;

      const specElements = precisionSection.querySelectorAll('.spec');
      specElements.forEach(spec => {
        spec.addEventListener('click', () => {
          const bEl = spec.querySelector('b');
          const spanEl = spec.querySelector('span');
          if (!bEl || !spanEl) return;

          const rawValue = bEl.textContent;
          const rawLabel = spanEl.textContent.trim();
          const key = rawLabel.toLowerCase();

          const info = specDetails[key] || {
            title: rawLabel,
            description: `This technical specification is part of AUNA's commitment to high-performance horology. Every element of the watch is designed, assembled, and calibrated to meet rigorous quality control standards, ensuring maximum comfort, longevity, and reliable performance on a daily basis.`,
            svg: `<svg viewBox="0 0 100 24" fill="none" stroke="#C4956A" stroke-width="1.2" style="width: 120px; height: 30px;"><circle cx="50" cy="12" r="8" stroke-dasharray="2 2"/></svg>`
          };

          const modalTitle = document.getElementById('specModalTitle');
          const modalValue = document.getElementById('specModalValue');
          const modalDesc = document.getElementById('specModalDescription');
          const modalGraphic = document.getElementById('specModalGraphic');

          if (modalTitle) modalTitle.textContent = info.title;
          if (modalValue) modalValue.textContent = rawValue;
          if (modalDesc) modalDesc.textContent = info.description;
          if (modalGraphic) modalGraphic.innerHTML = info.svg || '';

          specModalOverlay.classList.add('active');
        });
      });
    }

    // Initial setup
    setupPrecisionModal();

    updateClock();
    setInterval(updateClock, 1000);
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
})();
