import { getAccessToken } from "./auth";

export async function generatePlaylist(preferences) {
  const {
    artists = [],
    genres = [],
    decades = [],
    yearRange,
    popularity,
    favoriteTracks = [],
  } = preferences;

  const token = getAccessToken();

  // 0. Normalizamos favoritos (por si llegan duplicados)
  const favoritesMap = new Map();
  if (Array.isArray(favoriteTracks)) {
    for (const track of favoriteTracks) {
      if (track && track.id) {
        favoritesMap.set(track.id, track);
      }
    }
  }
  const favoritesUnique = Array.from(favoritesMap.values());

  // 1. Obtener top tracks de artistas seleccionados
  let candidateTracks = [];

  for (const artist of artists) {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) continue;

      const data = await response.json();

      if (Array.isArray(data.tracks)) {
        candidateTracks.push(...data.tracks);
      }
    } catch {
      // ignoramos errores individuales de artista para no romper toda la generación
    }
  }

  // 2. Añadir pistas basadas en géneros seleccionados
  if (genres && genres.length > 0) {
    const uniqueGenres = Array.from(new Set(genres)).slice(0, 5); // límite para no hacer demasiadas peticiones

    for (const genre of uniqueGenres) {
      try {
        const query = `genre:${genre}`;
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            query
          )}&type=track&limit=10`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) continue;

        const data = await response.json();

        if (data.tracks && Array.isArray(data.tracks.items)) {
          candidateTracks.push(...data.tracks.items);
        }
      } catch {
        // ignoramos errores de género individual
      }
    }
  }

  // 3. Filtrar candidatos por décadas y/o rango manual de años
  const fromYear = yearRange?.fromYear ?? null;
  const toYear = yearRange?.toYear ?? null;

  if ((decades && decades.length > 0) || fromYear || toYear) {
    candidateTracks = candidateTracks.filter((track) => {
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

  // 4. Filtrar candidatos por popularidad
  if (popularity) {
    const [min, max] = popularity;
    candidateTracks = candidateTracks.filter(
      (track) => track.popularity >= min && track.popularity <= max
    );
  }

  // 5. Eliminar duplicados entre candidatos
  const candidateMap = new Map();
  for (const track of candidateTracks) {
    if (track && track.id) {
      candidateMap.set(track.id, track);
    }
  }
  const uniqueCandidates = Array.from(candidateMap.values());

  // 6. Combinar favoritos + candidatos, sin duplicar, priorizando favoritos
  const merged = [
    ...favoritesUnique,
    ...uniqueCandidates.filter((track) => !favoritesMap.has(track.id)),
  ];

  // 7. Limitar a 30 canciones
  return merged.slice(0, 30);
}