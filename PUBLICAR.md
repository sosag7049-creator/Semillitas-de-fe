# Cómo publicar lo que falta

> Documento temporal. Bórralo cuando ya esté publicado.

## Qué está esperando

Dos funciones nuevas, terminadas y probadas, que **todavía no se ven** en
https://semillitasbiblicas.space:

- **`/series/`** — 6 planes de enseñanza que agrupan las 31 lecciones, con el
  bloque «¿qué enseño este domingo?».
- **Filtro por edad** en el catálogo — botones 3-5 / 6-10 años.

Más `IDEAS.md` (hoja de ruta) y dos herramientas de revisión.

Todo está guardado en el commit local **`b4d225d`**, encima de lo que ya está
publicado (`6caed72`).

---

## Por qué no se publicó solo

La sesión de trabajo donde se construyó esto **quedó cerrada** cuando se
fusionaron los dos primeros pull requests. Desde una sesión cerrada se puede
seguir programando y probando, pero no subir nada a GitHub.

No es un error del proyecto ni algo que esté roto: solo hay que hacerlo desde
una sesión nueva.

---

## Qué hacer (2 minutos)

### 1. Abre una sesión de código nueva

En Arena, empieza una conversación nueva en modo Agente sobre el repositorio
`sosag7049-creator/Semillitas-de-fe`.

### 2. Pega este mensaje

```
Publica el trabajo que quedó pendiente en este repositorio.

Hay dos funciones terminadas que no están en main: la sección /series/
(planes de enseñanza) y el filtro por edad del catálogo.

Primero revisa si los archivos ya están en el espacio de trabajo:

    ls series/ series-data.js tools/revisar-series.mjs

- Si aparecen: haz commit y abre el pull request hacia main.
- Si NO aparecen: aplica el respaldo y luego sube:

    git am CAMBIOS-PENDIENTES.patch

Antes de subir, comprueba que todo sigue bien:

    node tools/revisar-biblia.mjs
    node tools/revisar-series.mjs

Las dos deben terminar en verde.
```

### 3. Fusiona el pull request

Cuando te avise, entra al enlace y pulsa **Merge**.

### 4. Espera 2 minutos

GitHub Pages reconstruye el sitio solo.

Para comprobar que funcionó, abre:
https://semillitasbiblicas.space/series/

Si ves la página de error, **espera un minuto y refresca con `Ctrl + Shift + R`**
(es caché del navegador, no un fallo).

---

## Si algo sale mal

El archivo **`CAMBIOS-PENDIENTES.patch`** de esta carpeta contiene todo el
trabajo y ya se verificó que aplica sin conflictos sobre el `main` publicado.
Mientras ese archivo exista, nada se pierde.
