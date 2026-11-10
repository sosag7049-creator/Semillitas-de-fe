# Supabase · Sion inteligente

Todo lo que necesita «Sion inteligente» vive aquí: la función de servidor que
conversa con el modelo de IA y el SQL del cupo por visitante.

El sitio es estático (GitHub Pages), así que **la clave del proveedor no puede
ir en el navegador**. La conversación pasa por una Edge Function de Supabase,
que es la única que conoce la clave.

```
supabase/
  functions/sion-chat/
    index.ts          La función desplegada (autosuficiente, sin imports)
    index.test.mjs    16 pruebas: prompt, cupo, CORS y errores del proveedor
```

---

## 1 · Poner la clave (lo único que falta para que responda)

Sion inteligente está escrito y desplegado, pero **sin clave el modelo no
puede contestar**: la función devuelve `sin_clave` y el sitio sigue funcionando
con las respuestas locales de la biblioteca.

1. Consigue una clave de Google AI Studio (<https://aistudio.google.com/apikey>).
   El plan gratuito alcanza de sobra para empezar.
2. Entra al proyecto **Semillitas biblicas** → *Project Settings* →
   *Edge Functions* → *Secrets*.
3. Crea el secreto `GEMINI_API_KEY` con la clave.

Opcionales:

| Secreto | Para qué | Por defecto |
| --- | --- | --- |
| `GEMINI_MODEL` | Cambiar de modelo | `gemini-2.5-flash-lite` |
| `SION_SALT` | Sal del hash que anonimiza al visitante | valor fijo del código |

No hace falta volver a desplegar: los secretos se leen en cada petición.

> La clave **nunca** se escribe en el repositorio, ni en `sion-ai.js`, ni en un
> archivo de configuración del sitio.

---

## 2 · Qué hace la función

- Recibe `{ question, lesson, lessons, history }` del navegador.
- Arma un prompt con la **lección abierta completa** (historia, dinámica,
  preguntas, versículo y oración) y los últimos turnos de la conversación.
- Pide la respuesta a Gemini con instrucciones de seguridad para contenido
  infantil: sin datos personales, sin consejo médico ni legal, sin violencia
  gráfica, y redirigiendo lo que se sale del tema.
- Devuelve `{ answer, related }`. Las lecciones sugeridas las calcula la propia
  función sobre el catálogo real, así que **ningún enlace puede estar roto**.
- Aplica un cupo por visitante anónimo (18 por hora, 60 por día) para que nadie
  agote la cuota gratuita. La huella es un SHA-256 de IP + navegador + sal,
  recortado: no permite reconstruir la IP ni identifica a nadie. Si la base no
  responde, **deja pasar** la pregunta: es peor dejar sin asistente al maestro.

Códigos de respuesta:

| Código | Cuándo | Qué muestra el sitio |
| --- | --- | --- |
| `200` | Hay respuesta | El texto formateado y las lecciones sugeridas |
| `200` + `code: "bloqueado"` | El filtro de seguridad frenó el tema | Un redireccionamiento amable |
| `400` | Pregunta vacía | — |
| `403` | Origen no permitido | — |
| `429` + `code: "limite"` | Se agotó el cupo | El mensaje, sin botón de reintentar |
| `503` + `code: "sin_clave"` | Falta `GEMINI_API_KEY` | «Todavía no está activo» |
| `504` + `code: "tiempo"` | El modelo tardó más de 20 s | Aviso y botón de reintentar |

Orígenes aceptados: `semillitasbiblicas.space`, `www.semillitasbiblicas.space`,
`localhost`/`127.0.0.1` en cualquier puerto, y las vistas previas
`*.e2b.app` de Arena. Cualquier otro origen recibe `403`.

---

## 3 · La tabla del cupo

```sql
public.sion_uso (huella text, ventana timestamptz, usos int, creado timestamptz)
```

- RLS activo y **sin políticas**: `anon` y `authenticated` no pueden leerla.
- `public.sion_consume(p_fp, p_window, p_limit)` es `security definer`,
  incrementa el contador en una sola sentencia (sin carreras) y devuelve
  `false` cuando se pasa del límite.
- Solo `service_role` puede ejecutarla; la función de Supabase la llama con la
  clave de servicio que ya tiene inyectada.
- Cada llamada borra las ventanas de más de 3 días: la tabla no crece.

---

## 4 · Desplegar un cambio

El conector de Supabase despliega **un solo archivo**, por eso `index.ts` no
importa nada del repositorio ni otros módulos de la función.

Con el conector: `update_edge_function` con `function_slug: "sion-chat"`,
`name: "sion-chat"`, `verify_jwt: false` y el contenido de `index.ts` como
`body`.

Con la CLI de Supabase, desde la raíz del repositorio:

```bash
supabase functions deploy sion-chat --project-ref wadfxtlbznxmbutkihkr --no-verify-jwt
```

`verify_jwt: false` es deliberado: quien pregunta es un visitante anónimo del
sitio, no una cuenta. La protección real es el cupo y la lista de orígenes.

---

## 5 · Probar

Sin red, sin Deno y sin gastar cuota:

```bash
node --experimental-strip-types supabase/functions/sion-chat/index.test.mjs
```

Y la parte del navegador (interruptor, memoria, botones rápidos, errores):

```bash
npm install jsdom          # solo la primera vez
node tools/probar-sion.mjs
```

Para probar la función desplegada de verdad, desde el sitio publicado:

1. Abre una lección, toca **✨ Sion inteligente** y pregunta algo.
2. Si responde «todavía no está activo», falta el secreto `GEMINI_API_KEY`.

---

## 6 · Costo

Con `gemini-2.5-flash-lite` y respuestas de ~200 palabras, una conversación
normal cuesta fracciones de centavo; el plan gratuito de Google cubre de sobra
el uso de un sitio como este. El cupo por visitante existe para que un bot no
consuma el mes en una tarde.
