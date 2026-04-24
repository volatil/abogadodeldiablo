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

const severidades = {
  critica: {
    label: "Critica",
    badge: "bg-[#dc2626] text-white",
    border: "border-[#f3b4b4]",
    icon: "!",
    iconBg: "bg-[#dc2626]",
  },
  alta: {
    label: "Alta",
    badge: "bg-[#f97316] text-white",
    border: "border-[#fed7aa]",
    icon: "!",
    iconBg: "bg-[#f97316]",
  },
  media: {
    label: "Media",
    badge: "bg-[#facc15] text-[#4a3410]",
    border: "border-[#fde68a]",
    icon: "?",
    iconBg: "bg-[#facc15] text-[#4a3410]",
  },
  baja: {
    label: "Baja",
    badge: "bg-[#15803d] text-white",
    border: "border-[#bbf7d0]",
    icon: "i",
    iconBg: "bg-[#15803d]",
  },
};

const categorias = {
  comercial: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
  tecnica: "bg-[#eef2ff] text-[#4338ca] border-[#c7d2fe]",
  financiera: "bg-[#fff7ed] text-[#c2410c] border-[#fed7aa]",
  operativa: "bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]",
  legal: "bg-[#fdf2f8] text-[#be185d] border-[#fbcfe8]",
  producto: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]",
  marketing: "bg-[#f5f3ff] text-[#6d28d9] border-[#ddd6fe]",
};

const scoreMeta = {
  viabilidad: {
    label: "Viabilidad",
    color: "#168447",
    icon: "V",
  },
  riesgo_comercial: {
    label: "Riesgo comercial",
    color: "#dc2626",
    icon: "R",
  },
  riesgo_tecnico: {
    label: "Riesgo tecnico",
    color: "#0284c7",
    icon: "T",
  },
  diferenciacion: {
    label: "Diferenciacion",
    color: "#7c3aed",
    icon: "D",
  },
};

function normalizarClave(valor) {
  return String(valor ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function textoItem(item) {
  if (typeof item === "string") {
    return item;
  }

  if (!item || typeof item !== "object") {
    return "";
  }

  return item.texto || item.descripcion || item.titulo || JSON.stringify(item);
}

function numeroScore(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.min(10, Math.max(0, Math.round(number)));
}

function BadgeSeveridad({ value }) {
  const key = normalizarClave(value);
  const meta = severidades[key] || severidades.media;

  return (
    <span className={`rounded-md px-3 py-2 text-xs font-black uppercase ${meta.badge}`}>
      {meta.label}
    </span>
  );
}

function BadgeCategoria({ value }) {
  if (!value) {
    return null;
  }

  const key = normalizarClave(value);
  const classes = categorias[key] || "bg-[#f8fafc] text-[#334155] border-[#cbd5e1]";

  return (
    <span
      className={`rounded-md border px-3 py-2 text-xs font-bold uppercase ${classes}`}
    >
      {String(value).replaceAll("_", " ")}
    </span>
  );
}

function CardSeccion({ accent, children, className = "", icon, number, title }) {
  return (
    <section
      className={`rounded-lg border bg-[#fffdf8] p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)] ${className}`}
      style={{ borderColor: accent }}
    >
      <div className="mb-3 flex items-center gap-3">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-lg font-black text-white"
          style={{ backgroundColor: accent }}
        >
          {icon}
        </span>
        <h3 className="text-lg font-black uppercase leading-none" style={{ color: accent }}>
          {number}. {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

function ListaNumerada({ items, color }) {
  const lista = Array.isArray(items) ? items.map(textoItem).filter(Boolean) : [];

  if (lista.length === 0) {
    return (
      <p className="text-sm leading-6 text-[#6b6258]">
        Gemini no entrego elementos para esta seccion.
      </p>
    );
  }

  return (
    <ol className="space-y-2">
      {lista.map((item, index) => (
        <li
          className="grid grid-cols-[1.75rem_1fr] gap-3 border-b border-[#eadfce] pb-2 text-sm leading-5 last:border-b-0 last:pb-0"
          key={`${item}-${index}`}
        >
          <span
            className="flex size-6 items-center justify-center rounded-full text-xs font-black text-white"
            style={{ backgroundColor: color }}
          >
            {index + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

function ScoreRing({ name, value }) {
  const score = numeroScore(value);
  const meta = scoreMeta[name] || {
    label: name.replaceAll("_", " "),
    color: "#334155",
    icon: "S",
  };
  const degrees = score * 36;

  return (
    <div className="grid grid-cols-[2rem_1fr_3.75rem] items-center gap-3 border-b border-[#e5e7eb] py-3 last:border-b-0">
      <span
        className="flex size-8 items-center justify-center rounded-full text-xs font-black text-white"
        style={{ backgroundColor: meta.color }}
      >
        {meta.icon}
      </span>
      <p className="text-xs font-black uppercase text-[#263142]">{meta.label}</p>
      <div className="flex items-center justify-end gap-2">
        <span
          className="size-10 rounded-full"
          style={{
            background: `conic-gradient(${meta.color} ${degrees}deg, #d9dee3 ${degrees}deg)`,
          }}
        />
        <strong className="min-w-8 text-right text-2xl text-[#0f2440]">{score}</strong>
        <span className="text-xs font-bold text-[#64748b]">/10</span>
      </div>
    </div>
  );
}

function HeaderReporte({ form, parsed }) {
  const titulo = form.titulo?.trim() || "Idea sin titulo";
  const descripcion =
    form.descripcion?.trim() ||
    parsed.resumen ||
    "Analisis critico generado a partir del contexto entregado.";
  const bullets = [
    form.publico_objetivo?.trim()
      ? `Publico objetivo: ${form.publico_objetivo.trim()}`
      : null,
    form.problema?.trim() ? `Problema: ${form.problema.trim()}` : null,
    form.etapa?.trim() ? `Etapa: ${form.etapa.trim()}` : null,
    form.modelo_de_negocio?.trim()
      ? `Modelo: ${form.modelo_de_negocio.trim()}`
      : null,
  ]
    .filter(Boolean)
    .slice(0, 3);

  return (
    <header className="grid gap-5 rounded-t-xl bg-[#061b36] p-5 text-white lg:grid-cols-[1fr_1.15fr] lg:p-7">
      <div className="border-b border-white/25 pb-5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-7">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#8bd450]">
          Abogado del Diablo
        </p>
        <h2 className="mt-2 break-words text-4xl font-black uppercase italic leading-none sm:text-5xl">
          {titulo}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#d7e2ee]">
          {descripcion}
        </p>
      </div>
      <div className="grid content-center gap-3">
        {(bullets.length > 0
          ? bullets
          : [
              "Riesgos priorizados por severidad.",
              "Preguntas incomodas para validar supuestos.",
              "Experimentos accionables con metrica de exito.",
            ]
        ).map((bullet, index) => (
          <div className="grid grid-cols-[2rem_1fr] items-start gap-3" key={bullet}>
            <span className="flex size-8 items-center justify-center rounded-full border border-white/35 text-sm font-black">
              {index + 1}
            </span>
            <p className="text-sm font-bold leading-5 text-[#f8fafc]">{bullet}</p>
          </div>
        ))}
      </div>
    </header>
  );
}

function Veredicto({ parsed }) {
  const riesgos = Array.isArray(parsed.riesgos) ? parsed.riesgos : [];
  const severidadMaxima = riesgos.some(
    (riesgo) => normalizarClave(riesgo.severidad) === "critica"
  )
    ? "critica"
    : riesgos.some((riesgo) => normalizarClave(riesgo.severidad) === "alta")
      ? "alta"
      : "media";
  const meta = severidades[severidadMaxima];

  return (
    <section className="overflow-hidden rounded-lg border border-[#cfd8dc] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
      <div
        className="flex items-center justify-between px-4 py-3 text-white"
        style={{
          backgroundColor: severidadMaxima === "critica" ? "#15803d" : "#166534",
        }}
      >
        <h3 className="text-xl font-black uppercase">Veredicto</h3>
        <span className="text-2xl">T</span>
      </div>
      <div className="p-4">
        <p className="text-sm leading-6 text-[#1f2937]">
          {parsed.veredicto || "Gemini no entrego un veredicto explicito."}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#e5e7eb] pt-3">
          <div>
            <p className="text-[0.65rem] font-black uppercase text-[#64748b]">
              Severidad
            </p>
            <div className="mt-2">
              <BadgeSeveridad value={meta.label} />
            </div>
          </div>
          <div>
            <p className="text-[0.65rem] font-black uppercase text-[#64748b]">
              Categoria
            </p>
            <div className="mt-2">
              <BadgeCategoria value={riesgos[0]?.categoria || "producto"} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Resultado({ respuesta, form }) {
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

  const riesgos = Array.isArray(parsed.riesgos) ? parsed.riesgos : [];
  const preguntas = Array.isArray(parsed.preguntas_incomodas)
    ? parsed.preguntas_incomodas
    : [];
  const experimentos = Array.isArray(parsed.experimentos_validacion)
    ? parsed.experimentos_validacion
    : [];
  const scores = parsed.scores && typeof parsed.scores === "object" ? parsed.scores : {};

  return (
    <article className="overflow-hidden rounded-xl border border-[#cfd8dc] bg-[#f8faf7] shadow-[0_22px_70px_rgba(15,23,42,0.14)]">
      <HeaderReporte form={form} parsed={parsed} />

      <div className="grid gap-3 p-3 lg:grid-cols-[1fr_1.45fr_0.8fr] lg:p-4">
        <div className="grid gap-3">
          <CardSeccion accent="#13833d" icon="R" number="1" title="Resumen">
            <p className="text-sm leading-6 text-[#263142]">
              {parsed.resumen || "Gemini no entrego resumen para esta idea."}
            </p>
          </CardSeccion>

          <CardSeccion accent="#1e5c9a" icon="D" number="2" title="Diagnostico">
            <p className="text-sm leading-6 text-[#263142]">
              {parsed.diagnostico ||
                "Gemini no entrego diagnostico para esta idea."}
            </p>
          </CardSeccion>

          <CardSeccion
            accent="#f97316"
            className="bg-[#fffaf2]"
            icon="!"
            number="4"
            title="Supuestos debiles"
          >
            <ListaNumerada color="#f97316" items={parsed.supuestos_debiles} />
          </CardSeccion>
        </div>

        <div className="grid gap-3">
          <CardSeccion accent="#c91919" icon="X" number="3" title="Riesgos clave">
            {riesgos.length > 0 ? (
              <div className="divide-y divide-[#eadfce]">
                {riesgos.map((riesgo, index) => {
                  const key = normalizarClave(riesgo.severidad);
                  const meta = severidades[key] || severidades.media;

                  return (
                    <article
                      className="grid gap-3 py-4 first:pt-0 last:pb-0 md:grid-cols-[3.5rem_1fr_10rem_9rem]"
                      key={`${riesgo.titulo || "riesgo"}-${index}`}
                    >
                      <div className="flex items-start gap-2 md:block">
                        <span className="flex size-6 items-center justify-center rounded-full bg-[#e11d22] text-xs font-black text-white">
                          {index + 1}
                        </span>
                        <span
                          className={`mt-0 flex size-12 items-center justify-center rounded-full text-xl font-black text-white md:mt-2 ${meta.iconBg}`}
                        >
                          {meta.icon}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-black leading-5 text-[#1f2937]">
                          {riesgo.titulo || "Riesgo sin titulo"}
                        </h4>
                        {riesgo.descripcion ? (
                          <p className="mt-1 text-sm leading-5 text-[#374151]">
                            {riesgo.descripcion}
                          </p>
                        ) : null}
                        {riesgo.recomendacion ? (
                          <p className="mt-2 text-xs leading-5 text-[#4b5563]">
                            <strong className="text-[#b91c1c]">
                              Recomendacion:{" "}
                            </strong>
                            {riesgo.recomendacion}
                          </p>
                        ) : null}
                      </div>
                      <div className="self-center">
                        <BadgeSeveridad value={riesgo.severidad} />
                      </div>
                      <div className="self-center">
                        <BadgeCategoria value={riesgo.categoria} />
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm leading-6 text-[#6b6258]">
                Gemini no entrego riesgos especificos.
              </p>
            )}
          </CardSeccion>

          <CardSeccion
            accent="#5b3b9b"
            className="bg-[#fdfbff]"
            icon="?"
            number="5"
            title="Preguntas incomodas"
          >
            {preguntas.length > 0 ? (
              <div className="divide-y divide-[#e8ddf6]">
                {preguntas.map((item, index) => (
                  <article
                    className="grid gap-3 py-3 first:pt-0 last:pb-0 md:grid-cols-[2rem_1fr_12rem]"
                    key={`${item.pregunta || "pregunta"}-${index}`}
                  >
                    <span className="flex size-7 items-center justify-center rounded-full bg-[#5b3b9b] text-xs font-black text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm font-bold leading-5 text-[#1f2937]">
                      {item.pregunta || textoItem(item)}
                    </p>
                    {item.motivo ? (
                      <p className="text-xs leading-5 text-[#4b5563]">
                        <strong className="block uppercase text-[#5b3b9b]">
                          Motivo
                        </strong>
                        {item.motivo}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-[#6b6258]">
                Gemini no entrego preguntas incomodas.
              </p>
            )}
          </CardSeccion>
        </div>

        <div className="grid gap-3">
          <Veredicto parsed={parsed} />

          <section className="rounded-lg border border-[#dbe4f0] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
            <div className="mb-2 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#0f5e9c] text-lg font-black text-white">
                S
              </span>
              <h3 className="text-lg font-black uppercase text-[#0f5e9c]">
                7. Scores
              </h3>
            </div>
            {(Object.keys(scores).length > 0
              ? Object.entries(scores)
              : Object.keys(scoreMeta).map((key) => [key, 0])
            ).map(([key, value]) => (
              <ScoreRing key={key} name={key} value={value} />
            ))}
          </section>
        </div>
      </div>

      <div className="grid gap-3 px-3 pb-3 lg:grid-cols-[1fr_0.32fr] lg:px-4 lg:pb-4">
        <CardSeccion accent="#13833d" icon="E" number="6" title="Experimentos de validacion">
          {experimentos.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-[760px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-[#cfe0d4] text-[#13833d]">
                    <th className="w-10 px-3 py-2 font-black uppercase">#</th>
                    <th className="px-3 py-2 font-black uppercase">Experimento</th>
                    <th className="px-3 py-2 font-black uppercase">Descripcion</th>
                    <th className="px-3 py-2 font-black uppercase">Dificultad</th>
                    <th className="px-3 py-2 font-black uppercase">Tiempo</th>
                    <th className="px-3 py-2 font-black uppercase">Metrica de exito</th>
                  </tr>
                </thead>
                <tbody>
                  {experimentos.map((item, index) => (
                    <tr
                      className="border-b border-[#e4ece6] align-top last:border-b-0"
                      key={`${item.titulo || "experimento"}-${index}`}
                    >
                      <td className="px-3 py-3">
                        <span className="flex size-7 items-center justify-center rounded-full bg-[#13833d] text-xs font-black text-white">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-black text-[#1f2937]">
                        {item.titulo || "Experimento"}
                      </td>
                      <td className="px-3 py-3 leading-5 text-[#374151]">
                        {item.descripcion || "Sin descripcion."}
                      </td>
                      <td className="px-3 py-3">
                        <BadgeSeveridad value={item.dificultad || "media"} />
                      </td>
                      <td className="px-3 py-3 font-bold text-[#374151]">
                        {item.tiempo_estimado || "Por definir"}
                      </td>
                      <td className="px-3 py-3 leading-5 text-[#374151]">
                        {item.metrica_exito || "Sin metrica definida."}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm leading-6 text-[#6b6258]">
              Gemini no entrego experimentos de validacion.
            </p>
          )}
        </CardSeccion>

        <footer className="flex items-center rounded-lg bg-[#061b36] p-4 text-sm font-bold leading-6 text-white">
          {parsed.veredicto ||
            "El analisis necesita un veredicto mas concreto para cerrar la evaluacion."}
        </footer>
      </div>
    </article>
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

      let data;

      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok || data.error) {
        const mensajeBase = data.error || "No fue posible analizar la idea.";
        const mensaje =
          res.status === 429
            ? `${mensajeBase} Puedes esperar unos minutos o revisar la cuota del proyecto en Google AI Studio.`
            : mensajeBase;

        throw new Error(mensaje);
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

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-5 lg:py-10">
        <form
          className="rounded-lg border border-[#ded6ca] bg-[#fffdf8] p-5 shadow-[0_18px_60px_rgba(52,43,34,0.10)]"
          onSubmit={analizarIdea}
        >
          <div className="grid gap-5 border-b border-[#e8e0d5] pb-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase text-[#8b3f2f]">
                Wen Abogao
              </p>
              <h1 className="mt-2 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
                Pon a prueba tu idea antes de enamorarte de ella.
              </h1>
            </div>
            <p className="max-w-3xl leading-7 text-[#5f5851] lg:justify-self-end">
              Completa el contexto y recibe una revision critica con riesgos,
              supuestos flojos, preguntas dificiles y experimentos para validar.
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
            className="mt-6 w-full rounded-md bg-[#201d19] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3a342e] disabled:cursor-not-allowed disabled:bg-[#8d857d] sm:w-auto sm:min-w-52"
            disabled={cargando}
            type="submit"
          >
            {cargando ? "Pensando..." : "Analizar idea"}
          </button>
        </form>

        <section aria-label="Resultado critico">
          <Resultado form={form} respuesta={respuesta} />
        </section>
      </section>
    </main>
  );
}
