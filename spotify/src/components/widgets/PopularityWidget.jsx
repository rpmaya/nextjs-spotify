"use client";

import { useState } from "react";

function PopularityWidget({ onChange }) {
  const [popularity, setPopularity] = useState(70); // 0–100

  const handleChange = (event) => {
    const value = Number(event.target.value);
    setPopularity(value);
    if (onChange) {
      onChange(value);
    }
  };

  const labelForPopularity = (value) => {
    if (value < 30) return "Joyas ocultas";
    if (value < 60) return "Mezcla equilibrada";
    return "Hits de estadio";
  };

  return (
    <div className="relative rounded-2xl border border-sky-300/40 bg-gradient-to-b from-sky-500/15 via-slate-950/70 to-slate-950/95 p-4 shadow-[0_0_35px_rgba(56,189,248,0.55)]">
      {/* Encabezado estilo 1989 / Polaroid */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="inline-flex items-center rounded-full border border-sky-200/70 bg-sky-50/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-900">
            Popularidad · 1989
          </div>
          <h3 className="text-sm font-semibold tracking-tight text-sky-100">
            Ajusta el nivel de popularidad
          </h3>
          <p className="text-[11px] text-sky-100/85">
            Controla si tu playlist debe sonar más a joyas ocultas
            o a grandes himnos de estadio. Inspirado en la energía brillante de 1989.
          </p>
        </div>

        <div className="text-right text-[10px] text-sky-100/80">
          <p className="uppercase tracking-[0.22em]">Level</p>
          <p className="text-xs font-semibold">
            {popularity}
          </p>
          <p className="text-[10px] text-sky-200/80">
            {labelForPopularity(popularity)}
          </p>
        </div>
      </div>

      {/* Slider estilizado */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-[10px] text-sky-100/80">
          <span className="uppercase tracking-[0.22em]">0 · Joyas ocultas</span>
          <span className="uppercase tracking-[0.22em]">100 · Stadium hits</span>
        </div>

        <div className="relative mt-1">
          {/* Barra visual */}
          <div className="h-1.5 w-full rounded-full bg-slate-900/90">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-pink-300"
              style={{ width: `${popularity}%` }}
            />
          </div>

          {/* Burbuja de valor */}
          <div
            className="pointer-events-none absolute -top-5 flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${popularity}%` }}
          >
            <div className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-medium text-sky-100 shadow-[0_0_15px_rgba(129,140,248,0.75)]">
              {popularity}
            </div>
            <div className="mt-1 h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_10px_rgba(125,211,252,0.9)]" />
          </div>

          {/* Input real (rango) */}
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={popularity}
            onChange={handleChange}
            className="absolute inset-0 h-4 w-full cursor-pointer opacity-0"
          />
        </div>
      </div>

      {/* Descripción del rango actual */}
      <div className="mt-3 rounded-xl border border-sky-300/30 bg-slate-950/60 px-3 py-2 text-[11px] text-sky-50/90">
        <p className="font-medium">
          {labelForPopularity(popularity)}
        </p>
        <p className="text-[10px] text-sky-100/80">
          Este valor guiará la generación de tu playlist para favorecer canciones
          más o menos populares dentro del catálogo de Spotify.
        </p>
      </div>
    </div>
  );
}

export default PopularityWidget;