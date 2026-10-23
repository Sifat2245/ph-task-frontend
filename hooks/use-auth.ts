"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  authService,
  type SignInPayload,
  type SignUpPayload,
} from "@/services/auth.service";
import { keys } from "@/lib/query-keys";

export function useMe() {
  return useQuery({
    queryKey: keys.me,
    queryFn: authService.me,
    retry: false,
    staleTime: 60_000,
  });
}

export function useAuthenticate(mode: "signin" | "signup") {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: SignInPayload | SignUpPayload) =>
      mode === "signin"
        ? authService.signIn(body as SignInPayload)
        : authService.signUp(body as SignUpPayload),
    onSuccess: (result) => {
      client.clear();
      // Never cache access, refresh, or session tokens in browser query state.
      client.setQueryData(keys.me, result.data.user);
    },
  });
}

export function useLogout() {
  const client = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      client.clear();
      router.replace("/signin");
      router.refresh();
    },
  });
}
