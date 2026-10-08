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

// Historia: cada paso ocupa el centro y deja una breve huella antes del cierre.
const partirEnPalabras = (p) => {
  [...p.childNodes].forEach((nodo) => {
    if (nodo.nodeType === Node.ELEMENT_NODE) {
      // El degradado queda entero para envolver líneas sin cortar su luz.
      if (!nodo.classList.contains('grad')) partirEnPalabras(nodo);
      return;
    }
    if (nodo.nodeType !== Node.TEXT_NODE) return;
    const trozos = nodo.textContent.split(/(\s+)/);
    const frag = document.createDocumentFragment();
    trozos.forEach((t) => {
      if (!t) return;
      if (/^\s+$/.test(t)) { frag.append(t); return; }
      const w = document.createElement('span');
      w.className = 'w';
      w.textContent = t;
      frag.append(w);
    });
    nodo.replaceWith(frag);
  });
};

const animarHistoria = () => {
  const historia = document.querySelector('.story');
  if (!historia || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const lineas = [...historia.querySelectorAll('p')];
  const originales = lineas.map((linea) => linea.innerHTML);
  const pasos = [...historia.querySelectorAll('.story-steps span')];
  const numeros = [...historia.querySelectorAll('.story-counter span')];
  const foto = historia.querySelector('.story-foto');
  const brillo = historia.querySelector('.story-glow');
  const halo = historia.querySelector('.story-halo');
  const orbitas = [...historia.querySelectorAll('.story-orbit')];
  const barra = historia.querySelector('.story-bar i');
  const medios = gsap.matchMedia();

  medios.add({
    escritorio: '(min-width: 641px)',
    movil: '(max-width: 640px)',
    sinMovimiento: '(prefers-reduced-motion: reduce)',
    pocaAltura: '(max-height: 620px)',
  }, (contexto) => {
    const { movil, sinMovimiento, pocaAltura } = contexto.conditions;
    // En pantallas bajas y con movimiento reducido se conserva el flujo normal.
    if (sinMovimiento || pocaAltura) return;
    historia.classList.add('story-animada');
    lineas.forEach(partirEnPalabras);
    const palabras = lineas.map((linea) => [...linea.querySelectorAll('.w')]);
    const frase = historia.querySelector('.grad');
    const recuerdo = movil ? -104 : -96;
    const entrada = movil ? 22 : 38;
    const paralaje = movil
      ? { inicio: 0, fin: 5, escalaInicial: 1.02, escalaFinal: 1.04 }
      : { inicio: -3, fin: 7, escalaInicial: 1.03, escalaFinal: 1.06 };
    let pasoActual = -1;

    const activarPaso = (indice) => {
      if (indice === pasoActual) return;
      pasos.forEach((paso, i) => paso.classList.toggle('on', indice === 3 || i === indice));
      pasoActual = indice;
    };

    // Solo ocultamos contenido después de confirmar las dos librerías.
    gsap.set(palabras[0], { y: 10, opacity: 0.78 });
    gsap.set(lineas.slice(1), { opacity: 0 });
    gsap.set(palabras.slice(1).flat(), { y: entrada, rotation: 3, opacity: 0, filter: `blur(${movil ? 2 : 5}px)` });
    gsap.set(frase, { opacity: 0, y: entrada, scale: 0.96 });
    gsap.set(numeros.slice(1), { opacity: 0, yPercent: 45, scale: 0.86, rotationX: -35 });
    gsap.set(pasos, { opacity: 0.58, scale: 0.97 });
    gsap.set(pasos[0], { opacity: 1, scale: 1 });
    gsap.set(barra, { scaleX: 0 });
    activarPaso(0);

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: historia, start: 'top top',
        end: () => `+=${Math.round(historia.offsetHeight * (movil ? 1.8 : 2.8))}`,
        pin: true, scrub: movil ? 0.35 : 0.65, invalidateOnRefresh: true,
      },
      onUpdate: () => {
        const tiempo = tl.time();
        activarPaso(tiempo >= tl.labels.cierre ? 3 : tiempo >= tl.labels.paso2 ? 2 : tiempo >= tl.labels.paso1 ? 1 : 0);
      },
    });

    tl.addLabel('paso0', 0).addLabel('paso1', 1.9).addLabel('paso2', 3.8).addLabel('cierre', 5.7);
    tl.to(palabras[0], { y: 0, opacity: 1, duration: 0.85, stagger: 0.06 }, 'paso0')
      .fromTo(numeros[0], { scale: 0.94 }, { scale: 1, duration: 1.1 }, 'paso0');
    [1, 2].forEach((i) => {
      const inicio = `paso${i}`;
      if (i === 2) tl.to(lineas[0], { y: recuerdo - 34, opacity: 0, duration: 0.5 }, inicio);
      tl.to(lineas[i - 1], { y: recuerdo, scale: movil ? 0.7 : 0.74, opacity: 0.45, duration: 0.85 }, inicio)
        .set(lineas[i], { opacity: 1 }, inicio)
        .to(palabras[i], { y: 0, rotation: 0, opacity: 1, filter: 'blur(0px)', duration: 0.85, stagger: movil ? 0.045 : 0.065 }, inicio)
        .to(numeros[i - 1], { yPercent: -45, scale: 0.86, rotationX: 35, opacity: 0, duration: 0.65 }, inicio)
        .to(numeros[i], { yPercent: 0, scale: 1, rotationX: 0, opacity: 1, duration: 0.85 }, inicio)
        .to(pasos[i - 1], { opacity: 0.58, scale: 0.97, y: 0, duration: 0.55 }, inicio)
        .to(pasos[i], { opacity: 1, scale: 1.04, y: -3, duration: 0.65 }, inicio)
        .to(brillo, { x: (i === 1 ? -1 : 1) * (movil ? 24 : 85), y: -i * 16, scale: 1 + i * 0.12, opacity: 0.7 + i * 0.1, duration: 1.25 }, inicio)
        .to(halo, { x: i === 1 ? 30 : -45, y: i * 22, opacity: i === 1 ? 0.4 : 0.8, duration: 1.25 }, inicio);
    });

    tl.to(lineas.slice(0, 3), { y: recuerdo - 24, opacity: 0, duration: 0.45 }, 'cierre')
      .set(lineas[3], { opacity: 1 }, 'cierre')
      .to(palabras[3], { y: 0, rotation: 0, opacity: 1, filter: 'blur(0px)', duration: 0.75, stagger: 0.035 }, 'cierre')
      .to(numeros[2], { scale: 0.86, opacity: 0.3, duration: 1 }, 'cierre')
      .to(pasos, { opacity: 1, scale: 1, y: 0, duration: 0.8 }, 'cierre')
      .to(frase, { opacity: 1, y: 0, scale: 1, duration: 1.15, ease: 'power4.out' }, 'cierre+=0.4')
      .to(frase, { backgroundPosition: '0% 0', duration: 1.8, ease: 'sine.inOut' }, 'cierre+=0.5')
      .to(brillo, { x: 0, y: 20, scale: movil ? 1.35 : 1.5, opacity: 1, duration: 1.5 }, 'cierre+=0.3')
      .to(halo, { x: movil ? -25 : -100, y: 80, scale: 1.2, opacity: 1, duration: 1.5 }, 'cierre+=0.3')
      .to({}, { duration: 0.7 });

    const duracion = tl.duration();
    tl.to(barra, { scaleX: 1, ease: 'none', duration: duracion }, 0)
      .to(orbitas[0], { rotation: 18, y: movil ? -18 : -50, scale: 1.08, ease: 'none', duration: duracion }, 0)
      .to(orbitas[1], { rotation: -24, y: movil ? 20 : 60, scale: 0.94, ease: 'none', duration: duracion }, 0);
    // El margen vertical cubre toda la deriva; solo transformamos la foto.
    if (foto) tl.fromTo(foto,
      { yPercent: paralaje.inicio, scale: paralaje.escalaInicial },
      { yPercent: paralaje.fin, scale: paralaje.escalaFinal, ease: 'none', duration: duracion }, 0);

    // matchMedia revierte los estilos GSAP; restauramos también el texto y el flujo.
    return () => {
      historia.classList.remove('story-animada');
      pasos.forEach((paso) => paso.classList.remove('on'));
      lineas.forEach((linea, i) => { linea.innerHTML = originales[i]; });
    };
  }, historia);
};
// GSAP se carga con defer; esperamos a que esté listo.
if (document.readyState === 'complete') animarHistoria();
else window.addEventListener('load', animarHistoria);

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
