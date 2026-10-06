import { PRINTABLES } from '/printables-data.js';
import { ADDITIONAL_LESSONS } from '/additional-lessons.js?v=2';
import { SECOND_BLOCK } from '/additional-lessons-2.js?v=1';
import { THIRD_BLOCK } from '/additional-lessons-3.js?v=1';

const slugs=['la-creacion','noe-y-el-arca','abraham-espera','jose-perdona','moises-y-la-zarza','dios-abre-el-mar','diez-mandamientos','josue-y-jerico','rut-es-fiel','samuel-escucha','david-y-goliat','david-y-jonatan','salomon-y-la-sabiduria','elias-y-la-viuda','ester-actua','daniel-y-la-oracion','jonas','jesus-nace','jesus-calma-el-mar','panes-y-peces','buen-samaritano','oveja-perdida','zaqueo-cambia','jesus-vive'];
// Un icono distinto por lección: se repite en el catálogo, en la ruleta y en
// los planes, así que dos lecciones nunca deben compartir el mismo.
// Abraham usa ✨ («como las estrellas del cielo») y la ⭐ de Belén queda
// reservada para «Jesús nace».
const icons=['🌍','🌈','✨','🧥','🔥','🌊','📜','🎺','🌾','👂','🪨','🤝','👑','🏺','👸','🦁','🐋','⭐','⛵','🥖','❤️','🐑','🌳','☀️'];
const coverImages=Object.fromEntries(slugs.map(slug=>[slug,`/images/lessons/${slug}.webp`]));

const stories=[
 [['Antes de todo','Antes de que existieran las montañas, los animales o las personas, Dios ya estaba allí. Dios habló y comenzó a crear un mundo bueno, hermoso y ordenado.'],['Siete días maravillosos','Dios hizo la luz; el cielo; la tierra, el mar y las plantas; el sol, la luna y las estrellas; los peces y las aves; los animales y las personas. El séptimo día descansó.'],['Una creación muy especial','Dios creó al ser humano a su imagen. Eso significa que cada niño y cada niña tiene gran valor. Dios nos encargó cuidar lo que hizo.']],
 [['Una tarea sorprendente','La maldad había crecido, pero Noé caminaba con Dios. Dios le indicó construir una enorme arca para proteger a su familia y a los animales.'],['Obedecer antes de ver','Noé hizo lo que Dios mandó aunque nunca había vivido algo parecido. Entraron los animales según la instrucción de Dios: siete parejas de los limpios y de las aves, y una pareja de los no limpios. Llovió cuarenta días y cuarenta noches, y Dios cuidó a los que estaban en el arca.'],['La promesa del arcoíris','Cuando las aguas bajaron, Noé salió y adoró a Dios. Dios puso el arcoíris como señal de su pacto: no volvería a destruir a todos los seres vivos con un diluvio.']],
 [['Una invitación','Dios llamó a Abram para dejar su tierra y viajar a un lugar que le mostraría. Le prometió una familia numerosa y bendición para muchas naciones.'],['Una espera larga','Pasaron años y Abraham y Sara todavía no tenían el hijo prometido. Dios le mostró las estrellas y le recordó que podía confiar en su palabra.'],['La promesa llega','En el tiempo de Dios nació Isaac. Abraham aprendió que esperar no significa que Dios haya olvidado; Él cumple lo que promete.']],
 [['Sueños y dificultades','José recibió sueños, pero sus hermanos sintieron celos y lo vendieron. En Egipto enfrentó injusticias; aun así, Dios estuvo con él y José siguió actuando correctamente.'],['Dios prepara el camino','Dios dio a José sabiduría para explicar los sueños del faraón. José organizó alimento para los años difíciles y llegó a servir con gran responsabilidad.'],['Un perdón que restaura','Cuando sus hermanos buscaron comida, José decidió perdonar. No llamó bueno al daño, pero vio cómo Dios había convertido el sufrimiento en una oportunidad para salvar vidas.']],
 [['Dios llama a Moisés','Mientras cuidaba ovejas, Moisés vio una zarza que ardía sin consumirse. Dios lo llamó por su nombre y le pidió ayudar a liberar a su pueblo.'],['Moisés tiene preguntas','Moisés sintió temor y presentó excusas. Dios no se burló: prometió acompañarlo y le dio ayuda para cumplir la misión.'],['Una respuesta valiente','Moisés regresó a Egipto confiando en la presencia de Dios. Aprendió que no necesitamos sentirnos perfectos para obedecer.']],
 [['Atrapados frente al mar','El pueblo salió de Egipto, pero pronto quedó entre el mar y el ejército. Tuvieron miedo y clamaron. Moisés les recordó que Dios podía ayudarlos.'],['Un camino inesperado','Dios abrió un camino en medio del mar. El pueblo cruzó por tierra seca mientras las aguas estaban a los lados.'],['Libres para seguir','Al llegar seguros a la otra orilla, celebraron la ayuda de Dios. Cuando sentimos miedo podemos orar, buscar a un adulto seguro y dar el siguiente paso correcto.']],
 [['Un pueblo libre','Dios había rescatado a Israel de Egipto. En el monte Sinaí les dio mandamientos para enseñarles a vivir como su pueblo.'],['Dos grandes amores','Los mandamientos enseñan a amar y honrar a Dios, y a respetar la vida, la familia, la verdad y lo que pertenece a otros.'],['Reglas que protegen','Las instrucciones de Dios no eran para ganar su amor; eran una respuesta al Dios que ya los había rescatado. Sus caminos protegen y guían.']],
 [['Una ciudad cerrada','Jericó tenía grandes murallas. Dios dio a Josué un plan extraño: marchar alrededor de la ciudad durante varios días y esperar la señal.'],['Paciencia y unidad','Soldados, sacerdotes y pueblo siguieron las instrucciones juntos. No corrieron antes de tiempo ni cambiaron el plan.'],['Dios da la victoria','En el día señalado tocaron las trompetas y gritaron; las murallas cayeron. La victoria vino de Dios, no de la fuerza del pueblo.']],
 [['Una decisión fiel','Después de perder a sus esposos, Noemí quiso volver a Belén. Rut decidió acompañarla, cuidar de ella y confiar en el Dios de Israel.'],['Trabajo y bondad','Rut recogía espigas que quedaban en el campo para conseguir alimento. Booz vio su fidelidad y procuró que estuviera segura.'],['Dios cuida por medio de personas','La historia de Rut muestra actos pequeños de lealtad, trabajo y generosidad. Dios usó esa familia dentro de la historia que conduciría a David y, más adelante, a Jesús.']],
 [['Una voz en la noche','Samuel era niño y ayudaba en el santuario. Una noche oyó su nombre y pensó que Elí lo llamaba. Esto ocurrió tres veces.'],['Elí ayuda a comprender','Elí entendió que Dios llamaba a Samuel y le enseñó a responder: “Habla, Jehová, porque tu siervo oye”. Samuel necesitó la guía de un adulto.'],['Escuchar y obedecer','Dios habló y Samuel escuchó con atención. Hoy escuchamos a Dios al leer la Biblia y comprobamos toda enseñanza con su Palabra.']],
 [['Un gigante amenaza','Goliat era un guerrero enorme que llenaba de temor al ejército. David llegó para llevar comida y oyó sus amenazas.'],['David recuerda a Dios','David no confió en una armadura que no sabía usar. Recordó cómo Dios lo había ayudado antes y tomó su honda y cinco piedras.'],['Valor con confianza','David enfrentó a Goliat en el nombre de Dios y venció. El valor no es buscar peligro; es hacer lo correcto confiando en Dios y pidiendo ayuda sabia.']],
 [['Una amistad sincera','David y Jonatán se hicieron grandes amigos. Jonatán no sintió celos del éxito de David; buscó su bien y cumplió sus promesas.'],['Ayuda en un momento difícil','Cuando David estuvo en peligro, Jonatán le avisó y trató de hablar con su padre. Su amistad incluyó verdad, valor y cuidado.'],['Amigos que hacen el bien','Una amistad sana ayuda a acercarnos a Dios y a hacer lo correcto. Los secretos que implican daño o peligro siempre deben contarse a un adulto seguro.']],
 [['Una oferta de Dios','Al comenzar a reinar, Salomón sabía que necesitaba ayuda. En un sueño, Dios le dijo que pidiera lo que quisiera.'],['Una petición sabia','Salomón no pidió riqueza ni fama. Pidió un corazón entendido para gobernar y distinguir entre lo bueno y lo malo.'],['Sabiduría para cada día','A Dios le agradó su petición y le concedió sabiduría. Nosotros también podemos parar, pensar, orar, leer la Biblia y pedir consejo antes de decidir.']],
 [['Muy poco alimento','Durante una sequía, Dios envió a Elías a una viuda. Ella solo tenía un poco de harina y aceite para preparar la última comida de su casa.'],['Una acción de fe','Elías le comunicó la promesa de Dios. La mujer compartió lo que tenía y preparó alimento con confianza.'],['Dios sostiene','La harina y el aceite no se acabaron durante la escasez. Dios vio su necesidad y mostró cuidado; la generosidad nunca debe usarse para presionar a quien necesita ayuda.']],
 [['Una reina en el momento preciso','Ester era reina cuando su pueblo quedó en peligro. Mardoqueo le pidió hablar con el rey, aunque acercarse sin invitación podía ser arriesgado.'],['Ayuno, consejo y valor','Ester no actuó impulsivamente. Pidió que el pueblo ayunara, preparó sus palabras y escogió el momento para hablar.'],['Defender lo correcto','Ester denunció a Amán ante el rey. Más adelante se permitió a los judíos defenderse; el primer decreto no podía anularse. Dios puede usar nuestra voz; cuando hay peligro, buscamos primero ayuda de adultos responsables.']],
 [['Una costumbre de oración','Daniel servía con excelencia y otros funcionarios sintieron celos. Convencieron al rey de prohibir orar a cualquier otro durante treinta días.'],['Fiel aun con temor','Daniel continuó orando a Dios como acostumbraba. Fue arrojado al foso de los leones, pero Dios envió su ángel y lo protegió.'],['Constancia que da testimonio','El rey se alegró al encontrarlo vivo y reconoció al Dios de Daniel. Orar es hablar con Dios con sinceridad, en días fáciles y difíciles.']],
 [['Huir en dirección contraria','Dios envió a Jonás a Nínive, pero él tomó un barco hacia otro lugar. Una tormenta mostró que no podía escapar de la misión.'],['Una segunda oportunidad','Jonás fue arrojado al mar, un gran pez lo guardó y allí oró. Dios lo rescató y volvió a enviarlo a Nínive.'],['Misericordia para otros','La gente de Nínive se arrepintió y Dios tuvo compasión. Jonás se enojó, y Dios le enseñó que su misericordia alcanza también a personas diferentes.']],
 [['La promesa se acerca','El ángel Gabriel anunció a María que tendría un hijo llamado Jesús. José también recibió dirección de Dios y decidió obedecer.'],['Una noche en Belén','María y José viajaron a Belén. Jesús nació y fue acostado en un pesebre porque no había lugar disponible para ellos.'],['Buenas noticias para todos','Ángeles anunciaron a pastores que había nacido el Salvador. Ellos fueron a verlo y contaron con alegría lo que habían oído.']],
 [['Una travesía tranquila','Jesús y sus discípulos cruzaban el lago. Mientras Jesús dormía, una tormenta fuerte llenó la barca de agua y los discípulos sintieron terror.'],['“Calla, enmudece”','Los discípulos despertaron a Jesús. Él reprendió al viento y al mar; de inmediato llegó una gran calma.'],['¿Quién es Jesús?','Ellos quedaron asombrados porque hasta el viento y el mar le obedecían. Podemos llevar nuestros temores a Jesús y buscar ayuda segura.']],
 [['Una multitud con hambre','Muchas personas siguieron a Jesús y escucharon sus enseñanzas. Al hacerse tarde, Jesús preguntó cómo podrían alimentar a todos.'],['Una pequeña ofrenda','Andrés señaló a un muchacho que tenía cinco panes de cebada y dos pececillos. Parecía muy poco para tantas personas; Jesús tomó esos alimentos.'],['Jesús multiplica','Jesús dio gracias y repartieron alimento hasta que todos comieron. Aún recogieron doce canastas; lo pequeño puede servir mucho en manos de Jesús.']],
 [['Una pregunta importante','Un experto preguntó a Jesús quién era su prójimo. Jesús respondió contando la historia de un viajero atacado en el camino.'],['Algunos pasaron de largo','Dos personas religiosas vieron al herido pero no se detuvieron. Después llegó un samaritano, alguien que muchos despreciaban.'],['Compasión en acción','El samaritano se acercó, cuidó las heridas y buscó un lugar seguro. Amar al prójimo significa ver la necesidad y ayudar con sabiduría.']],
 [['Una oveja falta','Jesús contó sobre un pastor que tenía cien ovejas. Al contar, descubrió que una se había perdido.'],['Una búsqueda cuidadosa','El pastor salió a buscarla hasta encontrarla. La cargó con alegría y volvió a casa.'],['Fiesta por quien vuelve','El pastor llamó a sus amigos para celebrar. Jesús explicó que hay gozo en el cielo cuando una persona se arrepiente y vuelve a Dios.']],
 [['Un hombre en un árbol','Zaqueo cobraba impuestos y había tratado injustamente a personas. Como era bajo, subió a un árbol para poder ver pasar a Jesús.'],['Jesús lo llama','Jesús se detuvo, lo llamó por su nombre y quiso visitar su casa. Zaqueo lo recibió con alegría aunque otros murmuraban.'],['Un cambio visible','Zaqueo anunció que daría la mitad de sus bienes a los pobres y devolvería cuatro veces lo que hubiera defraudado. El arrepentimiento verdadero cambia decisiones y busca reparar el daño.']],
 [['Una mañana diferente','Después de que Jesús murió y fue sepultado, varias mujeres fueron temprano a la tumba. Encontraron la piedra removida y la tumba vacía.'],['El anuncio más alegre','Ángeles les recordaron que Jesús había dicho que resucitaría. Ellas corrieron a contarlo a los discípulos.'],['Jesús está vivo','Jesús se apareció a sus seguidores y les explicó las Escrituras. Su resurrección nos da esperanza: el pecado y la muerte no tienen la última palabra.']]
];

// Distractores propios de cada historia. Antes las 24 clases base compartian
// 'Ser siempre el primero' y 'No necesitar ayuda', y la respuesta correcta
// quedaba siempre en la primera posicion: el nino aprendia el patron, no la
// leccion. rot() ademas rota las opciones para variar donde cae la correcta.
const wrongTeachings=[
 ['El mundo apareció solo, sin que nadie lo hiciera','Solo las cosas grandes de la creación son importantes'],
 ['Obedecemos a Dios solo cuando entendemos todo','Noé construyó el arca por su cuenta, sin que Dios se lo pidiera'],
 ['Si una promesa tarda, es que Dios se olvidó','Dios cumple solo si se lo pedimos muy rápido'],
 ['Perdonar significa que lo malo no importó','Debemos devolver el daño que nos hicieron'],
 ['Dios solo llama a quienes ya hacen todo bien','Moisés se nombró líder a sí mismo'],
 ['El pueblo se salvó porque corrió muy rápido','Tener miedo significa que no confiamos en Dios'],
 ['Las reglas de Dios existen para que nadie disfrute','Cumplir reglas nos hace mejores que los demás'],
 ['Los muros cayeron por la fuerza de los soldados','Obedecer sirve solo cuando vemos resultados el primer día'],
 ['Solo cuentan las ayudas grandes y llamativas','Rut ayudó esperando recibir algo a cambio'],
 ['Dios solo habla a las personas mayores','Escuchar es quedarse callado sin prestar atención'],
 ['David venció porque era el más fuerte','Ser valiente es no sentir miedo nunca'],
 ['Un buen amigo siempre nos da la razón','La amistad sirve para conseguir favores'],
 ['La sabiduría llega sola cuando crecemos','Salomón pidió riquezas y poder'],
 ['Solo quien tiene mucho puede compartir','La viuda compartió porque le sobraba comida'],
 ['Es mejor callar para no meterse en problemas','Ester actuó sola, sin orar ni pedir apoyo'],
 ['Orar sirve para que nunca nos pase nada difícil','Daniel dejó de orar para evitar el castigo'],
 ['Dios se olvida de quienes huyen de Él','Jonás fue castigado sin posibilidad de volver'],
 ['La Navidad se trata sobre todo de los regalos','Jesús nació en un palacio porque era rey'],
 ['La tormenta se calmó sola con el tiempo','Los discípulos no debieron despertar a Jesús'],
 ['Solo sirve lo que es grande y suficiente','La gente comió porque cada uno trajo su comida'],
 ['Ayudamos solo a quienes se parecen a nosotros','Basta con sentir pena por el que sufre'],
 ['El pastor prefirió quedarse con las noventa y nueve','Solo valen quienes nunca se equivocan'],
 ['Zaqueo cambió porque la gente lo criticó','Jesús solo visita a quienes ya son buenos'],
 ['Los discípulos solo recordaron a Jesús en su corazón','La tumba siguió cerrada']
];
const wrongApplications=[
 ['Arrancar flores para llevarlas a casa','Quedarnos callados sin dar gracias'],
 ['Obedecer solo si nos dan un premio','Esperar a que nos lo repitan muchas veces'],
 ['Dejar de orar si la respuesta tarda','Pedir lo mismo a muchas personas hasta conseguirlo'],
 ['Guardar el enojo en silencio','Dejar de hablarle a esa persona para siempre'],
 ['Esperar a ser grandes para servir','Servir solo cuando alguien nos mira'],
 ['Esconder el miedo y no contarlo a nadie','Resolver todo solos sin pedir ayuda'],
 ['Recitar los mandamientos sin practicarlos','Vigilar quién se porta mal'],
 ['Hacer solo la parte de la tarea que nos gusta','Dejar la instrucción a la mitad'],
 ['Ayudar solo cuando nos lo ruegan','Contarle a todos lo que ayudamos'],
 ['Leer la Biblia solo cuando hay una tarea','Esperar a que otro nos lo cuente'],
 ['Enfrentar todo solos para demostrar valor','Responder con gritos cuando nos molestan'],
 ['Jugar únicamente con nuestro mejor amigo','Elegir amigos por lo que tienen'],
 ['Decidir rápido y sin pensar','Hacer lo que haga la mayoría'],
 ['Compartir solo lo que ya no queremos','Esperar a tener de sobra para compartir'],
 ['Defender lo correcto gritando más fuerte','Mirar hacia otro lado cuando algo está mal'],
 ['Orar solo cuando algo sale mal','Orar únicamente en la iglesia'],
 ['Recordar siempre lo malo que nos hicieron','Huir cuando algo nos cuesta'],
 ['Guardar la buena noticia solo para nosotros','Pedir muchos regalos'],
 ['Aguantar el miedo sin decir nada','Esperar a que el miedo se vaya solo'],
 ['Esperar a tener mucho para compartir','Compartir solo con quien nos cae bien'],
 ['Pasar de largo si llevamos prisa','Resolver solos cualquier emergencia'],
 ['Dejar que cada quien se las arregle','Hacer amigos solo con los más populares'],
 ['Pedir perdón sin cambiar nada','Esperar a que el otro pida perdón primero'],
 ['Guardar silencio sobre lo que creemos','Esperar a entenderlo todo para contarlo']
];
const rot=(opts,k)=>{const n=opts.length;k=((k%n)+n)%n;return{options:opts.slice(n-k).concat(opts.slice(0,n-k)),answer:k}};
const quizzes=[
 ['¿Qué creó Dios el primer día?','La luz','Los animales','Las plantas'],['¿Qué señal recordó la promesa de Dios?','El arcoíris','Una corona','Una estrella'],['¿Qué mostró Dios a Abraham?','Las estrellas','Un palacio','Un barco'],['¿Qué decidió hacer José con sus hermanos?','Perdonarlos','Ignorarlos siempre','Vengarse'],['¿Desde dónde llamó Dios a Moisés?','Una zarza ardiente','Un barco','Un palacio'],['¿Por dónde cruzó el pueblo?','Por tierra seca en el mar','Por un puente','Por una montaña'],['¿Qué enseñan juntos los mandamientos?','Amar a Dios y al prójimo','Ganar premios','Ser más fuerte'],['¿Qué debía hacer el pueblo alrededor de Jericó?','Marchar y obedecer','Construir otro muro','Esconderse'],['¿A quién acompañó Rut?','A Noemí','A Ester','A María'],['¿Qué respondió Samuel?','Habla, porque tu siervo oye','No quiero escuchar','Volveré mañana'],['¿En quién confió David?','En Dios','En su tamaño','En la armadura de Saúl'],['¿Cómo trató Jonatán a David?','Como amigo fiel','Como enemigo','Con celos'],['¿Qué pidió Salomón?','Sabiduría','Más soldados','Un barco'],['¿Qué no se terminó en la casa?','La harina y el aceite','Las monedas','Las joyas'],['¿Qué hizo Ester antes de hablar?','Pidió apoyo y se preparó','Huyó sola','Gritó al pueblo'],['¿Cuántas veces acostumbraba orar Daniel?','Tres veces al día','Una vez al año','Nunca'],['¿Qué hizo Jonás dentro del gran pez?','Oró','Durmió todo el tiempo','Construyó una casa'],['¿Dónde acostaron a Jesús?','En un pesebre','En un trono','En una barca'],['¿Qué hizo Jesús con la tormenta?','La calmó','Se escondió','Saltó al agua'],['¿Qué alimentos tenía el muchacho?','Cinco panes y dos peces','Doce panes','Una moneda'],['¿Quién se detuvo para ayudar?','El samaritano','Nadie','El primer viajero'],['¿Cuántas ovejas se perdieron?','Una','Diez','Cien'],['¿Dónde estaba Zaqueo?','En un árbol','En una barca','En el templo'],['¿Qué encontraron en la tumba?','Que estaba vacía','Una gran piedra cerrada','A los discípulos']
];

const activities=[
 ['Ordena los siete días','Toca en orden: Luz|Cielo|Tierra y plantas|Astros|Aves y peces|Animales y personas|Descanso'],
 ['Parejas hacia el arca','Une cada pareja: León|Elefante|Jirafa|Paloma'],
 ['Cielo de promesas','Reparte diez estrellas de papel|Cuéntenlas juntos en voz alta|Recuerden la promesa que Dios hizo a Abraham|Cada niño elige una promesa para llevar a casa|Oren dando gracias porque Dios cumple a su tiempo'],
 ['Camino del perdón','Ordena: Reconocer el daño|Buscar ayuda segura|Hablar con verdad|Perdonar sin aceptar abuso|Elegir hacer el bien'],
 ['Heme aquí','Siéntense en círculo y hagan silencio|Llama a cinco niños por su nombre|Quien escucha el suyo responde: “Heme aquí”|Cada uno elige una acción de servicio para la semana|Repitan juntos: “Dios está conmigo”'],
 ['Cruza el Mar Rojo','Coloquen dos telas azules formando un camino|Fórmense en fila tomados de la mano|Crucen el camino sin soltarse|Al llegar, digan: “Jehová peleará por vosotros”|Conversen sobre a quién pedimos ayuda cuando tenemos miedo'],
 ['Dos grandes amores','Clasifica: Orar|Decir la verdad|Respetar a la familia|Adorar a Dios|Cuidar lo ajeno'],
 ['Marcha de Jericó','Representa una vuelta cada día durante seis días|Representa siete vueltas el séptimo día|Al terminar la séptima vuelta, da la señal para las trompetas y el grito|Recuerda: esta representación resume siete días; no fueron solo siete vueltas en total.'],
 ['Espigas de bondad','Esconde espigas de papel por el salón|Búsquenlas entre todos, sin competir|Por cada espiga digan una manera de ayudar|Reúnan las espigas en una canasta|Elijan una ayuda para hacer en casa esta semana'],
 ['¿Quién llamó?','Siéntense en círculo y cierren los ojos|Tres niños dicen una frase, uno por uno|Adivinen de quién era cada voz|Respondan todos: “Habla, porque tu siervo oye”|Conversen sobre cómo nos habla Dios por su Palabra'],
 ['Cinco piedras de valor','Escribe en cinco piedras de papel: Dios está conmigo|Puedo orar|Puedo pedir ayuda|Recordaré su Palabra|Haré lo correcto'],
 ['Cadena de amistad','Reparte una tarjeta a cada niño|Escriban o dibujen una cualidad amable de un compañero|Entreguen la tarjeta diciendo algo bueno|Unan las tarjetas formando una cadena|Revisen que nadie se haya quedado sin recibir'],
 ['Semáforo sabio','Practica una decisión con cuatro pasos: Rojo—para|Amarillo—piensa|Azul—ora y pide consejo|Verde—actúa bien'],
 ['Frasco que alcanza','Formen familias de dos o tres niños|Reparte fichas de harina y aceite|Cuenten qué familia tiene de más y cuál de menos|Compartan hasta que todas tengan lo necesario|Den gracias porque Dios cuida y provee'],
 ['Camino valiente de Ester','Elige en cada estación: orar|pedir consejo|preparar palabras|hablar con respeto|buscar protección.'],
 ['Ventana de oración','Abre tres ventanas de papel: Gracias|Ayúdame|Cuida a otros; añade un motivo en cada una.'],
 ['Rutas de Jonás','Sigue decisiones: Huir o escuchar|Ocultar o reconocer|Enojarse o aprender misericordia.'],
 ['Camino a Belén','Pasa por cuatro estaciones: anuncio|viaje|pesebre|pastores, y cuenta qué ocurrió en cada una.'],
 ['Tormenta y calma','Tomen una tela azul entre todos|Muévanla con fuerza imitando la tormenta|Al oír “Calla, enmudece”, deténganse en silencio|Cada niño dice algo que le da miedo, sin burlas|Oren juntos pidiendo la paz de Jesús'],
 ['Canasta compartida','Recorten cinco panes y dos peces de papel|Entréguenlos a un equipo pequeño|Cada equipo propone una manera de compartir|Coloquen todo en una canasta común|Repártanlo de nuevo y vean que alcanza para todos'],
 ['Estaciones de cuidado','Representa: observar|avisar a un adulto|acompañar|buscar ayuda; sin simular heridas reales.'],
 ['Busca la oveja','Esconde una oveja de papel antes de la clase|Reparte cinco pistas sencillas|Búsquenla juntos, sin competir|Al encontrarla, celebren todos a la vez|Repitan: Jesús busca a cada uno y se alegra'],
 ['Frutos de cambio','Coloca en el árbol cuatro frutos: confesar|pedir perdón|devolver|cambiar la conducta.'],
 ['La tumba está vacía','Ordena cinco escenas: cruz|sepultura|mujeres llegan|tumba vacía|Jesús aparece.']
];

const videos=['creacion biblia niños','noe arca biblia niños','abraham promesa biblia niños','jose perdona biblia niños','moises zarza ardiente niños','mar rojo biblia niños','diez mandamientos niños','josue jerico niños','rut biblia niños','samuel escucha a dios niños','david goliat niños','david jonatan niños','salomon sabiduria niños','elias viuda niños','ester biblia niños','daniel leones niños','jonas gran pez niños','nacimiento jesus niños','jesus calma tormenta niños','panes peces niños','buen samaritano niños','oveja perdida niños','zaqueo niños','resurreccion jesus niños'];
const videoIds=['UVou_Dmndqc','iOLi2mXQOjo','hTNGJe267pc','eSUUHKPKL8I','xF0xMJAgVzg','7MLMIau0nzw','F0gnCkAcZv8','w-eqGmWeioU','VTmoQYWaRsY','wwzlWBMTnig','I8bV6U7VYfg','azVk3hcxNVU','yBcRErmjems','ZcOM_mriHUA','VK3p3TmcHE0','tNr_KjUf81s','j13m5Evg-RE','fKcB1a9Vz7k','HHJ0xuHXBwo','hWXV9yTspwY','9jvobdpJCy4','OS0s7aJU7r4','uGz2E1f6o5w','hDAdKqkSp-o'];
const memories=[
 ['Y vio Dios todo lo que había hecho, y he aquí que era bueno en gran manera','Génesis 1:31'],['E hizo Noé conforme a todo lo que le mandó Jehová','Génesis 7:5'],['Y creyó a Jehová, y le fue contado por justicia','Génesis 15:6'],['Vosotros pensasteis mal contra mí, mas Dios lo encaminó a bien','Génesis 50:20'],['Ve, porque yo estaré contigo','Éxodo 3:12'],['Jehová peleará por vosotros, y vosotros estaréis tranquilos','Éxodo 14:14'],['Yo soy Jehová tu Dios','Éxodo 20:2'],['Mira que te mando que te esfuerces y seas valiente','Josué 1:9'],['Tu pueblo será mi pueblo, y tu Dios mi Dios','Rut 1:16'],['Habla, porque tu siervo oye','1 Samuel 3:10'],['de Jehová es la batalla','1 Samuel 17:47'],['En todo tiempo ama el amigo','Proverbios 17:17'],['Da, pues, a tu siervo corazón entendido para juzgar a tu pueblo','1 Reyes 3:9'],['Y la harina de la tinaja no escaseó, ni el aceite de la vasija menguó','1 Reyes 17:16'],['¿Y quién sabe si para esta hora has llegado al reino?','Ester 4:14'],['había confiado en su Dios','Daniel 6:23'],['Mas yo con voz de alabanza te ofreceré sacrificios','Jonás 2:9'],['que os ha nacido hoy, en la ciudad de David, un Salvador, que es CRISTO el Señor','Lucas 2:11'],['Y cesó el viento, y se hizo grande bonanza','Marcos 4:39'],['Y tomó Jesús aquellos panes, y habiendo dado gracias, los repartió entre los discípulos','Juan 6:11'],['Ve, y haz tú lo mismo','Lucas 10:37'],['Gozaos conmigo, porque he encontrado mi oveja que se había perdido','Lucas 15:6'],['Porque el Hijo del Hombre vino a buscar y a salvar lo que se había perdido','Lucas 19:10'],['No está aquí, sino que ha resucitado','Lucas 24:6']
];

const readingReferences={0:'Génesis 1:1–2:3; 2:15',3:'Génesis 37; 39–45; 50:15–21',6:'Éxodo 20:1–17; Mateo 22:37–40',7:'Josué 1:9; 6',8:'Rut 1–4; Mateo 1:5–6',14:'Ester 4–9',17:'Lucas 1–2; Mateo 1:18–25'};
const memoryPassages=['GEN.1.31','GEN.7.5','GEN.15.6','GEN.50.20','EXO.3.12','EXO.14.14','EXO.20.2','JOS.1.9','RUT.1.16','1SA.3.10','1SA.17.47','PRO.17.17','1KI.3.9','1KI.17.16','EST.4.14','DAN.6.23','JON.2.9','LUK.2.11','MRK.4.39','JHN.6.11','LUK.10.37','LUK.15.6','LUK.19.10','LUK.24.6'];
export const BIBLE_VERSION='Reina-Valera 1960 (RVR1960)';
export const LESSONS=PRINTABLES.slice(0,24).map((base,i)=>({
 ...base,reference:readingReferences[i]||base.reference,bibleVersion:BIBLE_VERSION,slug:slugs[i],icon:icons[i],coverImage:coverImages[slugs[i]]||null,age:'3 a 10 años',duration:'60 minutos',story:stories[i],
 takeaways:[`🌱 ${base.objective}.`,`❤️ Dios está presente y podemos confiar en Él.`,`👣 Esta historia nos invita a practicar: ${base.application.toLowerCase()}`],
 questions:[...base.questions,`¿Qué parte de la historia te sorprendió más?`,`¿Cómo se relaciona esta historia con ${base.objective.toLowerCase()}?`,`¿Qué acción pequeña puedes realizar esta semana?`],
 quiz:[{question:quizzes[i][0],...rot(quizzes[i].slice(1),i%3)},{question:'¿Cuál es la enseñanza principal?',...rot([base.objective,...wrongTeachings[i]],(i+1)%3)},{question:'¿Qué podemos practicar esta semana?',...rot([base.application,...wrongApplications[i]],(i+2)%3)}],
 activity:{title:activities[i][0],steps:activities[i][1].split('|')},
 memory:{text:memories[i][0],reference:memories[i][1],excerpt:![1,2,5,22].includes(i),sourceUrl:`https://www.bible.com/es/bible/149/${memoryPassages[i]}.RVR1960`},videoQuery:videos[i],videoId:videoIds[i],videoUrl:`https://www.youtube.com/watch?v=${videoIds[i]}`,printable:`/printables.html?leccion=${base.id}`,
 prayer:`Señor, gracias por enseñarnos por medio de ${base.title}. Ayúdanos a recordar que ${base.objective.toLowerCase()}. Danos amor y valor para vivirlo esta semana. En el nombre de Jesús, amén.`
})).concat([...ADDITIONAL_LESSONS,...SECOND_BLOCK,...THIRD_BLOCK].map((extra,i)=>({
 ...PRINTABLES[24+i], ...extra, bibleVersion:BIBLE_VERSION,
 coverImage:`/images/lessons/${extra.slug}.webp`,age:'3 a 10 años',duration:'45 a 60 minutos',
 videoUrl:extra.videoId?`https://www.youtube.com/watch?v=${extra.videoId}`:`https://www.youtube.com/results?search_query=${encodeURIComponent(extra.videoQuery)}`,
 printable:`/printables.html?leccion=${PRINTABLES[24+i].id}`
})));

export const lessonBySlug=slug=>LESSONS.find(lesson=>lesson.slug===slug);
