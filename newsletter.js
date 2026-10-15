/* Renders the newsletter archive from newsletters/newsletters.json.
   Add an issue by uploading via admin/upload-newsletter.php (PHP host needed)
   or by committing the PDF and adding an entry {title, date: "YYYY-MM", file} to the JSON. */
(function () {
  const list = document.getElementById('archive-list');
  if (!list) return;

  function safePath(p) {
    return typeof p === 'string' && p && !/^[a-z][a-z0-9+.-]*:|^\/\/|\.\./i.test(p);
  }

  function label(issue) {
    if (issue.label) return issue.label;
    const m = /^(\d{4})-(\d{2})$/.exec(issue.date || '');
    if (!m) return '';
    return new Date(+m[1], +m[2] - 1, 1).toLocaleString('en-ZA', { month: 'long', year: 'numeric' });
  }

  fetch('newsletters/newsletters.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((data) => {
      const issues = (data.issues || []).filter((i) => safePath(i.file));
      if (!issues.length) return;
      issues.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
      list.textContent = '';
      issues.forEach((issue) => {
        const href = encodeURI(issue.file);
        const li = document.createElement('li');
        li.className = 'archive-item';
        const text = document.createElement('div');
        const h3 = document.createElement('h3');
        h3.textContent = issue.title || 'Newsletter';
        const p = document.createElement('p');
        p.textContent = label(issue);
        text.append(h3, p);
        const open = document.createElement('a');
        open.className = 'btn btn-outline';
        open.href = href;
        open.target = '_blank';
        open.rel = 'noopener';
        open.textContent = 'Open PDF';
        li.append(text, open);
        list.appendChild(li);
      });
    })
    .catch(() => { /* keep the static fallback entry */ });
})();
