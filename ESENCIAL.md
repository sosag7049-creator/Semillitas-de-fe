# Semillitas de Fe · Lo esencial

> Qué **debe llevar sí o sí** una página web y qué debería llevar sí o sí
> Semillitas de Fe · 14 de octubre de 2026
> Sitio: <https://semillitasbiblicas.space>

---

## Parte 1 · Lo que toda página web debe llevar sí o sí

Estas catorce cosas no son «mejoras»: si falta alguna, el sitio se siente
incompleto o pierde visitas. La columna de la derecha es el estado real de
Semillitas de Fe, comprobado con las herramientas de `tools/`.

| # | Elemento esencial | Por qué | Estado hoy |
| :-: | --- | --- | :-: |
| 1 | **Dirección propia con HTTPS** | Sin dominio propio no se ve serio; sin HTTPS el navegador avisa que es «no seguro». | ✅ `semillitasbiblicas.space` |
| 2 | **Carga rápida** | Cada segundo de espera pierde visitantes. Lo más pesado manda. | ✅ Portadas en WebP con `srcset`, iconos de 3.8 MB a 255 KB |
| 3 | **Que se vea bien en el celular** | La mayoría de maestros entra desde el teléfono, muchas veces en la iglesia con datos. | ✅ Menú desplegable y rejilla de accesos bajo 900 px |
| 4 | **Título y descripción distintos en cada página** | Si las 42 páginas dicen lo mismo, Google solo muestra una. | ✅ `title`, `description` y `canonical` propios |
| 5 | **Navegación clara desde cualquier página** | El visitante nunca debería quedar atrapado. | ✅ Menú superior + seis accesos rápidos en la portada |
| 6 | **Buscador interno** | Quien sabe qué busca no quiere navegar. | ✅ En el catálogo, en la portada y en la página de error |
| 7 | **Página 404 propia** | Una dirección mal escrita no debe terminar en una pantalla gris en inglés. | ✅ `404.html` con buscador que adivina la lección |
| 8 | **Accesibilidad** | Contraste, teclado, foco visible, texto alternativo. También ayuda a quien proyecta en un salón con luz fuerte. | ✅ WCAG AA (el par más bajo, 4.73:1) y enlace para saltar al contenido |
| 9 | **Página de contacto y quién está detrás** | Sin forma de escribir, el sitio es un folleto anónimo. | ✅ `contacto.html` con correo directo |
| 10 | **Aviso de privacidad y términos** | Obligatorio si hay cuentas o datos, y más aún si son de menores. | ✅ `privacidad.html` y `terminos.html` |
| 11 | **Aparecer en Google y en redes** | Sin esto el trabajo existe, pero nadie lo encuentra. | ✅ `sitemap.xml` (38 direcciones), `robots.txt`, Open Graph y datos estructurados |
| 12 | **Analítica respetuosa** ⬅️ **es lo único que falta** | Sin datos, se crea contenido a ciegas: no se sabe qué lecciones se usan ni cuáles sobran. | ❌ **No hay** |
| 13 | **Respaldo fuera del sitio** | Si se pierde el repositorio, se pierden 39 lecciones escritas a mano. | ⚠️ Solo GitHub (conviene una copia externa) |
| 14 | **Pruebas y mantenimiento automatizados** | Un sitio sin revisiones se rompe en silencio. | ✅ **Excelente**: 7 revisiones que pasan en verde |

> **Conclusión de la Parte 1:** en lo técnico el sitio está por encima de la
> media. Lo único esencial que falta es **saber qué usa la gente** (punto 12).
> Una analítica sin cookies, sin rastreo de menores y con no más de 20 líneas
> resuelve esto sin chocar con la regla de privacidad del proyecto.

---

## Parte 2 · Lo que Semillitas de Fe debe llevar sí o sí

Aquí ya no se trata de estar «bien hecho», sino de cumplir lo que el sitio
promete. Los huecos de abajo son de contenido y se notan.

### 📌 Criterio fijado el 14 de octubre de 2026

**El contenido se guía solo por los libros de la Biblia, no por el calendario
religioso.** Nada de adviento ni de temporadas: una lección se elige por el
pasaje que enseña, no por la fecha del año.

Esto tiene una consecuencia buena: **una lección bíblica sirve cualquier
domingo del año**. Una clase sobre Génesis 1 no caduca el 24 de diciembre; en
cambio, el material hecho «para una fecha» se queda guardado once meses.

> **Corregido el 14 de octubre de 2026.** La huella del calendario era de
> **dos líneas** en todo el repositorio, y ya está resuelta:
>
> | Dónde | Antes | Ahora |
> | --- | --- | --- |
> | `home-destacadas.js` | «El cierre natural para Semana Santa.» | «Para cerrar el ciclo sobre Jesús y hablar de esperanza.» |
> | `series-data.js` | «…si quieres cerrar en Semana Santa.» | «…la esperanza que sostiene toda la serie.» |
> | `lesson-data.js` | «La Navidad se trata sobre todo de los regalos» | «El nacimiento de Jesús se trata sobre todo de los regalos» |
>
> Se subieron las versiones (`home-destacadas.js?v=2`, `series-data.js?v=2`,
> `lesson-data.js?v=12`) y el caché (`semillitas-v57-sin-calendario`) para que
> quien ya visitó el sitio reciba la corrección.

### ✅ Alcance confirmado

- **Los 66 libros**, sin calendario. El contenido se elige por el pasaje que
  enseña, no por la fecha del año, así que **sirve cualquier domingo**.
- **Las 11 clases sobre Jesús se quedan como están**: son pasajes bíblicos
  (Mateo 1–2, Lucas 1–2, Lucas 23–24). Solo se les quitó el encuadre de
  temporada. La serie se llama «Conociendo a Jesús», no «Navidad».

### 🔴 Falta 1 — Canciones (el hueco más grande)

La guía del maestro enseña un programa de clase que dedica **10 minutos a
«Alabanza y movimiento»**… y el sitio **no tiene ni una sola canción**. Es el
único paso del método que deja solo al maestro, justo el que más ayuda necesita
si nunca ha dado clase.

- 15–20 canciones en español agrupadas por uso: bienvenida, alabanza con
  movimientos, versículo cantado y despedida.
- Para cada una: letra completa, gestos descritos paso a paso, duración y
  enlace al video oficial.
- Modo letra grande para proyectar, como el modo TV de los juegos.
- **Solo canciones de dominio público o con permiso del autor**, y enlazar los
  videos en lugar de alojarlos.

### 🔴 Falta 2 — Falta más de la mitad del Antiguo Testamento

De los 39 libros del Antiguo Testamento, el sitio usa hoy **19**: Génesis,
Éxodo, Números, Deuteronomio, Josué, Jueces, Rut, 1 Samuel, 2 Samuel, 1 Reyes,
2 Reyes, Nehemías, Ester, Job, Salmo, Proverbios, Isaías, Daniel y Jonás.

> **Actualizado el 14 de octubre de 2026.** El catálogo pasó de 31 a **39
> lecciones** y con eso seis libros del Antiguo Testamento se estrenaron:
> **Números** (los doce espías), **2 Reyes** (Naamán), **Nehemías** (el muro),
> **Job**, **Salmo** (el 23) e **Isaías** (el llamado). **Deuteronomio** y
> **Proverbios** ya aparecían como versículos sueltos y ahora tienen su propia
> clase. Quedan **20 libros del Antiguo Testamento sin una sola clase**, y ahí
> sigue el mayor terreno por cubrir.

Lo que falta del Antiguo Testamento, en el orden en que conviene escribirlo:

| Libro | Qué enseñar |
| --- | --- |
| **2 Samuel** | El reinado de David y su cántico de gratitud (2 Samuel 22) |
| **1–2 Crónicas · Esdras** | El templo, el regreso del destierro y la lectura pública de la Ley |
| **Jeremías · Lamentaciones** | La fidelidad de Dios en medio del dolor del pueblo |
| **Levítico · Eclesiastés · Cantares** | La adoración con orden, el sentido de la vida y el amor fiel |
| **Profetas menores (Oseas a Malaquías)** | La misericordia, la justicia y el anuncio del Mesías |
| **Ezequiel** | El cuidado de Dios por su pueblo y su promesa de restauración |

Seis de los libros que antes encabezaban esta lista ya tienen clase: Números,
2 Reyes, Nehemías, Job, Salmo e Isaías se estrenaron el 14 de octubre de 2026, y
Deuteronomio y Proverbios, que solo aparecían como versículos sueltos, ahora
tienen su propia clase. **2 Samuel sigue esperando su turno**: el sitio cita sus
versículos, pero todavía no enseña el reinado de David.

### 🔴 Falta 3 — El Nuevo Testamento se acaba en los evangelios

De los 29 libros que el sitio cita, **todos los del Nuevo Testamento siguen
saliendo de los evangelios**: Mateo, Marcos, Lucas y Juan. Los demás —1
Corintios, Gálatas, Efesios, 1 Tesalonicenses, Santiago y Hebreos— aparecen
solo en versículos clave de los planes, no en una clase. No hay **una sola
lección de Hechos** ni de las cartas: los niños aprenden sobre Jesús, pero no
qué pasó después.

- **Hechos:** Pentecostés · Saulo cambia en el camino · Pablo y Silas cantan en
  la cárcel · Pedro y Juan sanan al cojo · Dorcas ayuda a los demás · Felipe y
  el etíope.

### 🔴 Falta 4 — Solo hay historias, no formación

Las **39 lecciones son narrativas**: alguien hace algo y Dios interviene. Está
muy bien, pero falta la otra mitad de un ministerio infantil: las enseñanzas.

- El Padrenuestro (Mateo 6:9–13) · Salmo 23, el buen pastor · las
  bienaventuranzas (Mateo 5:1–12).
- **El fruto del Espíritu (Gálatas 5:22–23)** — 9 clases, una por fruto: es un
  trimestre completo ya armado.
- **La armadura de Dios (Efesios 6:10–18)** — 6 clases; es de las series más
  pedidas en ministerio infantil en todo el mundo.
- El amor (1 Corintios 13).

### 🟠 Falta 5 — Historias muy conocidas que no están

**Del Antiguo Testamento** (encajan con la regla del proyecto):

- Moisés bebé en el río (Éxodo 2:1–10) · el maná en el desierto (Éxodo 16) ·
  el horno de fuego (Daniel 3) · Sansón (Jueces 13–16) · Ana ora por Samuel
  (1 Samuel 1) · Elías y el fuego del cielo (1 Reyes 18) · «yo y mi casa
  serviremos a Jehová» (Josué 24:14–15).

> Con las faltas 2 a 5, el Antiguo Testamento pasaría de 20 clases a más del
> doble, y cada libro nuevo abre la puerta a una serie completa.

### 🟡 Mejoras de uso en el salón

| Qué | Por qué importa |
| --- | --- |
| **Modo presentación secuencial** | Hoy «modo clase» solo agranda el texto. Falta una vista a pantalla completa que muestre una parte a la vez y avance con las flechas del teclado. |
| **Resumen para las familias por WhatsApp** | Un botón que arme el mensaje: la verdad central, el versículo, una pregunta para la casa y un reto familiar. Automatiza algo que el maestro hoy escribe a mano. |
| **Lista de asistencia y cumpleaños** | El panel ya guarda progreso y notas; falta marcar quién vino cada domingo y enlazar los cumpleaños con la agenda que ya existe. |
| **Buscar por tema o emoción** | Poder filtrar por *miedo, perdón, obediencia, gratitud, valentía, amistad*. Sion ya lo hace conversando; faltan los botones visibles. |
| **Clase de emergencia (20 minutos)** | Para cuando el maestro llega sin preparar o la clase se acorta: historia breve, tres preguntas, una dinámica sin materiales y la oración. |
| **Certificados imprimibles** | Diplomas de fin de curso, de versículos memorizados y de asistencia perfecta. Encaja con el sistema de imprimibles que ya existe. |
| **Lotería bíblica** | El juego más rentable: reutiliza las ilustraciones que ya existen y las cartillas se imprimen desde el sitio. |

### 🔧 Pendiente técnico que arrastra deuda

1. **El asistente Sion está duplicado.** Hay una versión escrita dentro de
   `index.html` y otra en `sion-widget.js`. Son dos chats que hay que arreglar
   por separado, y la portada tiene funciones propias (por ejemplo, responder
   sobre la Ruleta Bíblica). Conviene unificarlo **antes** de añadirle cosas
   nuevas, y con pruebas sobre la portada que ya existen.
2. **Analítica respetuosa** (el punto 12 de la Parte 1), para decidir qué
   contenido crear con datos y no por intuición.

---

## Parte 3 · Qué hacer primero

| Fase | Qué | Por qué en este orden |
| :-: | --- | --- |
| **1** | Analítica respetuosa (unas 20 líneas) | Es lo único esencial que falta y no necesita contenido nuevo. Sin datos, las fases siguientes se deciden a ciegas. |
| **2** | Libros del Antiguo Testamento sin ninguna lección (Falta 2) | Es el mayor terreno sin cubrir, y cada libro nuevo abre una serie completa. |
| **3** | Canciones | El hueco más visible: completa el método de clase. |
| **4** | Historias de prioridad 1 (8 clases) | Las que el maestro busca y no encuentra. |
| **5** | Fruto del Espíritu (9) y armadura de Dios (6) | Dos trimestres completos de contenido formativo. |
| **6** | Hechos: Pentecostés, Pablo, la iglesia primitiva | Cierra el vacío más grande del contenido bíblico. |
| **7** | Lotería bíblica, resumen para familias, asistencia | Aprovechan lo que ya existe; mucho valor con poco trabajo nuevo. |

---

## Parte 4 · Lo que NO hay que tocar

Vale la pena decirlo: hay cosas que ya funcionan y no deben «mejorarse».

- **Las siete revisiones automáticas.** `revisar-sitio`, `revisar-biblia`,
  `revisar-series`, `revisar-destacadas`, `revisar-plataforma`, `revisar-juegos`
  y `sincronizar-portada` pasan todas en verde. Eso no es común y es lo que
  mantiene el sitio sano.
- **La regla bíblica** (Reina-Valera 1960, los 66 libros, pasaje exacto en cada
  lección), con su comprobación automática.
- **El peso ya optimizado**: WebP con `srcset`, carga perezosa y modo sin
  conexión funcionando.
- **Las 42 páginas y sus versiones `?v=`**, que están todas cuadradas.

> **Nota de mantenimiento.** Al corregir el contador del revisor bíblico se
> descubrió que usaba `\b` —que en JavaScript no entiende acentos—, así que
> **Éxodo nunca aparecía en la lista de libros citados**. Ya está corregido con
> los límites propios que el mismo archivo define: pasa de 20 a **21 libros**
> citados, e incluye Éxodo (23 citas). Ninguna otra cifra cambia.

---

## Parte 5 · Revisión del sitio completo · 14 de octubre de 2026

Se revisaron los **42 archivos de contenido** (lecciones, juegos, imprimibles,
preescolar, portada, guía del maestro y páginas legales) buscando cualquier
rastro de enfoque no bíblico: calendario litúrgico, tradiciones ajenas a la
Biblia, religiosidad popular, vocabulario devocional católico y superstición.

### Resultado: el sitio está limpio

| Qué se buscó | Resultado |
| --- | --- |
| Calendario litúrgico (adviento, cuaresma, pascua, epifanía…) | ✅ **0**. Nada de adviento, cuaresma, pascua ni epifanía en todo el sitio. |
| Encuadre de temporada (Semana Santa, Navidad) | ✅ **0** tras las 3 correcciones de arriba. |
| Tradiciones que no están en la Biblia (Papá Noel, tres reyes, árbol…) | ✅ **0**. |
| Religiosidad popular (novenas, rosarios, procesiones, santos patronos…) | ✅ **0**. |
| Superstición / Nueva Era (horóscopos, amuletos, karma…) | ✅ **0**. |
| Mitos típicos del material infantil | ✅ **0**. Ni manzana en el Edén, ni «ballena» en Jonás, ni 25 de diciembre. |

### Dos cosas que se verificaron y están bien

- **Los 8 enlaces a `bible.com`** usan la versión **149**, que es la RVR1960
  (confirmado). Cada uno lleva además `.RVR1960` en la dirección.
- **Los 4 canales recomendados** en la guía del maestro son evangélicos:
  Superlibro (CBN), Saddleback Kids Español, Pequeños Héroes y Proyecto
  Biblia. Ninguno es católico.

### Dos detalles honestos

1. **Los videos recomendados son dramatizaciones.** Añaden diálogos y escenas
   que el texto bíblico no tiene (es normal en animación). Conviene que la guía
   lo advierta: el video ilustra, pero **la clase se enseña desde el pasaje**.
2. **Una pista del juego «¿Quién soy?»** dice de Ester: «Dios me puso en el
   palacio para un momento como ese». El libro de Ester **no nombra a Dios**
   en ninguno de sus versículos (4:14 dice «¿y quién sabe si para esta hora has
   llegado al reino?»). No es doctrina equivocada —la providencia es justamente
   el tema del libro—, pero sí es una interpretación. Se puede dejar o cambiar
   por «Llegué al reino para un momento como ese». **Es tu decisión**, no la
   cambié.

### Comprobado con las herramientas del proyecto

Las siete revisiones pasan después de los cambios:
`revisar-sitio` · `revisar-biblia` · `revisar-series` · `revisar-destacadas` ·
`revisar-plataforma` · `revisar-juegos` · `sincronizar-portada`.
