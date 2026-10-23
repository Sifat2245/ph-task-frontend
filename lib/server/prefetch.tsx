import "server-only";
import {
  dehydrate,
  HydrationBoundary,
  type QueryKey,
} from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/query-client";
import { serverGet } from "./api";

export async function Prefetch({
  children,
  queries,
}: {
  children: React.ReactNode;
  queries: { key: QueryKey; path: string }[];
}) {
  const client = makeQueryClient();
  await Promise.all(
    queries.map(({ key, path }) =>
      client.prefetchQuery({ queryKey: key, queryFn: () => serverGet(path) }),
    ),
  );
  return (
    <HydrationBoundary state={dehydrate(client)}>{children}</HydrationBoundary>
  );
}
