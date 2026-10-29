const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// Header gets a background once the page is scrolled
const nav = $('#nav');
const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 10);
onScroll();
addEventListener('scroll', onScroll, { passive: true });

// Mobile menu: closes on link, Esc, or a tap outside
const burger = $('#burger');
const links = $('#navLinks');
const setMenu = (open) => {
  links.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Zavřít menu' : 'Otevřít menu');
};
burger.addEventListener('click', () => setMenu(!links.classList.contains('open')));
$$('a', links).forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
document.addEventListener('click', (e) => {
  if (!links.contains(e.target) && !burger.contains(e.target)) setMenu(false);
});

// Scroll reveal (staggered within each parent)
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    io.unobserve(e.target);
  });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => {
  const sibs = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
  el.style.setProperty('--d', `${sibs.indexOf(el) * 0.09}s`);
  io.observe(el);
});

// Live previews: scale the 1280x800 demo iframes to fit their frame
const fitThumbs = () => $$('.thumb').forEach(t => {
  $('iframe', t).style.transform = `scale(${t.clientWidth / 1280})`;
});
fitThumbs();
addEventListener('resize', fitThumbs);

// Mobile call bar steps aside while the contact section is on screen
const callbar = $('#callbar');
new IntersectionObserver(([e]) => callbar.classList.toggle('is-hidden', e.isIntersecting), { threshold: 0.2 })
  .observe($('#kontakt'));

// Contact form
// Sent via Web3Forms to the owner's inbox. The access key is public by design:
// it can only deliver to that inbox.
const WEB3FORMS_KEY = '86e62abe-388c-42f1-b2c9-3ee7a39a5f54';
const MAIL = 'kontakt.gorodigital@gmail.com';
const PHONE = { text: '731 061 199', href: '+420731061199' };
const form = $('#form');
const note = $('#formNote');
const submitBtn = $('button[type=submit]', form);

// "Vybrat Start" etc. carry the chosen plan into the form
$$('[data-plan]').forEach(a => a.addEventListener('click', () => {
  form.elements.type.value = a.dataset.plan;
}));

const showError = (field, msg) => {
  const el = form.elements[field];
  el.setAttribute('aria-invalid', 'true');
  $(`#e-${field}`).textContent = msg;
};
const clearErrors = () => {
  ['name', 'email', 'phone', 'msg'].forEach(f => {
    form.elements[f].removeAttribute('aria-invalid');
    $(`#e-${f}`).textContent = '';
  });
  note.classList.remove('is-error');
  note.replaceChildren();
};

// Returns the first invalid field name, or null when the form is fine
const validate = () => {
  clearErrors();
  const v = (n) => form.elements[n].value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('email'));
  const phoneOk = v('phone').replace(/\D/g, '').length >= 9;
  const bad = [];
  if (!v('name')) { showError('name', 'Napište prosím své jméno.'); bad.push('name'); }
  if (!emailOk && !phoneOk) {
    if (v('email')) showError('email', 'E-mail má mít tvar jmeno@firma.cz. Nebo napište telefon.');
    else if (v('phone')) showError('phone', 'Telefon má mít alespoň 9 číslic. Nebo napište e-mail.');
    else showError('email', 'Napište e-mail nebo telefon, ať vás můžu kontaktovat.');
    bad.push(v('phone') && !v('email') ? 'phone' : 'email');
  }
  if (v('msg').length < 5) { showError('msg', 'Napište alespoň pár slov o tom, co potřebujete.'); bad.push('msg'); }
  return bad[0] || null;
};

const setNote = (text, isError = false) => {
  note.classList.toggle('is-error', isError);
  note.textContent = text;
};

const failureNote = () => {
  const mail = Object.assign(document.createElement('a'), { href: `mailto:${MAIL}`, textContent: MAIL });
  const tel = Object.assign(document.createElement('a'), { href: `tel:${PHONE.href}`, textContent: PHONE.text });
  note.classList.add('is-error');
  note.replaceChildren('Odeslání se nepovedlo. Napište mi prosím na ', mail, ' nebo zavolejte na ', tel, '.');
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const firstBad = validate();
  if (firstBad) {
    setNote('Zkontrolujte prosím označená pole.', true);
    form.elements[firstBad].focus();
    return;
  }

  // Honeypot: a hidden field only bots fill in. Pretend it worked, send nothing.
  if (form.elements.company_url.value) {
    form.reset();
    setNote('Díky! Zpráva je odeslána, ozvu se vám do 24 hodin.');
    return;
  }

  const val = (n) => form.elements[n].value.trim();
  const plan = form.elements.type.selectedOptions[0].text;
  const payload = {
    access_key: WEB3FORMS_KEY,
    subject: `Zpráva z webu: ${plan}`,
    from_name: 'GoroDigital web',
    name: val('name'),
    type: plan,
    message: val('msg'),
  };
  if (val('email')) payload.email = val('email');
  if (val('phone')) payload.phone = val('phone');

  submitBtn.disabled = true;
  setNote('Odesílám…');
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    form.reset();
    setNote('Díky! Zpráva je odeslána, ozvu se vám do 24 hodin.');
  } catch {
    failureNote();
  } finally {
    clearTimeout(timer);
    submitBtn.disabled = false;
    note.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});

$('#year').textContent = new Date().getFullYear();
