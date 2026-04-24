"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const campos = [
  {
    id: "titulo",
    label: "Titulo",
    placeholder: "Nombre breve de la idea",
    rows: 1,
  },
  {
    id: "descripcion",
    label: "Descripcion",
    placeholder: "Que es y que intenta lograr",
    rows: 3,
  },
  {
    id: "publico_objetivo",
    label: "Publico objetivo",
    placeholder: "Quien lo usaria o pagaria",
    rows: 2,
  },
  {
    id: "problema",
    label: "Problema",
    placeholder: "Dolor concreto que quieres resolver",
    rows: 2,
  },
  {
    id: "solucion",
    label: "Solucion",
    placeholder: "Como lo resuelve tu propuesta",
    rows: 2,
  },
  {
    id: "modelo_de_negocio",
    label: "Modelo de negocio",
    placeholder: "Como capturaria valor",
    rows: 2,
  },
  {
    id: "competencia_conocida",
    label: "Competencia conocida",
    placeholder: "Alternativas, competidores o sustitutos",
    rows: 2,
  },
  {
    id: "etapa",
    label: "Etapa",
    placeholder: "Idea, prototipo, MVP, ventas, crecimiento",
    rows: 1,
  },
];

const estadoInicial = campos.reduce((acc, campo) => {
  acc[campo.id] = "";
  return acc;
}, {});

function parsearRespuesta(respuesta) {
  if (!respuesta) {
    return null;
  }

  try {
    return JSON.parse(respuesta);
  } catch {
    return null;
  }
}

function ListaTexto({ items }) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li className="rounded-md bg-[#f7f4ee] px-4 py-3 text-sm" key={index}>
          {typeof item === "string" ? item : JSON.stringify(item)}
        </li>
      ))}
    </ul>
  );
}

function Resultado({ respuesta }) {
  const parsed = useMemo(() => parsearRespuesta(respuesta), [respuesta]);

  if (!respuesta) {
    return (
      <div className="rounded-md border border-dashed border-[#c9beb0] p-5 text-sm leading-6 text-[#686058]">
        Completa la idea y ejecuta el analisis. La respuesta aparecera aqui
        con riesgos, preguntas incomodas y experimentos de validacion.
      </div>
    );
  }

  if (!parsed) {
    return (
      <pre className="max-h-[720px] overflow-auto whitespace-pre-wrap rounded-md bg-[#201d19] p-5 text-sm leading-6 text-[#fff7ec]">
        {respuesta}
      </pre>
    );
  }

  return (
    <div className="space-y-5">
      {parsed.resumen ? (
        <section>
          <h3 className="text-sm font-semibold uppercase text-[#8b3f2f]">
            Resumen
          </h3>
          <p className="mt-2 leading-7 text-[#4f4943]">{parsed.resumen}</p>
        </section>
      ) : null}

      {parsed.diagnostico ? (
        <section>
          <h3 className="text-sm font-semibold uppercase text-[#8b3f2f]">
            Diagnostico
          </h3>
          <p className="mt-2 leading-7 text-[#4f4943]">
            {parsed.diagnostico}
          </p>
        </section>
      ) : null}

      <section>
        <h3 className="text-sm font-semibold uppercase text-[#8b3f2f]">
          Supuestos debiles
        </h3>
        <div className="mt-3">
          <ListaTexto items={parsed.supuestos_debiles} />
        </div>
      </section>

      {Array.isArray(parsed.riesgos) && parsed.riesgos.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold uppercase text-[#8b3f2f]">
            Riesgos
          </h3>
          <div className="mt-3 grid gap-3">
            {parsed.riesgos.map((riesgo, index) => (
              <article
                className="rounded-md border border-[#ebe4da] bg-[#fffdf8] p-4"
                key={`${riesgo.titulo || "riesgo"}-${index}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-semibold text-[#201d19]">
                    {riesgo.titulo || "Riesgo sin titulo"}
                  </h4>
                  {riesgo.severidad ? (
                    <span className="rounded-full bg-[#f0ddd6] px-3 py-1 text-xs font-semibold text-[#8b3f2f]">
                      {riesgo.severidad}
                    </span>
                  ) : null}
                  {riesgo.categoria ? (
                    <span className="rounded-full bg-[#e5f0ea] px-3 py-1 text-xs font-semibold text-[#28614a]">
                      {riesgo.categoria}
                    </span>
                  ) : null}
                </div>
                {riesgo.descripcion ? (
                  <p className="mt-3 text-sm leading-6 text-[#4f4943]">
                    {riesgo.descripcion}
                  </p>
                ) : null}
                {riesgo.recomendacion ? (
                  <p className="mt-3 text-sm leading-6 text-[#686058]">
                    <strong className="text-[#201d19]">Recomendacion: </strong>
                    {riesgo.recomendacion}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {Array.isArray(parsed.preguntas_incomodas) &&
      parsed.preguntas_incomodas.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold uppercase text-[#8b3f2f]">
            Preguntas incomodas
          </h3>
          <div className="mt-3 grid gap-3">
            {parsed.preguntas_incomodas.map((item, index) => (
              <article className="rounded-md bg-[#f7f4ee] p-4" key={index}>
                <p className="font-semibold text-[#201d19]">{item.pregunta}</p>
                {item.motivo ? (
                  <p className="mt-2 text-sm leading-6 text-[#686058]">
                    {item.motivo}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {Array.isArray(parsed.experimentos_validacion) &&
      parsed.experimentos_validacion.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold uppercase text-[#8b3f2f]">
            Experimentos de validacion
          </h3>
          <div className="mt-3 grid gap-3">
            {parsed.experimentos_validacion.map((item, index) => (
              <article
                className="rounded-md border border-[#ebe4da] bg-[#fbfaf6] p-4"
                key={`${item.titulo || "experimento"}-${index}`}
              >
                <h4 className="font-semibold text-[#201d19]">
                  {item.titulo || "Experimento"}
                </h4>
                {item.descripcion ? (
                  <p className="mt-2 text-sm leading-6 text-[#4f4943]">
                    {item.descripcion}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                  {item.dificultad ? (
                    <span className="rounded-full bg-[#f0ddd6] px-3 py-1 text-[#8b3f2f]">
                      {item.dificultad}
                    </span>
                  ) : null}
                  {item.tiempo_estimado ? (
                    <span className="rounded-full bg-[#e7e1d8] px-3 py-1 text-[#4f4943]">
                      {item.tiempo_estimado}
                    </span>
                  ) : null}
                </div>
                {item.metrica_exito ? (
                  <p className="mt-3 text-sm leading-6 text-[#686058]">
                    <strong className="text-[#201d19]">Metrica: </strong>
                    {item.metrica_exito}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {parsed.scores ? (
        <section>
          <h3 className="text-sm font-semibold uppercase text-[#8b3f2f]">
            Scores
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-4">
            {Object.entries(parsed.scores).map(([key, value]) => (
              <div className="rounded-md bg-[#201d19] p-4 text-white" key={key}>
                <p className="text-xs uppercase text-[#d9d2c8]">
                  {key.replaceAll("_", " ")}
                </p>
                <strong className="mt-2 block text-3xl">{value}</strong>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {parsed.veredicto ? (
        <section className="rounded-md bg-[#8b3f2f] p-5 text-white">
          <h3 className="text-sm font-semibold uppercase text-[#f2d2c3]">
            Veredicto
          </h3>
          <p className="mt-2 leading-7">{parsed.veredicto}</p>
        </section>
      ) : null}
    </div>
  );
}

export default function Home() {
  const [form, setForm] = useState(estadoInicial);
  const [respuesta, setRespuesta] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  function actualizarCampo(event) {
    const { name, value } = event.target;
    setForm((actual) => ({
      ...actual,
      [name]: value,
    }));
  }

  async function analizarIdea(event) {
    event.preventDefault();
    setCargando(true);
    setError("");
    setRespuesta("");

    try {
      const res = await fetch("/api/abogapi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "No fue posible analizar la idea.");
      }

      setRespuesta(data.respuesta || "Sin respuesta.");
    } catch (err) {
      setError(err.message || "Ocurrio un error inesperado.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#201d19]">
      <header className="border-b border-[#ded6ca] bg-[#fbfaf6]/90">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link className="text-base font-semibold tracking-wide" href="/">
            Abogado del Diablo
          </Link>
          <span className="rounded-full bg-[#e5f0ea] px-3 py-1 text-xs font-semibold text-[#28614a]">
            Analisis IA
          </span>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-12">
        <form
          className="rounded-lg border border-[#ded6ca] bg-[#fffdf8] p-5 shadow-[0_18px_60px_rgba(52,43,34,0.10)]"
          onSubmit={analizarIdea}
        >
          <div className="border-b border-[#e8e0d5] pb-5">
            <p className="text-sm font-semibold uppercase text-[#8b3f2f]">
              Wen Abogao
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
              Pon a prueba tu idea antes de enamorarte de ella.
            </h1>
            <p className="mt-3 leading-7 text-[#5f5851]">
              Completa el contexto y recibe una revision critica: riesgos,
              supuestos flojos, preguntas dificiles y experimentos para validar.
            </p>
          </div>

          <div className="mt-5 grid gap-4">
            {campos.map((campo) => (
              <label className="block" key={campo.id}>
                <span className="text-sm font-semibold text-[#2e2924]">
                  {campo.label}
                </span>
                {campo.rows === 1 ? (
                  <input
                    className="mt-2 w-full rounded-md border border-[#c9beb0] bg-white px-3 py-3 text-sm outline-none transition focus:border-[#8b3f2f] focus:ring-2 focus:ring-[#f0ddd6]"
                    name={campo.id}
                    onChange={actualizarCampo}
                    placeholder={campo.placeholder}
                    type="text"
                    value={form[campo.id]}
                  />
                ) : (
                  <textarea
                    className="mt-2 min-h-24 w-full resize-y rounded-md border border-[#c9beb0] bg-white px-3 py-3 text-sm outline-none transition focus:border-[#8b3f2f] focus:ring-2 focus:ring-[#f0ddd6]"
                    name={campo.id}
                    onChange={actualizarCampo}
                    placeholder={campo.placeholder}
                    rows={campo.rows}
                    value={form[campo.id]}
                  />
                )}
              </label>
            ))}
          </div>

          {error ? (
            <div className="mt-5 rounded-md border border-[#d7a08e] bg-[#fff3ef] px-4 py-3 text-sm leading-6 text-[#8b3f2f]">
              {error}
            </div>
          ) : null}

          <button
            className="mt-6 w-full rounded-md bg-[#201d19] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3a342e] disabled:cursor-not-allowed disabled:bg-[#8d857d]"
            disabled={cargando}
            type="submit"
          >
            {cargando ? "Pensando..." : "Analizar idea"}
          </button>
        </form>

        <aside className="rounded-lg border border-[#ded6ca] bg-[#fbfaf6] p-5">
          <div className="border-b border-[#e8e0d5] pb-4">
            <p className="text-sm font-semibold text-[#8b3f2f]">
              Resultado critico
            </p>
            <h2 className="mt-1 text-2xl font-semibold">
              Objeciones, riesgos y validacion
            </h2>
          </div>
          <div className="mt-5">
            <Resultado respuesta={respuesta} />
          </div>
        </aside>
      </section>
    </main>
  );
}
