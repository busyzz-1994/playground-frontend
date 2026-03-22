import { cookies } from "next/headers"

const BACKEND_URL = process.env.BACKEND_URL

export async function backendFetch(path: string, init?: RequestInit) {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ")

  return fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  })
}
