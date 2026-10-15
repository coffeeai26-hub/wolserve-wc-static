(function () {
  const root = document.getElementById('selector-body');
  if (!root) return;
  const progress = document.querySelectorAll('.selector-progress li');

  const CONTACTS = {
    corine: { name: 'Corine', email: 'Corine@wolservewc.co.za', wa: '27824691994' },
    izak: { name: 'Izak', email: 'izak@wolservewc.co.za', wa: '27824152234' }
  };

  const questions = [
    { key: 'family', label: 'An individual or family', options: [
      { label: 'A care assessment', r: 'rn' },
      { label: 'Daily or live-in care', r: 'rn' },
      { label: 'Nurse oversight', r: 'oversight' },
      { label: 'Something else', r: 'good' } ] },
    { key: 'org', label: 'An organisation or team', options: [
      { label: 'A quality or cleaning audit', r: 'review' },
      { label: 'Policies, SOPs or checklists', r: 'docs' },
      { label: 'Staff training and implementation', r: 'practice' },
      { label: 'A service-improvement project', r: 'brief' } ] },
    { key: 'equip', label: 'Equipment or masonry services', options: [
      { label: 'Cleaning equipment repairs, maintenance and inspection', r: 'repair' },
      { label: 'Sales/Rental of Homecare Medical Equipment', r: 'medequip' },
      { label: 'Stone masonry or retaining walls', r: 'stone' } ] },
    { key: 'unsure', label: "I'm not sure yet", options: [
      { label: 'Support for someone at home', r: 'rn' },
      { label: 'Better systems for a workplace', r: 'review' },
      { label: 'Cleaning equipment or masonry', r: 'repair' },
      { label: 'I would prefer to explain', r: 'short' } ] }
  ];

  const results = {
    rn: { tag: 'Wolserve WC Homecare', title: 'Start with an RN-led care conversation.', text: 'Sr Corine Goss, a registered nurse, will talk through the care needed and arrange an assessment.', who: 'corine' },
    oversight: { tag: 'Wolserve WC Homecare', title: 'Strengthen care with nurse oversight.', text: 'Registered-nurse oversight can support existing carers and keep the care plan current.', who: 'corine' },
    good: { tag: 'Wolserve WC Homecare', title: 'Tell us what good support would look like.', text: 'Send Corine a short description of the situation and she will suggest a sensible next step.', who: 'corine' },
    review: { tag: 'Wolserve WC Consulting', title: 'Begin with a focused operational review.', text: 'A quality or cleaning audit shows where standards are working and where they need attention.', who: 'corine' },
    docs: { tag: 'Wolserve WC Consulting', title: 'Turn standards into workable documents.', text: 'Policies, SOPs, schedules and checklists written for the way your team actually works.', who: 'corine' },
    practice: { tag: 'Wolserve WC Consulting', title: 'Build standards into daily practice.', text: 'Staff training and on-the-job implementation so standards are followed every day.', who: 'corine' },
    brief: { tag: 'Wolserve WC Consulting', title: 'Shape the brief with Corine.', text: 'Describe the service-improvement project and Corine will help define scope and priorities.', who: 'corine' },
    repair: { tag: 'Wolserve Western Cape (Pty) Ltd Services', title: "Let's understand the repair or maintenance work needed.", text: 'Tell Izak about the cleaning equipment and what needs repair, maintenance or inspection.', who: 'izak' },
    medequip: { tag: 'Wolserve Western Cape (Pty) Ltd Services', title: 'Discuss homecare medical equipment with Izak.', text: 'Izak can advise on sales or rental of suitable homecare medical equipment.', who: 'izak' },
    stone: { tag: 'Wolserve Western Cape (Pty) Ltd Services', title: 'Discuss the stonework with Izak.', text: 'Share the site and what you want built, such as stone masonry or retaining walls.', who: 'izak' },
    short: { tag: 'Wolserve WC', title: 'Start with a short conversation.', text: 'Send Corine a brief note and she will direct you to Wolserve WC Homecare, Wolserve WC Consulting or Izak for repairs and maintenance services.', who: 'corine' }
  };

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function setStep(n) {
    progress.forEach((li) => li.classList.toggle('active', Number(li.dataset.step) <= n));
  }

  function choice(label, onClick) {
    const b = el('button', 'selector-option', label);
    b.type = 'button';
    b.addEventListener('click', onClick);
    return b;
  }

  function step1() {
    setStep(1);
    root.replaceChildren();
    root.append(el('p', 'selector-kicker', 'Question 1 of 2'), el('h2', '', 'Who needs support?'));
    const list = el('div', 'selector-options');
    questions.forEach((q) => list.append(choice(q.label, () => step2(q))));
    root.append(list);
  }

  function step2(q) {
    setStep(2);
    root.replaceChildren();
    root.append(el('p', 'selector-kicker', 'Question 2 of 2'), el('h2', '', 'What do you need help with?'));
    const list = el('div', 'selector-options');
    q.options.forEach((o) => list.append(choice(o.label, () => step3(q, o))));
    root.append(list);
    const back = el('button', 'selector-link', 'Change my answer');
    back.type = 'button';
    back.addEventListener('click', step1);
    root.append(back);
  }

  function step3(q, o) {
    setStep(3);
    const r = results[o.r];
    const c = CONTACTS[r.who];
    const note = 'Hello ' + c.name + ', I need help with: ' + o.label + ' (' + q.label + ').';
    root.replaceChildren();
    root.append(el('p', 'selector-kicker', r.tag), el('h2', '', r.title), el('p', '', r.text));
    const actions = el('div', 'selector-actions');

    const mail = el('a', 'btn btn-primary', 'Email ' + c.name);
    mail.href = 'mailto:' + c.email + '?subject=' + encodeURIComponent('Website enquiry: ' + o.label) + '&body=' + encodeURIComponent(note);
    const wa = el('a', 'btn btn-outline', 'Prepare WhatsApp');
    wa.href = 'https://wa.me/' + c.wa + '?text=' + encodeURIComponent(note);
    wa.target = '_blank';
    wa.rel = 'noopener';
    const call = el('a', 'btn btn-outline', 'Request a call');
    call.href = '#callback';
    call.addEventListener('click', () => {
      const msg = document.getElementById('cb-message');
      if (msg && !msg.value) msg.value = note;
    });
    const again = el('button', 'selector-link', 'Start again');
    again.type = 'button';
    again.addEventListener('click', step1);
    actions.append(mail, wa, call);
    root.append(actions, el('small', 'selector-foot', 'WhatsApp prepares a message for you to send. Call requests use the callback form below.'), again);
    const back = el('button', 'selector-link', 'Change my answer');
    back.type = 'button';
    back.addEventListener('click', () => step2(q));
    root.append(back);
  }

  step1();
})();
