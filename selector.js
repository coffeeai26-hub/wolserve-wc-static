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
      { label: 'Daily or live-in care', r: 'match' },
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
    rn: { tag: 'Wolserve WC Homecare', title: 'Start with an RN-led care conversation.', text: "The nursing sister's home visit includes the client's care assessment, care planning and a home-safety assessment, considering mobility, access and suitable equipment.", who: 'corine', more: 'homecare.html' },
    match: { tag: 'Wolserve WC Homecare', title: "Let's match care to the person and home.", text: 'Wolserve WC Homecare can discuss daily, live-in or 24-hour support and help identify the safest, most practical arrangement for the family.', who: 'corine', more: 'homecare.html' },
    oversight: { tag: 'Wolserve WC Homecare', title: 'Strengthen care with nurse oversight.', text: 'A conversation with Corine can clarify the current care arrangement, reporting needs and the right rhythm of registered nurse monitoring.', who: 'corine', more: 'homecare.html' },
    good: { tag: 'Wolserve WC Homecare', title: 'Tell us what good support would look like.', text: 'Every home is different. Share the situation with Corine and Wolserve WC Homecare will help identify a respectful, practical next step.', who: 'corine', more: 'homecare.html' },
    review: { tag: 'Wolserve WC Consulting', title: 'Begin with a focused operational review.', text: 'Wolserve WC Consulting can assess current cleaning, hygiene and quality systems, identify priority gaps and recommend practical improvements.', who: 'corine', more: 'consulting.html' },
    docs: { tag: 'Wolserve WC Consulting', title: 'Turn standards into workable documents.', text: 'Wolserve WC Consulting can help develop or improve policies, SOPs, schedules and checklists that are clear enough to use every day.', who: 'corine', more: 'consulting.html' },
    practice: { tag: 'Wolserve WC Consulting', title: 'Build standards into daily practice.', text: 'Wolserve WC Consulting can shape practical on-the-job training and implementation support around your team, environment and priorities.', who: 'corine', more: 'consulting.html' },
    brief: { tag: 'Wolserve WC Consulting', title: 'Shape the brief with Corine.', text: 'Start with a conversation about the site, the challenge and the result you need. Wolserve WC Consulting can recommend a practical project scope.', who: 'corine', more: 'consulting.html' },
    repair: { tag: 'Wolserve Western Cape (Pty) Ltd Services', title: "Let's understand the repair or maintenance work needed.", text: 'Wolserve Western Cape (Pty) Ltd provides repairs, maintenance, inspection, cleaning and routine care of cleaning equipment. Discuss the equipment and the work needed with Izak.', who: 'izak', more: 'cleaning-equipment.html' },
    medequip: { tag: 'Wolserve Western Cape (Pty) Ltd Services', title: 'Discuss homecare medical equipment with Izak.', text: 'Wolserve Western Cape (Pty) Ltd provides homecare medical equipment sales and rental. Tell Izak what equipment you need and whether you prefer to buy or rent. Availability, pricing and arrangements will be confirmed before proceeding.', who: 'izak', more: 'medical-equipment.html' },
    stone: { tag: 'Wolserve Western Cape (Pty) Ltd Services', title: 'Discuss the stonework with Izak.', text: 'Wolserve Western Cape can assess natural-stone masonry, repairs to existing stonework and retaining-wall requirements before agreeing the practical scope.', who: 'izak', more: 'stone-masonry.html' },
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
    const back = el('button', 'selector-link', '← Back');
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

    const back = el('button', 'selector-link', '← Change answer');
    back.type = 'button';
    back.addEventListener('click', () => step2(q));
    root.append(back, el('p', 'selector-kicker', 'Your recommended next step'), el('p', 'selector-tag', r.tag), el('h2', '', r.title), el('p', '', r.text));
    const actions = el('div', 'selector-actions');

    const mail = el('a', 'btn btn-primary', 'Email ' + c.name);
    mail.href = 'mailto:' + c.email + '?subject=' + encodeURIComponent('Website enquiry: ' + o.label) + '&body=' + encodeURIComponent(note);
    const wa = el('a', 'btn btn-outline', 'Prepare WhatsApp');
    wa.href = 'https://wa.me/' + c.wa + '?text=' + encodeURIComponent(note);
    wa.target = '_blank';
    wa.rel = 'noopener';
    const call = el('a', 'btn btn-outline', 'Request a call');
    call.href = 'mailto:' + c.email + '?subject=' + encodeURIComponent('Call request: ' + o.label) + '&body=' + encodeURIComponent(note + ' Please call me back. My name and phone number: ');
    actions.append(mail, wa, call);
    root.append(actions);

    if (r.more) {
      const more = el('a', 'selector-learn', 'Learn more →');
      more.href = r.more;
      root.append(more);
    }

    const again = el('button', 'selector-link', 'Start again');
    again.type = 'button';
    again.addEventListener('click', step1);
    root.append(el('small', 'selector-foot', 'WhatsApp prepares a message for you to send. Callback requests open in your email app.'), again);
  }

  step1();
})();
