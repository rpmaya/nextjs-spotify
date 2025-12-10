"use client";

import { useState } from "react";

function DecadeWidget({ onChange }) {
  const [selected, setSelected] = useState([]);

  // Décadas con guiños a letras de Taylor
  const decades = [
    { value: "1920", label: "1920 – Roaring twenties, tossing pennies in the pool" },
    { value: "1930", label: "1930 – Watched as you signed your name Marjorie" },
    { value: "1940", label: "1940 – I met Bobby on the boardwalk summer of '45" },
    { value: "1950", label: "1950 – The 1950s shit they want from me" },
    { value: "1960", label: "1960 – So overnight, you look like a '60s queen" },
    { value: "1970", label: "1970 – " },
    { value: "1980", label: "1980 – My name is Taylor. I was borned in 1989" },
    { value: "1990", label: "1990 – Comeback stronger than a nineties trend" },
    { value: "2000", label: "2000 – It was the end of an era, but the start of an age" },
    { value: "2010", label: "2010 – I'm only 17, I don't know anything" },
    { value: "2020", label: "2020 – I don't know about you, but I'm felling 22" },
  ];

  const toggleDecade = (value) => {
    let updated;

    if (selected.includes(value)) {
      updated = selected.filter((d) => d !== value);
    } else {
      updated = [...selected, value];
    }

    setSelected(updated);
    if (onChange) {
      onChange(updated);
    }
  };

  return (
    <div className="relative rounded-2xl border border-zinc-700/60 bg-[#050608]/90 p-4 shadow-[0_0_25px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <div className="relative space-y-3">
        {/* Encabezado estilo expediente */}
        <div className="flex items-baseline justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-serif uppercase tracking-[0.25em] text-zinc-400">
              Department of tortured playlists
            </p>
            <h3 className="text-[12px] font-serif uppercase tracking-[0.22em] text-zinc-100">
              Décadas · Case files
            </h3>
            <p className="text-[11px] text-zinc-300/85 font-light">
              Marca las épocas que quieres que influyan en tu playlist.  
              Cada década funciona como un expediente en tu archivo musical.
            </p>
          </div>
          <span className="text-[10px] font-serif uppercase tracking-[0.20em] text-zinc-500">
            Widget
          </span>
        </div>

        {/* Lista de expedientes por década */}
        <div className="space-y-2">
          {decades.map((decade, index) => {
            const active = selected.includes(decade.value);

            return (
              <button
                key={decade.value}
                type="button"
                onClick={() => toggleDecade(decade.value)}
                className={[
                  "flex w-full items-stretch gap-3 rounded-xl border px-3 py-2 text-left transition",
                  "bg-black/40",
                  active
                    ? "border-zinc-100/70 shadow-[0_0_20px_rgba(250,250,249,0.25)]"
                    : "border-zinc-700/70 hover:border-zinc-400/80 hover:bg-black/60"
                ].join(" ")}
              >
                {/* Lado izquierdo: pestaña de expediente */}
                <div className="flex flex-col justify-between border-r border-zinc-700/70 pr-3 text-[10px] font-serif">
                  <span className="rounded-sm border border-zinc-600/80 bg-[#f5f1e8]/80 px-2 py-0.5 text-[9px] uppercase tracking-[0.22em] text-black">
                    File
                  </span>
                  <span className="mt-1 text-[10px] uppercase tracking-[0.20em] text-zinc-300">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </span>
                </div>

                {/* Lado derecho: detalle de la década */}
                <div className="flex flex-1 items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-serif text-[12px] text-zinc-100">
                      {decade.label}
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      Era dossier · {decade.value}s
                    </p>
                  </div>

                  <span
                    className={[
                      "text-[10px] font-serif uppercase tracking-[0.18em]",
                      active ? "text-[#f5f1e8]" : "text-zinc-500"
                    ].join(" ")}
                  >
                    {active ? "Seleccionado" : "Abrir"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DecadeWidget;
