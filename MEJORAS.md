# Semillitas de Fe · Diagnóstico y mejoras aplicadas

> Revisión técnica completa del repositorio · **5 de octubre de 2026**
> Sitio: <https://semillitasbiblicas.space> · GitHub Pages desde la rama `main`

---

## 1. Resumen

Se revisaron los 121 archivos del repositorio uno por uno, siguiendo las
importaciones de JavaScript, los estilos de cada página y las 58 direcciones que
guarda el modo sin conexión.

**Buena noticia de partida:** el proyecto estaba sano. No había enlaces rotos,
ni hojas de estilo huérfanas, ni imágenes sin usar. El único archivo sobrante
era un respaldo `.zip`.

Lo que sí se corrigió fue: peso de las imágenes, visibilidad en buscadores,
tres fallos silenciosos del modo sin conexión y la duplicación del catálogo.

---

## 2. Cambios aplicados

### 🗑️ Limpieza

| Qué | Detalle |
| --- | --- |
| Eliminado `SITIO-COMPLETO.zip` | Copia completa del sitio (154 archivos, **13.4 MB**) duplicada dentro del repositorio. No estaba enlazada, pero era descargable en `semillitasbiblicas.space/SITIO-COMPLETO.zip`. |
| Añadido `.gitignore` | Impide que vuelvan a subirse respaldos `.zip`, temporales, basura del sistema y, sobre todo, archivos con llaves o contraseñas. |

> El ZIP no se perdió: sigue en el historial de Git.
> `git show main:SITIO-COMPLETO.zip > SITIO-COMPLETO.zip`

### 🔍 Visibilidad en buscadores y redes

| Qué | Detalle |
| --- | --- |
| **`sitemap.xml`** | Las 38 direcciones del sitio, con su fecha de última modificación. Se regenera con `node tools/generar-sitemap.mjs`. |
| **`robots.txt`** | Indica dónde está el sitemap y excluye las páginas de servicio. |
| **`404.html`** | Antes, una dirección mal escrita mostraba la pantalla gris de GitHub en inglés. Ahora aparece una página de Semillitas con **buscador de clases**, que además adivina qué lección buscaba el visitante a partir de la dirección fallida. |
| **Etiquetas sociales** | `/juegos/` y `/printables.html` no tenían `canonical`, Open Graph ni datos estructurados: al compartirlas por WhatsApp salían sin imagen ni descripción. Ya las tienen, igual que el resto del sitio. |

### ⚡ Peso y velocidad

| Imagen | Antes | Ahora | Ahorro |
| --- | --- | --- | --- |
| `icons/bible-avatars.png` → `.webp` | 2 127 KB | **126 KB** | 94 % |
| `icons/sion-bible.png` → `.webp` | 1 457 KB | **25 KB** | 98 % |
| `icons/icon-512.png` | 304 KB | **104 KB** | 66 % |
| **Total de iconos** | **3 888 KB** | **255 KB** | **93 %** |

Las tres se compararon lado a lado con las originales antes de reemplazarlas:
se ven idénticas.

**Portadas de las lecciones.** Cada una pesaba 140 KB y se descargaba siempre en
tamaño de escritorio (1200 px), incluso en un celular que la muestra a 370 px.
Ahora hay una segunda versión de 800 px y el navegador elige la adecuada
(`srcset`). Abrir el catálogo completo en el celular baja de **3.9 MB a 2.6 MB**
(33 % menos).

### 🔧 Fallos corregidos

1. **Sin internet, las lecciones no abrían.** El modo sin conexión sí guardaba
   cada lección visitada, pero al quedarse sin señal devolvía siempre la
   portada en lugar de la página guardada. Ahora devuelve primero la página
   exacta que el maestro pidió.
2. **Una portada nunca se guardaba.** La regla que decide qué ilustraciones
   conservar sin conexión no aceptaba números, así que
   `gedeon-y-los-300.webp` quedaba fuera. Corregido: las 31 (y sus versiones de
   800 px) ya se guardan.
3. **La página 404 ahora funciona sin conexión** también.

### 📚 Catálogo unificado

El contenido de las 31 lecciones estaba escrito en **dos lugares**: en
`printables-data.js` y copiado a mano dentro de `index.html`. Ya habían quedado
**40 diferencias** entre ambos (comillas, rayas en los pasajes y 7 emojis
distintos).

- Se corrigió la tipografía en `printables-data.js` (comillas “curvas” y rayas
  en los rangos: `Génesis 6–9` en vez de `Génesis 6-9`) → mejora en las 32
  páginas que leen ese archivo.
- Se unificaron los 7 emojis que discrepaban.
- Se creó **`tools/sincronizar-portada.mjs`**: ahora el contenido se escribe en
  un solo lugar y un comando mantiene la portada al día.

```bash
node tools/sincronizar-portada.mjs            # ¿hay diferencias?
node tools/sincronizar-portada.mjs --escribir # corregirlas
```

### 🧪 Herramientas de mantenimiento (`tools/`)

| Archivo | Para qué |
| --- | --- |
| `servidor-local.mjs` | Ver el sitio en la computadora, imitando a GitHub Pages |
| `sincronizar-portada.mjs` | Mantener la portada igual que el catálogo |
| `generar-sitemap.mjs` | Regenerar `sitemap.xml` al agregar lecciones |
| `probar-portada.mjs` | Simula un navegador y comprueba catálogo, ventana de lección, Sion, ruleta y buscador |

### 📖 Documentación

`README.md` pasó de dos líneas a una guía con el mapa de archivos, cómo agregar
una lección, cómo probar y las reglas del proyecto.

---

## 3. Rediseño de la portada · 7 de octubre de 2026

La portada hacía de todo: presentación, método de clase, videoteca, canales,
recursos, la Ruleta Bíblica completa y el catálogo de las 31 lecciones, con
cuatro botones flotantes encima. Se acortó y se repartió el contenido.

### Qué se pidió y cómo quedó

| Pedido | Solución |
| --- | --- |
| Acortar la portada | De 21 secciones a **seis**: bienvenida, accesos rápidos, destacadas, planes, herramientas y protección infantil. El método, el programa de clase, la videoteca y los canales se mudaron a **`/maestros/`**. |
| Accesos rápidos arriba | `#accesos`: seis tarjetas (Lecciones, Planes, Juegos, Imprimibles, Guía del maestro, Mi cuenta) justo debajo de la bienvenida. En el celular hacen de menú, porque la barra superior se oculta por debajo de 900 px. |
| Un solo botón flotante | `home-dock.js`: un único botón abre una bandeja con Sion, la agenda, las favoritas, la cuenta e «instalar la app». Antes había cuatro botones sueltos tapándose entre sí. |
| Lecciones destacadas con sus datos | `#destacadas`: cinco tarjetas con **duración, rango de edad, pasaje y materiales necesarios**. Cuatro son fijas por tema y una rota cada semana entre 14 lecciones (`home-destacadas.js`). |

La **Ruleta Bíblica** no se eliminó: sigue completa en `/juegos/`, y la portada
la ofrece como una tarjeta más de accesos rápidos.

### Añadidos

- `maestros/index.html` — guía del maestro con el método de clase mixta, el
  programa de 60 minutos, la videoteca y los canales recomendados.
- `home-destacadas.js` — una sola lista con las destacadas, la rotación semanal
  y los materiales de las 31 lecciones.
- `home.js` — además de las destacadas, arma los planes y la tarjeta
  «continúa donde quedaste» leyendo el progreso guardado en el navegador.
- `tools/revisar-destacadas.mjs` — avisa si una destacada apunta a una lección
  que no existe o si alguna clase se quedó sin materiales.

### Fallos encontrados de paso

| Dónde | Qué pasaba |
| --- | --- |
| `series/index.html` | El archivo estaba cortado a la mitad: la página de planes se quedaba para siempre en «Cargando los planes…». |
| `series-page.js` | Cargaba `auth.js` sin definir antes `window.Semillitas`, y eso rompía la sesión del maestro en `/series/`. |
| `home-dock.js` | Un `MutationObserver` se disparaba a sí mismo sin parar (escribía `hidden` con el mismo valor que ya tenía). Bastaba cualquier cambio en la página para **congelar el navegador**. Ahora solo escribe cuando el estado cambia de verdad. |
| `index.html` | El guion de Sion buscaba el enlace «Sion» del menú viejo; al no existir, fallaba y perdía los demás botones del chat. Y un botón llevaba a una videoteca que ya no estaba en la portada. |

### Integración con lo que ya estaba en `main`

Mientras se rediseñaba la portada, `main` recibió cuatro mejoras (PR #3 a #6).
Se fusionaron antes de publicar, resolviendo 39 conflictos, para no borrar nada:

| De `main` | Qué se conservó |
| --- | --- |
| #4 · carga de `/series/` | Su arreglo, que es el mismo que se había hecho aquí. |
| #5 · correcciones del sitio | Datos de lección corregidos (emoji de «Fe» y «El hijo pródigo»), `rel="noopener"` y la herramienta `tools/revisar-sitio.mjs`. |
| #6 · menú móvil accesible | El botón hamburguesa con ARIA, cierre con Escape, al tocar fuera y al elegir una opción. Se adaptó a la portada nueva y ahora **sí tiene pruebas** (el PR original no pudo ejecutarlas). |

Los accesos rápidos no sustituyen al menú: en el celular conviven el
desplegable de la barra superior y la rejilla de `#accesos`.

---

## 4. Comprobaciones realizadas

- ✅ Las 38 páginas responden correctamente; ninguna dirección rota.
- ✅ Las 58 direcciones del modo sin conexión existen (si una fallara, el modo
  sin conexión no se instalaría).
- ✅ 26 pruebas automáticas sobre la portada (`tools/probar-portada.mjs`):
  catálogo de 31 lecciones, títulos únicos, seis accesos rápidos, **un solo
  botón flotante**, la bandeja, la ventana de lección, el asistente Sion, el
  buscador, las destacadas con sus cuatro datos, «continúa donde quedaste» y
  los planes.
- ✅ Las 70 direcciones del modo sin conexión responden tras el rediseño.
- ✅ Los planes, las destacadas y el catálogo de la portada apuntan a lecciones
  que existen (`revisar-series`, `revisar-destacadas`, `sincronizar-portada`).
- ✅ Sin errores de JavaScript en consola.
- ✅ **Contraste de color**: los 11 pares principales superan el mínimo de
  accesibilidad WCAG AA (el más bajo, 4.73:1, sobre un mínimo de 4.5:1).
- ✅ `loading="lazy"` ya estaba bien aplicado en las portadas del catálogo.
- ✅ Ningún contenido de lección se perdió ni se alteró: solo cambió tipografía.

---

## 5. Lo que queda pendiente

### 🟡 El asistente Sion está duplicado

Existe una versión escrita dentro de `index.html` y otra en `sion-widget.js`
(la que usan las otras 36 páginas). Son dos implementaciones del mismo chat,
y hay que arreglar cada una por separado.

**No se unificó** porque el entorno de trabajo no tiene un navegador real para
comprobarlo, y la versión de la portada tiene funciones propias (por ejemplo,
responder sobre la Ruleta Bíblica). Conviene hacerlo con pruebas en un
navegador de verdad.

### 🟢 Ideas para después

- **Analítica respetuosa**: saber qué lecciones se usan más ayudaría a decidir
  qué contenido crear. Hay opciones sin cookies ni rastreo de menores.
- **Contenido**: lecciones de la 32 en adelante y más material imprimible
  separado por edad (3-5 años frente a 6-10 años).
- **Video de portada**: son 4.9 MB, lo más pesado que queda. Ya está bien
  resuelto (solo se descarga si la conexión lo permite), pero recortarlo a unos
  8 segundos lo dejaría en la mitad.
- **Revisión de teclado**: el contraste ya cumple; faltaría recorrer el sitio
  solo con la tecla Tab para confirmar que todo es alcanzable.

---

*Documento generado durante la revisión técnica del repositorio.*

---

## 6. Accesibilidad, PWA y resiliencia · 8 de octubre de 2026

Esta actualización se aplicó sobre la versión vigente de `main`, conservando el
rediseño de portada y las mejoras publicadas previamente. No se agregó contenido
bíblico.

- **Accesibilidad global:** las 42 páginas HTML incluyen un enlace para saltar
  al contenido, foco de teclado visible y respeto a la preferencia de movimiento
  reducido. Los elementos principales reciben un destino de foco explícito.
- **PWA en entradas directas:** `pwa-register.js` registra el service worker en
  todas las páginas y permite guardar también la página abierta al entrar desde
  un enlace compartido o un buscador. Se excluyen URLs con parámetros para no
  almacenar búsquedas ni callbacks de autenticación.
- **Progreso de clases:** el indicador anuncia su porcentaje a tecnologías de
  asistencia; cada parte de la dinámica se conserva localmente y se puede
  desmarcar; el desplazamiento respeta movimiento reducido.
- **Copiar versículo:** se usa Clipboard API cuando está disponible y un recurso
  compatible como alternativa, sin interrumpir la clase si el navegador lo
  bloquea.
- **Robustez de componentes:** se protegen las consultas de `matchMedia` en
  juegos y portada; el diálogo de Sion devuelve el foco al botón que lo abrió.
- **Caché renovada:** service worker `semillitas-v56-pwa-accesible`, con las
  versiones actualizadas de los recursos PWA y de accesibilidad.

### Verificación

`node tools/revisar-plataforma.mjs`, `node tools/revisar-series.mjs`,
`node tools/revisar-biblia.mjs`, `node tools/revisar-destacadas.mjs`,
`node tools/sincronizar-portada.mjs` y `node tools/probar-portada.mjs`.

---

## 7. Catálogo de 39 lecciones · 14 de octubre de 2026

El catálogo pasa de **31 a 39 clases** con ocho lecciones nuevas del Antiguo
Testamento, una serie más y dos herramientas de mantenimiento. Se mantiene la
regla del proyecto: Reina-Valera 1960, canon de 66 libros, «Jehová», sin
vocabulario devocional católico y **sin encuadre de calendario religioso**.

### Las ocho clases nuevas

| # | Clase | Pasaje | Libro que se estrena |
| :-: | --- | --- | --- |
| 32 | Los doce espías | Números 13–14 | **Números** |
| 33 | Naamán sana | 2 Reyes 5 | **2 Reyes** |
| 34 | Nehemías y el muro | Nehemías 2–6 | **Nehemías** |
| 35 | Job confía en Dios | Job 1–2; 42 | **Job** |
| 36 | El Señor es mi pastor | Salmo 23 | **Salmo** |
| 37 | Isaías es llamado | Isaías 6 | **Isaías** |
| 38 | Ama a Dios de corazón | Deuteronomio 6:4–9 | **Deuteronomio** |
| 39 | Confía de todo corazón | Proverbios 3:5–6 | **Proverbios** |

Con ellas el sitio cita **29 libros** de los 66 y pasa de 13 a **19 libros del
Antiguo Testamento**. Ninguna usa vocabulario devocional católico ni se apoya
en una fecha del año: cada una sirve cualquier domingo.

Cada clase nueva trae lo mismo que las anteriores: cuatro partes de historia,
verdades para repetir, preguntas para conversar, mini quiz, actividad con pasos
seguros, versículo con enlace a su fuente en la RVR1960, oración y consigna de
dibujo para los más pequeños.

### Serie nueva

**«Confiar en Dios en todo momento»** (`confiar-en-dios`): las ocho clases
nuevas en un solo plan de ocho semanas, para cuando el grupo pasa por un momento
difícil. El sitio pasa de 6 a **7 series** y las 39 lecciones quedan dentro de
al menos un plan.

### Dos herramientas nuevas

| Archivo | Para qué |
| --- | --- |
| `tools/revisar-cobertura.mjs` | Que ninguna clase se quede a medias: carpeta, dos portadas, consigna de párvulos, materiales y contenido completo |
| `tools/revisar-calendario.mjs` | Que el contenido no dependa del calendario religioso (adviento, cuaresma, Semana Santa, Navidad…) |

La segunda cubre un hueco real: `revisar-biblia.mjs` vigila la traducción, el
canon y el vocabulario, pero **no** el encuadre de temporada, que es por donde
se habían colado las tres líneas corregidas el 14 de octubre.

### Otros cambios

- `additional-lessons-4.js`: el cuarto bloque de contenido, con las ocho clases.
- `printables-data.js` llega a **39 entradas**; `preschool-data.json`, a 39.
- `home-destacadas.js` gana los materiales de las ocho clases y sube a `?v=3`.
- `series-data.js` gana la serie nueva y sube a `?v=3`.
- `lesson-page.js` (`?v=15`) muestra la búsqueda de video cuando una clase
  todavía no tiene un video revisado, en vez de un reproductor vacío. Las ocho
  clases nuevas no presumen de un video que nadie ha verificado.
- `index.html` se resincronizó con el catálogo, `sitemap.xml` pasó a 48
  direcciones y el caché del service worker se renombró a
  `semillitas-v58-catalogo-39`.

### Verificación

```bash
node tools/revisar-sitio.mjs        node tools/revisar-biblia.mjs
node tools/revisar-series.mjs       node tools/revisar-destacadas.mjs
node tools/revisar-plataforma.mjs   node tools/revisar-juegos.mjs
node tools/sincronizar-portada.mjs  node tools/revisar-cobertura.mjs
node tools/revisar-calendario.mjs
```

Las nueve terminan en verde: 39 lecciones publicadas, 29 libros citados y
39 lecciones usadas en los planes.

---

## 8. Pantallas grandes y el número de planes · 14 de octubre de 2026

Dos arreglos de presentación que venían de la misma pregunta: «¿por qué se ve
tan pequeño al proyectar?».

### La página se veía chica en un monitor grande

El ancho del contenido estaba topado a **1160 px** (1120 px en las lecciones) y
el texto base era de **16 px**. En un monitor grande o al proyectar sobraba
espacio a los lados y las letras se veían chicas. Lo único que agrandaba algo
era el **modo clase** de las lecciones (1400 px y 20 px de texto) y el **modo
TV** de los juegos, pero hay que activarlos y solo existen dentro de esas
páginas: la portada, el catálogo, los planes, los imprimibles y la guía del
maestro se quedaban sin arreglo.

Se añadió **un solo bloque** al final de `accessibility.css`, la hoja que
comparten las 50 páginas, que se activa **solo desde 1440 px de ancho**:

| Ajuste | Antes | Desde 1440 px |
| --- | --- | --- |
| Tamaño base de la página | 16 px | **17.5 px** (todo lo que usa `rem` crece un 9 %) |
| Texto corrido | 16 px | **17.5 px** |
| Ancho del contenido | 1160 px (1120 px en las lecciones) | **1320 px** |
| Columna del titular de la portada | 760 px | **880 px** |
| Entradilla de la portada | 690 px | **780 px** |
| Barra fija de las lecciones (`--semillitas-sticky`) | 146 px | **159 px** |

Detalles de la implementación, que importan para no romper nada:

- Va en `@media screen and (min-width: 1440px)`: **imprimir no se toca** y el
  bloque de `@media print` de las lecciones sigue mandando.
- **En celular, tableta y laptop normal no cambia absolutamente nada.** Se
  comprobó con un navegador real a 1439 px, 1366 px y 412 px.
- El **modo clase** sigue mandando sobre el nuevo tamaño: `body.class-mode`
  tiene más especificidad que `body`, así que conserva sus 20 px y sus 1400 px.
  El **modo TV** de los juegos gana el 9 % a favor.
- Las páginas de texto legal (privacidad, términos, contacto y 404) se
  reconocen por su barra `.page-nav` y **conservan su columna de lectura de
  860 px**.
- Se subió la hoja a `/accessibility.css?v=2` en las 50 páginas y en `sw.js`, y
  el caché pasó a `semillitas-v59-pantallas-grandes` para que quien ya visitó
  el sitio reciba el cambio.

### La portada decía «Ver los 6 planes» y ya eran 7

La séptima serie entró con el catálogo de 39 lecciones y el número del enlace
se quedó en 6. Ahora dice **«Ver los 7 planes →»** y ya no depende de que
alguien se acuerde:

- `tools/sincronizar-portada.mjs` compara ese número con `series-data.js` y
  `--escribir` lo corrige (antes solo sincronizaba el catálogo de lecciones).
- `tools/revisar-series.mjs` termina en error si la portada anuncia un número
  distinto al real, y lo dice en su informe («Planes en la portada: 7»).

### Verificación

```bash
node tools/revisar-sitio.mjs        node tools/revisar-biblia.mjs
node tools/revisar-series.mjs       node tools/revisar-destacadas.mjs
node tools/revisar-plataforma.mjs   node tools/revisar-juegos.mjs
node tools/sincronizar-portada.mjs  node tools/revisar-cobertura.mjs
node tools/revisar-calendario.mjs   node tools/probar-portada.mjs
```

Las nueve revisiones, la sincronización y las 31 comprobaciones de la portada
terminan en verde. Además se midió el resultado con Chromium de verdad a
1920 px, 1440 px, 1439 px, 1366 px y 412 px: texto de 17.5 px y contenido de
1320 px desde 1440 px, y exactamente los mismos valores de antes por debajo.
