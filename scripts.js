(function () {
  const body = document.body;

  // Mobile overlay menu toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileClose');

  function openMobile() {
    if (!mobileOverlay) return;
    mobileOverlay.classList.add('open');
    mobileOverlay.setAttribute('aria-hidden', 'false');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';
  }

  function closeMobile() {
    if (!mobileOverlay) return;
    mobileOverlay.classList.remove('open');
    mobileOverlay.setAttribute('aria-hidden', 'true');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobile);
  if (mobileClose) mobileClose.addEventListener('click', closeMobile);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobile();
  });

  document.addEventListener('click', (event) => {
    if (!mobileOverlay) return;
    if (mobileOverlay.classList.contains('open')) {
      const inner = mobileOverlay.querySelector('.overlay-inner');
      if (inner && !inner.contains(event.target) && !event.target.closest('#mobileToggle')) {
        closeMobile();
      }
    }
  });

  // Desktop dropdown accessibility
  document.querySelectorAll('.has-dropdown').forEach((wrap) => {
    const button = wrap.querySelector('.dropdown-toggle');
    const panel = wrap.querySelector('.dropdown-panel');
    if (!button || !panel) return;

    button.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        panel.querySelector('a')?.focus();
      }
      if (e.key === 'Escape') {
        button.focus();
      }
    });

    wrap.addEventListener('focusout', () => {
      setTimeout(() => {
        if (!wrap.contains(document.activeElement)) {
          panel.style.display = '';
          button.setAttribute('aria-expanded', 'false');
        }
      }, 10);
    });

    wrap.addEventListener('mouseenter', () => {
      panel.style.display = 'block';
      button.setAttribute('aria-expanded', 'true');
    });
    wrap.addEventListener('mouseleave', () => {
      panel.style.display = '';
      button.setAttribute('aria-expanded', 'false');
    });
  });

  // Gracefully handle broken/missing images
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', function () {
      const parent = this.parentElement;
      this.style.display = 'none';
      if (parent) {
        parent.classList.add('image-missing');
      }
    });
  });

  // Contact form success message
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      formSuccess.classList.add('visible');
      contactForm.reset();
    });
  }

  // Lightbox for gallery-style images
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

  function closeLightboxFn() {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = '';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.style.display = 'none';
    body.style.overflow = '';
  }

  document.querySelectorAll('.alive-image').forEach((img) => {
    img.addEventListener('click', () => openLightbox(img.src));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightboxFn);
  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightboxFn();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightboxFn();
  });
})();
