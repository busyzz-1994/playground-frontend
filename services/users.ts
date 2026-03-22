export interface User {
  id: number
  userName: string
  email: string
  avatarUrl: string | null
  createdAt: string
}

export interface UsersResponse {
  users: User[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export async function getUsers(
  page: number,
  pageSize: number
): Promise<UsersResponse> {
  const res = await fetch(`/api/users?page=${page}&pageSize=${pageSize}`)
  const json = await res.json()
  if (json.code !== 200) {
    throw new Error(json.message ?? "请求失败")
  }
  return json.data as UsersResponse
}

export async function getMe(): Promise<User> {
  const res = await fetch("/api/users/me")
  const json = await res.json()
  if (json.code !== 200) {
    throw new Error(json.message ?? "请求失败")
  }
  return json.data as User
}

export async function getAvatarPresignedUrl(
  filename: string,
  contentType: string
): Promise<{ presignedUrl: string; publicUrl: string }> {
  const res = await fetch("/api/users/me/avatar/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename, contentType }),
  })
  const json = await res.json()
  if (json.code !== 200) {
    throw new Error(json.message ?? "获取上传地址失败")
  }
  return json.data as { presignedUrl: string; publicUrl: string }
}

export async function updateMe(data: { avatarUrl: string }): Promise<User> {
  const res = await fetch("/api/users/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (json.code !== 200) {
    throw new Error(json.message ?? "更新失败")
  }
  return json.data as User
}
