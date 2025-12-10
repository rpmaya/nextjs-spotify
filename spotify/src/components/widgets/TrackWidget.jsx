"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth";

const MAX_SELECTED_TRACKS = 5;

function formatDuration(ms) {
  if (!ms && ms !== 0) return "";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function TrackWidget({ onChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const updateSelection = (tracks) => {
    setSelectedTracks(tracks);
    if (onChange) {
      onChange(tracks);
    }
  };

  const toggleTrack = (track) => {
    const exists = selectedTracks.some((t) => t.id === track.id);

    if (exists) {
      const next = selectedTracks.filter((t) => t.id !== track.id);
      updateSelection(next);
    } else {
      if (selectedTracks.length >= MAX_SELECTED_TRACKS) {
        // Simplemente ignoramos selecciones adicionales
        return;
      }
      const next = [...selectedTracks, track];
      updateSelection(next);
    }
  };

  // Búsqueda con debouncing
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setError("");
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setError(
        "No se encontró un token válido. Vuelve a iniciar sesión para buscar canciones."
      );
      setResults([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);
    setHasSearched(true);
    setError("");

    const handler = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(
            query
          )}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al buscar canciones en Spotify");
        }

        const data = await response.json();
        if (!cancelled) {
          setResults(data.tracks?.items || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            "No se pudieron cargar resultados. Inténtalo de nuevo más tarde."
          );
          setResults([]);
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(handler);
    };
  }, [query]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sky-400/70 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-4 shadow-[0_0_30px_rgba(56,189,248,0.5)]">
      {/* halo suave */}
      <div className="pointer-events-none absolute -top-10 right-0 h-32 w-32 rounded-full bg-[radial-gradient(circle,_rgba(56,189,248,0.65),_transparent_60%)] blur-xl" />

      <div className="relative space-y-3">
        {/* cabecera */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="inline-flex items-center rounded-full border border-sky-300/80 bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-100">
              Track search
            </p>
            <h3 className="text-sm font-semibold tracking-tight text-sky-50">
              Canciones favoritas como punto de partida
            </h3>
            <p className="text-[11px] text-sky-100/80">
              Busca temas concretos para usar como referencia en tu mezcla.
              Puedes seleccionar hasta {MAX_SELECTED_TRACKS} canciones.
            </p>
          </div>
          <span className="mt-1 text-[10px] uppercase tracking-[0.20em] text-sky-200/80">
            Widget
          </span>
        </div>

        {/* resumen selección */}
        <div className="flex items-center justify-between text-[11px] text-sky-100/85">
          <p>
            Seleccionadas:{" "}
            <span className="font-semibold">{selectedTracks.length}</span> /
            {MAX_SELECTED_TRACKS}
          </p>
          {selectedTracks.length >= MAX_SELECTED_TRACKS && (
            <span className="text-[10px] text-amber-300">
              Has alcanzado el límite de canciones.
            </span>
          )}
        </div>

        {/* campo de búsqueda */}
        <div className="space-y-1">
          <label
            htmlFor="track-search"
            className="block text-[11px] font-medium text-sky-50"
          >
            Buscar canciones
          </label>
          <input
            id="track-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Escribe el nombre de una canción o artista..."
            className="w-full rounded-full border border-sky-300/60 bg-black/60 px-3 py-2 text-xs text-sky-50 placeholder:text-sky-200/60 focus:outline-none focus:ring-2 focus:ring-sky-300/80"
          />
          <p className="text-[10px] text-sky-200/70">
            Empieza a escribir al menos 2 caracteres para ver resultados.
          </p>
        </div>

        {/* estados de carga / error */}
        {isSearching && (
          <p className="text-[11px] text-sky-200/90">
            Buscando canciones en Spotify...
          </p>
        )}
        {error && (
          <p className="text-[11px] text-rose-300/90">
            {error}
          </p>
        )}
        {!isSearching && hasSearched && results.length === 0 && !error && (
          <p className="text-[11px] text-sky-100/70">
            No se han encontrado canciones para esta búsqueda.
          </p>
        )}

        {/* lista de seleccionadas */}
        {selectedTracks.length > 0 && (
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-sky-50">
              Canciones seleccionadas
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedTracks.map((track) => (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => toggleTrack(track)}
                  className="group flex items-center gap-2 rounded-full border border-sky-300/80 bg-sky-900/60 px-3 py-1 text-[11px] text-sky-50 shadow-[0_0_14px_rgba(56,189,248,0.8)] hover:bg-black"
                >
                  <span className="truncate max-w-[130px]">
                    {track.name}
                  </span>
                  <span className="text-[10px] text-sky-200 group-hover:text-sky-300">
                    · Quitar
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* resultados de búsqueda */}
        {results.length > 0 && (
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-sky-50">
              Resultados
            </p>
            <ul className="max-h-60 space-y-1 overflow-y-auto pr-1">
              {results.map((track) => {
                const isSelected = selectedTracks.some(
                  (t) => t.id === track.id
                );
                const image =
                  track.album?.images?.[2] ||
                  track.album?.images?.[1] ||
                  track.album?.images?.[0];

                return (
                  <li key={track.id}>
                    <button
                      type="button"
                      onClick={() => toggleTrack(track)}
                      className={[
                        "flex w-full items-center gap-3 rounded-xl border px-2 py-2 text-left text-[11px] transition",
                        isSelected
                          ? "border-sky-300 bg-sky-900/70 shadow-[0_0_12px_rgba(56,189,248,0.8)]"
                          : "border-white/10 bg-black/40 hover:border-sky-300/80 hover:bg-slate-900/70",
                      ].join(" ")}
                    >
                      {image ? (
                        <img
                          src={image.url}
                          alt={track.name}
                          className="h-10 w-10 flex-shrink-0 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 flex-shrink-0 rounded-md border border-white/10 bg-slate-900" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-medium text-sky-50">
                          {track.name}
                        </p>
                        <p className="truncate text-[10px] text-sky-200/80">
                          {track.artists?.map((a) => a.name).join(", ")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end text-[10px] text-sky-200/80">
                        <span>{formatDuration(track.duration_ms)}</span>
                        {isSelected && (
                          <span className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-emerald-300">
                            Seleccionada
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackWidget;