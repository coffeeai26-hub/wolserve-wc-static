(function () {
  const body = document.body;

  const menuTrigger = document.getElementById('menuTrigger');
  const mobileMenuPanel = document.getElementById('mobileMenuPanel');

  if (menuTrigger && mobileMenuPanel) {
    menuTrigger.addEventListener('click', () => {
      const isOpen = mobileMenuPanel.classList.contains('open');
      mobileMenuPanel.classList.toggle('open', !isOpen);
      menuTrigger.setAttribute('aria-expanded', String(!isOpen));
      mobileMenuPanel.setAttribute('aria-hidden', String(isOpen));
    });

    document.addEventListener('click', (event) => {
      if (!mobileMenuPanel.contains(event.target) && !menuTrigger.contains(event.target)) {
        mobileMenuPanel.classList.remove('open');
        menuTrigger.setAttribute('aria-expanded', 'false');
        mobileMenuPanel.setAttribute('aria-hidden', 'true');
      }
    });
  }

  const navToggle = document.getElementById('nav-toggle');
  const navToggleAbout = document.getElementById('nav-toggle-about');
  const navToggleServices = document.getElementById('nav-toggle-services');
  const navToggleNewsletter = document.getElementById('nav-toggle-newsletter');
  const navToggleContact = document.getElementById('nav-toggle-contact');

  const toggles = [navToggle, navToggleAbout, navToggleServices, navToggleNewsletter, navToggleContact];
  const navs = [
    document.getElementById('main-nav'),
    document.getElementById('main-nav-about'),
    document.getElementById('main-nav-services'),
    document.getElementById('main-nav-newsletter'),
    document.getElementById('main-nav-contact')
  ];

  toggles.forEach((toggle, idx) => {
    const nav = navs[idx];
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  });

  document.querySelectorAll('.submenu-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      const wrap = btn.closest('.submenu-wrap');
      wrap.classList.toggle('open', !open);
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src) {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = src;
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.style.display = 'flex';
    body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = '';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.style.display = 'none';
    body.style.overflow = '';
  }

  document.querySelectorAll('.alive-image').forEach((img) => {
    img.addEventListener('click', () => openLightbox(img.src));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    document.querySelectorAll('.hero-right img, .card-media img, .newsletter-image img, .tribute-image img, .flower-box img, .service-item img').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(800px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }
})();
