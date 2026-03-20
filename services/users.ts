export interface User {
  id: number
  userName: string
  email: string
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
