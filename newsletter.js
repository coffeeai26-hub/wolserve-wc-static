/* Newsletter archive: lists the editions in newsletters/newsletters.json */
(function () {
  const list = document.getElementById('newsletter-archive');
  if (!list || !window.fetch) return;

  fetch('newsletters/newsletters.json')
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error('not found'))))
    .then((items) => {
      if (!Array.isArray(items) || !items.length) return;
      const frag = document.createDocumentFragment();
      items.forEach((item) => {
        if (!item.file) return;
        const href = item.file;
        const li = document.createElement('li');
        li.className = 'archive-item';
        const copy = document.createElement('div');
        const h3 = document.createElement('h3');
        h3.textContent = item.title || 'Newsletter';
        const p = document.createElement('p');
        p.textContent = item.date || '';
        copy.append(h3, p);
        const actions = document.createElement('div');
        actions.className = 'archive-actions';
        const open = document.createElement('a');
        open.className = 'btn btn-primary';
        open.href = href;
        open.target = '_blank';
        open.rel = 'noopener';
        open.textContent = 'Open PDF';
        const dl = document.createElement('a');
        dl.className = 'btn btn-outline';
        dl.href = href;
        dl.setAttribute('download', '');
        dl.textContent = 'Download';
        actions.append(open, dl);
        li.append(copy, actions);
        frag.append(li);
      });
      list.replaceChildren(frag);
    })
    .catch(() => { /* keep the static list */ });
})();
