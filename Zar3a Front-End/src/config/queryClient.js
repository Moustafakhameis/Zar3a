import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch on window focus by default
      retry: 1, // Retry failed requests once before showing error
      staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes even if unused (gcTime in v5+)
    },
    mutations: {
      retry: 0, // Never retry mutations by default to avoid duplicate operations
    },
  },
});
