#!/usr/bin/env node
/**
 * Pruebas de «Sion inteligente» (sion-ai.js) en un DOM simulado.
 *
 *   npm install jsdom                 (solo la primera vez)
 *   node tools/probar-sion.mjs
 *
 * jsdom no ejecuta los módulos del sitio, así que se levanta el panel de Sion a
 * mano, se evalúa sion-ai.js sobre ese documento y se sustituye fetch por un
 * doble. Se comprueba el contrato con la función de Supabase: qué se envía, qué
 * se dibuja y qué pasa cuando algo falla.
 */
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CODIGO = readFileSync(resolve(RAIZ, 'sion-ai.js'), 'utf8');

const PLANTILLA = `<!doctype html><html lang="es"><body data-lesson="jonas">
  <button class="jerubi-launch" id="jerubiLaunch" aria-controls="jerubiPanel" aria-expanded="false">📖</button>
  <aside class="jerubi-panel is-open" id="jerubiPanel">
    <div class="jerubi-messages" id="jerubiMessages" aria-live="polite"><div class="jerubi-bubble">Hola</div></div>
    <div class="jerubi-quick">
      <button type="button" data-j-action="simple">Explícalo a un niño de 4</button>
      <button type="button" data-j-action="dinamica">Dinámica</button>
    </div>
    <form class="jerubi-form" id="jerubiForm">
      <input id="jerubiInput" aria-label="Habla con Sion" autocomplete="off">
      <button type="submit">Enviar</button>
    </form>
  </aside>
</body></html>`;

const errores = [];
let pasadas = 0;

function montar({ respuesta } = {}) {
  const dom = new JSDOM(PLANTILLA, {
    url: 'https://semillitasbiblicas.space/lecciones/jonas/',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });
  const { window } = dom;
  const llamadas = [];
  window.fetch = async (url, opciones = {}) => {
    llamadas.push({ url: String(url), cuerpo: opciones.body ? JSON.parse(opciones.body) : null });
    const datos = respuesta ?? {
      answer: '**Jonás** huyó de su misión.\n- Dios lo buscó\n- Le dio otra oportunidad',
      related: [{ slug: 'jonas', title: 'Jonás', reference: 'Jonás 1–4' }],
    };
    const estado = datos.__estado ?? 200;
    return { ok: estado < 400, status: estado, json: async () => datos };
  };
  window.eval(CODIGO);
  return { window, document: window.document, llamadas };
}

const esperar = (ms = 40) => new Promise((listo) => setTimeout(listo, ms));

async function prueba(nombre, fn) {
  try {
    await fn();
    pasadas += 1;
    console.log(`  ok  ${nombre}`);
  } catch (error) {
    errores.push(nombre);
    console.error(`  ✗   ${nombre}\n      ${error.message}`);
  }
}

function afirmar(condicion, mensaje) {
  if (!condicion) throw new Error(mensaje);
}

function enviar(window, texto) {
  const input = window.document.getElementById('jerubiInput');
  input.value = texto;
  window.document.getElementById('jerubiForm').dispatchEvent(
    new window.Event('submit', { bubbles: true, cancelable: true })
  );
}

console.log('\nSion inteligente · comportamiento');

await prueba('el interruptor aparece apagado y con etiqueta accesible', () => {
  const { document } = montar();
  const boton = document.querySelector('.sion-ai-toggle');
  afirmar(Boolean(boton), 'no se creó el botón .sion-ai-toggle');
  afirmar(boton.getAttribute('aria-pressed') === 'false', 'debería empezar apagado');
  afirmar(/Sion inteligente/.test(boton.textContent), 'texto del botón poco claro');
});

await prueba('al encenderlo avisa y ofrece ejemplos, y lo recuerda', () => {
  const { document, window } = montar();
  document.querySelector('.sion-ai-toggle').click();
  const texto = document.getElementById('jerubiMessages').textContent;
  afirmar(/listo/i.test(texto), 'no saludó al activarse');
  afirmar(document.querySelectorAll('[data-sion-ask]').length >= 3, 'faltan preguntas de ejemplo');
  afirmar(window.localStorage.getItem('semillitas.sion.ia') === '1', 'no guardó la preferencia');
});

await prueba('apagado, el envío sigue siendo local', async () => {
  const { window, llamadas } = montar();
  enviar(window, 'hola');
  await esperar();
  afirmar(llamadas.length === 0, 'llamó a la IA estando apagada');
});

await prueba('encendido, la pregunta viaja a Supabase', async () => {
  const { window, document, llamadas } = montar();
  document.querySelector('.sion-ai-toggle').click();
  enviar(window, 'cuéntame de Jonás');
  await esperar();
  afirmar(llamadas.length === 1, `esperaba 1 llamada y hubo ${llamadas.length}`);
  afirmar(llamadas[0].url.endsWith('/functions/v1/sion-chat'), 'endpoint equivocado');
  afirmar(llamadas[0].cuerpo.question === 'cuéntame de Jonás', 'la pregunta no viajó');
  afirmar(Array.isArray(llamadas[0].cuerpo.lessons), 'falta el catálogo de lecciones');
  afirmar(Array.isArray(llamadas[0].cuerpo.history), 'falta el historial');
});

await prueba('la respuesta se dibuja con formato y enlaces verificados', async () => {
  const { window, document } = montar();
  document.querySelector('.sion-ai-toggle').click();
  enviar(window, 'cuéntame de Jonás');
  await esperar();
  const ultima = [...document.querySelectorAll('.jerubi-bubble')].at(-1);
  afirmar(ultima.querySelector('strong'), 'no convirtió la negrita');
  afirmar(ultima.querySelectorAll('ul li').length === 2, 'no armó la lista');
  afirmar(ultima.querySelector('[data-sion-ir="jonas"]'), 'no dibujó la lección sugerida');
});

await prueba('el segundo mensaje lleva memoria de la conversación', async () => {
  const { window, document, llamadas } = montar();
  document.querySelector('.sion-ai-toggle').click();
  enviar(window, 'primera pregunta');
  await esperar();
  enviar(window, 'segunda pregunta');
  await esperar();
  afirmar(llamadas.length === 2, 'no hubo dos llamadas');
  const historial = llamadas[1].cuerpo.history;
  afirmar(historial.length >= 2, `historial vacío: ${JSON.stringify(historial)}`);
  afirmar(historial[0].role === 'user' && historial[0].content === 'primera pregunta', 'no recordó la pregunta');
  afirmar(historial.some((turno) => turno.role === 'assistant'), 'no recordó la respuesta');
});

await prueba('los botones rápidos conversan cuando la IA está encendida', async () => {
  const { window, document, llamadas } = montar();
  document.querySelector('.sion-ai-toggle').click();
  let respondioLocal = false;
  document.querySelector('.jerubi-quick').addEventListener('click', () => {
    respondioLocal = true;
  });
  document.querySelector('[data-j-action="dinamica"]').click();
  await esperar();
  afirmar(llamadas.length === 1, 'el botón rápido no consultó a la IA');
  afirmar(/dinámica/i.test(llamadas[0].cuerpo.question), 'no tradujo el botón a una pregunta');
  afirmar(!respondioLocal, 'el chat local respondió además de la IA');
});

await prueba('sin clave configurada lo explica en vez de romperse', async () => {
  const { window, document } = montar({
    respuesta: { error: 'Sion inteligente todavía no está activo.', code: 'sin_clave', __estado: 503 },
  });
  document.querySelector('.sion-ai-toggle').click();
  enviar(window, 'hola');
  await esperar();
  const ultima = [...document.querySelectorAll('.jerubi-bubble')].at(-1);
  afirmar(/no está activo/i.test(ultima.textContent), 'no explicó que falta configurarlo');
  afirmar(ultima.querySelector('[data-sion-reintentar]'), 'no ofreció reintentar');
});

await prueba('el límite de uso se muestra tal cual, sin reintento inútil', async () => {
  const { window, document } = montar({
    respuesta: { error: 'Vas muy rápido. Espera unos minutos.', code: 'limite', __estado: 429 },
  });
  document.querySelector('.sion-ai-toggle').click();
  enviar(window, 'hola');
  await esperar();
  const ultima = [...document.querySelectorAll('.jerubi-bubble')].at(-1);
  afirmar(/Vas muy rápido/.test(ultima.textContent), 'no mostró el mensaje del límite');
  afirmar(!ultima.querySelector('[data-sion-reintentar]'), 'no debería invitar a reintentar de inmediato');
});

await prueba('reintentar vuelve a preguntar lo mismo', async () => {
  const { window, document, llamadas } = montar({
    respuesta: { error: 'No pude responder.', code: 'proveedor', __estado: 502 },
  });
  document.querySelector('.sion-ai-toggle').click();
  enviar(window, 'pregunta difícil');
  await esperar();
  document.querySelector('[data-sion-reintentar]').click();
  await esperar();
  afirmar(llamadas.length === 2, 'no reenvió');
  afirmar(llamadas[1].cuerpo.question === 'pregunta difícil', 'reenvió otra cosa');
});

await prueba('sin conexión avisa antes de gastar una llamada', async () => {
  const { window, document, llamadas } = montar();
  Object.defineProperty(window.navigator, 'onLine', { get: () => false, configurable: true });
  document.querySelector('.sion-ai-toggle').click();
  enviar(window, 'hola');
  await esperar();
  afirmar(llamadas.length === 0, 'llamó a la red sin conexión');
  const texto = document.getElementById('jerubiMessages').textContent;
  afirmar(/conexión/i.test(texto), 'no avisó de la falta de conexión');
});

if (errores.length) {
  console.error(`\n❌ ${errores.length} prueba(s) fallaron.\n`);
  process.exitCode = 1;
} else {
  console.log(`\n✅ ${pasadas} pruebas de Sion inteligente pasaron.\n`);
}
