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

---

## 4. Comprobaciones realizadas

- ✅ Las 38 páginas responden correctamente; ninguna dirección rota.
- ✅ Las 58 direcciones del modo sin conexión existen (si una fallara, el modo
  sin conexión no se instalaría).
- ✅ 23 pruebas automáticas sobre la portada (`tools/probar-portada.mjs`):
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
