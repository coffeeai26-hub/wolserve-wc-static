/* Stone masonry gallery: renders images/masonry/gallery.json.
   The page ships with the same photos as static HTML, so the gallery still
   works when opened from disk (where fetch is blocked). */
(function () {
  const grid = document.getElementById('masonry-gallery');
  if (!grid || !window.fetch) return;

  fetch('images/masonry/gallery.json')
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error('gallery.json not found'))))
    .then((items) => {
      if (!Array.isArray(items) || !items.length) return;
      const frag = document.createDocumentFragment();
      items.forEach((item) => {
        const fig = document.createElement('figure');
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt || item.caption || 'Stone masonry project';
        img.className = 'alive-image';
        img.loading = 'lazy';
        fig.append(img);
        if (item.caption) {
          const cap = document.createElement('figcaption');
          cap.textContent = item.caption;
          fig.append(cap);
        }
        frag.append(fig);
      });
      grid.replaceChildren(frag);
    })
    .catch(() => { /* keep the static gallery */ });
})();
