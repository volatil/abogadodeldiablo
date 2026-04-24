const asuntos = [
  {
    titulo: "Debates activos",
    valor: "12",
    detalle: "Argumentos listos para contrastar",
  },
  {
    titulo: "Tesis en revision",
    valor: "4",
    detalle: "Ideas que necesitan una segunda lectura",
  },
  {
    titulo: "Evidencia pendiente",
    valor: "7",
    detalle: "Fuentes por validar antes de publicar",
  },
];

const tareas = [
  "Ordenar argumentos a favor y en contra",
  "Separar hechos verificables de interpretaciones",
  "Preparar una respuesta breve para objeciones frecuentes",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#201d19]">
      <header className="border-b border-[#ded6ca] bg-[#fbfaf6]/90">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a className="text-base font-semibold tracking-wide" href="#">
            Abogado del Diablo
          </a>
          <div className="hidden items-center gap-6 text-sm text-[#686058] sm:flex">
            <a className="transition hover:text-[#201d19]" href="#panel">
              Panel
            </a>
            <a className="transition hover:text-[#201d19]" href="#metodo">
              Metodo
            </a>
            <a className="transition hover:text-[#201d19]" href="#agenda">
              Agenda
            </a>
          </div>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#8b3f2f]">
            Wen Abogao
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-[#201d19] sm:text-5xl">
            Un tablero para poner a prueba ideas antes de defenderlas.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5f5851]">
            Reune tesis, objeciones, evidencia y contraargumentos en un flujo
            pensado para pensar mejor, discutir con calma y llegar mas fino a
            cada decision.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              className="rounded-md bg-[#201d19] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3a342e]"
              href="#panel"
            >
              Abrir panel
            </a>
            <a
              className="rounded-md border border-[#c9beb0] px-5 py-3 text-sm font-semibold text-[#2e2924] transition hover:border-[#8b3f2f] hover:text-[#8b3f2f]"
              href="#metodo"
            >
              Ver metodo
            </a>
          </div>
        </div>

        <div
          id="panel"
          className="rounded-lg border border-[#ded6ca] bg-[#fffdf8] p-5 shadow-[0_18px_60px_rgba(52,43,34,0.10)]"
        >
          <div className="flex items-start justify-between gap-4 border-b border-[#e8e0d5] pb-4">
            <div>
              <p className="text-sm font-medium text-[#8b3f2f]">
                Sala de estrategia
              </p>
              <h2 className="mt-1 text-2xl font-semibold">
                Revision de argumentos
              </h2>
            </div>
            <span className="rounded-full bg-[#e5f0ea] px-3 py-1 text-xs font-semibold text-[#28614a]">
              Activo
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {asuntos.map((item) => (
              <article
                className="rounded-md border border-[#ebe4da] bg-[#fbfaf6] p-4"
                key={item.titulo}
              >
                <p className="text-sm text-[#686058]">{item.titulo}</p>
                <strong className="mt-3 block text-3xl font-semibold">
                  {item.valor}
                </strong>
                <p className="mt-2 text-sm leading-5 text-[#686058]">
                  {item.detalle}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-5 rounded-md bg-[#25211d] p-5 text-white">
            <p className="text-sm font-semibold text-[#e7c7b8]">
              Proxima sesion
            </p>
            <h3 className="mt-2 text-xl font-semibold">
              Defender una postura incomoda sin perder rigor.
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#d9d2c8]">
              El objetivo es encontrar la version mas fuerte del argumento
              contrario antes de responderlo.
            </p>
          </div>
        </div>
      </section>

      <section
        id="metodo"
        className="border-y border-[#ded6ca] bg-[#fffdf8] px-5 py-10"
      >
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8b3f2f]">
              Metodo
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Menos ruido, mas estructura.
            </h2>
          </div>
          <div className="grid gap-3">
            {tareas.map((tarea, index) => (
              <div
                className="flex items-start gap-4 rounded-md border border-[#ebe4da] bg-[#fbfaf6] p-4"
                key={tarea}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#8b3f2f] text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <p className="pt-1 text-[#4f4943]">{tarea}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="agenda" className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col justify-between gap-4 rounded-lg border border-[#ded6ca] bg-[#fbfaf6] p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-[#8b3f2f]">
              Agenda inicial
            </p>
            <h2 className="mt-1 text-2xl font-semibold">
              Convertir este tablero en producto.
            </h2>
          </div>
          <button className="rounded-md bg-[#8b3f2f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#743226]">
            Nueva tesis
          </button>
        </div>
      </section>
    </main>
  );
}
