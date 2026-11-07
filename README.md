# 🌱 Semillitas de Fe

Sitio con lecciones, dinámicas y materiales bíblicos para maestros de niños y
niñas de **3 a 10 años**, basados en la **Reina-Valera 1960**.

🌐 **<https://semillitasbiblicas.space>** · Gratuito · Creado por Gerardo Sosa

---

## Qué incluye

| Sección | Dirección | Qué hay |
| --- | --- | --- |
| Portada | `/` | Bienvenida corta, accesos rápidos y lecciones destacadas de la semana |
| Clases | `/lecciones/` | Las **39 lecciones**, con buscador y filtros |
| Planes | `/series/` | Rutas de enseñanza que agrupan las clases por semanas |
| Cada clase | `/lecciones/<nombre>/` | Historia, versículo, preguntas, dinámica, manualidad y oración |
| Juegos | `/juegos/` | Ruleta, memoria de 6 a 10 parejas, “¿quién soy?” con pistas, juego de mesa con dado 3D y **«El buen pastor» en 3D**, para proyectar |
| Imprimibles | `/printables.html` | Hojas para colorear, versículos y actividades |
| Guía del maestro | `/maestros/` | Método de clase mixta, programa de 60 minutos, videos y canales |

Además es una **PWA**: se puede instalar en el celular y funciona sin internet
una vez visitadas las páginas.

---

## Cómo está hecho

HTML, CSS y JavaScript puros. **No hay que compilar ni instalar nada** para
trabajar en el sitio: se edita el archivo y listo. Se publica con GitHub Pages
desde la rama `main`.

### Mapa de archivos

```
index.html              Portada (lleva su propio catálogo, ver más abajo)
home.js  home.css       Accesos rápidos, destacadas, planes y «continúa donde quedaste»
home-destacadas.js      ⭐ Qué lecciones se destacan en la portada y sus materiales
home-dock.js/.css       El único botón flotante y su bandeja (Sion, agenda, cuenta…)
maestros/index.html     Guía del maestro: método, programa de clase, videos y canales
lecciones/index.html    Listado de las 39 clases
lecciones/<nombre>/     Una carpeta por clase
series/index.html       Planes de enseñanza (agrupan las clases en rutas)
juegos/                 Juegos para proyectar (incluye la Ruleta Bíblica)
juegos-3d.js  juegos-3d.css  «El buen pastor» en 3D (se carga solo al abrirlo)
printables.html         Material imprimible

printables-data.js      ⭐ FUENTE DE VERDAD del contenido de las 39 lecciones
additional-lessons*.js  Material extra de las lecciones 25 a 39
lesson-data.js          Arma el catálogo completo a partir de lo anterior
series-data.js          ⭐ FUENTE DE VERDAD de los planes de enseñanza

sw.js                   Service worker: caché y modo sin conexión
pwa-register.js         Registra la PWA también en las páginas de entrada directa
accessibility.css       Enlace para saltar al contenido, foco, movimiento reducido
                        y el agrandado de pantallas grandes y proyector (≥ 1440 px)
manifest.webmanifest    Datos de la app instalable
sitemap.xml  robots.txt Para los buscadores
404.html                Página de error con buscador de clases

fonts.css               Declara las dos tipografías del sitio (un solo lugar)
fonts/                  Baloo 2 y Nunito en woff2, con su licencia OFL
vendor/                 Cliente de Supabase y Three.js empaquetados (los genera tools/)
images/lessons/         Portadas: <nombre>.webp (1200px) y <nombre>-800.webp
images/avatars/         Retratos dibujados de los personajes (12 SVG de 240×240)
icons/                  Iconos del sitio
media/                  Escena vectorial del hero (hero-amanecer.svg)
tools/                  Utilidades de mantenimiento (no se usan en el sitio)
tools/generar-avatares-svg.mjs  Redibuja los 12 retratos de images/avatars/
```

---

## Tareas comunes

### Comprobar que todo sigue en pie

No hay que instalar nada: son revisores de Node puro que ahora también corren
solos en cada push (`.github/workflows/sitio-v1.yml`).

```bash
node tools/revisar-sitio.mjs       # enlaces, páginas cortadas, versiones ?v=
node tools/revisar-plataforma.mjs  # accesibilidad, PWA y caché del service worker
node tools/revisar-cobertura.mjs   # portadas y archivos de cada lección
node tools/probar-juego-3d.mjs     # arma el campo 3D y revisa sus ovejas y la cerca
```

Los demás (`revisar-destacadas`, `revisar-series`, `revisar-juegos`,
`revisar-videos`, `revisar-biblia`, `revisar-calendario`) comprueban el
contenido. Todos deben terminar en ✅ antes de subir cambios.

### El fondo animado de la portada

El hero no usa fotos: es una escena vectorial, `media/hero-amanecer.svg`,
dibujada con el mismo kit que las 39 portadas de lección. Se ve nítida en
cualquier pantalla (incluido 4K) y su movimiento —sol, nubes, niebla, trigo y
semillas de luz— es CSS dentro del propio SVG, así que lo anima el navegador
sin gastar CPU.

```bash
node tools/generar-hero.mjs   # vuelve a dibujar la escena
```

Para cambiar la composición (posición del sol, colores, horas del día) se edita
`tools/generar-hero.mjs`, nunca el SVG a mano: el archivo se regenera entero.
Recuerda subir el `?v=` de `home-cinematic.css` y el nombre de `CACHE` en
`sw.js` para que el cambio llegue a quien ya visitó el sitio.

### El juego 3D («El buen pastor»)

`/juegos/` tiene una quinta pestaña que abre un campo en 3D: el pastor camina,
encuentra cinco ovejas y las lleva al redil (Lucas 15:4-7). No hay tiempo
límite, vidas ni eliminados, y al terminar se lee Lucas 15:6.

- **Motor:** Three.js viaja con el sitio en `vendor/three.module.min.js` y
  `vendor/three.core.min.js` (MIT, con su licencia al lado). Nada de CDN: así
  el juego funciona sin conexión y no depende de terceros.
- **Peso:** son ~700 KB de motor que **solo se descargan al pulsar «Jugar en
  3D»** (`import()` perezoso desde `juegos.js`). Quien entra a la ruleta no los
  paga. El service worker los guarda la primera vez y después el juego abre sin
  internet.
- **Controles:** flechas o W A S D, clic/toque en el pasto para caminar y un
  joystick para el teléfono. `P` pausa y `R` reinicia.
- **Sin archivos de audio:** los balidos y la melodía final se sintetizan con
  WebAudio y se pueden apagar. Con `prefers-reduced-motion` se apagan la cámara
  flotante, los latidos de luz y los saltitos.
- **Si el equipo no puede con el 3D**, la tarjeta de inicio lo explica y los
  otros cuatro juegos siguen funcionando igual.

```bash
node tools/probar-juego-3d.mjs       # arma el mundo en Node: NaN, ovejas, cerca y pasaje
node tools/revisar-juegos.mjs        # pestaña, import perezoso, licencia y versiones ?v=

npm install jsdom                    # opcional, una sola vez
node tools/probar-juego-3d.mjs --domo # juega la partida entera sin navegador
```

`--domo` es la prueba más completa: carga `/juegos/` en un DOM simulado, sustituye
la tarjeta gráfica por un renderizador de mentira y juega con las flechas hasta
encontrar las cinco ovejas y volver al redil. Comprueba la celebración, el
reinicio, la pausa y el botón de sonido. Queda fuera del CI a propósito, para
que el sitio siga sin dependencias.

Para cambiar el campo (colores, colinas, número de ovejas) se edita
`construirMundo` en `juegos-3d.js`; el juego está separado en tres piezas:
`alturaTerreno` (el relieve), `construirMundo` (la escena) y `iniciarPastor`
(la partida). Las constantes del juego —ovejas, radio del campo, puerta del
redil— están arriba del todo, en un solo bloque.

### Los retratos de los personajes

Los avatares de **Memoria bíblica**, **¿Quién soy?**, el selector de cuenta, el
panel del maestro y las fichas del tablero son **dibujos hechos con código**:
SVG de `images/avatars/` con el mismo lenguaje que las portadas de las clases
—contorno grueso, color plano, caras de cuento—, nada de fotos ni de imágenes
generadas. Cada retrato mide 240×240, tiene recorte circular, fondo pastel
propio y un `<title>` para lectores de pantalla.

```bash
node tools/generar-avatares-svg.mjs            # vuelve a dibujar los 12 retratos
node tools/generar-avatares-svg.mjs --revisar  # comprueba que existen y llevan título
```

| Clave | Personaje | Se usa en |
| --- | --- | --- |
| `semilla` | Un brote en el jardín (Creación) | memoria, cuenta (avatar por defecto) |
| `adan` | Adán y Eva | memoria, «¿quién soy?», cuenta |
| `noe` | Noé con arcoíris y barba blanca | memoria, «¿quién soy?», cuenta, tablero |
| `maestro` | Moisés con cayado y tablas | memoria, «¿quién soy?», cuenta, tablero |
| `david` | David con arpa, honda y oveja | memoria, «¿quién soy?», cuenta, tablero |
| `leon` | Daniel junto al león | memoria, «¿quién soy?», cuenta |
| `maestra` | Ester con corona | memoria, «¿quién soy?», cuenta, tablero |
| `biblia` | Jesús con túnica y manto azul | memoria, «¿quién soy?», cuenta |
| `paloma` | Paloma con rama de olivo | memoria, cuenta |
| `juan` | Juan el Bautista en el Jordán | memoria, «¿quién soy?», cuenta |
| `rut` | Rut con un haz de espigas | memoria, «¿quién soy?», cuenta |
| `jonas` | Jonás sorprendido junto al gran pez | memoria, «¿quién soy?», cuenta |

Para cambiar un dibujo no se edita el SVG a mano: se toca su escena en
`tools/generar-avatares-svg.mjs` y se vuelve a ejecutar el script. Para añadir
un personaje hacen falta tres pasos: la escena en el script, la clase
`.avatar-art-<clave>` **en las dos hojas** (`juegos.css` y `account-ui.css`) y
la ruta en `ACCOUNT_ASSETS` de `sw.js`, que es lo que lo deja disponible sin
conexión. `node tools/revisar-juegos.mjs` avisa si falta alguno de los tres.

### Actualizar el cliente de Supabase

El sitio no le pide el cliente a una CDN: lo sirve desde `vendor/`, así que
también funciona sin conexión. Para subir de versión:

```bash
node tools/generar-vendor.mjs --version 2.57.4
```

Recuerda subir el `?v=` de `vendor/supabase-js.min.js` en `auth.js`,
`lesson-page.js` y `sw.js`.

**Three.js** se actualiza aparte, porque no se empaqueta: se copian los dos
archivos oficiales desde npm.

```bash
node tools/generar-vendor.mjs --solo three --three 0.180.0
```

Después hay que subir el `?v=` de `juegos-3d.js` (va en `juegos.js` y en
`sw.js`) y la versión de `RUTA_THREE` dentro de `juegos-3d.js`.

**Tipografías.** Las fuentes viven en `fonts/` y se declaran una sola vez en
`fonts.css`, que cada página enlaza con sus dos `preload`. Para cambiar de
familia: deja el `.woff2` en `fonts/`, ajusta `@font-face` en `fonts.css` y
actualiza el `?v=` de `fonts.css` en las páginas y en `sw.js`.

### Ver el sitio en tu computadora

```bash
node tools/servidor-local.mjs
# abre http://localhost:8000
```

Imita a GitHub Pages: carpetas con `index.html` y la página `404.html` propia.

### Agregar o editar una lección

1. Edita el contenido en **`printables-data.js`** (y en `additional-lessons*.js`
   si es de la lección 25 en adelante). **Este es el único lugar donde se
   escribe el contenido.**
2. Sincroniza la portada, que lleva una copia del catálogo por motivos técnicos:
   ```bash
   node tools/sincronizar-portada.mjs            # muestra las diferencias
   node tools/sincronizar-portada.mjs --escribir # las corrige
   ```
   El mismo script revisa el enlace «Ver los N planes →»: los planes son los de
   `series-data.js` y el número de la portada se escribe a mano, así que también
   compara cuántos hay (el 14 de octubre decía 6 con 7 series).
3. Si agregaste una lección nueva, crea su carpeta en `lecciones/<nombre>/` y su
   portada en `images/lessons/` (ver abajo).
4. Vuelve a generar el mapa del sitio:
   ```bash
   node tools/generar-sitemap.mjs
   ```
5. Si cambiaste un `.js` o un `.css`, súbele el número a su `?v=` **en todos los
   archivos que lo piden, incluido `sw.js`**, y cambia el nombre de `CACHE` en
   `sw.js`. Si no, quien ya visitó el sitio seguirá viendo la versión vieja.
   `node tools/revisar-sitio.mjs` avisa cuando los números no coinciden.

### Agregar la portada de una lección

Guarda la ilustración como `images/lessons/<nombre>.webp` a **1200 × 800 px** y
genera la versión pequeña que usan los celulares:

```bash
convert images/lessons/<nombre>.webp -resize 800x -quality 82 images/lessons/<nombre>-800.webp
```

### Cambiar las lecciones destacadas de la portada

Todo está en **`home-destacadas.js`**:

- `DESTACADAS` — las tarjetas fijas (título de la etiqueta, lección, duración,
  edad y pasaje). La que lleva `rotatoria: true` cambia sola cada semana.
- `ROTACION_SEMANAL` — la lista de lecciones por las que va pasando esa
  tarjeta, una por semana.
- `MATERIALES` — qué hace falta llevar a clase, por lección.

Después conviene correr `node tools/revisar-destacadas.mjs`.

### Comprobar que nada se rompió

**1. Revisión bíblica** — que el contenido respete la Reina-Valera 1960:

```bash
node tools/revisar-biblia.mjs
```

No necesita instalar nada. Avisa si aparece un libro deuterocanónico, otra
versión de la Biblia, vocabulario devocional católico, un «San» antepuesto a un
personaje bíblico o «Yahvé» en lugar de «Jehová», y lista los libros citados.
Termina con error si encuentra algo, así que **conviene correrlo antes de
publicar**.

**2. Revisión de los planes** — que ninguna serie apunte a una clase que no existe:

```bash
node tools/revisar-series.mjs
```

Comprueba además que la portada anuncie el número correcto de planes
(«Ver los 7 planes») y cuántas lecciones del catálogo quedan fuera de todo plan.

**3. Revisión del sitio** — que ninguna página esté cortada ni le falte su JavaScript:

```bash
node tools/revisar-sitio.mjs
```

No necesita instalar nada. Busca páginas incompletas, enlaces y recursos que no
existen, archivos pedidos con dos versiones distintas de `?v=`, precargas rotas
en `sw.js` y lecciones sin descripción propia. Termina con error si encuentra
algo, así que **conviene correrlo antes de publicar**.

**4. Revisión de las destacadas** — que la portada destaque clases que existen:

```bash
node tools/revisar-destacadas.mjs
```

Comprueba las tarjetas fijas, la rotación semanal y que ninguna lección se
quede sin lista de materiales en `home-destacadas.js`.

**5. Revisión técnica** — que la página siga funcionando:

```bash
npm install jsdom            # solo la primera vez
node tools/probar-portada.mjs
```

Levanta la portada en un navegador de mentira y revisa las 31 comprobaciones:
el catálogo, los seis accesos rápidos, que haya **un solo botón flotante**, la
bandeja, la ventana de lección, el asistente Sion, el buscador, las tarjetas
destacadas (duración, edad, pasaje y materiales), «continúa donde quedaste» y
los planes. Necesita el servidor local encendido:

```bash
node tools/servidor-local.mjs &   # en otra terminal
node tools/probar-portada.mjs
```

**6. Revisión de plataforma** — valida las rutas del caché, el registro de la
PWA y el enlace de navegación por teclado en todas las páginas. No necesita
instalar dependencias:

```bash
node tools/revisar-plataforma.mjs
```

**7. Revisión de cobertura** — que ninguna clase se quede a medias:

```bash
node tools/revisar-cobertura.mjs
```

Carga el catálogo tal como lo ve el navegador y revisa lección por lección que
existan la carpeta, las dos portadas, la consigna de párvulos en
`preschool-data.json`, los materiales de `home-destacadas.js` y el contenido
completo (historia, preguntas, quiz con una sola respuesta válida, actividad,
versículo y oración). También avisa si un emoji, un título o un slug se repite.

**8. Revisión del calendario** — que el contenido no dependa de la fecha:

```bash
node tools/revisar-calendario.mjs
```

Vigila la regla del proyecto: el contenido se elige por el pasaje que enseña,
no por el calendario religioso. Busca adviento, cuaresma, Semana Santa, Navidad
y demás encuadres de temporada en las páginas, el contenido y los planes.

**9. Revisión de videos** — que ninguna clase se quede sin video:

```bash
node tools/revisar-videos.mjs              # sin internet
node tools/revisar-videos.mjs --en-linea   # además comprueba cada video
```

Recuerda qué clases ya tienen un video revisado y cuáles siguen mostrando la
búsqueda guiada, comprueba que cada identificador de YouTube sea válido, que
ninguna clase repita el video de otra y que el enlace coincida con el video.
Con `--en-linea` pregunta por cada video a YouTube y muestra su título y su
canal: si un video está retirado o no se deja insertar, la clase se queda con un
reproductor vacío y aquí aparece el aviso.

### Publicar los cambios

Al subir a la rama `main`, GitHub Pages reconstruye el sitio en 1-2 minutos.

> ⚠️ Si cambias un archivo `.css` o `.js`, **sube también su número de versión**
> (por ejemplo `juegos.css?v=5` → `?v=6`) en las páginas que lo usan y en la
> lista `CORE` de `sw.js`, y cambia el nombre del caché al inicio de `sw.js`.
> Si no, quien ya visitó el sitio seguirá viendo la versión vieja.

---

## Reglas del proyecto

### 📖 Regla bíblica (no negociable)

**Todo el contenido se basa en la Reina-Valera 1960, Biblia evangélica.** Esta
regla manda sobre cualquier otra consideración y se aplica a lecciones, juegos,
imprimibles, canciones y a las respuestas del asistente Sion.

En la práctica significa:

| Sí | No |
| --- | --- |
| Reina-Valera 1960 (RVR1960) | NVI, NTV, TLA, LBLA, DHH, PDT, Nueva Versión Internacional, Nueva Traducción Viviente, Traducción en Lenguaje Actual, Dios Habla Hoy, Biblia Latinoamericana u otra versión |
| Los **66 libros** del canon evangélico | Deuterocanónicos: Tobías, Judit, Sabiduría, Eclesiástico, Baruc, 1-2 Macabeos y las adiciones a Ester y Daniel |
| **Jehová** (como traduce la RVR1960) | Yahvé, Yahveh, Yahweh |
| Pedro, Pablo, María, José | «San Pedro», «Santa María», «la Virgen María» |
| La Biblia como única autoridad | Tradición, catecismo, santos como intercesores, rosario, purgatorio, sacramentos |
| Orar a Dios por medio de Jesucristo | Orar a María, a los santos o a los ángeles |

Cada lección cita su **pasaje exacto** (libro, capítulo y versículo) para que el
maestro pueda abrir la Biblia y comprobarlo.

> Antes de publicar contenido nuevo, pasar la revisión de la sección
> [Comprobar que nada se rompió](#comprobar-que-nada-se-rompió), que incluye un
> chequeo automático de esta regla.

### Las demás reglas

- El material es para **niños de 3 a 10 años**: lenguaje sencillo, sin imágenes
  ni descripciones que puedan asustar.
- **No se suben respaldos `.zip`, archivos temporales ni credenciales** (ver
  `.gitignore`). Todo lo que está en el repositorio queda público en internet.
- Las cuentas de maestros usan Supabase; las llaves del proveedor viven en una
  función del servidor, nunca en el navegador.

---

## Estado y mejoras pendientes

Ver **[`MEJORAS.md`](MEJORAS.md)** para el diagnóstico técnico completo y la
lista de mejoras pendientes por prioridad.

---

## 🚧 Versión 2.0 (en desarrollo)

En [`v2/`](v2/) se construye la nueva generación del sitio: **Next.js 15,
TypeScript y Tailwind CSS 4**, con las 39 lecciones migradas automáticamente,
búsqueda instantánea, quiz interactivo, páginas pre-renderizadas y CI con
GitHub Actions (lint · tipos · build).

```bash
cd v2 && npm install && npm run dev
```

Consulta **[`v2/README.md`](v2/README.md)** para el stack, la hoja de ruta y
las decisiones técnicas.
