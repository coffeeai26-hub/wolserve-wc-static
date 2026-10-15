/* Renders the completed stone masonry gallery from images/masonry/gallery.json.
   Add a photo: put the file in images/masonry/ and add {"file": "name.jpg", "caption": "...", "alt": "..."}.
   The section stays hidden until at least one photo is listed. */
(function () {
  const section = document.getElementById('masonry-gallery');
  const grid = document.getElementById('masonry-grid');
  if (!section || !grid) return;

  fetch('images/masonry/gallery.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((data) => {
      const photos = (data.photos || []).filter((p) => typeof p.file === 'string' && /^[\w][\w .()-]*$/.test(p.file));
      photos.forEach((photo) => {
        const fig = document.createElement('figure');
        fig.className = 'gallery-tile';
        const img = document.createElement('img');
        img.className = 'alive-image';
        img.loading = 'lazy';
        img.src = 'images/masonry/' + encodeURIComponent(photo.file);
        img.alt = photo.alt || photo.caption || 'Completed stone masonry project';
        img.addEventListener('error', () => fig.remove());
        img.addEventListener('click', () => {
          const lb = document.getElementById('lightbox');
          const lbImg = document.getElementById('lightbox-image');
          if (!lb || !lbImg) return;
          lbImg.src = img.src;
          lb.setAttribute('aria-hidden', 'false');
          lb.style.display = 'flex';
        });
        fig.appendChild(img);
        if (photo.caption) {
          const cap = document.createElement('figcaption');
          cap.textContent = photo.caption;
          fig.appendChild(cap);
        }
        grid.appendChild(fig);
      });
      if (photos.length) section.hidden = false;
    })
    .catch(() => {});
})();
