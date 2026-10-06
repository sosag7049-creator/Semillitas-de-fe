/**
 * series-data.js — Planes de enseñanza
 * ---------------------------------------------------------------------------
 * Agrupa las lecciones que ya existen en rutas con orden y sentido, para que
 * el maestro sepa qué enseña el próximo trimestre sin tener que armarlo.
 *
 * Cada serie referencia las lecciones por su `slug`, nunca por su número:
 * así, si mañana se inserta una lección nueva en medio del catálogo, los
 * planes siguen apuntando a la clase correcta.
 *
 * Una lección puede estar en varias series. Es intencional: «David y Goliat»
 * sirve igual para un recorrido del Antiguo Testamento que para una serie
 * sobre el miedo.
 *
 * Para agregar una serie, añade un objeto aquí. La página /series/ se arma
 * sola y `tools/revisar-series.mjs` avisa si algún slug no existe.
 */

export const SERIES = [
  {
    id: 'plan-de-dios',
    title: 'El plan de Dios desde el principio',
    tagline: 'Un recorrido completo, de la creación al nacimiento de Jesús',
    emoji: '📜',
    tone: 'azul',
    audience: '3 a 10 años',
    description:
      'Trece clases en orden cronológico para que los niños entiendan que la ' +
      'Biblia no son historias sueltas, sino una sola historia. Es la serie ' +
      'recomendada para empezar el año o para un grupo nuevo.',
    keyVerse: 'En el principio creó Dios los cielos y la tierra. — Génesis 1:1',
    lessons: [
      'la-creacion',
      'adan-y-eva',
      'noe-y-el-arca',
      'abraham-espera',
      'jose-perdona',
      'moises-y-la-zarza',
      'dios-abre-el-mar',
      'diez-mandamientos',
      'josue-y-jerico',
      'samuel-escucha',
      'david-y-goliat',
      'salomon-y-la-sabiduria',
      'jesus-nace',
    ],
  },
  {
    id: 'conociendo-a-jesus',
    title: 'Conociendo a Jesús',
    tagline: 'Del pesebre a la tumba vacía, en el orden en que ocurrió',
    emoji: '✝️',
    tone: 'verde',
    audience: '3 a 10 años',
    description:
      'Once clases que siguen la vida de Jesús: su nacimiento, su bautismo, ' +
      'sus milagros, sus parábolas y su resurrección. Termina en «Jesús vive», ' +
      'así que encaja muy bien si quieres cerrar en Semana Santa.',
    keyVerse:
      'Yo soy el camino, y la verdad, y la vida. — Juan 14:6',
    lessons: [
      'jesus-nace',
      'bautismo-de-jesus',
      'jesus-calma-el-mar',
      'panes-y-peces',
      'jesus-bendice-a-los-ninos',
      'buen-samaritano',
      'oveja-perdida',
      'el-hijo-prodigo',
      'zaqueo-cambia',
      'la-casa-sobre-la-roca',
      'jesus-vive',
    ],
  },
  {
    id: 'valientes',
    title: 'Valientes de la Biblia',
    tagline: 'Personas comunes que obedecieron a Dios aun con miedo',
    emoji: '🦁',
    tone: 'naranja',
    audience: '6 a 10 años',
    description:
      'Ocho clases sobre valentía que no esconden el miedo: Gedeón dudó, ' +
      'Moisés puso excusas y Ester necesitó ayuda antes de hablar. Útil para ' +
      'grupos de mayores o para un campamento de vacaciones.',
    keyVerse:
      'Esfuérzate y sé valiente; no temas ni desmayes. — Josué 1:9',
    lessons: [
      'moises-y-la-zarza',
      'dios-abre-el-mar',
      'josue-y-jerico',
      'debora-sirve-con-valentia',
      'gedeon-y-los-300',
      'david-y-goliat',
      'ester-actua',
      'daniel-y-la-oracion',
    ],
  },
  {
    id: 'corazon-que-ama',
    title: 'Un corazón que ama',
    tagline: 'Perdón, amistad, honestidad y misericordia',
    emoji: '❤️',
    tone: 'rosa',
    audience: '3 a 10 años',
    description:
      'Nueve clases sobre cómo tratamos a los demás. Cada una termina en una ' +
      'decisión concreta que el niño puede tomar durante la semana. Buena ' +
      'serie para un grupo con conflictos entre compañeros.',
    keyVerse:
      'Sed benignos unos con otros, misericordiosos, perdonándoos unos a ' +
      'otros. — Efesios 4:32',
    lessons: [
      'jose-perdona',
      'rut-es-fiel',
      'david-y-jonatan',
      'elias-y-la-viuda',
      'diez-mandamientos',
      'jonas',
      'buen-samaritano',
      'zaqueo-cambia',
      'el-hijo-prodigo',
    ],
  },
  {
    id: 'primeras-historias',
    title: 'Mis primeras historias',
    tagline: 'Las seis más sencillas, pensadas para los más pequeños',
    emoji: '🐑',
    tone: 'amarillo',
    audience: '3 a 5 años',
    description:
      'Seis clases con animales, repetición y mucho movimiento. Historias ' +
      'cortas, sin escenas que asusten y con manualidades de pocos pasos. ' +
      'Ideal para una clase de párvulos o para un niño que llega por primera vez.',
    keyVerse:
      'Dejad a los niños venir a mí. — Marcos 10:14',
    lessons: [
      'la-creacion',
      'noe-y-el-arca',
      'jesus-nace',
      'oveja-perdida',
      'panes-y-peces',
      'jesus-bendice-a-los-ninos',
    ],
  },
  {
    id: 'cuando-tengo-miedo',
    title: 'Cuando tengo miedo',
    tagline: 'Cinco clases para hablar del temor sin minimizarlo',
    emoji: '🌊',
    tone: 'morado',
    audience: '6 a 10 años',
    description:
      'Una serie corta para momentos difíciles: una mudanza, un duelo en la ' +
      'iglesia, un susto en la comunidad. Enseña a orar, a nombrar lo que se ' +
      'siente y a buscar a un adulto seguro.',
    keyVerse:
      'En el día que temo, yo en ti confío. — Salmo 56:3',
    lessons: [
      'dios-abre-el-mar',
      'david-y-goliat',
      'jesus-calma-el-mar',
      'daniel-y-la-oracion',
      'gedeon-y-los-300',
    ],
  },
];

/** Serie que se sugiere a quien todavía no ha empezado ninguna. */
export const SERIE_RECOMENDADA = 'plan-de-dios';
