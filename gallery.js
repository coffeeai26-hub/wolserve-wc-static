(function () {
  const grid = document.getElementById('masonry-gallery');
  if (!grid) return;
  const base = 'images/masonry/';

  fetch(base + 'gallery.json')
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error('gallery.json not found'))))
    .then((items) => {
      if (!Array.isArray(items) || !items.length) return;
      grid.replaceChildren();
      items.forEach((item) => {
        const fig = document.createElement('figure');
        fig.className = 'gallery-item';
        const img = document.createElement('img');
        img.className = 'alive-image';
        img.loading = 'lazy';
        img.src = base + encodeURIComponent(item.src);
        img.alt = item.alt || item.caption || 'Stone masonry project';
        const cap = document.createElement('figcaption');
        cap.textContent = item.caption || '';
        fig.append(img, cap);
        grid.append(fig);
      });
    })
    .catch(() => { /* keep the static fallback markup */ });
})();
