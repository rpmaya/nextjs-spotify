"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, logout } from "@/lib/auth";
import { generatePlaylist } from "@/lib/spotify";

import ArtistWidget from "@/components/widgets/ArtistWidget";
import GenreWidget from "@/components/widgets/GenreWidget";
import DecadeWidget from "@/components/widgets/DecadeWidget";
import PopularityWidget from "@/components/widgets/PopularityWidget";
import MoodWidget from "@/components/widgets/MoodWidget";
import FavoritesWidget from "@/components/widgets/FavoritesWidget";

function mapPopularityToRange(value) {
  if (value <= 30) return [0, 50];
  if (value <= 60) return [30, 80];
  return [60, 100];
}

function DashboardPage() {
  const router = useRouter();

  // ESTADO DE PREFERENCIAS
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [decades, setDecades] = useState([]);
  const [popularity, setPopularity] = useState(70);
  const [mood, setMood] = useState(null);

  // PLAYLIST GENERADA
  const [tracks, setTracks] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // FAVORITOS
  const [favoriteTracks, setFavoriteTracks] = useState([]);

  // Cargar favoritos desde localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem("favoriteTracks");
    if (stored) {
      try {
        setFavoriteTracks(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("favoriteTracks", JSON.stringify(favoriteTracks));
  }, [favoriteTracks]);

  // Protección de ruta
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/");
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  // Añadir / quitar favorito
  const toggleFavorite = (track) => {
    setFavoriteTracks((prev) => {
      const exists = prev.some((t) => t.id === track.id);
      if (exists) {
        return prev.filter((t) => t.id !== track.id);
      }
      return [...prev, track];
    });
  };

  // Generación de playlist
  const handleGeneratePlaylist = async () => {
    setError("");

    const popularityRange = Array.isArray(popularity)
      ? popularity
      : mapPopularityToRange(popularity);

    const preferences = {
      artists,
      genres,
      decades,
      popularity: popularityRange,
      mood,
    };

    try {
      setIsGenerating(true);
      const newTracks = await generatePlaylist(preferences);
      setTracks(newTracks);
    } catch (err) {
      console.error(err);
      setError("Hubo un problema al generar la playlist.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-slate-950 to-black text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.18),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.20),_transparent_55%)]" />

      <div className="relative z-10">
        {/* HEADER */}
        <header className="border-b border-white/10 bg-black/40 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.25em] text-purple-200/70">
                The Eras Tour inspired
              </p>
              <h1 className="text-2xl font-semibold tracking-tight">
                Spotify Taste Mixer
              </h1>
              <p className="text-xs text-zinc-300/80">
                Diseña tu propio setlist mezclando eras, estados de ánimo y décadas.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-white/30 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] hover:bg-white/15"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        {/* MAIN */}
        <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
          {/* CINTA SUPERIOR */}
          <section className="rounded-2xl border border-white/10 bg-gradient-to-r from-fuchsia-500/20 via-sky-500/10 to-indigo-500/20 px-4 py-3 text-xs backdrop-blur-sm">
            <div className="flex justify-between">
              <span className="rounded-full border border-white/30 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.22em]">
                Tour dashboard
              </span>

              <div className="flex gap-2">
                <span className="rounded-full bg-black/40 px-3 py-1">Eras: {decades.length}</span>
                <span className="rounded-full bg-black/40 px-3 py-1">Artistas: {artists.length}</span>
                <span className="rounded-full bg-black/40 px-3 py-1">Géneros: {genres.length}</span>
              </div>
            </div>
          </section>

          {/* LAYOUT DOS COLUMNAS */}
          <section className="grid gap-5 lg:grid-cols-[2fr_2.2fr]">
            {/* IZQUIERDA – Widgets */}
            <div className="space-y-4">
              <ArtistWidget onChange={setArtists} />
              <GenreWidget onChange={setGenres} />
              <DecadeWidget onChange={setDecades} />
              <MoodWidget onChange={setMood} />
              <PopularityWidget onChange={setPopularity} />
            </div>

            {/* DERECHA – Setlist + Favoritas */}
            <div className="space-y-4">
              {/* SETLIST */}
              <div className="rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur">
                <div className="flex justify-between border-b border-white/10 pb-3 text-xs">
                  <span className="text-zinc-300">
                    {tracks.length === 0
                      ? "Aún no hay canciones en tu setlist."
                      : `Tienes ${tracks.length} canciones en tu setlist.`}
                  </span>

                  <button
                    onClick={handleGeneratePlaylist}
                    disabled={isGenerating}
                    className="rounded-full border border-white/30 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] hover:bg-white/15 disabled:opacity-40"
                  >
                    {isGenerating ? "Generando..." : "Generar playlist"}
                  </button>
                </div>

                {error && <p className="mt-2 text-rose-300">{error}</p>}

                {/* LISTA DE TEMAS */}
                <ul className="mt-3 space-y-2 text-[11px] text-zinc-200">
                  {tracks.map((track) => (
                    <li
                      key={track.id}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-black/60 px-3 py-2"
                    >
                      <div className="truncate">
                        <p className="font-medium truncate">{track.name}</p>
                        <p className="text-[10px] text-zinc-400 truncate">
                          {track.artists?.map((a) => a.name).join(", ")}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleFavorite(track)}
                        className="rounded-full border border-white/20 px-2 py-1 text-[10px] hover:bg-white/10"
                      >
                        {favoriteTracks.some((f) => f.id === track.id)
                          ? "Unfav"
                          : "Fav"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* WIDGET LOVER – FAVORITAS */}
              <FavoritesWidget
                favorites={favoriteTracks}
                onClear={() => setFavoriteTracks([])}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;