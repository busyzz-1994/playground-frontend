export interface User {
  id: string
  username: string
  email: string
  createdAt: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  userName: string
  email: string
  password: string
  confirm: string
}

export interface AuthResponse {
  user?: User
  message?: string
  errors?: { message: string }[]
}

export async function getMe(): Promise<User> {
  const res = await fetch("/api/auth/me")
  if (!res.ok) {
    throw new Error("未登录或登录已过期")
  }
  const data: AuthResponse = await res.json()
  return data.user!
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const data: AuthResponse = await res.json()
  if (!res.ok) {
    throw new Error(data.errors?.[0]?.message ?? data.message ?? "登录失败")
  }
  return data
}

export async function register(
  payload: RegisterPayload
): Promise<AuthResponse> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const data: AuthResponse = await res.json()
  if (!res.ok) {
    throw new Error(data.errors?.[0]?.message ?? data.message ?? "注册失败")
  }
  return data
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" })
}
