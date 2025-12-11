"use client";

import { useEffect, useState } from "react";

const MOOD_PRESETS = [
  {
    key: "debut",
    name: "Debut",
    description: "Country juvenil, guitarras y frescura inicial.",
    values: {
      energy: 60,
      valence: 75,
      danceability: 55,
      acousticness: 55,
    },
  },
  {
    key: "fearless",
    name: "Fearless",
    description: "Himnos luminosos, emoción adolescente y esperanza.",
    values: {
      energy: 70,
      valence: 80,
      danceability: 60,
      acousticness: 45,
    },
  },
  {
    key: "speaknow",
    name: "Speak Now",
    description: "Confesiones intensas, guitarras y grandes puentes.",
    values: {
      energy: 65,
      valence: 65,
      danceability: 55,
      acousticness: 55,
    },
  },
  {
    key: "red",
    name: "Red",
    description: "Emoción extrema, mezcla de euforia y ruptura.",
    values: {
      energy: 70,
      valence: 55,
      danceability: 60,
      acousticness: 40,
    },
  },
  {
    key: "1989",
    name: "1989",
    description: "Pop pulido, sintetizadores y ciudad de noche.",
    values: {
      energy: 80,
      valence: 75,
      danceability: 80,
      acousticness: 25,
    },
  },
  {
    key: "reputation",
    name: "reputation",
    description: "Oscuro, contundente, beats pesados y venganza.",
    values: {
      energy: 85,
      valence: 40,
      danceability: 80,
      acousticness: 20,
    },
  },
  {
    key: "lover",
    name: "Lover",
    description: "Colores pastel, romanticismo y pop brillante.",
    values: {
      energy: 70,
      valence: 85,
      danceability: 75,
      acousticness: 30,
    },
  },
  {
    key: "folklore",
    name: "folklore",
    description: "Cabaña en el bosque, historias suaves y nostalgia.",
    values: {
      energy: 40,
      valence: 50,
      danceability: 35,
      acousticness: 85,
    },
  },
  {
    key: "evermore",
    name: "evermore",
    description: "Invierno, reflexión, folk aún más introspectivo.",
    values: {
      energy: 35,
      valence: 45,
      danceability: 30,
      acousticness: 85,
    },
  },
  {
    key: "midnights",
    name: "Midnights",
    description: "Confesiones nocturnas, synth-pop introspectivo.",
    values: {
      energy: 65,
      valence: 55,
      danceability: 70,
      acousticness: 25,
    },
  },
  {
    key: "ttpd",
    name: "The Tortured Poets Department",
    description: "Poesía dolida, ironía y capas emocionales.",
    values: {
      energy: 50,
      valence: 35,
      danceability: 45,
      acousticness: 60,
    },
  },
];

function MoodWidget({ onChange }) {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [energy, setEnergy] = useState(50);
  const [valence, setValence] = useState(50);
  const [danceability, setDanceability] = useState(50);
  const [acousticness, setAcousticness] = useState(50);

  // Emitimos la configuración completa al padre
  useEffect(() => {
    if (onChange) {
      onChange({
        preset: selectedPreset, // nombre de álbum o null
        energy,
        valence,
        danceability,
        acousticness,
      });
    }
  }, [selectedPreset, energy, valence, danceability, acousticness, onChange]);

  const applyPreset = (presetKey) => {
    const preset = MOOD_PRESETS.find((m) => m.key === presetKey);
    if (!preset) return;

    setSelectedPreset(presetKey);
    setEnergy(preset.values.energy);
    setValence(preset.values.valence);
    setDanceability(preset.values.danceability);
    setAcousticness(preset.values.acousticness);
  };

  const renderSlider = (id, label, value, setValue, help) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px] text-slate-100">
        <span>{label}</span>
        <span className="text-slate-300">{value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-emerald-400"
      />
      {help && (
        <p className="text-[10px] text-slate-400">
          {help}
        </p>
      )}
    </div>
  );

  return (
    <div className="relative rounded-2xl border border-emerald-900/60 bg-gradient-to-b from-stone-900/90 via-[#050608] to-black p-4 shadow-[0_0_30px_rgba(6,95,70,0.45)]">
      {/* Vibe bosque / niebla folklore/evermore */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_55%)] opacity-70" />

      <div className="relative space-y-4">
        {/* Cabecera */}
        <div className="flex items-baseline justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-serif uppercase tracking-[0.25em] text-slate-300/80">
              Folklore · Evermore atmospheres
            </p>
            <h3 className="text-[12px] font-serif uppercase tracking-[0.22em] text-slate-100">
              Mood por álbum
            </h3>
            <p className="text-[11px] text-slate-300/90 font-light">
              Elige una era de Taylor como mood base o ajusta manualmente energía,
              valence, danceability y acousticness para afinar el ambiente.
            </p>
          </div>
          <span className="text-[10px] font-serif uppercase tracking-[0.20em] text-slate-500">
            Widget
          </span>
        </div>

        {/* Presets por álbum / era */}
        <div className="grid gap-2 text-[11px] md:grid-cols-2">
          {MOOD_PRESETS.map((mood) => {
            const active = mood.key === selectedPreset;

            return (
              <button
                key={mood.key}
                type="button"
                onClick={() => applyPreset(mood.key)}
                className={[
                  "flex w-full flex-col items-start rounded-xl border px-3 py-2 text-left transition",
                  active
                    ? "border-emerald-300/80 bg-emerald-900/40 shadow-[0_0_22px_rgba(16,185,129,0.5)]"
                    : "border-stone-700/80 bg-stone-950/70 hover:border-emerald-700/80 hover:bg-stone-900/80",
                ].join(" ")}
              >
                <span className="font-medium text-slate-100 font-serif">
                  {mood.name}
                </span>
                <span className="text-[10px] text-slate-300/90">
                  {mood.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sliders de audio features */}
        <div className="mt-2 grid gap-3 text-[11px] md:grid-cols-2">
          {renderSlider(
            "energy",
            "Energy",
            energy,
            setEnergy,
            "Intensidad y fuerza general de las canciones."
          )}
          {renderSlider(
            "valence",
            "Valence",
            valence,
            setValence,
            "Qué tan positiva/sentimentalmente alegre se percibe la música."
          )}
          {renderSlider(
            "danceability",
            "Danceability",
            danceability,
            setDanceability,
            "Qué tan bailable resulta la canción."
          )}
          {renderSlider(
            "acousticness",
            "Acousticness",
            acousticness,
            setAcousticness,
            "Nivel de carácter acústico frente a electrónico."
          )}
        </div>

        {/* Resumen */}
        <div className="mt-2 rounded-xl border border-stone-700/80 bg-black/70 px-3 py-2 text-[10px] text-slate-200/90">
          <p className="mb-1 font-semibold font-serif">
            Mood actual
          </p>
          <p className="text-[10px] text-slate-400">
            Álbum / era:{" "}
            {selectedPreset
              ? MOOD_PRESETS.find((m) => m.key === selectedPreset)?.name
              : "Personalizado"}
            . Estos valores se enviarán como parte de tus preferencias al generar
            la playlist.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MoodWidget;