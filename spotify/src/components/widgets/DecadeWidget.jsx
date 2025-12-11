"use client";

import { useState, useMemo } from "react";

const DECADE_CASEFILES = [
  {
    decade: "1920",
    title: "1920s · roaring twenties",
    note: "Jazz, brillo y primeras notas en la escena.",
  },
  {
    decade: "1930",
    title: "1930s · silver screens & swing",
    note: "La era del swing, grandes escenarios y primeras divas del sonido.",
  },
  {
    decade: "1940",
    title: "1940s · wartime chronicles",
    note: "Crooners, bandas y la música que llenaba hogares en tiempos inciertos.",
  },
  {
    decade: "1950",
    title: "1950s · vinyl beginnings",
    note: "Baladas clásicas y primeros iconos del pop.",
  },
  {
    decade: "1960",
    title: "1960s · revolution on the radio",
    note: "Bandas legendarias cambiando el sonido para siempre.",
  },
  {
    decade: "1970",
    title: "1970s · golden records",
    note: "Rock, disco y guitarras que llenan estadios.",
  },
  {
    decade: "1980",
    title: "1980s · neon synths",
    note: "Sintetizadores, himnos y videoclips icónicos.",
  },
  {
    decade: "1990",
    title: "1990s · comeback stronger than a 90s trend",
    note: "Pop, R&B y bandas sonoras de tu infancia.",
  },
  {
    decade: "2000",
    title: "2000s · burning red beginnings",
    note: "Pop-rock, country-pop y los primeros grandes hits.",
  },
  {
    decade: "2010",
    title: "2010s · starlit arenas",
    note: "Eras gigantes, tours mundiales y streaming.",
  },
  {
    decade: "2020",
    title: "2020s · folklore stories",
    note: "Introspección, playlists infinitas y noches en bucle.",
  },
];


function DecadeWidget({ onChange, onRangeChange }) {
  const [selectedDecades, setSelectedDecades] = useState([]);
  const [search, setSearch] = useState("");
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");
  const [rangeError, setRangeError] = useState("");

  const emitDecades = (decades) => {
    setSelectedDecades(decades);
    if (onChange) {
      onChange(decades);
    }
  };

  const emitRange = (from, to) => {
    if (!onRangeChange) return;

    const parsedFrom = from ? Number(from) : null;
    const parsedTo = to ? Number(to) : null;

    onRangeChange({
      fromYear: Number.isNaN(parsedFrom) ? null : parsedFrom,
      toYear: Number.isNaN(parsedTo) ? null : parsedTo,
    });
  };

  const toggleDecade = (decade) => {
    const exists = selectedDecades.includes(decade);
    const updated = exists
      ? selectedDecades.filter((d) => d !== decade)
      : [...selectedDecades, decade];

    emitDecades(updated);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const handleFromYearChange = (value) => {
    setFromYear(value);
    validateRange(value, toYear);
  };

  const handleToYearChange = (value) => {
    setToYear(value);
    validateRange(fromYear, value);
  };

  const validateRange = (from, to) => {
    const f = from ? Number(from) : null;
    const t = to ? Number(to) : null;

    if ((from && Number.isNaN(f)) || (to && Number.isNaN(t))) {
      setRangeError("Los años deben ser números válidos.");
      emitRange(from, to);
      return;
    }

    if (f && t && f > t) {
      setRangeError("El año inicial no puede ser mayor que el final.");
      emitRange(from, to);
      return;
    }

    if ((f && f < 1920) || (t && t < 1920)) {
      setRangeError("Usa años posteriores a 1920 para este filtro.");
      emitRange(from, to);
      return;
    }

    setRangeError("");
    emitRange(from, to);
  };

  const filteredCasefiles = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return DECADE_CASEFILES;

    return DECADE_CASEFILES.filter((decade) => {
      return (
        decade.decade.includes(term) ||
        decade.title.toLowerCase().includes(term) ||
        decade.note.toLowerCase().includes(term)
      );
    });
  }, [search]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-600/80 bg-gradient-to-b from-[#111217] via-black to-black p-4 shadow-[0_0_32px_rgba(148,163,184,0.45)]">
      {/* Capa expediente TTPD */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.22),_transparent_55%)] opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-30 mix-blend-soft-light" />

      <div className="relative space-y-4">
        {/* Cabecera Fortnight expediente */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="inline-flex items-center gap-2 rounded-full border border-zinc-500/70 bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-200">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-100 shadow-[0_0_10px_rgba(248,250,252,0.8)]" />
              TTPD · casefile eras
            </p>
            <h3 className="text-sm font-semibold tracking-tight text-zinc-100">
              Expediente de décadas
            </h3>
            <p className="text-[11px] text-zinc-300/90">
              Como si cada época fuese un expediente de{" "}
              <span className="italic">Fortnight</span>: marca las décadas que
              quieres investigar o acota con un rango de años.
            </p>
          </div>
          <span className="mt-1 text-[10px] uppercase tracking-[0.20em] text-zinc-500">
            Widget
          </span>
        </div>

        {/* Buscador de décadas */}
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-zinc-100">
            Buscar década / nota
          </p>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Ej. 1990, roaring, folklore..."
            className="w-full rounded-full border border-zinc-600 bg-black/70 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400/70"
          />
          <p className="text-[10px] text-zinc-500">
            Filtra por número de década o por fragmentos del texto.
          </p>
        </div>

        {/* Lista de décadas estilo expediente */}
        <div className="space-y-2">
          <p className="text-[11px] font-medium text-zinc-100">
            Décadas disponibles
          </p>
          {filteredCasefiles.length === 0 ? (
            <p className="text-[11px] text-zinc-400">
              Ninguna década coincide con la búsqueda.
            </p>
          ) : (
            <div className="grid gap-2 md:grid-cols-2">
              {filteredCasefiles.map((item) => {
                const active = selectedDecades.includes(item.decade);
                return (
                  <button
                    key={item.decade}
                    type="button"
                    onClick={() => toggleDecade(item.decade)}
                    className={[
                      "flex flex-col items-start rounded-xl border px-3 py-2 text-left text-[11px] transition",
                      active
                        ? "border-zinc-100 bg-zinc-900 text-zinc-50 shadow-[0_0_20px_rgba(250,250,250,0.55)]"
                        : "border-zinc-700/80 bg-black/70 text-zinc-200 hover:border-zinc-300 hover:bg-zinc-900/80",
                    ].join(" ")}
                  >
                    <span className="text-[11px] font-semibold text-zinc-100">
                      {item.title}
                    </span>
                    <span className="mt-1 text-[10px] text-zinc-400">
                      {item.note}
                    </span>
                    <span className="mt-1 text-[9px] uppercase tracking-[0.18em] text-zinc-500">
                      {active ? "Marcado en el expediente" : "Disponible"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Rango manual de años */}
        <div className="space-y-2 rounded-xl border border-zinc-700/80 bg-black/60 px-3 py-3">
          <p className="text-[11px] font-medium text-zinc-100">
            Rango manual de años
          </p>
          <p className="text-[10px] text-zinc-400">
            Opcional: acota aún más. Por ejemplo, 2008–2012 para capturar una
            etapa más concreta dentro de tus décadas.
          </p>

          <div className="mt-1 grid grid-cols-2 gap-2 text-[11px]">
            <div className="space-y-1">
              <label
                htmlFor="from-year"
                className="block text-[10px] uppercase tracking-[0.18em] text-zinc-400"
              >
                Desde año
              </label>
              <input
                id="from-year"
                type="number"
                value={fromYear}
                onChange={(e) => handleFromYearChange(e.target.value)}
                placeholder="Ej. 2008"
                className="w-full rounded-md border border-zinc-600 bg-black/70 px-2 py-1.5 text-[11px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400/70"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="to-year"
                className="block text-[10px] uppercase tracking-[0.18em] text-zinc-400"
              >
                Hasta año
              </label>
              <input
                id="to-year"
                type="number"
                value={toYear}
                onChange={(e) => handleToYearChange(e.target.value)}
                placeholder="Ej. 2014"
                className="w-full rounded-md border border-zinc-600 bg-black/70 px-2 py-1.5 text-[11px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400/70"
              />
            </div>
          </div>

          {rangeError ? (
            <p className="mt-1 text-[10px] text-rose-300">{rangeError}</p>
          ) : (
            <p className="mt-1 text-[10px] text-zinc-500">
              Si dejas estos campos vacíos, solo se tendrán en cuenta las
              décadas seleccionadas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DecadeWidget;