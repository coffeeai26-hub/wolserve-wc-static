(function () {
  const list = document.getElementById('newsletter-archive');
  if (!list) return;

  function pdfUrl(file) {
    return encodeURI(file);
  }

  fetch('newsletters/newsletters.json')
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error('newsletters.json not found'))))
    .then((items) => {
      if (!Array.isArray(items) || !items.length) {
        list.textContent = 'No newsletters have been published yet.';
        return;
      }
      list.replaceChildren();
      items.forEach((item) => {
        const row = document.createElement('article');
        row.className = 'archive-item';
        const text = document.createElement('div');
        const h = document.createElement('h3');
        h.textContent = item.title || 'Newsletter';
        const p = document.createElement('p');
        p.textContent = item.date || '';
        text.append(h, p);
        const a = document.createElement('a');
        a.className = 'btn btn-outline';
        a.href = pdfUrl(item.file || '');
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = 'Open PDF';
        row.append(text, a);
        list.append(row);
      });
    })
    .catch(() => {
      // Keep the static archive markup from newsletter.html when the JSON cannot be fetched.
    });
})();
