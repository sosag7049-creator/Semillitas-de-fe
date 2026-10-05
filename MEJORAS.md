# Semillitas de Fe · Diagnóstico y plan de mejoras

> Revisión completa del repositorio realizada el **5 de octubre de 2026**.
> Sitio: <https://semillitasbiblicas.space> · Publicado con GitHub Pages desde la rama `main`.

---

## 1. Limpieza ya aplicada

| Acción | Detalle |
| --- | --- |
| 🗑️ Eliminado `SITIO-COMPLETO.zip` | Copia completa del sitio (154 archivos, **13.4 MB**) duplicada dentro del propio repositorio. No estaba enlazada en ninguna página, pero sí era **descargable públicamente** en `semillitasbiblicas.space/SITIO-COMPLETO.zip`. Era la mitad del peso del repositorio. |
| 🛡️ Añadido `.gitignore` | Evita que vuelvan a subirse respaldos `.zip`, archivos temporales, basura del sistema (`.DS_Store`, `Thumbs.db`) y, sobre todo, **archivos con llaves o contraseñas** (`.env`, `*.key`). |

> 💡 El ZIP no se pierde: sigue disponible en el historial de Git.
> Para recuperarlo: `git show main:SITIO-COMPLETO.zip > SITIO-COMPLETO.zip`

### Lo que NO se borró (y por qué)

Se revisaron los **121 archivos** del repositorio uno por uno, siguiendo las
importaciones de JavaScript, los `@import` de CSS y las etiquetas de cada HTML.
Resultado: **todos los demás archivos están en uso**.

- Las 44 hojas de estilo y scripts tienen al menos una referencia real.
- Las 37 imágenes (`images/`, `icons/`, `media/`) se usan todas.
- Las **58 URLs** que el service worker guarda en caché responden correctamente
  (si una sola fallara, el modo sin conexión dejaría de instalarse por completo).
- No hay enlaces internos rotos en ninguna de las 38 páginas.

**El repositorio estaba sano.** El único archivo sobrante era el ZIP.

---

## 2. Mejoras recomendadas, por prioridad

### 🔴 Prioridad alta — rápidas y de alto impacto

#### 2.1 Falta `sitemap.xml`
Google tiene que descubrir las 31 lecciones una por una siguiendo enlaces.
Un sitemap con las 38 URLs hace que las indexe mucho antes.
*Esfuerzo: 15 minutos. Se puede generar automáticamente desde `lesson-data.js`.*

#### 2.2 Falta `robots.txt`
Sin él, los buscadores usan reglas por defecto y no saben dónde está el sitemap.
*Esfuerzo: 2 minutos.*

#### 2.3 Falta página `404.html`
Confirmado en la configuración de GitHub Pages: `custom_404: false`.
Hoy, si alguien escribe mal una dirección, ve la pantalla genérica y gris de
GitHub en inglés. Debería ver una página de Semillitas con el menú y un buscador
de lecciones.
*Esfuerzo: 20 minutos.*

#### 2.4 `juegos/` y `printables.html` no tienen etiquetas para redes sociales
Ambas páginas carecen de `canonical`, `og:title`, `og:image` y datos
estructurados. Si un maestro comparte el enlace de los juegos por WhatsApp,
**no aparece imagen ni descripción**: sale un enlace pelado. El resto de las
páginas sí las tiene.
*Esfuerzo: 15 minutos.*

---

### 🟠 Prioridad media — velocidad en celulares

El sitio pesa **14 MB**. Para un maestro en Centroamérica con datos móviles
limitados, esto importa. Los culpables concretos:

| Archivo | Tamaño actual | Problema | Propuesta |
| --- | --- | --- | --- |
| `icons/bible-avatars.png` | **2.1 MB** (1774×887) | Es un *sprite* de avatares en PNG sin comprimir | Convertir a WebP → **~150 KB** (93 % menos) |
| `icons/sion-bible.png` | **1.5 MB** (1384×1136) | Se muestra en un círculo de 64 px, pero se descarga en tamaño gigante | Convertir a WebP y reducir a 256 px → **~25 KB** |
| `icons/icon-512.png` | 303 KB | Icono de la app | Optimizar → ~80 KB |
| `media/hero-smooth-v2.mp4` | 3.1 MB | Video de portada | Ya está bien resuelto: `home-cinematic.js` solo lo descarga si la conexión es buena 👍 |

**Ahorro total estimado: ~3.6 MB (un 26 % del sitio) sin perder calidad visible.**

Otras ideas de rendimiento:
- Las 31 imágenes de lecciones (~140 KB cada una) podrían servirse en dos
  tamaños (`srcset`) para que el celular no baje la versión de escritorio.
- Añadir `loading="lazy"` a las imágenes que están debajo del primer pantallazo.

---

### 🟡 Prioridad media — mantenimiento del código

#### 2.5 El catálogo de lecciones está duplicado
Las 31 lecciones existen **dos veces**:
1. En `lesson-data.js` (+ `additional-lessons*.js`) → lo usan `/lecciones/`, los juegos y las páginas de cada lección.
2. Copiadas a mano dentro de `index.html`, en un array `const L=[…]` de 13 KB.

Hoy están sincronizadas, pero al agregar la lección número 32 habrá que
escribirla en los dos lugares, y tarde o temprano se van a desfasar.
**Propuesta:** que `index.html` importe `lesson-data.js` como hacen las demás
páginas. De paso, `index.html` baja de 68 KB a ~50 KB.

#### 2.6 El asistente "Sion" también está duplicado
Existe una versión en línea dentro de `index.html` y otra en `sion-widget.js`
(que usan las demás páginas). Son dos implementaciones del mismo chat que hay
que arreglar por separado cada vez. **Propuesta:** dejar solo `sion-widget.js`.

#### 2.7 Las páginas de lecciones no están en el caché sin conexión
`sw.js` guarda la portada, los juegos y los imprimibles, pero **no** las 31
páginas de `/lecciones/*/`. Si un maestro pierde señal en medio de la clase,
no puede abrir la lección que estaba usando. **Propuesta:** guardar en caché
cada lección en el momento en que se visita.

---

### 🟢 Prioridad baja — detalles que suman

- **`README.md`**: hoy tiene dos líneas. Convendría documentar la estructura del
  proyecto, cómo agregar una lección nueva y cómo se publica el sitio. Es lo
  primero que ve cualquiera que quiera ayudar.
- **Accesibilidad**: revisar el contraste de los textos sobre los fondos
  amarillos y naranjas, y verificar que todo el sitio se pueda navegar con el
  teclado (importante para pantallas en iglesias y para lectores de pantalla).
- **Analítica respetuosa**: saber qué lecciones se usan más ayudaría a decidir
  qué contenido crear. Hay opciones sin cookies ni rastreo de menores.
- **Contenido**: las lecciones 32+ y más material imprimible por edad
  (3-5 años vs 6-10 años).

---

## 3. Orden sugerido de trabajo

1. **Semana 1 — Visibilidad:** sitemap, robots, 404, etiquetas sociales en juegos e imprimibles. *(≈1 hora, impacto inmediato en Google y WhatsApp)*
2. **Semana 2 — Velocidad:** optimizar los 4 iconos pesados. *(≈1 hora, −3.6 MB)*
3. **Semana 3 — Código:** unificar el catálogo de lecciones y el asistente Sion. *(≈3 horas, evita errores futuros)*
4. **Después:** caché sin conexión de las lecciones, README, accesibilidad y contenido nuevo.

---

*Documento generado durante la revisión técnica del repositorio.*
