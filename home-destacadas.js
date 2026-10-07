/**
 * home-destacadas.js — Qué se muestra en «Lecciones destacadas» de la portada
 * ---------------------------------------------------------------------------
 * La portada ya no obliga a entrar al catálogo para descubrir contenido: enseña
 * unas pocas clases elegidas a mano, cada una con su duración, su rango de
 * edad, el pasaje y los materiales que hay que llevar a la clase.
 *
 * Este archivo guarda SOLO las decisiones editoriales (qué se destaca y qué
 * materiales lleva cada clase). El título, el pasaje, la ilustración y la
 * duración salen del catálogo real (`lesson-data.js`), así que nunca hay dos
 * versiones del mismo dato.
 *
 * Para cambiar lo que se destaca, edita `DESTACADAS`. Para que una clase nueva
 * muestre sus materiales, añádela a `MATERIALES` con su `slug`.
 */

/** Materiales de cada clase, en el orden en que conviene prepararlos. */
export const MATERIALES = {
  'la-creacion': ['Papel continuo o cartulinas', 'Crayones', 'Tarjetas de cielo, tierra y mar'],
  'noe-y-el-arca': ['Cartulinas de colores', 'Tijeras sin punta', 'Pegamento'],
  'abraham-espera': ['Un frasco o vaso', 'Estrellas de papel', 'Marcadores'],
  'jose-perdona': ['Papel de colores', 'Crayones', 'Cinta adhesiva'],
  'moises-y-la-zarza': ['Cartulina', 'Tiras de papel rojo y naranja', 'Pegamento'],
  'dios-abre-el-mar': ['Dos hojas azules', 'Tijeras sin punta', 'Sillas u objetos para el camino'],
  'diez-mandamientos': ['Cartulina gris o café', 'Marcadores', 'Tarjetas con situaciones'],
  'josue-y-jerico': ['Hojas para enrollar', 'Cinta adhesiva', 'Vasos de papel'],
  'rut-es-fiel': ['Una canasta o caja', 'Espigas de papel', 'Crayones'],
  'samuel-escucha': ['Diadema u orejas de papel', 'Marcadores', 'Objetos que suenen'],
  'david-y-goliat': ['Cinco piedras lisas o de papel', 'Marcadores', 'Vasos de papel y una pelota blanda'],
  'david-y-jonatan': ['Cartulina', 'Crayones', 'Lana o estambre'],
  'salomon-y-la-sabiduria': ['Cartulina amarilla', 'Marcadores', 'Círculos rojo, amarillo y verde'],
  'elias-y-la-viuda': ['Un frasco o vaso', 'Tiras de papel', 'Fichas o semillas para repartir'],
  'ester-actua': ['Tiras de cartulina para la corona', 'Grapadora o cinta', 'Marcadores'],
  'daniel-y-la-oracion': ['Cartulina', 'Tijeras sin punta', 'Crayones'],
  'jonas': ['Platos o cartulinas', 'Pintura o crayones azules', 'Tijeras sin punta'],
  'jesus-nace': ['Cartulina amarilla', 'Escarcha o papel brillante', 'Lana para colgar'],
  'jesus-calma-el-mar': ['Papel para doblar barcos', 'Crayones', 'Una tela o sábana grande'],
  'panes-y-peces': ['Una canasta pequeña', 'Papel café y azul', 'Tijeras sin punta'],
  'buen-samaritano': ['Una caja pequeña', 'Vendas o tiras de tela', 'Tarjetas y crayones'],
  'oveja-perdida': ['Algodón', 'Cartulina', 'Pegamento'],
  'zaqueo-cambia': ['Cartulina café y verde', 'Papel para los frutos', 'Pegamento'],
  'jesus-vive': ['Cartulina', 'Un círculo de papel para la piedra', 'Marcadores'],
  'jesus-bendice-a-los-ninos': ['Cartulina para el marco', 'Crayones', 'Un espejo pequeño (opcional)'],
  'el-hijo-prodigo': ['Hojas de colores', 'Crayones', 'Pegamento'],
  'la-casa-sobre-la-roca': ['Bloques o cajitas', 'Una bandeja firme y papel arrugado', 'Hojas y crayones'],
  'adan-y-eva': ['Cartulina verde y café', 'Papel para los frutos', 'Tarjetas de acciones'],
  'debora-sirve-con-valentia': ['Cartulina verde y café', 'Tijeras sin punta', 'Marcadores'],
  'bautismo-de-jesus': ['Papel blanco y azul', 'Tijeras sin punta', 'Hilo para colgar la paloma'],
  'gedeon-y-los-300': ['Vasos de papel', 'Papel de colores', 'Linternas pequeñas (opcional)'],
};

/** Si una clase todavía no tiene lista propia, se muestra esto. */
export const MATERIALES_POR_DEFECTO = ['Biblia Reina-Valera', 'Hojas y crayones', 'Cinta adhesiva'];

/**
 * «Lección de la semana»: rota sola cada lunes.
 * No incluye las clases que ya aparecen fijas más abajo, para que nunca salgan
 * dos tarjetas con la misma lección.
 */
export const ROTACION_SEMANAL = [
  'la-creacion',
  'noe-y-el-arca',
  'abraham-espera',
  'moises-y-la-zarza',
  'samuel-escucha',
  'ester-actua',
  'daniel-y-la-oracion',
  'jonas',
  'jesus-nace',
  'panes-y-peces',
  'buen-samaritano',
  'oveja-perdida',
  'zaqueo-cambia',
  'la-casa-sobre-la-roca',
];

/**
 * Las tarjetas de la portada, en orden.
 *
 *   etiqueta → el rótulo de color que explica por qué está destacada
 *   motivo   → una línea corta que ayuda a decidir
 *   slug     → la clase; si se omite, se usa la rotación semanal
 *   enlace   → enlace secundario opcional («ver más de lo mismo»)
 */
export const DESTACADAS = [
  {
    etiqueta: 'Lección de la semana',
    tono: 'semana',
    motivo: 'Cambia cada lunes. Si no sabes por dónde empezar, empieza aquí.',
    rotatoria: true,
  },
  {
    etiqueta: 'Más guardadas',
    tono: 'guardadas',
    slug: 'david-y-goliat',
    motivo: 'La clase que más maestros guardan en sus favoritas.',
  },
  {
    etiqueta: 'Para enseñar sobre el miedo',
    tono: 'miedo',
    slug: 'jesus-calma-el-mar',
    motivo: 'Para hablar del temor sin minimizarlo.',
    enlace: { texto: 'Ver el plan «Cuando tengo miedo»', href: '/series/#cuando-tengo-miedo' },
  },
  {
    etiqueta: 'Para enseñar sobre el perdón',
    tono: 'perdon',
    slug: 'jose-perdona',
    motivo: 'Cuando hubo un pleito en el grupo o en casa.',
    enlace: { texto: 'Ver el plan «Un corazón que ama»', href: '/series/#corazon-que-ama' },
  },
  {
    etiqueta: 'Especiales sobre Jesús',
    tono: 'jesus',
    slug: 'jesus-vive',
    motivo: 'El cierre natural para Semana Santa.',
    enlace: { texto: 'Ver las 11 clases sobre Jesús', href: '/lecciones/?categoria=Jes%C3%BAs' },
  },
];

/** Lunes de la semana en curso, para que la rotación sea igual para todos. */
export function semanaActual(hoy = new Date()) {
  const dia = (hoy.getDay() + 6) % 7; // 0 = lunes
  const lunes = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - dia);
  return Math.floor(lunes.getTime() / 604800000); // 604800000 ms = 7 días
}
