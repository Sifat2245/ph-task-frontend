import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./api-error";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 300_000,
        retry: (count, error) =>
          !(error instanceof ApiError && error.statusCode < 500) && count < 1,
      },
    },
  });
}
