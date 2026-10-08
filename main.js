/* ═══════════════════════════════════════════════
   NEGRO PABLO — main.js
   ═══════════════════════════════════════════════ */

// Datos de contacto: cambia aquí y se actualiza todo el sitio.
const CONTACTO = {
  whatsapp: '56964067622', // código de país + número, sin "+" ni espacios
  instagram: 'negropablo',
  email: 'contacto@negropablo.cl',
};

// Precios mensuales en CLP según veces por semana. Cambia aquí y se actualiza
// la página de planes y el asistente.
const PRECIOS = {
  online: { nombre: 'Online', 2: 59000, 3: 69000 },
  hibrido: { nombre: 'Híbrido', 2: 99000, 3: 129000 },
  presencial: { nombre: 'Presencial 1:1', 2: 190000, 3: 270000 },
};
// Descuento sobre el valor mensual al pagar el período completo.
const PERIODOS = {
  mensual: { nombre: 'mensual', meses: 1, descuento: 0 },
  trimestral: { nombre: 'trimestral', meses: 3, descuento: 0.05 },
  semestral: { nombre: 'semestral', meses: 6, descuento: 0.1 },
};

const clp = (n) => `$${(Math.round(n / 10) * 10).toLocaleString("es-CL")}`;
const precioMes = (plan, veces, periodo = 'mensual') =>
  PRECIOS[plan][veces] * (1 - PERIODOS[periodo].descuento);

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
const hayPortada = !!document.querySelector('.hero');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
  // En la portada el botón del asistente se esconde: ya hay uno en el hero.
  document.body.classList.toggle('en-portada', hayPortada && window.scrollY < 260);
};
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

// Camino tipo Duolingo (GSAP + ScrollTrigger): la sección queda fija, el marcador
// recorre la ruta, cada checkpoint se enciende con su frase y al final la meta
// se abre como popup con Pablo. Sin GSAP o con movimiento reducido queda todo visible.
const animarCamino = () => {
  const camino = document.querySelector('.camino');
  if (!camino || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const mapa = camino.querySelector('.camino-mapa');
  const ruta = camino.querySelector('.camino-trazo');
  const yo = camino.querySelector('.camino-yo');
  const nodos = [...camino.querySelectorAll('.camino-nodo')];
  const burbujas = [...camino.querySelectorAll('.burbuja')];
  const meta = camino.querySelector('.camino-meta');
  const popup = camino.querySelector('.popup-in');
  const velo = camino.querySelector('.camino-velo');
  const fondo = camino.querySelector('.camino-fondo');
  const largo = ruta.getTotalLength();

  // Fracción de la ruta donde cae cada checkpoint (coordenadas del viewBox 400×800).
  const fraccionEn = (x, y) => {
    let mejor = 0;
    let distancia = Infinity;
    for (let i = 0; i <= 400; i++) {
      const p = ruta.getPointAtLength((largo * i) / 400);
      const d = (p.x - x) ** 2 + (p.y - y) ** 2;
      if (d < distancia) { distancia = d; mejor = i / 400; }
    }
    return mejor;
  };
  const paradas = [...nodos, meta].map((n) => fraccionEn(Number(n.dataset.x), Number(n.dataset.y)));

  const avance = { f: 0 };
  const pintar = () => {
    ruta.style.strokeDashoffset = String(1 - avance.f);
    const p = ruta.getPointAtLength(largo * avance.f);
    gsap.set(yo, { x: (p.x / 400) * mapa.clientWidth, y: (p.y / 800) * mapa.clientHeight, xPercent: -50, yPercent: -50 });
  };

  const medios = gsap.matchMedia();
  medios.add({ animar: '(prefers-reduced-motion: no-preference)', movil: '(max-width: 640px)' }, ({ conditions }) => {
    if (!conditions.animar) return undefined;
    camino.classList.add('camino-anim');
    avance.f = 0;

    gsap.set(burbujas, { autoAlpha: 0, y: 18, scale: 0.94 });
    nodos.forEach((nodo) => {
      gsap.set(nodo.querySelector('.fill'), { opacity: 0 });
      gsap.set(nodo.querySelector('.ok'), { opacity: 0, scale: 0.4 });
    });
    gsap.set(meta, { opacity: 0.55, filter: 'grayscale(.75)' });
    gsap.set(velo, { autoAlpha: 0 });
    gsap.set(popup, { autoAlpha: 0, scale: 0.82, y: 40 });
    pintar();

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: camino, start: 'top top', end: conditions.movil ? '+=300%' : '+=340%', pin: true, scrub: 0.8,
        onRefresh: pintar,
      },
    });

    let desde = 0;
    nodos.forEach((nodo, i) => {
      const bola = nodo.querySelector('.bola');
      if (i > 0) tl.to(burbujas[i - 1], { autoAlpha: 0.35, scale: 0.97, duration: 0.3 });
      tl.to(avance, { f: paradas[i], duration: (paradas[i] - desde) * 5, ease: 'none', onUpdate: pintar }, i > 0 ? '<' : '>')
        .to(bola, { scale: 1.22, duration: 0.2 })
        .to(nodo.querySelector('.fill'), { opacity: 1, duration: 0.2 }, '<')
        .to(nodo.querySelector('.n'), { opacity: 0, duration: 0.15 }, '<')
        .to(nodo.querySelector('.ok'), { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(3)' }, '<0.05')
        .to(bola, { scale: 1, duration: 0.35, ease: 'back.out(3)' })
        .to(burbujas[i], { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.7)' }, '<')
        .to({}, { duration: 0.6 });
      desde = paradas[i];
    });

    tl.to(burbujas[burbujas.length - 1], { autoAlpha: 0.35, scale: 0.97, duration: 0.3 })
      .to(avance, { f: 1, duration: (1 - desde) * 5, ease: 'none', onUpdate: pintar }, '<')
      .to(meta, { opacity: 1, filter: 'grayscale(0)', scale: 1.18, duration: 0.4 }, '-=0.2')
      .to(velo, { autoAlpha: 1, duration: 0.35 })
      .to(popup, { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.6)' }, '<')
      .to({}, { duration: 0.9 });

    // La meta de fondo baja suave con el scroll (parallax).
    tl.fromTo(fondo, { yPercent: -5, scale: 1.06 }, { yPercent: 5, scale: 1.12, ease: 'none', duration: tl.duration() }, 0);

    return () => {
      camino.classList.remove('camino-anim');
      ruta.style.strokeDashoffset = '';
    };
  });
};
// GSAP se carga con defer; esperamos a que esté listo.
if (document.readyState === 'complete') animarCamino();
else window.addEventListener('load', animarCamino);

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
  document.querySelectorAll('[data-src]').forEach((clip) =>
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

// Filtros del carrusel de videos
document.querySelectorAll('.vfilter[data-row]').forEach((group) => {
  const items = document.querySelectorAll(`${group.dataset.row} li`);
  group.querySelectorAll('button').forEach((btn) =>
    btn.addEventListener('click', () => {
      group.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b === btn));
      const cat = btn.dataset.cat;
      items.forEach((li) => li.classList.toggle('hide', cat !== 'todos' && li.dataset.cat !== cat));
      document.querySelector(group.dataset.row).scrollTo({ left: 0, behavior: 'smooth' });
    })
  );
});

// Planes: veces por semana × período de pago
const detallePlan = (plan, veces) => {
  const sesiones = veces * 4;
  if (plan === 'online') return { ses: `${sesiones} entrenamientos al mes`, valor: 'Rutina + seguimiento online' };
  if (plan === 'hibrido') return { ses: `4 presenciales + ${sesiones - 4} online`, valor: '1 sesión presencial por semana' };
  return { ses: `${sesiones} sesiones 1:1 al mes`, valor: `Valor sesión ${clp(PRECIOS.presencial[veces] / sesiones)}` };
};

document.querySelectorAll('.pricing').forEach((root) => {
  const estado = { veces: 2, periodo: 'mensual' };
  const pintar = () => {
    const { veces, periodo } = estado;
    const p = PERIODOS[periodo];
    root.querySelectorAll('[data-plan]').forEach((card) => {
      const plan = card.dataset.plan;
      const mes = precioMes(plan, veces, periodo);
      const { ses, valor } = detallePlan(plan, veces);
      card.querySelector('[data-precio]').textContent = clp(mes);
      card.querySelector('[data-ses]').textContent = ses;
      card.querySelector('[data-valor]').textContent = plan === 'presencial'
        ? `Valor sesión ${clp(mes / (veces * 4))}`
        : valor;
      card.querySelector('[data-total]').innerHTML = p.meses === 1
        ? 'Pago mes a mes'
        : `Pagas ${clp(mes * p.meses)} por ${p.meses} meses · <b>ahorras ${clp((PRECIOS[plan][veces] - mes) * p.meses)}</b>`;
      card.querySelector('[data-wa-plan]').href = waLink(
        `Hola Pablo! Me interesa el plan ${PRECIOS[plan].nombre}, ${veces} veces por semana, pago ${p.nombre}.`
      );
    });
  };
  root.querySelectorAll('[data-pick]').forEach((group) =>
    group.querySelectorAll('button').forEach((btn) =>
      btn.addEventListener('click', () => {
        group.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b === btn));
        const v = btn.dataset.v;
        estado[group.dataset.pick] = group.dataset.pick === 'veces' ? Number(v) : v;
        pintar();
      })
    )
  );
  root.querySelectorAll('[data-wa-plan]').forEach((a) => { a.target = '_blank'; a.rel = 'noopener'; });
  pintar();
});

// Historias tipo Instagram: tocar a la derecha avanza, a la izquierda
// retrocede y mantener presionado pausa.
const ESPERA_PAUSA_MS = 220;
document.querySelectorAll('.stories').forEach((root) => {
  const slides = [...root.querySelectorAll('.st-slide')];
  const bars = root.querySelector('.st-bars');
  bars.innerHTML = slides.map(() => '<i><b></b></i>').join('');
  const barEls = [...bars.children];
  const chaps = [...document.querySelectorAll(`[data-stories="${root.id}"] .st-chap`)];
  let actual = 0;
  let visible = false;
  let pausado = false;

  const sincronizarVideos = () => slides.forEach((s, i) => {
    const v = s.querySelector('video');
    if (!v) return;
    if (i === actual && visible && !pausado) v.play().catch(() => {});
    else v.pause();
  });

  const mostrar = (n) => {
    actual = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('on', i === actual));
    barEls.forEach((bar, i) => {
      bar.className = i < actual ? 'done' : '';
      const fill = bar.firstChild.cloneNode();
      bar.replaceChild(fill, bar.firstChild);
      if (i === actual) {
        bar.style.setProperty('--dur', `${slides[i].dataset.dur || 5000}ms`);
        bar.className = 'on';
        fill.addEventListener('animationend', () => mostrar(actual + 1), { once: true });
      }
    });
    chaps.forEach((c, i) => c.setAttribute('aria-current', i === actual));
    const v = slides[actual].querySelector('video');
    if (v) v.currentTime = 0;
    sincronizarVideos();
  };

  const pausar = (estado) => {
    pausado = estado;
    root.classList.toggle('paused', pausado || !visible);
    sincronizarVideos();
  };

  let temporizador;
  let mantenido = false;
  root.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button')) return;
    mantenido = false;
    temporizador = setTimeout(() => { mantenido = true; pausar(true); }, ESPERA_PAUSA_MS);
  });
  root.addEventListener('pointerup', (e) => {
    if (e.target.closest('a, button')) return;
    clearTimeout(temporizador);
    root.classList.add('touched');
    if (mantenido) { pausar(false); return; }
    const { left, width } = root.getBoundingClientRect();
    mostrar(e.clientX - left < width * 0.3 ? actual - 1 : actual + 1);
  });
  root.addEventListener('pointerleave', () => { clearTimeout(temporizador); if (mantenido) pausar(false); });
  root.addEventListener('contextmenu', (e) => e.preventDefault());
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') mostrar(actual + 1);
    if (e.key === 'ArrowLeft') mostrar(actual - 1);
    if (e.key === ' ') { e.preventDefault(); pausar(!pausado); }
  });
  chaps.forEach((c, i) => c.addEventListener('click', () => { pausar(false); mostrar(i); }));

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    pausar(pausado);
  }, { threshold: 0.4 }).observe(root);

  mostrar(0);
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
