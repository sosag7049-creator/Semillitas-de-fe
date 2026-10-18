"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/types";

interface Nivel {
  emoji: string;
  titulo: string;
  texto: string;
}

export function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctas, setCorrectas] = useState(0);
  const [terminado, setTerminado] = useState(false);

  if (questions.length === 0) return null;

  const actual = questions[index];

  function elegir(opcion: number) {
    if (selected !== null) return;
    setSelected(opcion);
    if (opcion === actual.answer) setCorrectas((n) => n + 1);
  }

  function continuar() {
    if (index + 1 >= questions.length) {
      setTerminado(true);
      return;
    }
    setIndex((n) => n + 1);
    setSelected(null);
  }

  function reiniciar() {
    setIndex(0);
    setSelected(null);
    setCorrectas(0);
    setTerminado(false);
  }

  if (terminado) {
    const nivel: Nivel =
      correctas === questions.length
        ? {
            emoji: "🌻",
            titulo: "¡Excelente!",
            texto: "Esta lección ya echará raíces en tu corazón.",
          }
        : correctas >= questions.length / 2
          ? {
              emoji: "🌿",
              titulo: "¡Muy bien!",
              texto: "Ya conoces la historia; repasa lo que faltó en familia.",
            }
          : {
              emoji: "🌱",
              titulo: "¡Buen comienzo!",
              texto: "Vuelve a leer la historia juntos y vuelve a intentarlo.",
            };

    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-leaf-50 px-6 py-10 text-center">
        <span aria-hidden className="text-5xl">
          {nivel.emoji}
        </span>
        <p className="font-display text-2xl font-semibold text-leaf-700">
          {correctas} de {questions.length} correctas
        </p>
        <p className="font-display text-lg font-semibold">{nivel.titulo}</p>
        <p className="max-w-sm text-sm text-ink-500">{nivel.texto}</p>
        <button type="button" onClick={reiniciar} className="btn btn-ghost mt-2 text-sm">
          🔄 Intentar de nuevo
        </button>
      </div>
    );
  }

  const progreso = ((index + (selected !== null ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="space-y-5">
      {/* Progreso */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-ink-300">
          <span>
            Pregunta {index + 1} de {questions.length}
          </span>
          <span>✅ {correctas} correctas</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={Math.round(progreso)}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-2 overflow-hidden rounded-full bg-leaf-100"
        >
          <div
            className="h-full rounded-full bg-leaf-500 transition-all duration-300"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      <p className="font-display text-lg font-semibold text-ink-900">
        {actual.question}
      </p>

      <div role="group" aria-label="Opciones de respuesta" className="grid gap-2.5">
        {actual.options.map((opcion, i) => {
          const esCorrecta = i === actual.answer;
          const elegida = selected === i;
          let estilo =
            "border-cream-200 bg-white hover:border-leaf-400 hover:bg-leaf-50/60";
          if (selected !== null) {
            if (esCorrecta) {
              estilo = "border-leaf-500 bg-leaf-50 text-leaf-700";
            } else if (elegida) {
              estilo = "border-berry-500 bg-berry-100 text-berry-700";
            } else {
              estilo = "border-cream-200 bg-white opacity-55";
            }
          }
          return (
            <button
              key={opcion}
              type="button"
              onClick={() => elegir(i)}
              disabled={selected !== null}
              aria-pressed={elegida}
              className={`flex items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold text-ink-900 transition ${estilo}`}
            >
              <span>{opcion}</span>
              {selected !== null && esCorrecta && (
                <span aria-hidden className="text-lg">
                  ✅
                </span>
              )}
              {selected !== null && elegida && !esCorrecta && (
                <span aria-hidden className="text-lg">
                  💭
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p
            role="status"
            className={`text-sm font-bold ${
              selected === actual.answer ? "text-leaf-700" : "text-berry-600"
            }`}
          >
            {selected === actual.answer
              ? "¡Muy bien! 🎉"
              : `Casi… la respuesta era: ${actual.options[actual.answer]}`}
          </p>
          <button type="button" onClick={continuar} className="btn btn-primary text-sm">
            {index + 1 >= questions.length ? "Ver resultado" : "Siguiente →"}
          </button>
        </div>
      )}
    </div>
  );
}
