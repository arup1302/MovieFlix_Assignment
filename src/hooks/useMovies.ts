import { useCallback, useEffect, useState } from 'react';
import { fetchMovies } from '../services/movieService';
import type { Movie } from '../types/movie';

export default function useMovies(pageSize = 10) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadPage = useCallback(
    async (p: number, replace = false) => {
      if (p === 1) setLoading(true);
      try {
        const res = await fetchMovies(p, pageSize);
        const incoming = res.data;
        setHasMore((p - 1) * pageSize + incoming.length < res.total);
        setMovies((prev) => (replace ? incoming : [...prev, ...incoming]));
      } catch (e) {
        setError('Unable to fetch movies.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [pageSize]
  );

  const loadMovies = useCallback(async () => {
    setError(null);
    setPage(1);
    await loadPage(1, true);
  }, [loadPage]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    const next = page + 1;
    setPage(next);
    await loadPage(next, false);
  }, [hasMore, loadingMore, page, loadPage]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    setPage(1);
    await loadPage(1, true);
  }, [loadPage]);

  useEffect(() => {
    loadMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    movies,
    loading,
    loadingMore,
    error,
    refreshing,
    hasMore,
    loadMovies,
    loadMore,
    refresh,
  };
}
