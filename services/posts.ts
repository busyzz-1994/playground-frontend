export interface CreatePostPayload {
  title: string
  content?: string
  published?: boolean
}

export interface UpdatePostPayload {
  title?: string
  content?: string
  published?: boolean
}

export interface Post {
  id: number
  title: string
  content?: string
  published: boolean
  createdAt: string
  updatedAt?: string
}

export interface PostWithUser extends Post {
  updatedAt: string
  userId: number
  user: { id: number; userName: string }
}

export interface PostsResponse {
  posts: PostWithUser[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export async function getPosts(
  page: number,
  pageSize: number
): Promise<PostsResponse> {
  const res = await fetch(`/api/posts?page=${page}&pageSize=${pageSize}`)
  const json = await res.json()
  if (json.code !== 200) {
    throw new Error(json.message ?? "请求失败")
  }
  return json.data as PostsResponse
}

export async function getPostById(id: number): Promise<PostWithUser> {
  const res = await fetch(`/api/posts/${id}`)
  const json = await res.json()
  if (json.code !== 200) {
    throw new Error(json.message ?? "请求失败")
  }
  return json.data as PostWithUser
}

export async function createPost(payload: CreatePostPayload): Promise<Post> {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(json.errors?.[0]?.message ?? json.message ?? "发布失败")
  }
  return json.data as Post
}

export async function updatePost(
  id: number,
  payload: UpdatePostPayload
): Promise<Post> {
  const res = await fetch(`/api/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(json.errors?.[0]?.message ?? json.message ?? "更新失败")
  }
  return json.data as Post
}

export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`/api/posts/${id}`, { method: "DELETE" })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(json.message ?? "删除失败")
  }
}
