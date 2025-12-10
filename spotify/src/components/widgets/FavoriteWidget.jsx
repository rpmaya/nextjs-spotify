"use client";

function FavoritesWidget({ favorites = [], onClear }) {
  const hasFavorites = favorites.length > 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-pink-200/70 bg-gradient-to-b from-pink-300/50 via-sky-200/40 to-rose-200/60 p-4 shadow-[0_0_40px_rgba(244,114,182,0.6)]">
      {/* Halos Lover */}
      <div className="pointer-events-none absolute -top-16 left-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(248,187,208,0.9),_transparent_60%)] blur-xl" />
      <div className="pointer-events-none absolute -bottom-14 right-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(96,165,250,0.7),_transparent_60%)] blur-xl" />

      {/* Textura */}
      <div className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-30 mix-blend-soft-light" />

      <div className="relative space-y-3 text-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="inline-flex items-center gap-1 rounded-full border border-pink-200 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-pink-700">
              <span className="h-1.5 w-1.5 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
              Lover · favorites
            </p>
            <h3 className="text-sm font-semibold tracking-tight">
              Canciones favoritas
            </h3>
            <p className="text-[11px] text-pink-900/80">
              Canciones que has marcado como favoritas en tu setlist.
            </p>
          </div>

          <span className="mt-1 text-[10px] uppercase tracking-[0.20em] text-pink-700/80">
            Widget extra
          </span>
        </div>

        {/* Resumen */}
        <div className="flex items-center justify-between text-[11px] text-pink-900/80">
          <p>
            {hasFavorites
              ? `Tienes ${favorites.length} canción${favorites.length === 1 ? "" : "es"} favorita${favorites.length === 1 ? "" : "s"}.`
              : "Todavía no has marcado ninguna canción como favorita."}
          </p>

          {hasFavorites && (
            <button
              onClick={onClear}
              className="rounded-full border border-pink-300 bg-white/70 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-pink-700 hover:bg-pink-100"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Listado */}
        {hasFavorites && (
          <ul className="mt-1 space-y-1.5 text-[11px]">
            {favorites.slice(0, 6).map((track) => (
              <li
                key={track.id}
                className="flex items-center justify-between rounded-xl border border-pink-200 bg-white/70 px-3 py-1.5"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-pink-900">
                    {track.name}
                  </p>
                  <p className="truncate text-[10px] text-pink-700/80">
                    {track.artists?.map((a) => a.name).join(", ")}
                  </p>
                </div>

                <span className="text-[10px] uppercase tracking-[0.2em] text-pink-500">
                  ♥
                </span>
              </li>
            ))}

            {favorites.length > 6 && (
              <li className="text-[10px] text-pink-800/80">
                + {favorites.length - 6} más en tu colección
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FavoritesWidget;