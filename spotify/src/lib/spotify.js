import { getAccessToken } from "./auth";

export async function generatePlaylist(preferences) {
  const {
    artists = [],
    genres = [],
    decades = [],
    yearRange,
    popularity,
  } = preferences;

  const token = getAccessToken();
  let allTracks = [];

  // 1. Obtener top tracks de artistas seleccionados
  for (const artist of artists) {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();

    if (Array.isArray(data.tracks)) {
      allTracks.push(...data.tracks);
    }
  }

  // 2. Añadir pistas basadas en géneros seleccionados
  if (genres && genres.length > 0) {
    const uniqueGenres = Array.from(new Set(genres)).slice(0, 5); // límite para no hacer demasiadas peticiones

    for (const genre of uniqueGenres) {
      const query = `genre:${genre}`;
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=track&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();

      if (data.tracks && Array.isArray(data.tracks.items)) {
        allTracks.push(...data.tracks.items);
      }
    }
  }

  // 3. Filtrar por décadas y/o rango manual de años
  const fromYear = yearRange?.fromYear ?? null;
  const toYear = yearRange?.toYear ?? null;

  if ((decades && decades.length > 0) || fromYear || toYear) {
    allTracks = allTracks.filter((track) => {
      const date = track.album?.release_date || track.release_date;
      if (!date) return true;

      const year = parseInt(String(date).slice(0, 4), 10);
      if (Number.isNaN(year)) return true;

      // Rango manual (si está definido)
      if (fromYear && year < fromYear) return false;
      if (toYear && year > toYear) return false;

      // Décadas seleccionadas (si las hay)
      if (decades && decades.length > 0) {
        const inSomeDecade = decades.some((decade) => {
          const d = parseInt(decade, 10);
          if (Number.isNaN(d)) return false;
          const start = d;
          const end = d + 9;
          return year >= start && year <= end;
        });

        if (!inSomeDecade) return false;
      }

      return true;
    });
  }

  // 4. Filtrar por popularidad
  if (popularity) {
    const [min, max] = popularity;
    allTracks = allTracks.filter(
      (track) => track.popularity >= min && track.popularity <= max
    );
  }

  // 5. Eliminar duplicados y limitar a 30 canciones
  const uniqueTracks = Array.from(
    new Map(allTracks.map((track) => [track.id, track])).values()
  ).slice(0, 30);

  return uniqueTracks;
}