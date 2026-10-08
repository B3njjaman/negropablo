import sys, os, time

# Cambia en cada build para que el navegador no use copias viejas de CSS/JS.
VER = time.strftime('%Y%m%d%H%M')

# Uso: python _fuente/build.py   (genera los .html en la carpeta del sitio)
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

NAV = [
    ("sobre-mi.html", "Sobre mí"),
    ("clientes.html", "Clientes y entrenamiento"),
    ("planes.html", "Planes"),
    ("contacto.html", "Contacto"),
]

WA_SVG = '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.7L3 29l6.9-2.2c1.9 1 4 1.6 6.1 1.6 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23.1c-2 0-3.9-.5-5.6-1.6l-.4-.2-4.1 1.3 1.3-4-.3-.4c-1.2-1.8-1.8-3.8-1.8-5.9C5.1 9.9 10 5.2 16 5.2s10.9 4.8 10.9 10.6S22 26.1 16 26.1zm6-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1c-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>'
# Iconos decorativos inline, compartidos por todas las p?ginas.
ICONOS = {
    "casa": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-8H9v8H4a1 1 0 0 1-1-1z"/></svg>',
    "pulmones": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v9m0-4-3 3m3-3 3 3M9 6C6 6 3 12 3 17c0 3 3 4 6 2V6Zm6 0c3 0 6 6 6 11 0 3-3 4-6 2V6Z"/></svg>',
    "fuerza": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 6 12 12M3 8l5-5m8 18 5-5M2 6l4-4m12 20 4-4M5 10l5-5m4 14 5-5"/></svg>',
    "correr": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="16" cy="4" r="2"/><path d="m4 13 4-5 5 1 4 4h4M13 9l-3 6 5 3v4M10 15l-4 5H2"/></svg>',
    "fuego": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c1 5 6 6 6 11a6 6 0 0 1-12 0c0-3 2-5 4-7 0 3 1 4 2 4 1-2 1-5 0-8Z"/></svg>',
    "rayo": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m13 2-10 12h8l-1 8 11-12h-8z"/></svg>',
    "trofeo": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3h8v6a4 4 0 0 1-8 0V3ZM8 5H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4m-4 2v5m-4 3h8m-6-3h4v3"/></svg>',
    "cerebro": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5a3 3 0 0 0-6-1 4 4 0 0 0-3 6 4 4 0 0 0 0 6 4 4 0 0 0 5 4 3 3 0 0 0 4-3V5Zm0 0a3 3 0 0 1 6-1 4 4 0 0 1 3 6 4 4 0 0 1 0 6 4 4 0 0 1-5 4 3 3 0 0 1-4-3M6 4v3m12-3v3M3 10l3 1m15-1-3 1M8 20v-4m8 4v-4"/></svg>',
    "graduacion": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2 9 10-5 10 5-10 5-10-5Zm4 2v6c4 3 8 3 12 0v-6m4-2v8"/></svg>',
    "libros": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h4v16H3zM7 4h4v16H7zM14 4l4-1 4 16-4 1zM3 8h8m5-1 4-1"/></svg>',
    "comida": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 3v6a3 3 0 0 0 6 0V3M7 3v19M20 3c-4 3-5 7-5 10h5m0-10v19"/></svg>',
    "asistente": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="7" width="16" height="14" rx="3"/><path d="M12 3v4M2 12v5m20-5v5M9 17h6"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/></svg>',
    "instagram": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>',
    "email": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></svg>',
    "whatsapp": WA_SVG,
}

ARROW = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h12M11 5l5 5-5 5"/></svg>'
PLAY = '<svg viewBox="0 0 12 14"><path fill="currentColor" d="M0 0l12 7-12 7z"/></svg>'


# GSAP + ScrollTrigger (solo la portada los usa, para la historia animada).
GSAP = ('<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>\n'
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>\n')


def head(title, desc, og="assets/img/pablo-handball-salto.jpg"):
    return f'''<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta name="theme-color" content="#060606">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:image" content="{og}">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='%23e63946'/><stop offset='1' stop-color='%23ff6b35'/></linearGradient></defs><rect width='64' height='64' rx='18' fill='url(%23g)'/><text x='32' y='42' font-family='Arial' font-weight='800' font-size='26' fill='white' text-anchor='middle'>NP</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css?v={VER}">
</head>
<body>
<div class="blobs" aria-hidden="true"><i></i><i></i><i></i></div>
'''


def nav(active):
    on = ' class="on" aria-current="page"'
    links = "\n".join(f'        <a href="{f}"{on if f == active else ""}>{label}</a>' for f, label in NAV)
    return f'''<header class="nav">
  <div class="wrap">
    <div class="nav-in">
      <a href="index.html" class="logo"><b>NP</b>Negro Pablo</a>
      <nav class="nav-d" aria-label="Principal">
{links}
        <a class="btn btn-p btn-s" data-wa="Hola Pablo! Quiero info para empezar a entrenar">Empezar ahora</a>
      </nav>
      <button class="burger" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span></button>
    </div>
  </div>
</header>
'''


def cta(title, text, video="handball-corto"):
    return f'''
<section>
  <div class="wrap">
    <div class="cta-box rev">
      <video src="assets/video/{video}.mp4" muted loop playsinline preload="none" data-auto aria-hidden="true"></video>
      <span class="badge" style="background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.3);color:#fff"><i></i>Cupos abiertos este mes</span>
      <h2 style="margin-top:22px">{title}</h2>
      <p>{text}</p>
      <div class="ctas">
        <a class="btn btn-white" data-wa="Hola Pablo! Quiero empezar a entrenar contigo">{WA_SVG.replace('<svg', '<svg style="color:#25D366"')} Escribir por WhatsApp</a>
        <a class="btn btn-g" href="planes.html">Ver planes</a>
      </div>
    </div>
  </div>
</section>
'''


FOOT = f'''
<footer class="foot">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a href="index.html" class="logo"><b>NP</b>Negro Pablo</a>
        <p>Pablo Meza · Profesor de Estado de Educación Física (USACH), entrenador y preparador físico.</p>
      </div>
      <div>
        <h4>Sitio</h4>
        <ul>
          <li><a href="index.html">Inicio</a></li>
          <li><a href="sobre-mi.html">Sobre mí</a></li>
          <li><a href="clientes.html">Clientes y entrenamiento</a></li>
        </ul>
      </div>
      <div>
        <h4>Planes</h4>
        <ul>
          <li><a href="planes.html">Precios</a></li>
          <li><a href="planes.html#preguntas">Preguntas</a></li>
          <li><a href="contacto.html">Agenda tu inicio</a></li>
        </ul>
      </div>
      <div>
        <h4>Contacto</h4>
        <ul>
          <li><a data-wa="Hola Pablo!">WhatsApp</a></li>
          <li><a data-ig>Instagram</a></li>
          <li><a data-mail>Email</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-bot">
      <span>© <span data-year></span> Pablo Meza · Negro Pablo</span>
      <span>No se trata de entrenar más. Se trata de entrenar mejor.</span>
    </div>
  </div>
</footer>

<div class="lb" role="dialog" aria-label="Video">
  <button class="lb-x" aria-label="Cerrar">✕</button>
  <video controls playsinline></video>
</div>

<script src="main.js?v={VER}"></script>
<script src="chat.js?v={VER}"></script>
</body>
</html>
'''

# ───────────────── Historias: clientes y entrenamiento ─────────────────
HISTORIAS = [
    # Solo videos de clientes (carpeta Fotos_Pagina/Estudiantesclientes).
    dict(tipo="video", src="c-domicilio", dur=9000, ante="A domicilio",
         titulo="Entrenamos donde estés",
         texto="En tu casa, en el jardín o al aire libre: con colchonetas, mancuernas y bosu llevamos el gimnasio a ti.",
         cap="Entrenamiento a domicilio"),
    dict(tipo="video", src="c-bulgara", dur=7000, ante="En el gimnasio",
         titulo="Fuerza que se nota",
         texto="Sentadilla búlgara con mancuerna: pierna, glúteo y equilibrio en un solo ejercicio.",
         cap="Fuerza en el gimnasio"),
    dict(tipo="video", src="c-adulto-mayor", dur=9000, ante="Adulto mayor",
         titulo="Para todas las edades",
         texto="Fuerza, equilibrio y movilidad adaptados a cada etapa de la vida, para moverse mejor día a día.",
         cap="Adultos mayores activos"),
    dict(tipo="video", src="c-fondos-asistidos", dur=8000, ante="Progresión",
         titulo="Paso a paso",
         texto="Fondos asistidos: hoy la máquina te ayuda, en unas semanas los haces libres.",
         cap="Progresión semana a semana"),
    dict(tipo="video", src="c-core-pareja", dur=8000, ante="En pareja o grupo",
         titulo="Mejor acompañado",
         texto="Circuitos de core en pareja: más motivación y el mismo cuidado de la técnica.",
         cap="Entrenamiento en pareja"),
    dict(tipo="video", src="c-balon-medicinal", dur=7000, ante="Potencia y coordinación",
         titulo="Moverse mejor",
         texto="Pases con balón medicinal: potencia, coordinación y reacción, sin importar la edad.",
         cap="Funcional para todos"),
    dict(tipo="video", src="c-press-piso", dur=7000, ante="Tu turno",
         titulo="¿Entrenamos?",
         texto="Cuéntame tu objetivo y armamos tu plan esta semana.",
         cap="Tu turno", boton=True),
]


def historias(sid):
    slides = []
    for h in HISTORIAS:
        media = (f'<video src="assets/video/{h["src"]}.mp4" poster="assets/img/{h["src"]}.jpg" muted loop playsinline preload="none" aria-label="{h["titulo"]}"></video>'
                 if h["tipo"] == "video" else
                 f'<img src="assets/img/{h["src"]}.jpg" alt="Pablo Meza jugando handball" loading="lazy">')
        boton = (f'<a class="btn btn-p btn-s" data-wa="Hola Pablo! Vi tu página y quiero entrenar contigo">Escribirle a Pablo {ARROW}</a>'
                 if h.get("boton") else "")
        slides.append(f'''        <div class="st-slide" data-dur="{h["dur"]}">
          {media}
          <div class="st-txt"><small>{h["ante"]}</small><h3>{h["titulo"]}</h3><p>{h["texto"]}</p>{boton}</div>
        </div>''')
    chaps = "\n".join(
        f'''        <li><button class="st-chap" type="button"><span class="n">{i + 1:02d}</span><span><b>{h["cap"]}</b><small><span>{h["texto"]}</span></small></span></button></li>'''
        for i, h in enumerate(HISTORIAS))
    return chaps, "\n".join(slides), sid


def bloque_historias(sid, badge, titulo, sub, extra=""):
    chaps, slides, sid = historias(sid)
    return f'''
<section id="clientes">
  <div class="wrap st-wrap">
    <div data-stories="{sid}">
      <span class="badge rev"><i></i>{badge}</span>
      <h2 class="rev">{titulo}</h2>
      <p class="sub rev">{sub}</p>
      <ol class="st-chaps rev" aria-label="Capítulos">
{chaps}
      </ol>
      {extra}
    </div>
    <div class="st-phone rev">
      <div class="stories" id="{sid}" tabindex="0" role="region" aria-roledescription="historias" aria-label="Clientes y entrenamiento. Usa las flechas para avanzar.">
{slides}
        <div class="st-top"><div class="st-bars"></div><div class="st-user"><span class="np-av">NP</span>Pablo Meza · Entrenador</div></div>
        <span class="st-hint" aria-hidden="true">›</span>
      </div>
    </div>
  </div>
</section>
'''


# ───────────────── Carrusel de videos ─────────────────
VIDEOS = [
    # (archivo, título, detalle, categoría, etiqueta, duración)
    # Mis clientes: carpeta Fotos_Pagina/Estudiantesclientes
    ("c-bulgara", "Sentadilla búlgara", "Pierna y glúteo con mancuerna", "clientes", "Cliente", "0:07"),
    ("c-domicilio", "Workout session en casa", "Plancha, bosu y press con mancuerna", "clientes", "Cliente", "0:19"),
    ("c-adulto-mayor", "Rutina diaria en casa", "Fuerza y equilibrio para adulto mayor", "clientes", "Cliente", "0:47"),
    ("c-balon-medicinal", "Pases con balón medicinal", "Potencia y coordinación sentados", "clientes", "Cliente", "0:08"),
    ("c-fondos-paralelas", "Fondos en paralelas", "Tríceps y pecho con peso corporal", "clientes", "Cliente", "0:10"),
    ("c-core-pareja", "Circuito de core en pareja", "Crunch, plancha y elevación de piernas", "clientes", "Cliente", "0:20"),
    ("c-press-piso", "Press de piso con barra", "Fuerza de pecho al aire libre", "clientes", "Cliente", "0:08"),
    ("c-fondos-asistidos", "Fondos asistidos", "Progresión hacia fondos libres", "clientes", "Cliente", "0:18"),
    ("c-encogimientos", "Encogimientos con mancuernas", "Trapecio y agarre", "clientes", "Cliente", "0:15"),
    ("c-core-mancuerna", "Core con mancuerna", "Abdomen al aire libre", "clientes", "Cliente", "0:04"),
    # Mis entrenamientos: carpeta Fotos_Pagina/PabloMeza
    ("c-curl-bayesiano", "Curl bayesiano de bíceps", "Bíceps en polea, en estiramiento", "entrenamientos", "Entrenamiento", "0:07"),
    ("cliente-dominadas", "Dominadas estrictas", "Espalda con peso corporal", "entrenamientos", "Entrenamiento", "0:07"),
    ("evaluacion-vo2", "Test de VO₂ máx", "Evaluación de rendimiento", "entrenamientos", "Entrenamiento", "0:05"),
    ("handball-partido", "Pablo en cancha", "Handball competitivo", "entrenamientos", "Entrenamiento", "0:48"),
]


def carrusel(rid, cat, badge, titulo, sub):
    items = "\n".join(
        f'''      <li><button class="vcard" data-src="assets/video/{src}.mp4" aria-label="Ver video: {t}">
        <span class="fr"><img src="assets/img/{src}.jpg" alt="" loading="lazy"><span class="tg">{tag}</span><span class="pl">{PLAY}</span><span class="du">{du}</span></span>
        <b>{t}</b><small>{d}</small></button></li>'''
        for src, t, d, c, tag, du in VIDEOS if c == cat)
    return f'''
<section style="padding-top:20px">
  <div class="wrap center">
    <span class="badge rev"><i></i>{badge}</span>
    <h2 class="rev">{titulo}</h2>
    <p class="sub rev">{sub}</p>
  </div>
  <div class="wrap">
    <ul class="vrow" id="{rid}">
{items}
    </ul>
  </div>
</section>
'''


# ───────────────── Planes ─────────────────
def plan_card(plan, nombre, desc, items, hot=False):
    flag = '<span class="flag">Más elegido</span>' if hot else ""
    btn = "btn-p" if hot else "btn-g"
    lis = "\n".join(f"          <li>{i}</li>" for i in items)
    return f'''      <article class="plan card{' hot' if hot else ''}" data-plan="{plan}">
        {flag}
        <h3>{nombre}</h3>
        <p class="d">{desc}</p>
        <span class="ses" data-ses></span>
        <div class="pr"><b data-precio></b><span>/ mes</span></div>
        <span class="valor" data-valor></span>
        <p class="total" data-total></p>
        <ul>
{lis}
        </ul>
        <a class="btn {btn} btn-w" data-wa-plan>Quiero este plan</a>
      </article>'''


PLANS = f'''
  <div class="pricing">
    <div class="pick rev">
      <div class="vfilter" data-pick="veces" role="group" aria-label="Veces por semana">
        <button type="button" aria-pressed="true" data-v="2">2 veces por semana</button>
        <button type="button" aria-pressed="false" data-v="3">3 veces por semana</button>
      </div>
      <div class="vfilter" data-pick="periodo" role="group" aria-label="Período de pago">
        <button type="button" aria-pressed="true" data-v="mensual">Mensual</button>
        <button type="button" aria-pressed="false" data-v="trimestral">Trimestral<em>-5%</em></button>
        <button type="button" aria-pressed="false" data-v="semestral">Semestral<em>-10%</em></button>
      </div>
    </div>
    <div class="planes">
{plan_card("online", "Online", "Tu rutina y seguimiento, estés donde estés.", ["Planificación según tu evaluación", "Corrección de técnica por video", "Pauta de alimentación flexible", "Ajustes cada 4 semanas"])}
{plan_card("hibrido", "Híbrido", "2 sesiones presenciales al mes + el resto online.", ["Todo el plan Online, y además…", "Sesiones presenciales para pulir técnica", "Evaluación física inicial", "WhatsApp directo conmigo"], hot=True)}
{plan_card("presencial", "Presencial 1:1", "Entrenamos juntos en cada sesión.", ["Todas las sesiones conmigo", "Técnica y cargas en tiempo real", "Plan de alimentación completo", "Control de progreso mensual"])}
    </div>
  </div>'''

ASSIST = f'''
    <div class="assist card rev">
      <span class="np-av" aria-hidden="true">NP</span>
      <div>
        <h3>¿No sabes cuál elegir?</h3>
        <p>Responde unas preguntas (objetivo, lesiones, días disponibles) y te recomiendo el plan ideal.</p>
      </div>
      <button class="btn btn-p" data-chat-open>Descubrir mi plan {ARROW}</button>
    </div>'''

FAQS = [
    ("¿Necesito experiencia previa?", "No. Cada planificación parte de una evaluación de tu condición física, experiencia y disponibilidad. Desde ahí avanzamos de forma segura."),
    ("¿Qué diferencia hay entre 2 y 3 veces por semana?", "La cantidad de sesiones al mes: 8 o 12. Con 3 veces avanzas más rápido; con 2 es más fácil de sostener si tienes poco tiempo."),
    ("¿Conviene pagar trimestral o semestral?", "Si vas a entrenar en serio, sí: el trimestral tiene 5% de descuento y el semestral 10% sobre el valor mensual."),
    ("¿Puedo entrenar si tengo una lesión?", "Sí, adaptando los ejercicios. Si hay dolor que te limita o estás en tratamiento, partimos con el visto bueno de tu médico o kinesiólogo."),
    ("¿Cómo me corriges la técnica si es online?", "Me mandas videos de tus series por WhatsApp y te devuelvo correcciones concretas: postura, rango de movimiento y ritmo."),
    ("¿Cómo se paga?", "Por transferencia bancaria. Lo coordinamos por WhatsApp al momento de inscribirte."),
]


def faq_html():
    items = "\n".join(f'      <details><summary>{q}<i></i></summary><p>{a}</p></details>' for q, a in FAQS)
    return f'''    <div class="faq card rev">
{items}
    </div>'''


# ═════════════════════════ INICIO ═════════════════════════
INDEX = head("Negro Pablo · Entrenador personal y preparador físico", "Pablo Meza, Profesor de Estado de Educación Física (USACH), entrenador y preparador físico. Entrenamiento online, híbrido y presencial 1:1.") + nav("index.html") + f'''
<main>
<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <h1 class="in-2">Entrena con<br><span class="grad">propósito.</span><br>Avanza de verdad.</h1>
      <div class="ctas in-4">
        <a class="btn btn-p" data-wa="Hola Pablo! Quiero empezar a entrenar contigo">Empezar ahora {ARROW}</a>
        <button class="btn btn-g" data-chat-open>¿Qué plan es para mí?</button>
      </div>
    </div>

    <div class="stage in-3" aria-hidden="true">
      <div class="phone ph-back"><video src="assets/video/c-bulgara.mp4" poster="assets/img/c-bulgara.jpg" muted loop playsinline preload="none" data-auto></video></div>
      <div class="phone ph-3"><video src="assets/video/c-domicilio.mp4" poster="assets/img/c-domicilio.jpg" muted loop playsinline preload="none" data-auto></video></div>
      <div class="phone ph-main"><video src="assets/video/cliente-dominadas.mp4" poster="assets/img/cliente-dominadas.jpg" muted loop playsinline autoplay preload="metadata" data-auto></video></div>
      <div class="float fl-1">
        <div class="fl-ico"><span>{ICONOS["casa"]}</span><div><strong>Gimnasio o domicilio</strong>Tú eliges dónde</div></div>
      </div>
      <div class="float fl-2">
        <strong>Sentadilla búlgara</strong>
        <span class="mono">▲ +2 kg vs mes pasado</span>
        <div class="bar"><i></i></div>
      </div>
      <div class="float fl-3">
        <div class="fl-ico"><span>{ICONOS["pulmones"]}</span><div><strong>VO₂ máx medido</strong>Evaluación inicial</div></div>
      </div>
    </div>
  </div>
</section>

<div class="strip" aria-hidden="true">
  <div class="strip-track">
    <span>Fuerza</span><span>✦</span><span>Velocidad</span><span>✦</span><span>Potencia</span><span>✦</span><span>Resistencia</span><span>✦</span><span>Coordinación</span><span>✦</span><span>Disciplina</span><span>✦</span>
    <span>Fuerza</span><span>✦</span><span>Velocidad</span><span>✦</span><span>Potencia</span><span>✦</span><span>Resistencia</span><span>✦</span><span>Coordinación</span><span>✦</span><span>Disciplina</span><span>✦</span>
  </div>
</div>

<section class="camino" aria-label="Tu camino con Pablo">
  <img class="camino-fondo" src="assets/img/pablo-handball-celebra.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async">
  <div class="wrap camino-inner">
    <div class="camino-head">
      <span class="eyebrow">Cómo funciona</span>
      <h2>Un proceso con <span class="grad">propósito</span></h2>
      <p class="sub">Un buen entrenamiento no es solo hacer ejercicio: tiene un objetivo y está adaptado a la persona que tengo delante.</p>
    </div>
    <div class="camino-mapa">
      <svg class="camino-svg" viewBox="0 0 400 800" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="caminoGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e63946"/><stop offset=".55" stop-color="#ff6b35"/><stop offset="1" stop-color="#ffd23f"/></linearGradient></defs>
        <path class="camino-base" d="M110 60 C 110 180, 290 180, 290 300 C 290 420, 110 420, 110 540 C 110 640, 200 640, 200 740"/>
        <path class="camino-trazo" d="M110 60 C 110 180, 290 180, 290 300 C 290 420, 110 420, 110 540 C 110 640, 200 640, 200 740" pathLength="1"/>
      </svg>
      <div class="camino-nodo" data-x="110" data-y="60" style="left:27.5%;top:7.5%"><span class="bola"><i class="fill"></i><span class="n">01</span><svg class="ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span></div>
      <div class="camino-card der" style="top:7.5%"><div class="burbuja"><small>01 · Evaluación</small><b>Primero, te evalúo.</b><span>Tus objetivos, condición física, experiencia y disponibilidad.</span></div></div>
      <div class="camino-nodo" data-x="290" data-y="300" style="left:72.5%;top:37.5%"><span class="bola"><i class="fill"></i><span class="n">02</span><svg class="ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span></div>
      <div class="camino-card izq" style="top:37.5%"><div class="burbuja"><small>02 · Plan</small><b>Después, diseño tu plan.</b><span>Entrenamientos progresivos y personalizados, pensados para ti.</span></div></div>
      <div class="camino-nodo" data-x="110" data-y="540" style="left:27.5%;top:67.5%"><span class="bola"><i class="fill"></i><span class="n">03</span><svg class="ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span></div>
      <div class="camino-card der" style="top:67.5%"><div class="burbuja"><small>03 · Progreso</small><b>Semana a semana, progresas.</b><span>Revisamos técnica y avance, y ajustamos para que sigas progresando.</span></div></div>
      <div class="camino-meta" data-x="200" data-y="740" style="left:50%;top:92.5%"><span class="etq">Meta</span><span class="aro"><img src="assets/img/pablo-handball-salto.jpg" alt="" loading="lazy"></span></div>
      <div class="camino-yo" aria-hidden="true"><span>Tú</span></div>
    </div>
  </div>
  <div class="camino-popup">
    <div class="popup-in">
      <img src="assets/img/pablo-handball-salto.jpg" alt="Pablo Meza jugando handball">
      <div class="popup-txt">
        <span class="badge"><i></i>¡Llegaste a la meta!</span>
        <p>Porque no se trata de entrenar más, <span class="grad">se trata de entrenar mejor.</span></p>
        <span class="firma">— Pablo Meza</span>
        <a class="btn btn-p btn-w" data-wa="Hola Pablo! Quiero empezar mi camino contigo">Empezar mi camino {ARROW}</a>
      </div>
    </div>
  </div>
</section>
{bloque_historias("historias-inicio", "Clientes y entrenamiento", 'Así se entrena <span class="grad">con Pablo.</span>', "Míralo como historias de Instagram: toca a la derecha para avanzar.", f'<a class="btn btn-g rev" href="clientes.html" style="margin-top:24px">Ver todos los videos {ARROW}</a>')}
<section style="padding-top:20px">
  <div class="wrap">
    <div class="bento">
      <article class="card b-4 rev">
        <div class="b-media">
          <div>
            <span class="num">RESPALDO</span>
            <h3>Formación y alto rendimiento</h3>
            <p>Profesor de Estado de Educación Física titulado en la USACH, con años como deportista de selección y entrenador de handball.</p>
            <div class="stats">
              <div class="stat"><b>USACH</b><span>Profesor de Estado</span></div>
              <div class="stat"><b>Selección</b><span>nacional de handball</span></div>
            </div>
          </div>
          <video src="assets/video/evaluacion-vo2.mp4" poster="assets/img/evaluacion-vo2.jpg" muted loop playsinline preload="none" data-auto></video>
        </div>
      </article>
      <article class="card b-2 rev" style="display:flex;flex-direction:column;justify-content:space-between;gap:24px">
        <div>
          <span class="num">TRAYECTORIA</span>
          <h3>Conoce a Pablo</h3>
          <p>Campeón nacional, competencias internacionales y años formando deportistas.</p>
        </div>
        <a class="btn btn-g btn-s" href="sobre-mi.html" style="align-self:flex-start">Sobre mí {ARROW}</a>
      </article>
    </div>
  </div>
</section>

<section style="padding-top:20px">
  <div class="wrap">
    <div class="head center">
      <span class="eyebrow rev">Planes</span>
      <h2 class="rev">Elige el plan que más <span class="grad">te acomoda</span></h2>
      <p class="sub rev">Planes mensuales, trimestrales y semestrales para entrenar 2 o 3 veces por semana. <span class="highlight">Cuanto más largo el plan, mejores resultados y mayor sostenibilidad.</span></p>
    </div>
{PLANS}
{ASSIST}
    <p class="note rev"><a href="planes.html" style="color:var(--acento);font-weight:700">Ver detalle y preguntas frecuentes →</a></p>
  </div>
</section>
{cta('Tu mejor versión <span style="opacity:.75">parte con un mensaje.</span>', 'Escríbeme, cuéntame tu objetivo y armamos tu plan esta misma semana.')}
</main>
''' + FOOT.replace('<script src="main.js', GSAP + '<script src="main.js', 1)

# ═════════════════════════ SOBRE MÍ ═════════════════════════
GOALS = [
    (ICONOS["fuerza"], "Mejorar tu fuerza y condición física"),
    (ICONOS["correr"], "Aumentar tu rendimiento y capacidad deportiva"),
    (ICONOS["fuego"], "Mejorar tu composición corporal"),
    (ICONOS["rayo"], "Desarrollar velocidad, coordinación, potencia y resistencia"),
    (ICONOS["trofeo"], "Prepararte para desafíos y objetivos deportivos específicos"),
    (ICONOS["cerebro"], "Construir hábitos y disciplina que puedas mantener en el tiempo"),
]
CARRERA = [
    ("Seleccionado nacional", "En categorías inferiores y adulta, y parte de procesos de selección chilena adulta."),
    ("Campeón nacional", "Además de competencias nacionales de clubes y ligas nacionales de handball."),
    ("Competencias internacionales", "En Argentina y Brasil, y campeonatos sudamericanos y panamericanos de clubes."),
    ("DPV Kutral", "Experiencia competitiva representando al club y luego en el ámbito universitario."),
    ("Representando a la USACH", "En competencias universitarias nacionales."),
    ("Entrenador y profesor", "De handball en categorías infantiles y juveniles, profesor de Educación Física y entrenador personalizado."),
]
EDU = [
    (ICONOS["graduacion"], "Profesor de Estado de Educación Física", "Universidad de Santiago de Chile — USACH"),
    (ICONOS["libros"], "Pedagogía en Educación Física, Salud, Deporte y Recreación", "Universidad de Santiago de Chile"),
    (ICONOS["comida"], "Minor en Nutrición y Actividad Física (Salud)", "Universidad de Santiago de Chile"),
]

goals_html = "\n".join(f'      <article class="card goal rev"><span>{e}</span><b>{t}</b></article>' for e, t in GOALS)
carrera_html = "\n".join(f'        <li class="card rev"><b>{t}</b><span>{d}</span></li>' for t, d in CARRERA)
edu_html = "\n".join(f'      <article class="card rev"><span class="ico">{e}</span><b>{t}</b><small>{d}</small></article>' for e, t, d in EDU)

SOBRE = head("Sobre mí · Pablo Meza", "Pablo Nicolás Meza Espinosa: Profesor de Estado de Educación Física (USACH), entrenador y preparador físico. Ex seleccionado nacional de handball.") + nav("sobre-mi.html") + f'''
<main>
<section class="page-hero">
  <div class="wrap about">
    <div class="portrait in-2">
      <img src="assets/img/pablo-handball-salto.jpg" alt="Pablo Meza lanzando en un partido de handball con la camiseta naranja número 2" width="1000" height="1250">
      <div class="float fl-a"><div class="fl-ico"><span>{ICONOS["trofeo"]}</span><div><strong>Campeón nacional</strong>Handball</div></div></div>
      <div class="float fl-b"><div class="fl-ico"><span>{ICONOS["graduacion"]}</span><div><strong>USACH</strong>Profesor de Estado</div></div></div>
    </div>
    <div>
      <span class="badge in-1"><i></i>Sobre mí</span>
      <h1 class="in-2">Pablo Nicolás<br><span class="grad">Meza Espinosa</span></h1>
      <p class="role in-3">Profesor de Estado de Educación Física · Entrenador · Preparador físico</p>
      <div class="in-4" style="margin-top:22px">
        <p>Soy Profesor de Estado de Educación Física titulado por la Universidad de Santiago de Chile (USACH), con experiencia en entrenamiento personalizado, preparación física, deporte competitivo y formación deportiva.</p>
        <p>Mi trayectoria nace desde el propio deporte. He sido deportista de alto rendimiento en handball, participando en competencias nacionales e internacionales y formando parte de procesos de selección nacional. Esta experiencia me permitió conocer de primera mano lo que significa entrenar con objetivos, disciplina, constancia y compromiso.</p>
        <p>A lo largo de mi carrera he combinado mi experiencia como deportista con mi formación profesional, trabajando como entrenador de handball, profesor de Educación Física y Personal Trainer, desarrollando programas de entrenamiento adaptados a las necesidades y objetivos de cada persona.</p>
      </div>
      <div class="ctas in-5">
        <a class="btn btn-p" data-wa="Hola Pablo! Quiero entrenar contigo">Entrenar conmigo {ARROW}</a>
        <a class="btn btn-g" href="clientes.html">Ver clientes y entrenamiento</a>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="head center">
      <span class="eyebrow rev">Mi forma de trabajar</span>
      <h2 class="rev">Entrenar con <span class="grad">propósito</span></h2>
      <p class="sub rev">Creo que un buen entrenamiento no consiste simplemente en hacer ejercicio: debe tener un propósito y estar adaptado a la persona que tienes delante.</p>
      <p class="sub rev" style="margin-top:14px">Por eso, cada planificación parte desde una evaluación de tus objetivos, condición física, experiencia y disponibilidad. A partir de ahí, diseño entrenamientos progresivos y personalizados que permitan avanzar de manera segura y sostenible.</p>
    </div>
    <p class="eyebrow center rev" style="margin-bottom:18px">Mi objetivo es que puedas</p>
    <div class="goals">
{goals_html}
    </div>
    <div class="card big-quote rev">No se trata de entrenar más.<br><span class="grad">Se trata de entrenar mejor.</span></div>
  </div>
</section>

<section>
  <div class="wrap career">
    <div class="career-media">
      <img class="rev" src="assets/img/pablo-handball-celebra.jpg" alt="Pablo Meza celebrando un gol con la camiseta de Kutral" loading="lazy">
    </div>
    <div>
      <span class="eyebrow rev">Experiencia que respalda mi método</span>
      <h2 class="rev">Años de <span class="grad">competencia</span></h2>
      <p class="sub rev" style="margin-bottom:28px">Mi experiencia deportiva comenzó en el handball y se desarrolló durante años de competencia, entrenamiento y preparación física.</p>
      <ul class="timeline">
{carrera_html}
      </ul>
    </div>
  </div>
</section>

{carrusel("videos-pablo", "entrenamientos", "Mis entrenamientos", 'Pablo, <span class="grad">entrenando.</span>', "Evaluación, gimnasio y cancha. Toca un video para verlo en grande.")}
<section style="padding-top:20px">
  <div class="wrap">
    <div class="head center">
      <span class="eyebrow rev">Formación profesional</span>
      <h2 class="rev">Una mirada <span class="grad">integral</span></h2>
    </div>
    <div class="edu">
{edu_html}
    </div>
    <p class="sub center rev" style="margin:28px auto 0">Mi formación combina educación física, entrenamiento, deporte, salud y experiencia práctica, permitiéndome abordar el entrenamiento desde una perspectiva integral.</p>
  </div>
</section>
{cta('¿Partimos <span style="opacity:.75">esta semana?</span>', 'Cuéntame tu objetivo y diseño tu plan desde una evaluación.')}
</main>
''' + FOOT

# ═════════════════════════ CLIENTES Y ENTRENAMIENTO ═════════════════════════
CLIENTES = head("Clientes y entrenamiento · Negro Pablo", "Así entrenan los clientes de Pablo Meza: en el gimnasio, a domicilio y adultos mayores, con evaluación y técnica guiada.", "assets/img/c-bulgara.jpg") + nav("clientes.html") + f'''
<main>
{bloque_historias("historias-clientes", "Clientes y entrenamiento", 'Así se entrena, <span class="grad">por dentro.</span>', "Jóvenes, adultos y adultos mayores, en el gimnasio o a domicilio. Toca a la derecha para avanzar.")}
{carrusel("videos", "clientes", "Mis clientes", 'Clientes reales, <span class="grad">de todas las edades.</span>', "En el gimnasio, en casa o al aire libre. Toca un video para verlo en grande.")}
{cta('¿Quieres entrenar <span style="opacity:.75">así?</span>', 'Evaluación, técnica guiada y un plan que progresa contigo.', "cliente-dominadas")}
</main>
''' + FOOT

# ═════════════════════════ PLANES ═════════════════════════
PLANES = head("Planes · Negro Pablo", "Planes Online desde $59.000, Híbrido desde $99.000 y Presencial 1:1 desde $190.000 al mes. Mensual, trimestral o semestral.") + nav("planes.html") + f'''
<main>
<section class="page-hero" style="padding-bottom:60px">
  <div class="wrap">
    <div class="head center">
      <span class="badge in-1"><i></i>Planes y precios</span>
      <h1 class="in-2">Elige el plan que más <span class="grad">te acomoda.</span></h1>
      <p class="sub in-3">Planes mensuales, trimestrales y semestrales para entrenar 2 o 3 veces por semana. <span class="highlight">Cuanto más largo el plan, mejores resultados y mayor sostenibilidad.</span></p>
    </div>
{PLANS}
    <p class="note rev">Valores mensuales en pesos chilenos. Pago por transferencia, coordinado por WhatsApp. Cupos limitados.</p>
{ASSIST}
  </div>
</section>

<section id="preguntas" style="padding-top:40px">
  <div class="wrap">
    <div class="head center">
      <span class="eyebrow rev">Preguntas frecuentes</span>
      <h2 class="rev">Lo que me preguntan <span class="grad">antes de partir</span></h2>
    </div>
{faq_html()}
  </div>
</section>
{cta('¿Te quedó alguna duda? <span style="opacity:.75">Pregúntame.</span>', 'Respondo personalmente cada mensaje.', "c-curl-bayesiano")}
</main>
''' + FOOT

# ═════════════════════════ CONTACTO ═════════════════════════
CONTACTO = head("Contacto · Negro Pablo", "Escríbele a Pablo Meza y arma tu plan de entrenamiento.") + nav("contacto.html") + f'''
<main>
<section class="page-hero">
  <div class="wrap">
    <div class="head">
      <span class="badge in-1"><i></i>Respondo en menos de 24 h</span>
      <h1 class="in-2">Hablemos de <span class="grad">tu objetivo.</span></h1>
      <p class="sub in-3">Completa esto y se abre WhatsApp con tu mensaje listo para enviar.</p>
    </div>
    <div class="contact">
      <form class="form card in-4" id="contactForm">
        <div class="row">
          <div class="field"><label for="nombre">Tu nombre</label><input id="nombre" name="nombre" required placeholder="Ej: Camila" autocomplete="given-name"></div>
          <div class="field">
            <label for="objetivo">Tu objetivo</label>
            <select id="objetivo" name="objetivo">
              <option>Mejorar fuerza y condición física</option>
              <option>Mejorar composición corporal</option>
              <option>Rendimiento deportivo</option>
              <option>Prepararme para un desafío</option>
              <option>Crear el hábito de entrenar</option>
              <option>Otro</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label>¿Cómo quieres entrenar?</label>
          <div class="seg">
            <label><input type="radio" name="modalidad" value="Online" checked><span>Online</span></label>
            <label><input type="radio" name="modalidad" value="Híbrido"><span>Híbrido</span></label>
            <label><input type="radio" name="modalidad" value="Presencial 1:1"><span>Presencial 1:1</span></label>
            <label><input type="radio" name="modalidad" value="Aún no sé"><span>Aún no sé</span></label>
          </div>
        </div>
        <div class="field"><label for="mensaje">Cuéntame más <span style="color:var(--ink3);font-weight:500">(opcional)</span></label><textarea id="mensaje" name="mensaje" placeholder="Experiencia, lesiones, días disponibles…"></textarea></div>
        <button class="btn btn-p" type="submit">{WA_SVG} Enviar por WhatsApp</button>
      </form>
      <div class="side">
        <button class="card in-4" data-chat-open style="text-align:left;width:100%"><span class="ico">{ICONOS["asistente"]}</span><div><small>Asistente</small><strong>Descubre tu plan en 1 minuto</strong></div></button>
        <a class="card in-4" data-wa="Hola Pablo!"><span class="ico">{ICONOS["whatsapp"]}</span><div><small>WhatsApp</small><strong>+56 9 6406 7622</strong></div></a>
        <a class="card in-5" data-ig><span class="ico">{ICONOS["instagram"]}</span><div><small>Instagram</small><strong data-ig data-ig-text>@negropablo</strong></div></a>
        <a class="card in-5" data-mail><span class="ico">{ICONOS["email"]}</span><div><small>Email</small><strong data-mail data-mail-text>contacto@negropablo.cl</strong></div></a>
      </div>
    </div>
  </div>
</section>
</main>
''' + FOOT

REDIRECT = '''<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=clientes.html"><link rel="canonical" href="clientes.html"><title>Clientes y entrenamiento</title></head>
<body style="background:#060606;color:#fff;font-family:sans-serif"><a href="clientes.html" style="color:#ff6b35">Ir a Clientes y entrenamiento</a></body></html>
'''

for name, html in [("index.html", INDEX), ("sobre-mi.html", SOBRE), ("clientes.html", CLIENTES),
                   ("planes.html", PLANES), ("contacto.html", CONTACTO), ("entrenamientos.html", REDIRECT)]:
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        f.write(html)
    print("ok", name, len(html))
