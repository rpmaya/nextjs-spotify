"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth";

const FALLBACK_GENRES = [
  "pop",
  "pop rock",
  "country",
  "country pop",
  "indie",
  "indie pop",
  "alternative",
  "rock",
  "singer-songwriter",
  "folk",
  "electropop",
];

function GenreWidget({ onChange }) {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [customGenre, setCustomGenre] = useState("");
  const [suggestedGenres, setSuggestedGenres] = useState(FALLBACK_GENRES);
  const [genreFilter, setGenreFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const normalize = (value) => value.trim().toLowerCase();

  const updateGenres = (newGenres) => {
    setSelectedGenres(newGenres);
    if (onChange) {
      onChange(newGenres);
    }
  };

  const toggleGenre = (genre) => {
    const norm = normalize(genre);
    const exists = selectedGenres.some((g) => normalize(g) === norm);

    if (exists) {
      updateGenres(selectedGenres.filter((g) => normalize(g) !== norm));
    } else {
      updateGenres([...selectedGenres, genre]);
    }
  };

  const handleAddCustom = (event) => {
    event.preventDefault();
    const trimmed = customGenre.trim();
    if (!trimmed) return;

    const norm = normalize(trimmed);
    const exists = selectedGenres.some((g) => normalize(g) === norm);

    if (!exists) {
      updateGenres([...selectedGenres, trimmed]);
    }
    setCustomGenre("");
  };

  // Cargar géneros reales desde Spotify
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setError(
        "No se encontró un token válido. Vuelve a iniciar sesión para cargar géneros de Spotify."
      );
      return;
    }

    const fetchGenres = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          "https://api.spotify.com/v1/recommendations/available-genre-seeds",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Respuesta no válida de Spotify");
        }

        const data = await response.json();

        if (Array.isArray(data.genres) && data.genres.length > 0) {
          setSuggestedGenres(data.genres);
        }
      } catch (err) {
        // Mantenemos FALLBACK_GENRES, solo informamos
        setError(
          "No se pudieron cargar los géneros desde Spotify. Usando lista por defecto."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const filteredGenres = suggestedGenres.filter((genre) => {
    const filter = genreFilter.trim().toLowerCase();
    if (!filter) return true;
    return genre.toLowerCase().includes(filter);
  });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-red-400/70 bg-gradient-to-b from-[#3b1212] via-black to-black p-4 shadow-[0_0_40px_rgba(248,113,113,0.65)]">
      {/* halos rojos */}
      <div className="pointer-events-none absolute -top-12 left-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(248,113,113,0.5),_transparent_60%)] blur-xl" />
      <div className="pointer-events-none absolute -bottom-16 right-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(127,29,29,0.6),_transparent_60%)] blur-xl" />

      <div className="relative space-y-3">
        {/* Cabecera Red */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="inline-flex items-center rounded-full border border-red-300/80 bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-red-100">
              Red · genres
            </p>
            <h3 className="text-sm font-semibold tracking-tight text-red-50">
              Géneros que colorean tu historia
            </h3>
            <p className="text-[11px] text-red-100/85">
              Elige los géneros que quieres que definan el tono de tu playlist.
              Puedes combinar sugerencias y añadir los tuyos propios.
            </p>
          </div>
          <span className="mt-1 text-[10px] uppercase tracking-[0.20em] text-red-200/80">
            Widget
          </span>
        </div>

        {/* Estado de carga / error */}
        {isLoading && (
          <p className="text-[11px] text-red-200/80">
            Cargando géneros desde Spotify…
          </p>
        )}
        {error && (
          <p className="text-[11px] text-red-300/90">
            {error}
          </p>
        )}

        {/* Géneros seleccionados */}
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-red-50">
            Géneros seleccionados
          </p>
          {selectedGenres.length === 0 ? (
            <p className="text-[11px] text-red-100/70">
              Aún no has elegido ningún género. Empieza seleccionando algunos
              de la lista o añade los tuyos.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedGenres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className="group rounded-full border border-red-300/80 bg-red-800/70 px-3 py-1 text-[11px] text-red-50 shadow-[0_0_14px_rgba(248,113,113,0.8)] transition hover:bg-black hover:text-red-200"
                >
                  <span>{genre}</span>
                  <span className="ml-1 text-[10px] text-red-200/90 group-hover:text-red-300">
                    · Quitar
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filtro de géneros */}
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-red-50">
            Buscar en géneros disponibles
          </p>
          <input
            type="text"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            placeholder="Escribe para filtrar géneros (ej. pop, indie)..."
            className="w-full rounded-full border border-red-300/70 bg-black/60 px-3 py-2 text-xs text-red-50 placeholder:text-red-200/60 focus:outline-none focus:ring-2 focus:ring-red-300/80"
          />
          <p className="text-[10px] text-red-200/70">
            Se muestran los géneros que coinciden con tu búsqueda.
          </p>
        </div>

        {/* Sugerencias de géneros (Spotify o fallback) */}
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-red-50">
            Sugerencias
          </p>
          <div className="flex flex-wrap gap-2">
            {filteredGenres.map((genre) => {
              const active = selectedGenres.some(
                (g) => normalize(g) === normalize(genre)
              );
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={[
                    "rounded-full border px-3 py-1 text-[10px] capitalize transition",
                    active
                      ? "border-red-300 bg-red-600/90 text-red-50 shadow-[0_0_12px_rgba(248,113,113,0.7)]"
                      : "border-red-700/80 bg-black/60 text-red-100/85 hover:border-red-300 hover:bg-red-800/60",
                  ].join(" ")}
                >
                  {genre}
                </button>
              );
            })}
            {filteredGenres.length === 0 && (
              <p className="text-[11px] text-red-100/70">
                Ningún género coincide con tu búsqueda.
              </p>
            )}
          </div>
        </div>

        {/* Añadir género personalizado */}
        <form onSubmit={handleAddCustom} className="space-y-1">
          <p className="text-[11px] font-medium text-red-50">
            Añadir género personalizado
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={customGenre}
              onChange={(e) => setCustomGenre(e.target.value)}
              placeholder="Por ejemplo: dream pop, indie folk…"
              className="flex-1 rounded-full border border-red-300/70 bg-black/60 px-3 py-2 text-xs text-red-50 placeholder:text-red-200/60 focus:outline-none focus:ring-2 focus:ring-red-300/80"
            />
            <button
              type="submit"
              className="rounded-full border border-red-200/80 bg-red-300 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.20em] text-slate-900 shadow-[0_0_16px_rgba(248,113,113,0.8)] transition hover:bg-red-200"
            >
              Añadir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GenreWidget;