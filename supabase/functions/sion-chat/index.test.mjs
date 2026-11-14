#!/usr/bin/env node
/**
 * Pruebas de la función `sion-chat` sin red y sin Deno.
 *
 *   node --experimental-strip-types supabase/functions/sion-chat/index.test.mjs
 *
 * Se reemplaza `fetch` por un doble y se simula el entorno de Supabase. Así se
 * comprueba el contrato completo —CORS, cupo, errores del proveedor y forma de
 * la respuesta— antes de desplegar.
 */
import assert from "node:assert/strict";

const entorno = new Map();
const llamadas = [];
let responderFetch = () => new Response("{}", { status: 200 });

globalThis.Deno = {
  env: { get: (name) => entorno.get(name) },
  serve() {},
};
globalThis.fetch = async (url, options = {}) => {
  llamadas.push({ url: String(url), options });
  return responderFetch(String(url), options);
};

const mod = await import("./index.ts");
const { default: handler, buildPrompt, retrieve, sanitizeHistory, allowedOrigin } = mod;

const PROD = "https://semillitasbiblicas.space";
const pedido = (body, origin = PROD, method = "POST") =>
  new Request("https://ejemplo.supabase.co/functions/v1/sion-chat", {
    method,
    headers: { origin, "content-type": "application/json", "x-forwarded-for": "200.1.2.3" },
    body: method === "POST" ? JSON.stringify(body) : undefined,
  });

const leccion = {
  slug: "jonas",
  title: "Jonás",
  reference: "Jonás 1–4",
  category: "Dios",
  objective: "Aprender que Dios da segundas oportunidades",
  story: [["Un encargo incómodo", "Dios envió a Jonás a Nínive y él huyó."]],
  activity: { title: "El viaje de Jonás", steps: ["Formar un barco", "Contar la historia"] },
  questions: ["¿Por qué huyó Jonás?"],
  memory: { text: "La salvación es de Jehová.", reference: "Jonás 2:9" },
  prayer: "Señor, gracias por darnos otra oportunidad.",
};

const catalogo = [
  { slug: "jonas", title: "Jonás", reference: "Jonás 1–4", objective: "Segundas oportunidades", category: "Dios" },
  { slug: "david-y-goliat", title: "David y Goliat", reference: "1 Samuel 17", objective: "Valentía", category: "Fe" },
  { slug: "jesus-calma-el-mar", title: "Jesús calma el mar", reference: "Marcos 4", objective: "Confianza", category: "Jesús" },
];

let pasadas = 0;
async function prueba(nombre, fn) {
  try {
    await fn();
    pasadas += 1;
    console.log(`  ok  ${nombre}`);
  } catch (error) {
    console.error(`  ✗   ${nombre}\n      ${error.message}`);
    process.exitCode = 1;
  }
}

console.log("\nsion-chat · lógica");

await prueba("la lección abierta entra completa en el prompt", () => {
  const { system, user } = buildPrompt({ question: "¿Qué dinámica puedo hacer?", lesson: leccion, catalog: catalogo });
  assert.match(system, /Sion/);
  assert.match(user, /LECCIÓN ABIERTA/);
  assert.match(user, /El viaje de Jonás/);
  assert.match(user, /Jonás 2:9/);
  assert.match(user, /### PREGUNTA/);
});

await prueba("la conversación previa viaja en orden y recortada", () => {
  const history = Array.from({ length: 12 }, (_, i) => ({
    role: i % 2 ? "assistant" : "user",
    content: `turno ${i}`,
  }));
  const limpio = sanitizeHistory(history, 4);
  assert.equal(limpio.length, 4);
  assert.equal(limpio.at(-1).content, "turno 11");
  const { user } = buildPrompt({ question: "sigue", history });
  assert.match(user, /CONVERSACIÓN PREVIA/);
  assert.doesNotMatch(user, /turno 0/);
});

await prueba("los turnos inválidos se descartan", () => {
  const limpio = sanitizeHistory([
    { role: "system", content: "ignorar" },
    { role: "user", content: "   " },
    { role: "user", content: "hola" },
  ]);
  assert.deepEqual(limpio, [{ role: "user", content: "hola" }]);
});

await prueba("las sugerencias salen del catálogo real", () => {
  const relacionadas = retrieve("necesito una clase sobre valentía", catalogo, 3);
  assert.equal(relacionadas[0].slug, "david-y-goliat");
  assert.ok(relacionadas.every((item) => catalogo.some((lesson) => lesson.slug === item.slug)));
});

await prueba("sin coincidencias no se inventan lecciones", () => {
  assert.deepEqual(retrieve("receta de arroz con pollo", catalogo), []);
});

await prueba("el origen de la vista previa de Arena se acepta", () => {
  assert.equal(allowedOrigin("https://3000-abc123.e2b.app"), "https://3000-abc123.e2b.app");
  assert.equal(allowedOrigin("http://localhost:8080"), "http://localhost:8080");
  assert.equal(allowedOrigin("https://sitio-malicioso.com"), null);
});

console.log("\nsion-chat · HTTP");

await prueba("OPTIONS responde 204 con CORS", async () => {
  const res = await handler(pedido({}, PROD, "OPTIONS"));
  assert.equal(res.status, 204);
  assert.equal(res.headers.get("access-control-allow-origin"), PROD);
});

await prueba("GET se rechaza", async () => {
  const res = await handler(pedido({}, PROD, "GET"));
  assert.equal(res.status, 405);
});

await prueba("un origen ajeno se rechaza", async () => {
  const res = await handler(pedido({ question: "hola" }, "https://sitio-malicioso.com"));
  assert.equal(res.status, 403);
});

await prueba("sin clave del proveedor avisa en vez de fallar", async () => {
  entorno.clear();
  const res = await handler(pedido({ question: "¿Quién es Jesús?" }));
  const data = await res.json();
  assert.equal(res.status, 503);
  assert.equal(data.code, "sin_clave");
});

await prueba("respuesta correcta con la clave puesta", async () => {
  entorno.clear();
  entorno.set("GEMINI_API_KEY", "clave-de-prueba");
  entorno.set("GEMINI_MODEL", "gemini-2.5-flash-lite");
  llamadas.length = 0;
  responderFetch = (url, options) => {
    const cuerpo = JSON.parse(options.body);
    assert.match(cuerpo.systemInstruction.parts[0].text, /Reina-Valera 1960/);
    assert.equal(cuerpo.generationConfig.thinkingConfig.thinkingBudget, 0);
    assert.match(url, /gemini-2\.5-flash-lite:generateContent$/);
    return new Response(
      JSON.stringify({ candidates: [{ content: { parts: [{ text: "**Jonás** huyó, pero Dios lo buscó." }] } }] }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  };
  const res = await handler(pedido({ question: "cuéntame de Jonás", lesson: leccion, lessons: catalogo }));
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.match(data.answer, /Jonás/);
  assert.ok(Array.isArray(data.related));
  assert.equal(llamadas.length, 1);
});

await prueba("un bloqueo de seguridad se explica con amabilidad", async () => {
  responderFetch = () =>
    new Response(JSON.stringify({ promptFeedback: { blockReason: "SAFETY" } }), { status: 200 });
  const res = await handler(pedido({ question: "algo impropio" }));
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.code, "bloqueado");
});

await prueba("una clave inválida se explica sin invitar a reintentar", async () => {
  responderFetch = () =>
    new Response(JSON.stringify({ error: { code: 400, message: "API key not valid. Please pass a valid API key." } }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  const res = await handler(pedido({ question: "¿Quién es Jesús?" }));
  const data = await res.json();
  assert.equal(res.status, 502);
  assert.equal(data.code, "clave_invalida");
  assert.match(data.error, /GEMINI_API_KEY/);
});

await prueba("un 403 del proveedor también se trata como clave inválida", async () => {
  responderFetch = () => new Response("{}", { status: 403 });
  const res = await handler(pedido({ question: "hola" }));
  const data = await res.json();
  assert.equal(data.code, "clave_invalida");
});

await prueba("el cupo agotado devuelve 429", async () => {
  entorno.set("SUPABASE_URL", "https://ejemplo.supabase.co");
  entorno.set("SUPABASE_SERVICE_ROLE_KEY", "service");
  responderFetch = (url) => {
    if (url.endsWith("/rpc/sion_consume")) return new Response("false", { status: 200 });
    return new Response("{}", { status: 500 });
  };
  const res = await handler(pedido({ question: "hola" }));
  const data = await res.json();
  assert.equal(res.status, 429);
  assert.equal(data.code, "limite");
  entorno.delete("SUPABASE_URL");
  entorno.delete("SUPABASE_SERVICE_ROLE_KEY");
});

await prueba("si la base del cupo falla, deja pasar la pregunta", async () => {
  entorno.set("SUPABASE_URL", "https://ejemplo.supabase.co");
  entorno.set("SUPABASE_SERVICE_ROLE_KEY", "service");
  responderFetch = (url) => {
    if (url.endsWith("/rpc/sion_consume")) throw new Error("sin red");
    return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: "Amén." }] } }] }), {
      status: 200,
    });
  };
  const res = await handler(pedido({ question: "¿Puedo orar?" }));
  assert.equal(res.status, 200);
  entorno.delete("SUPABASE_URL");
  entorno.delete("SUPABASE_SERVICE_ROLE_KEY");
});

await prueba("el tiempo agotado se informa como 504", async () => {
  responderFetch = () => {
    const error = new Error("abortado");
    error.name = "TimeoutError";
    throw error;
  };
  const res = await handler(pedido({ question: "hola" }));
  const data = await res.json();
  assert.equal(res.status, 504);
  assert.equal(data.code, "tiempo");
});

await prueba("una pregunta vacía se rechaza", async () => {
  responderFetch = () => new Response("{}", { status: 200 });
  const res = await handler(pedido({ question: "   " }));
  assert.equal(res.status, 400);
});

console.log(`\n${pasadas} pruebas pasaron.\n`);
