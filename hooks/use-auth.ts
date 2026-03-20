import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getMe, login, logout, register } from "@/services/auth"
import type { LoginPayload, RegisterPayload } from "@/services/auth"
import { useRouter } from "next/navigation"

export const authKeys = {
  me: ["auth", "me"] as const,
}

export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: getMe,
    retry: false,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me })
      router.push("/dashboard")
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.me })
      router.push("/auth")
    },
  })
}
