# 🌱 Semillitas de Fe

Sitio con lecciones, dinámicas y materiales bíblicos para maestros de niños y
niñas de **3 a 10 años**, basados en la **Reina-Valera 1960**.

🌐 **<https://semillitasbiblicas.space>** · Gratuito · Creado por Gerardo Sosa

---

## Qué incluye

| Sección | Dirección | Qué hay |
| --- | --- | --- |
| Portada | `/` | Bienvenida corta, accesos rápidos y lecciones destacadas de la semana |
| Clases | `/lecciones/` | Las **31 lecciones**, con buscador y filtros |
| Planes | `/series/` | Rutas de enseñanza que agrupan las clases por semanas |
| Cada clase | `/lecciones/<nombre>/` | Historia, versículo, preguntas, dinámica, manualidad y oración |
| Juegos | `/juegos/` | Ruleta, memoria de 6 a 10 parejas, “¿quién soy?” con pistas y juego de mesa con dado 3D, para proyectar |
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
lecciones/index.html    Listado de las 31 clases
lecciones/<nombre>/     Una carpeta por clase
series/index.html       Planes de enseñanza (agrupan las clases en rutas)
juegos/                 Juegos para proyectar (incluye la Ruleta Bíblica)
printables.html         Material imprimible

printables-data.js      ⭐ FUENTE DE VERDAD del contenido de las 31 lecciones
additional-lessons*.js  Material extra de las lecciones 25 a 31
lesson-data.js          Arma el catálogo completo a partir de lo anterior
series-data.js          ⭐ FUENTE DE VERDAD de los planes de enseñanza

sw.js                   Service worker: caché y modo sin conexión
pwa-register.js         Registra la PWA también en las páginas de entrada directa
accessibility.css       Enlace para saltar al contenido, foco y movimiento reducido
manifest.webmanifest    Datos de la app instalable
sitemap.xml  robots.txt Para los buscadores
404.html                Página de error con buscador de clases

images/lessons/         Portadas: <nombre>.webp (1200px) y <nombre>-800.webp
icons/  media/          Iconos y video de la portada
tools/                  Utilidades de mantenimiento (no se usan en el sitio)
```

---

## Tareas comunes

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

Levanta la portada en un navegador de mentira y revisa las 26 comprobaciones:
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
