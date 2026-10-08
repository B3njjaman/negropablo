/* ═══════════════════════════════════════════════
   PABLOCOACH — main.js
   ═══════════════════════════════════════════════ */

// Datos de contacto: cambia aquí y se actualiza todo el sitio.
const CONTACTO = {
  whatsapp: '56964067622', // código de país + número, sin "+" ni espacios
  instagram: 'pablocoach', // por confirmar
  email: 'contacto@pablocoach.cl', // por confirmar
};

// Precios mensuales en CLP según veces por semana. Cambia aquí y se actualiza
// la página de planes y el asistente.
const PRECIOS = {
  online: { nombre: 'Online', 2: 69000, 3: 79000 },
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

// Camino tipo Duolingo (GSAP + ScrollTrigger), sin fijar la sección: la página
// sigue bajando y la ruta se dibuja siguiéndote. El marcador "Tú" queda siempre a
// la misma altura de la pantalla; cada checkpoint se enciende al alcanzarlo y al
// final se abre la meta con Pablo. Sin GSAP o con movimiento reducido, todo visible.
const animarCamino = () => {
  const camino = document.querySelector('.camino');
  if (!camino || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  // En iOS la barra de direcciones cambia el alto al hacer scroll: no recalcular por eso.
  ScrollTrigger.config({ ignoreMobileResize: true });

  const mapa = camino.querySelector('.camino-mapa');
  const ruta = camino.querySelector('.camino-trazo');
  const yo = camino.querySelector('.camino-yo');
  const nodos = [...camino.querySelectorAll('.camino-nodo')];
  const tarjetas = [...camino.querySelectorAll('.camino-card')];
  const meta = camino.querySelector('.camino-meta');
  const popup = camino.querySelector('.camino-popup');
  const fondo = camino.querySelector('.camino-fondo');
  const largo = ruta.getTotalLength();

  // La ruta siempre baja: tabla de altura (viewBox 400×800) → fracción recorrida.
  const MUESTRAS = 500;
  const alturas = Array.from({ length: MUESTRAS + 1 }, (_, i) => ruta.getPointAtLength((largo * i) / MUESTRAS).y);
  const fraccionPorAltura = (y) => {
    let i = 0;
    while (i < MUESTRAS && alturas[i + 1] <= y) i++;
    return i / MUESTRAS;
  };
  const Y_INICIO = alturas[0];
  const Y_FIN = alturas[MUESTRAS];
  const paradas = [...nodos, meta].map((n) => fraccionPorAltura(Number(n.dataset.y)) - 0.004);

  const tam = { w: 0, h: 0 };
  const medir = () => { tam.w = mapa.clientWidth; tam.h = mapa.clientHeight; };
  const moverYo = gsap.quickSetter(yo, 'css');
  const avance = { y: Y_INICIO };

  const pintar = () => {
    const f = fraccionPorAltura(avance.y);
    ruta.style.strokeDashoffset = String(1 - f);
    const p = ruta.getPointAtLength(largo * f);
    moverYo({ x: (p.x / 400) * tam.w, y: (p.y / 800) * tam.h });
    nodos.forEach((nodo, i) => {
      const listo = f >= paradas[i];
      nodo.classList.toggle('on', listo);
      tarjetas[i].classList.toggle('on', listo);
    });
    const llego = f >= paradas[paradas.length - 1];
    meta.classList.toggle('on', llego);
    popup.classList.toggle('on', llego);
  };

  const medios = gsap.matchMedia();
  medios.add({ animar: '(prefers-reduced-motion: no-preference)' }, ({ conditions }) => {
    if (!conditions.animar) return undefined;
    camino.classList.add('camino-anim');
    medir();
    gsap.set(yo, { xPercent: -50, yPercent: -50 });
    avance.y = Y_INICIO;
    pintar();

    // El marcador avanza a la misma velocidad que el scroll, a ~55% del alto de pantalla.
    const LINEA = '55%';
    gsap.to(avance, {
      y: Y_FIN,
      ease: 'none',
      onUpdate: pintar,
      scrollTrigger: {
        trigger: mapa,
        start: () => `top+=${(Y_INICIO / 800) * mapa.clientHeight} ${LINEA}`,
        end: () => `top+=${(Y_FIN / 800) * mapa.clientHeight} ${LINEA}`,
        scrub: 0.5,
        invalidateOnRefresh: true,
        onRefresh: () => { medir(); pintar(); },
      },
    });

    // La foto de fondo baja más lento que la página (parallax).
    gsap.fromTo(fondo, { yPercent: -8 }, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: camino, start: 'top bottom', end: 'bottom top', scrub: true },
    });

    return () => {
      camino.classList.remove('camino-anim');
      ruta.style.strokeDashoffset = '';
      [...nodos, ...tarjetas, meta, popup].forEach((el) => el.classList.remove('on'));
    };
  });
};
// GSAP se carga con defer; esperamos a que esté listo.
if (document.readyState === 'complete') animarCamino();
else window.addEventListener('load', animarCamino);

// Carrusel de la meta: se desliza con el dedo; puntos y flechas para saltar.
const popTrack = document.querySelector('#popTrack');
if (popTrack) {
  const caja = popTrack.closest('.popup-in');
  const puntos = [...caja.querySelectorAll('.pop-dots button')];
  const total = popTrack.children.length;
  const actualPop = () => Math.round(popTrack.scrollLeft / popTrack.clientWidth);
  const irA = (i) => popTrack.scrollTo({ left: Math.max(0, Math.min(total - 1, i)) * popTrack.clientWidth, behavior: 'smooth' });
  const marcar = () => {
    const i = actualPop();
    puntos.forEach((p, k) => p.setAttribute('aria-current', k === i));
    caja.querySelector('.pop-prev').disabled = i === 0;
    caja.querySelector('.pop-next').disabled = i === total - 1;
    // El aviso de deslizar desaparece apenas se cambia de tarjeta.
    if (i > 0) caja.classList.add('pop-visto');
  };
  puntos.forEach((p, k) => p.addEventListener('click', () => irA(k)));
  caja.querySelectorAll('[data-pop]').forEach((b) => b.addEventListener('click', () => irA(actualPop() + Number(b.dataset.pop))));
  popTrack.addEventListener('scroll', () => requestAnimationFrame(marcar), { passive: true });
  marcar();
  new IntersectionObserver(([e]) => document.body.classList.toggle('sin-lanzador', e.isIntersecting), { threshold: 0.2 }).observe(caja);
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

// Videos automáticos: se precargan antes de llegar, corren apenas asoman en
// pantalla y no se pueden pausar con un clic (si algo los pausa y siguen a la
// vista, vuelven a correr). Fuera de pantalla se pausan para ahorrar batería.
const enPantalla = new WeakSet();
const correr = (v) => { v.muted = true; v.play().catch(() => {}); };
const precargador = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const v = e.target;
    // load() cancela un play() en curso: si ya está a la vista, se relanza.
    if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); if (enPantalla.has(v)) correr(v); }
    precargador.unobserve(v);
  }),
  { rootMargin: '700px 0px' }
);
const reproductor = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { enPantalla.add(e.target); correr(e.target); }
    else { enPantalla.delete(e.target); e.target.pause(); }
  }),
  { threshold: 0.01 }
);
const autos = [...document.querySelectorAll('video[data-auto]')];
autos.forEach((v) => {
  v.muted = true;
  v.playsInline = true;
  v.removeAttribute('controls');
  v.disablePictureInPicture = true;
  v.addEventListener('pause', () => { if (enPantalla.has(v) && !document.hidden) correr(v); });
  v.addEventListener('canplay', () => { if (enPantalla.has(v)) correr(v); });
  precargador.observe(v);
  reproductor.observe(v);
});
// Si el navegador bloqueó la reproducción (ahorro de batería en iPhone), el
// primer toque en cualquier parte la reactiva; también al volver a la pestaña.
const reanudarVisibles = () => autos.forEach((v) => { if (enPantalla.has(v) && v.paused) correr(v); });
['touchstart', 'pointerdown', 'scroll'].forEach((ev) => window.addEventListener(ev, reanudarVisibles, { passive: true }));
document.addEventListener('visibilitychange', () => { if (!document.hidden) reanudarVisibles(); });

// Visor de video a pantalla completa
const lb = document.querySelector('.lb');
if (lb) {
  const lbVideo = lb.querySelector('video');
  const close = () => {
    lb.classList.remove('on');
    lbVideo.pause();
    lbVideo.removeAttribute('src');
    lbVideo.load();
  };
  document.querySelectorAll('[data-src]').forEach((clip) =>
    clip.addEventListener('click', () => {
      lbVideo.src = clip.dataset.src;
      lb.classList.add('on');
      lbVideo.play().catch(() => { lbVideo.muted = true; lbVideo.play().catch(() => {}); });
    })
  );
  // Un clic sobre el video no lo pausa: si algo lo detiene con el visor abierto, sigue.
  lbVideo.addEventListener('pause', () => { if (lb.classList.contains('on')) lbVideo.play().catch(() => {}); });
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

// Precios "desde" de los planes compactos de la portada (2 veces por semana, mensual).
document.querySelectorAll('[data-desde]').forEach((el) => {
  el.textContent = clp(PRECIOS[el.dataset.desde][2]);
});

// Planes: veces por semana × período de pago
const detallePlan = (plan, veces) => {
  const sesiones = veces * 4;
  // El Online no muestra conteo de entrenamientos.
  if (plan === 'online') return { ses: '', valor: 'Rutina + seguimiento online' };
  if (plan === 'hibrido') return { ses: `2 presenciales + ${sesiones - 2} online`, valor: '2 sesiones presenciales al mes' };
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
      const pildora = card.querySelector('[data-ses]');
      pildora.textContent = ses;
      pildora.hidden = !ses;
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

// Historias tipo Instagram: tocar a la derecha avanza y a la izquierda retrocede.
// Sin pausa: el video corre apenas la sección aparece en pantalla, y se precarga
// un poco antes de llegar para que parta al instante.
document.querySelectorAll('.stories').forEach((root) => {
  const slides = [...root.querySelectorAll('.st-slide')];
  const bars = root.querySelector('.st-bars');
  bars.innerHTML = slides.map(() => '<i><b></b></i>').join('');
  const barEls = [...bars.children];
  const chaps = [...document.querySelectorAll(`[data-stories="${root.id}"] .st-chap`)];
  let actual = 0;
  let visible = false;

  const videoDe = (i) => slides[(i + slides.length) % slides.length].querySelector('video');
  const precargar = (i) => {
    const v = videoDe(i);
    if (v && v.preload !== 'auto') { v.preload = 'auto'; v.load(); }
  };

  const sincronizarVideos = () => slides.forEach((s, i) => {
    const v = s.querySelector('video');
    if (!v) return;
    if (i === actual && visible) { v.muted = true; v.play().catch(() => {}); } else v.pause();
  });
  slides.forEach((s, i) => {
    const v = s.querySelector('video');
    if (!v) return;
    v.addEventListener('pause', () => { if (i === actual && visible && !document.hidden) v.play().catch(() => {}); });
  });
  window.addEventListener('touchstart', () => { if (visible) sincronizarVideos(); }, { passive: true });

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
    const v = videoDe(actual);
    if (v) v.currentTime = 0;
    precargar(actual + 1);
    sincronizarVideos();
  };

  root.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) return;
    root.classList.add('touched');
    const { left, width } = root.getBoundingClientRect();
    mostrar(e.clientX - left < width * 0.3 ? actual - 1 : actual + 1);
  });
  root.addEventListener('contextmenu', (e) => e.preventDefault());
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') mostrar(actual + 1);
    if (e.key === 'ArrowLeft') mostrar(actual - 1);
  });
  chaps.forEach((c, i) => c.addEventListener('click', () => mostrar(i)));

  // Precarga cuando la sección está a ~600px de entrar.
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { precargar(actual); precargar(actual + 1); sincronizarVideos(); }
  }, { rootMargin: '600px 0px' }).observe(root);

  // Corre apenas asoma en pantalla; la barra de progreso solo avanza mientras se ve.
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    root.classList.toggle('paused', !visible);
    sincronizarVideos();
  }, { threshold: 0.01 }).observe(root);

  root.classList.add('paused');
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
