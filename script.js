const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// Sticky nav state
const nav = $('#nav');
const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 10);
onScroll();
addEventListener('scroll', onScroll, { passive: true });

// Mobile menu
const burger = $('#burger');
const links = $('#navLinks');
burger.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
$$('a', links).forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open');
  burger.setAttribute('aria-expanded', false);
}));

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

// Count-up numbers
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, t0 = performance.now(), dur = 1400;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countIO.unobserve(el);
  });
}, { threshold: 0.6 });
$$('[data-count]').forEach(el => countIO.observe(el));

// Spotlight on cards
$$('.spot').forEach(card => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

// Hero mockup tilt following the cursor (desktop only)
const tilt = $('.tilt');
if (tilt && matchMedia('(hover:hover) and (min-width:1061px)').matches) {
  const hero = $('.hero');
  hero.addEventListener('pointermove', (e) => {
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    tilt.style.transform = `perspective(1200px) rotateY(${-9 + x * 5}deg) rotateX(${4 - y * 4}deg)`;
  });
  hero.addEventListener('pointerleave', () => { tilt.style.transform = ''; });
}

// Contact form: sends the inquiry via Web3Forms (delivered to the owner's inbox).
// The access key is public by design (it can only deliver to the owner's inbox).
// If the key is missing, the form falls back to opening the visitor's mail client.
const WEB3FORMS_KEY = '86e62abe-388c-42f1-b2c9-3ee7a39a5f54';
const TO = 'kontakt.gorodigital@gmail.com';
const form = $('#form');
const note = $('#formNote');
const submitBtn = $('button[type=submit]', form);
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  let ok = true;
  ['name', 'email', 'msg'].forEach(n => {
    const f = form.elements[n];
    const bad = !f.value.trim() || (n === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
    f.classList.toggle('invalid', bad);
    if (bad) ok = false;
  });
  if (!ok) { note.style.color = '#ff9aa5'; note.textContent = 'Vyplňte prosím jméno, platný e-mail a zprávu.'; return; }
  if (d.botcheck) return; // honeypot filled in: a bot
  const mailFallback = () => {
    const subject = encodeURIComponent(`Poptávka: ${d.type}`);
    const body = encodeURIComponent(`${d.msg}\n\n— ${d.name} (${d.email})`);
    location.href = `mailto:${TO}?subject=${subject}&body=${body}`;
    note.style.color = '#9ff0c0';
    note.textContent = 'Otevírám váš e-mail, stačí ho odeslat.';
  };
  if (WEB3FORMS_KEY.startsWith('PASTE_')) return mailFallback();

  submitBtn.disabled = true;
  note.style.color = 'rgba(255,255,255,.65)';
  note.textContent = 'Odesílám…';
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `Poptávka z webu: ${d.type}`,
        from_name: 'GoroDigital web',
        name: d.name,
        email: d.email,
        type: d.type,
        message: d.msg,
      }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    form.reset();
    note.style.color = '#9ff0c0';
    note.textContent = 'Díky! Zpráva je odeslána, ozvu se vám do 24 hodin.';
  } catch {
    note.style.color = '#ff9aa5';
    note.textContent = `Odeslání se nepovedlo. Napište mi prosím na ${TO} nebo zavolejte.`;
  } finally {
    submitBtn.disabled = false;
  }
});

$('#year').textContent = new Date().getFullYear();
