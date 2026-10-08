/* ═══════════════════════════════════════════════
   NEGRO PABLO — main.js
   ═══════════════════════════════════════════════ */

// Datos de contacto: cambia aquí y se actualiza todo el sitio.
const CONTACTO = {
  whatsapp: '56964067622', // código de país + número, sin "+" ni espacios
  instagram: 'negropablo',
  email: 'contacto@negropablo.cl',
};

const waLink = (mensaje) =>
  `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(mensaje)}`;

// Enlaces de WhatsApp, Instagram y email
document.querySelectorAll('[data-wa]').forEach((el) => {
  el.href = waLink(el.dataset.wa || 'Hola Pablo!');
  el.target = '_blank';
  el.rel = 'noopener';
});
document.querySelectorAll('[data-ig]').forEach((el) => {
  el.href = `https://instagram.com/${CONTACTO.instagram}`;
  el.target = '_blank';
  el.rel = 'noopener';
  if (el.hasAttribute('data-ig-text')) el.textContent = `@${CONTACTO.instagram}`;
});
document.querySelectorAll('[data-mail]').forEach((el) => {
  el.href = `mailto:${CONTACTO.email}`;
  if (el.hasAttribute('data-mail-text')) el.textContent = CONTACTO.email;
});
document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Navegación: fondo al hacer scroll + menú móvil
const nav = document.querySelector('.nav');
const burger = document.querySelector('.burger');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });
burger?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.nav-d a').forEach((a) =>
  a.addEventListener('click', () => nav.classList.remove('open'))
);

// Revelado al entrar en pantalla
const revealer = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    revealer.unobserve(e.target);
  }),
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.rev').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  revealer.observe(el);
});

// Narrativa: cada línea se "enciende" al llegar al centro
const storyLines = document.querySelectorAll('.story p');
if (storyLines.length) {
  const lighter = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.target.classList.toggle('lit', e.isIntersecting)),
    { rootMargin: '-35% 0px -35% 0px' }
  );
  storyLines.forEach((p) => lighter.observe(p));
}

// Contadores
const counter = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    counter.unobserve(e.target);
    const target = Number(e.target.dataset.count);
    const suffix = e.target.dataset.suffix || '';
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1400, 1);
      e.target.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }),
  { threshold: 0.6 }
);
document.querySelectorAll('[data-count]').forEach((el) => counter.observe(el));

// Videos: solo se reproducen mientras están visibles
const player = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) e.target.play().catch(() => {});
    else e.target.pause();
  }),
  { threshold: 0.25 }
);
document.querySelectorAll('video[data-auto]').forEach((v) => {
  v.muted = true;
  player.observe(v);
});

// Visor de video a pantalla completa
const lb = document.querySelector('.lb');
if (lb) {
  const lbVideo = lb.querySelector('video');
  const close = () => {
    lb.classList.remove('on');
    lbVideo.pause();
  };
  document.querySelectorAll('.clip[data-src]').forEach((clip) =>
    clip.addEventListener('click', () => {
      lbVideo.src = clip.dataset.src;
      lb.classList.add('on');
      lbVideo.play().catch(() => {});
    })
  );
  lb.querySelector('.lb-x').addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

// Filtros de la galería
document.querySelectorAll('.chips[data-filter]').forEach((group) => {
  const clips = document.querySelectorAll(group.dataset.filter);
  group.querySelectorAll('.chip').forEach((chip) =>
    chip.addEventListener('click', () => {
      group.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c === chip));
      const cat = chip.dataset.cat;
      clips.forEach((c) => c.classList.toggle('hide', cat !== 'todos' && c.dataset.cat !== cat));
    })
  );
});

// Formulario de contacto → mensaje de WhatsApp
const form = document.querySelector('#contactForm');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const lineas = [
    `Hola Pablo! Soy ${data.get('nombre')}.`,
    `Objetivo: ${data.get('objetivo')}`,
    `Modalidad: ${data.get('modalidad')}`,
    data.get('mensaje') ? `\n${data.get('mensaje')}` : '',
  ];
  window.open(waLink(lineas.join('\n').trim()), '_blank', 'noopener');
});
