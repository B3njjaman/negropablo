/* ═══════════════════════════════════════════════
   NEGRO PABLO — chat.js
   Asistente que detecta necesidades y recomienda un plan
   ═══════════════════════════════════════════════ */
(() => {
  const ICONOS = {
    alerta: '<svg class="np-alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/></svg>',
  };

  // Precios y nombres vienen de PRECIOS en main.js.
  const vecesPorSemana = (a) => (a.dias === '2' ? 2 : 3);
  const nombrePlan = (plan) => `Plan ${PRECIOS[plan].nombre}`;

  const CONSEJOS = {
    rodilla: 'Rodilla: ajustamos rango y carga en sentadillas y zancadas, y fortalecemos cuádriceps y glúteo para protegerla.',
    lumbar: 'Espalda baja: primero técnica de bisagra y core, con variantes apoyadas antes de cargar peso libre pesado.',
    hombro: 'Hombro: trabajo de manguito rotador y escápulas, y elegimos agarres y rangos de press que no generen dolor.',
    codo: 'Codo o muñeca: cuidamos agarres y volumen en tracciones y curls, con progresiones más graduales.',
    cadera: 'Cadera: movilidad y glúteo medio, con ejercicios unilaterales controlados.',
    tobillo: 'Tobillo: movilidad y estabilidad antes de cargar en ejercicios de pierna.',
    cuello: 'Cuello: evitamos carga directa y cuidamos la postura en press y remos.',
    condicion: 'Condición médica: ajustamos intensidad y descansos según lo que indique tu médico.',
  };

  const ZONAS = {
    rodilla: /rodill|menisco|r[oó]tula|cruzado|lca/i,
    lumbar: /lumbar|espalda|ci[aá]tic|hernia|columna|disco/i,
    hombro: /hombro|manguito|clav[ií]cula|esc[aá]pula/i,
    codo: /codo|mu[ñn]eca|epicondil|carpiano|mano/i,
    cadera: /cadera|ingle|gl[uú]teo|pubalgia/i,
    tobillo: /tobillo|esguince|pie|aquiles|plantar|talón|talon/i,
    cuello: /cuello|cervical/i,
    condicion: /asma|presi[oó]n|hipertens|diabet|coraz[oó]n|card[ií]a|embaraz|epilep|tiroid/i,
  };
  const detectarZonas = (texto = '') => Object.keys(ZONAS).filter((z) => ZONAS[z].test(texto));

  const ALERTAS = /operad|operaci|cirug|fractur|embaraz|card[ií]a|coraz[oó]n|hernia|presi[oó]n|desmay|ligamento|menisco|tendinitis/i;

  const STEPS = [
    {
      id: 'inicio', type: 'choice',
      say: () => [
        '¡Hola! Soy el asistente de Pablo.',
        'Te hago unas preguntas rápidas (menos de 1 minuto) para ver qué plan te sirve y si hay algo que cuidar, como lesiones o molestias.',
      ],
      options: [{ v: 'ok', t: '¡Vamos!' }],
    },
    {
      id: 'nombre', type: 'text', placeholder: 'Escribe tu nombre',
      say: () => ['¿Cómo te llamas?'],
    },
    {
      id: 'objetivo', type: 'choice',
      say: (a) => [`¡Buena, ${esc(a.nombre)}! ¿Cuál es tu objetivo principal?`],
      options: [
        { v: 'musculo', t: 'Ganar masa muscular' },
        { v: 'grasa', t: 'Bajar grasa' },
        { v: 'fuerza', t: 'Ganar fuerza' },
        { v: 'salud', t: 'Salud y movilidad' },
        { v: 'deporte', t: 'Rendir en mi deporte' },
      ],
    },
    {
      id: 'experiencia', type: 'choice',
      say: () => ['¿Cuánta experiencia tienes entrenando?'],
      options: [
        { v: 'cero', t: 'Nunca he entrenado' },
        { v: 'poca', t: 'Menos de 1 año' },
        { v: 'media', t: 'Entre 1 y 3 años' },
        { v: 'alta', t: 'Más de 3 años' },
      ],
    },
    {
      id: 'lesion', type: 'choice',
      say: () => ['¿Tienes alguna lesión, dolor o condición médica que deba conocer?'],
      options: [
        { v: 'no', t: 'No, ninguna' },
        { v: 'si', t: 'Sí, tengo algo' },
      ],
    },
    {
      id: 'detalle', type: 'text', skip: (a) => a.lesion !== 'si',
      placeholder: 'Ej: me duele la rodilla al bajar escaleras',
      say: () => [
        'Gracias por contarme, es clave para armar bien tu plan.',
        'Cuéntame con tus palabras: ¿dónde es, qué te pasó y hace cuánto?',
      ],
    },
    {
      id: 'estado', type: 'choice', skip: (a) => a.lesion !== 'si',
      say: () => ['¿Y cómo está hoy?'],
      options: [
        { v: 'recuperada', t: 'Ya está recuperada' },
        { v: 'leve', t: 'Molestia leve' },
        { v: 'limita', t: 'Dolor que me limita' },
        { v: 'tratamiento', t: 'En tratamiento o recién operado' },
      ],
      after: (a) => {
        const zonas = detectarZonas(a.detalle);
        const out = [zonas.length
          ? `Por lo que me cuentas, así lo vamos a trabajar:<br><br>${zonas.map((z) => CONSEJOS[z]).join('<br><br>')}`
          : 'Anotado. Pablo va a revisar lo que me contaste para adaptar los ejercicios desde el primer día.'];
        if (esSeria(a)) {
          out.push(`${ICONOS.alerta} Como hay dolor que limita o estás en tratamiento, lo ideal es partir con el visto bueno de tu médico o kinesiólogo y que las primeras sesiones sean supervisadas.`);
        } else if (ALERTAS.test(a.detalle)) {
          out.push('Por lo que describes, Pablo va a revisar tu caso en persona antes de definir cargas.');
        }
        return out;
      },
    },
    {
      id: 'dias', type: 'choice',
      say: () => ['¿Cuántos días a la semana puedes entrenar?'],
      options: [
        { v: '2', t: '2 días' },
        { v: '3', t: '3 días' },
        { v: '4', t: '4 días' },
        { v: '5', t: '5 o más' },
      ],
    },
    {
      id: 'lugar', type: 'choice',
      say: () => ['¿Dónde vas a entrenar?'],
      options: [
        { v: 'gym', t: 'En un gimnasio' },
        { v: 'casa', t: 'En casa' },
        { v: 'ambos', t: 'Un poco de ambos' },
      ],
    },
    {
      id: 'modalidad', type: 'choice',
      say: () => ['¿Cómo te gustaría entrenar con Pablo?'],
      options: [
        { v: 'online', t: 'Online, a mi ritmo' },
        { v: 'mixto', t: 'Mezcla de online y presencial' },
        { v: 'presencial', t: 'Presencial, con él al lado' },
        { v: 'nose', t: 'No sé, recomiéndame' },
      ],
    },
    {
      id: 'apoyo', type: 'choice',
      say: () => ['Última: ¿cuánto acompañamiento necesitas?'],
      options: [
        { v: 'solo', t: 'Me organizo solo, necesito el plan' },
        { v: 'revision', t: 'Que alguien revise mi técnica y avance' },
        { v: 'exigencia', t: 'Que me exijan en cada sesión' },
      ],
    },
  ];

  const paso = (id) => STEPS.find((s) => s.id === id);
  const esSeria = (a) => a.lesion === 'si' && ['limita', 'tratamiento'].includes(a.estado);

  // ── Recomendación ──
  const recomendar = (a) => {
    const s = { online: 0, hibrido: 0, presencial: 0 };
    const preferido = { online: 'online', mixto: 'hibrido', presencial: 'presencial' }[a.modalidad];
    if (preferido) s[preferido] += 3;
    s[{ solo: 'online', revision: 'hibrido', exigencia: 'presencial' }[a.apoyo]] += 2;
    if (a.experiencia === 'cero') { s.hibrido += 1; s.presencial += 1; }
    if (a.lugar === 'casa') s.online += 2;
    if (a.lesion === 'si' && a.estado === 'leve') s.hibrido += 1;
    if (esSeria(a) || ALERTAS.test(a.detalle || '')) { s.presencial += 2; s.hibrido += 1; s.online -= 2; }
    return ['hibrido', 'presencial', 'online'].reduce((best, k) => (s[k] > s[best] ? k : best));
  };

  const razones = (a, plan) => {
    const r = [];
    if (plan === 'online') r.push('Te da estructura y seguimiento sin depender de horarios.');
    if (plan === 'hibrido') r.push('Combina sesiones presenciales para pulir técnica con seguimiento online el resto de la semana.');
    if (plan === 'presencial') r.push('Entrenas con Pablo al lado en cada sesión: técnica y cargas controladas en tiempo real.');
    if (a.experiencia === 'cero') r.push('Al partir de cero, tener guía directa acelera mucho el aprendizaje de la técnica.');
    if (esSeria(a)) r.push('Por tu lesión conviene que las sesiones sean supervisadas.');
    else if (a.lesion === 'si') r.push('Adaptamos los ejercicios a tu lesión desde el primer día.');
    if (a.lugar === 'casa') r.push('La rutina se adapta al equipamiento que tengas en casa.');
    if (a.apoyo === 'exigencia' && plan !== 'presencial') r.push('Si buscas que te exijan en cada sesión, también puedes subir al Presencial 1:1.');
    return r;
  };

  const semana = (a) => {
    const dias = a.dias === '5' && a.experiencia === 'cero' ? '3' : a.dias;
    const split = {
      2: 'Full body 2 días por semana',
      3: 'Full body 3 días por semana',
      4: 'Torso / pierna, 4 días por semana',
      5: 'Empuje / tracción / pierna, 5 días por semana',
    }[dias];
    const nota = dias !== a.dias ? ' (partimos con 3 para aprender técnica y luego subimos)' : '';
    const foco = {
      musculo: 'hipertrofia con sobrecarga progresiva',
      grasa: 'fuerza + gasto calórico, con pauta de alimentación',
      fuerza: 'básicos pesados y progresión de cargas',
      salud: 'movilidad, fuerza general y hábitos',
      deporte: 'fuerza y potencia aplicadas a tu deporte',
    }[a.objetivo];
    return `${split}${nota}, enfocado en ${foco}.`;
  };

  const etiqueta = (step, v) => {
    if (step.type === 'text') return v || 'Prefiero omitirlo';
    const find = (x) => step.options.find((o) => o.v === x)?.t ?? x;
    return Array.isArray(v) ? v.map(find).join(', ') : find(v);
  };

  const resumenWhatsApp = (a, plan) => {
    const L = (id) => etiqueta(paso(id), a[id]);
    const lineas = [
      `Hola Pablo! Soy ${a.nombre}. Hice el test de la página:`,
      `• Objetivo: ${L('objetivo')}`,
      `• Experiencia: ${L('experiencia')}`,
      a.lesion === 'si'
        ? `• Lesión: "${a.detalle}" (${L('estado')})`
        : '• Lesiones: ninguna',
      `• Días: ${L('dias')} · Lugar: ${L('lugar')}`,
      `• Modalidad: ${L('modalidad')}`,
      `• Acompañamiento: ${L('apoyo')}`,
      `Me recomendó el ${nombrePlan(plan)}, ${vecesPorSemana(a)} veces por semana (${clp(PRECIOS[plan][vecesPorSemana(a)])} al mes). ¿Conversamos?`,
    ];
    return lineas.join('\n');
  };

  // ── Utilidades ──
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const wa = (msg) => (typeof waLink === 'function' ? waLink(msg) : '#');
  const KEY = 'np-chat-v2';
  const load = () => { try { return JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(A)); } catch { /* sin almacenamiento */ } };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // ── DOM ──
  const AV = '<span class="np-av" aria-hidden="true">NP</span>';
  const SEND = '<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M2.5 2.8l15 7.2-15 7.2 2.3-7.2z"/></svg>';
  document.body.insertAdjacentHTML('beforeend', `
    <button class="np-launch" aria-controls="npChat" aria-expanded="false">
      ${AV}<span class="np-launch-t"><b>¿Qué plan es para ti?</b><small>Te ayudo en 1 minuto</small></span>
    </button>
    <section class="np-chat" id="npChat" role="dialog" aria-label="Asistente de planes" aria-hidden="true">
      <header class="np-head">
        ${AV}
        <div class="np-who"><b>Asistente de Pablo</b><small><i></i>Responde al instante</small></div>
        <a class="np-hbtn np-wa" target="_blank" rel="noopener" aria-label="Hablar directo por WhatsApp" title="Hablar directo con Pablo">
          <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.7L3 29l6.9-2.2c1.9 1 4 1.6 6.1 1.6 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23.1c-2 0-3.9-.5-5.6-1.6l-.4-.2-4.1 1.3 1.3-4-.3-.4c-1.2-1.8-1.8-3.8-1.8-5.9C5.1 9.9 10 5.2 16 5.2s10.9 4.8 10.9 10.6S22 26.1 16 26.1z"/></svg>
        </a>
        <button class="np-hbtn np-reset" aria-label="Empezar de nuevo" title="Empezar de nuevo">↺</button>
        <button class="np-hbtn np-close" aria-label="Cerrar">✕</button>
      </header>
      <div class="np-log" aria-live="polite"></div>
      <form class="np-input" autocomplete="off">
        <input type="text" maxlength="500" placeholder="Elige una opción" disabled aria-label="Tu respuesta">
        <button type="submit" disabled aria-label="Enviar">${SEND}</button>
      </form>
    </section>`);

  const launch = document.querySelector('.np-launch');
  const chat = document.querySelector('#npChat');
  const log = chat.querySelector('.np-log');
  const form = chat.querySelector('.np-input');
  const input = form.querySelector('input');
  const sendBtn = form.querySelector('button');
  chat.querySelector('.np-wa').href = wa('Hola Pablo! Quiero info sobre tus planes');

  const scroll = () => { log.scrollTop = log.scrollHeight; };
  const add = (cls, html) => {
    const el = document.createElement('div');
    el.className = cls;
    el.innerHTML = html;
    log.appendChild(el);
    scroll();
    return el;
  };

  let run = 0;
  let started = false;
  let A = load();

  const bot = async (html, instant, id) => {
    if (!instant) {
      const t = add('np-msg np-bot np-typing', '<i></i><i></i><i></i>');
      await sleep(Math.min(450 + html.length * 9, 1300));
      t.remove();
      if (id !== run) throw new Error('cancelado');
    }
    add('np-msg np-bot', html);
  };
  const user = (text) => {
    const el = add('np-msg np-user', '');
    el.textContent = text;
  };

  const ask = (step) => new Promise((resolve) => {
    if (step.type === 'text') {
      input.disabled = false;
      sendBtn.disabled = false;
      input.placeholder = step.placeholder || 'Escribe aquí…';
      input.value = '';
      if (!matchMedia('(hover: none)').matches) input.focus();
      let skipBox;
      const done = (v) => {
        form.onsubmit = null;
        input.value = '';
        input.disabled = true;
        sendBtn.disabled = true;
        input.placeholder = 'Elige una opción';
        skipBox?.remove();
        resolve(v);
      };
      if (step.optional) {
        skipBox = add('np-opts', '<button type="button" class="np-opt">Omitir</button>');
        skipBox.firstChild.onclick = () => done('');
      }
      form.onsubmit = (e) => {
        e.preventDefault();
        const v = input.value.trim();
        if (v) done(v);
      };
      return;
    }

    const box = add('np-opts', step.options
      .map((o) => `<button type="button" class="np-opt" data-v="${o.v}">${o.t}</button>`).join(''));
    if (step.type === 'choice') {
      box.querySelectorAll('.np-opt').forEach((b) => (b.onclick = () => { box.remove(); resolve(b.dataset.v); }));
      return;
    }
    const ok = document.createElement('button');
    ok.type = 'button';
    ok.className = 'np-opt np-ok';
    ok.textContent = 'Listo ✓';
    ok.disabled = true;
    box.appendChild(ok);
    const picked = new Set();
    box.querySelectorAll('.np-opt[data-v]').forEach((b) => (b.onclick = () => {
      picked.has(b.dataset.v) ? picked.delete(b.dataset.v) : picked.add(b.dataset.v);
      b.classList.toggle('on');
      b.setAttribute('aria-pressed', b.classList.contains('on'));
      ok.disabled = !picked.size;
    }));
    ok.onclick = () => { box.remove(); resolve([...picked]); };
  });

  const resultado = (a) => {
    const plan = recomendar(a);
    const veces = vecesPorSemana(a);
    const lesion = a.lesion === 'si'
      ? `<div class="np-box${esSeria(a) ? ' np-warn' : ''}"><b>Tu lesión</b>“${esc(a.detalle)}” · ${esc(etiqueta(paso('estado'), a.estado))}. ${esSeria(a) ? 'Trae el visto bueno de tu médico o kine para la primera sesión.' : 'La adaptamos desde el día uno.'}</div>`
      : '';
    return `
      <div class="np-result">
        <span class="np-tag">Tu plan recomendado</span>
        <h4>${nombrePlan(plan)}</h4>
        <p class="np-price">${clp(PRECIOS[plan][veces])} / mes · ${veces} veces por semana</p>
        <ul>${razones(a, plan).map((r) => `<li>${r}</li>`).join('')}</ul>
        <div class="np-box"><b>Tu semana</b>${semana(a)}</div>
        ${lesion}
      </div>`;
  };

  const flow = async () => {
    const id = ++run;
    try {
      for (const step of STEPS) {
        if (step.skip?.(A)) continue;
        const replay = step.id in A;
        for (const m of step.say(A)) await bot(m, replay, id);
        if (!replay) {
          const v = await ask(step);
          if (id !== run) return;
          A[step.id] = v;
          save();
        }
        if (step.id !== 'inicio') user(etiqueta(step, A[step.id]));
        for (const m of step.after?.(A) ?? []) await bot(m, replay, id);
      }
      const replay = A.fin;
      await bot(`Listo, ${esc(A.nombre)}. Con lo que me contaste, esto es lo que te recomiendo:`, replay, id);
      await bot(resultado(A), replay, id);
      A.fin = true;
      save();
      const plan = recomendar(A);
      const acts = add('np-opts np-final', '');
      acts.innerHTML = `
        <a class="np-opt np-cta" target="_blank" rel="noopener" href="${wa(resumenWhatsApp(A, plan))}">Enviar mi resumen a Pablo</a>
        <a class="np-opt" href="planes.html">Ver todos los planes</a>
        <button type="button" class="np-opt np-again">Empezar de nuevo</button>`;
      acts.querySelector('.np-again').onclick = reset;
    } catch (e) {
      if (e.message !== 'cancelado') throw e;
    }
  };

  const reset = () => {
    A = {};
    save();
    log.innerHTML = '';
    form.onsubmit = null;
    input.disabled = true;
    sendBtn.disabled = true;
    flow();
  };

  const open = () => {
    chat.classList.add('on');
    chat.setAttribute('aria-hidden', 'false');
    launch.setAttribute('aria-expanded', 'true');
    document.body.classList.add('np-open');
    if (!started) { started = true; flow(); }
    setTimeout(scroll, 50);
  };
  const close = () => {
    chat.classList.remove('on');
    chat.setAttribute('aria-hidden', 'true');
    launch.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('np-open');
  };

  launch.addEventListener('click', () => (chat.classList.contains('on') ? close() : open()));
  chat.querySelector('.np-close').addEventListener('click', close);
  chat.querySelector('.np-reset').addEventListener('click', reset);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && chat.classList.contains('on')) close(); });
  document.querySelectorAll('[data-chat-open]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); open(); }));
})();
