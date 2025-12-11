"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getSpotifyAuthUrl } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-slate-950 to-black text-white">
      {/* Capa de luces tipo concierto */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.18),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.25),_transparent_55%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 md:flex-row md:items-center">
          {/* Columna izquierda: texto principal */}
          <section className="space-y-6 md:w-1/2">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.25em] text-purple-200/80">
                The Eras Tour inspired
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Spotify Taste Mixer
              </h1>
              {/* Mantengo el texto original de la home integrado */}
              <p className="text-xs text-zinc-300/80">
                🎵 Spotify Taste Mixer
              </p>
            </div>

            <p className="max-w-md text-sm text-zinc-300/90">
              Diseña tu propio “tour” musical: combina artistas, géneros,
              décadas, estados de ánimo y popularidad para generar playlists
              personalizadas a partir de tu cuenta de Spotify.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleLogin}
                className="rounded-full border border-white/20 bg-white text-[11px] font-semibold uppercase tracking-[0.20em] text-black px-6 py-3 shadow-[0_0_30px_rgba(255,255,255,0.35)] transition hover:bg-zinc-100"
              >
                Iniciar sesión con Spotify
              </button>

              <div className="text-[11px] text-zinc-300/90">
                <p className="uppercase tracking-[0.22em]">
                  OAuth seguro con Spotify
                </p>
                <p className="text-[11px] text-zinc-400">
                  Te redirigiremos a Spotify para autorizar la aplicación.
                </p>
              </div>
            </div>

            <div className="grid gap-3 text-[11px] text-zinc-300/85 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-3">
                <p className="uppercase tracking-[0.18em] text-zinc-200">
                  Widgets
                </p>
                <p className="text-xs text-zinc-400">
                  Artistas, géneros, décadas, mood y popularidad.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-3">
                <p className="uppercase tracking-[0.18em] text-zinc-200">
                  Playlist
                </p>
                <p className="text-xs text-zinc-400">
                  Generación dinámica según tus preferencias.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-3">
                <p className="uppercase tracking-[0.18em] text-zinc-200">
                  Favoritos
                </p>
                <p className="text-xs text-zinc-400">
                  Guarda canciones favoritas en localStorage.
                </p>
              </div>
            </div>
          </section>

          {/* Columna derecha: “escenario” visual */}
          <section className="md:w-1/2">
            <div className="relative mx-auto max-w-md rounded-3xl border border-white/10 bg-black/50 p-5 shadow-[0_0_60px_rgba(129,140,248,0.65)] backdrop-blur">
              <div className="flex items-center justify-between text-[11px] text-zinc-300/85">
                <span className="rounded-full bg-white/5 px-3 py-1 uppercase tracking-[0.20em]">
                  Preview del dashboard
                </span>
                <span className="text-zinc-400">Eras layout</span>
              </div>

              <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-gradient-to-b from-purple-900/40 via-slate-950 to-black p-4">
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="font-medium text-zinc-100">
                    Tus preferencias
                  </span>
                  <span className="text-zinc-400">Widgets</span>
                </div>

                <div className="grid gap-2 text-[10px] md:grid-cols-2">
                  <div className="h-12 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
                    <p className="font-medium text-zinc-100/90">
                      Artistas
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      Selección de favoritos
                    </p>
                  </div>
                  <div className="h-12 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
                    <p className="font-medium text-zinc-100/90">
                      Géneros
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      Explora estilos distintos
                    </p>
                  </div>
                  <div className="h-12 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
                    <p className="font-medium text-zinc-100/90">
                      Décadas
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      De los 80s a hoy
                    </p>
                  </div>
                  <div className="h-12 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
                    <p className="font-medium text-zinc-100/90">
                      Mood
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      Energía y ambiente
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-white/10 bg-black/50 px-3 py-3 text-[11px]">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-zinc-100">
                      Setlist generado
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      Vista previa
                    </span>
                  </div>
                  <div className="space-y-1 text-[10px] text-zinc-300/90">
                    <div className="flex items-center justify-between">
                      <span>Track 1 · Artist</span>
                      <span className="text-zinc-500">00:30</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Track 2 · Artist</span>
                      <span className="text-zinc-500">00:30</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Track 3 · Artist</span>
                      <span className="text-zinc-500">00:30</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-center text-[10px] text-zinc-400">
                Tras iniciar sesión, accederás al dashboard completo para ajustar
                tus widgets y generar tu playlist.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}