# 🌱 Semillitas de Fe · v2

La nueva generación de [Semillitas de Fe](https://semillitasbiblicas.space):
una plataforma de lecciones bíblicas para maestros de niños y niñas de **3 a
10 años** (Reina-Valera 1960), reconstruida como una aplicación moderna.

> **Por qué existe esta versión:** el sitio original (HTML, CSS y JS puro en
> la raíz del repositorio) demostró que el producto funciona. Esta versión
> demuestra arquitectura moderna: tipos, componentes, pruebas, CI/CD y una
> base lista para cuentas, progreso y comunidad.

## Stack

| Capa | Herramienta | Por qué |
| --- | --- | --- |
| Framework | **Next.js 15** (App Router) | SSG para las 39 lecciones, SEO y rendimiento |
| Lenguaje | **TypeScript** estricto | El catálogo completo está tipado: imposible renderizar una lección mal formada |
| Estilos | **Tailwind CSS 4** | Sistema de diseño consistente (paleta «semillita») sin CSS suelto |
| Fuentes | Fredoka + Nunito (fontsource) | Redondeadas y amables, empaquetadas localmente |
| Calidad | ESLint 9 · `tsc --noEmit` · **GitHub Actions** | Nada entra a `main` sin lint, tipos y build |

## Cómo correrla

```bash
cd v2
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción (46 páginas estáticas)
npm run migrate    # regenera src/data/lessons.json desde el sitio v1
```

## Estructura

```
src/
  app/
    page.tsx                  Portada: héroe, temas, plan de clase, destacadas
    lecciones/page.tsx        Catálogo con búsqueda y filtros
    lecciones/[slug]/page.tsx Clase completa (SSG: 39 páginas pre-renderizadas)
    sitemap.ts                Sitemap generado desde los datos
    not-found.tsx             404 con la oveja perdida 🐑
  components/
    lessons-explorer.tsx      Búsqueda instantánea + filtros (cliente)
    lesson-card.tsx           Tarjeta de lección
    quiz.tsx                  Quiz interactivo con retroalimentación
    site-header / footer
  lib/
    types.ts                  Modelo de datos de una lección
    lessons.ts                Acceso tipado al catálogo + normalización de búsqueda
  data/
    lessons.json              39 lecciones migradas (script: scripts/migrate-lessons.mjs)
```

## Hoja de ruta

### Mes 1 — Fundaciones ✅ *(hecho)*
- [x] Next.js 15 + TypeScript + Tailwind 4
- [x] Migración automatizada de las 39 lecciones del v1
- [x] Portada, catálogo con búsqueda instantánea y clase completa
- [x] Quiz interactivo con puntuación y mensajes por nivel
- [x] SSG + sitemap + metadatos por lección (SEO)
- [x] CI con GitHub Actions (lint · tipos · build)

### Mes 2 — Producto
- [ ] Cuentas y progreso con **Supabase** (login, favoritas, notas del maestro)
- [ ] Pruebas: **Vitest** (lógica) + **Playwright** (flujo lección → quiz)
- [ ] Deploy continuo a **Vercel** con preview por PR
- [ ] Juegos migrados (ruleta, memoria, ¿quién soy?, juego de mesa)

### Mes 3 — Pulido
- [ ] PWA offline de nuevo (service worker con estrategias modernas)
- [ ] Lighthouse ≥ 95 en rendimiento y accesibilidad AA
- [ ] Modo proyección para el aula (tipografía grande, navegación por teclado)
- [ ] README final con capturas, decisiones y métricas

## Decisiones técnicas

- **Datos sobre CMS:** el contenido vive en JSON versionado y se regenera desde
  el sitio original con `npm run migrate`. Cero dependencias externas para el
  contenido; el día que haya panel de administración, el mismo modelo
  `Lesson` de `lib/types.ts` se conecta a Supabase sin tocar los componentes.
- **Búsqueda en el cliente:** con 39 lecciones no hace falta un servicio de
  búsqueda; normalizar acentos y minúsculas en un `useMemo` da búsqueda
  instantánea sin red.
- **Imágenes sin optimizar por ahora** (`next.config.ts`): al desplegar en
  Vercel se activa la optimización nativa y se sirve AVIF/WebP automático.
- **Supabase reutilizado, no duplicado:** la v2 se conecta al mismo proyecto
  del sitio v1, así que los maestros con cuenta no crean nada nuevo. La clave
  pública vive en `.env.local` (nunca se sube); el esquema y sus políticas
  RLS están documentados en `supabase/migrations/0001_esquema_base.sql`.

## Cuentas y Supabase

1. Crea `v2/.env.local` a partir de `.env.example` con la URL y la clave
   pública (anon/publishable) de tu proyecto: Supabase → Settings → API.
2. Nada más. Login por correo/contraseña y Google OAuth salen funcionando.
3. Para que Google regrese bien al sitio, agrega tu dominio en
   Supabase → Authentication → URL Configuration (p. ej.
   `http://localhost:3000/**` para desarrollo y `https://tudominio/**` en
   producción). El login con correo funciona sin tocar nada.

El esquema completo de tablas (`profiles`, `lesson_favorites`,
`lesson_progress`, `teacher_notes`) con sus políticas RLS está en
[`supabase/migrations/0001_esquema_base.sql`](supabase/migrations/0001_esquema_base.sql).
