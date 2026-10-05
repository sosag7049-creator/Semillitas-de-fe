# 🌱 Semillitas de Fe

Sitio con lecciones, dinámicas y materiales bíblicos para maestros de niños y
niñas de **3 a 10 años**, basados en la **Reina-Valera 1960**.

🌐 **<https://semillitasbiblicas.space>** · Gratuito · Creado por Gerardo Sosa

---

## Qué incluye

| Sección | Dirección | Qué hay |
| --- | --- | --- |
| Portada | `/` | Presentación, método de clase, videos y la Ruleta Bíblica |
| Clases | `/lecciones/` | Las **31 lecciones**, con buscador y filtros |
| Cada clase | `/lecciones/<nombre>/` | Historia, versículo, preguntas, dinámica, manualidad y oración |
| Juegos | `/juegos/` | Ruleta, memoria, juego de mesa y “adivina quién”, para proyectar |
| Imprimibles | `/printables.html` | Hojas para colorear, versículos y actividades |

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
lecciones/index.html    Listado de las 31 clases
lecciones/<nombre>/     Una carpeta por clase
juegos/                 Juegos para proyectar
printables.html         Material imprimible

printables-data.js      ⭐ FUENTE DE VERDAD del contenido de las 31 lecciones
additional-lessons*.js  Material extra de las lecciones 25 a 31
lesson-data.js          Arma el catálogo completo a partir de lo anterior

sw.js                   Service worker: caché y modo sin conexión
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

### Agregar la portada de una lección

Guarda la ilustración como `images/lessons/<nombre>.webp` a **1200 × 800 px** y
genera la versión pequeña que usan los celulares:

```bash
convert images/lessons/<nombre>.webp -resize 800x -quality 82 images/lessons/<nombre>-800.webp
```

### Comprobar que nada se rompió

```bash
npm install jsdom            # solo la primera vez
node tools/probar-portada.mjs
```

Revisa el catálogo, la ventana de lección, el asistente Sion, la ruleta y el
buscador.

### Publicar los cambios

Al subir a la rama `main`, GitHub Pages reconstruye el sitio en 1-2 minutos.

> ⚠️ Si cambias un archivo `.css` o `.js`, **sube también su número de versión**
> (por ejemplo `juegos.css?v=5` → `?v=6`) en las páginas que lo usan y en la
> lista `CORE` de `sw.js`, y cambia el nombre del caché al inicio de `sw.js`.
> Si no, quien ya visitó el sitio seguirá viendo la versión vieja.

---

## Reglas del proyecto

- Todo el contenido bíblico se basa en la **Reina-Valera 1960** y se cita con su
  pasaje exacto.
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
