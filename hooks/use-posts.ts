import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "@/services/posts"
import type { CreatePostPayload, UpdatePostPayload } from "@/services/posts"
import { useRouter } from "next/navigation"

export const postsKeys = {
  list: (page: number, pageSize: number) =>
    ["posts", "list", page, pageSize] as const,
  detail: (id: number) => ["posts", "detail", id] as const,
}

export function usePosts(page: number, pageSize: number) {
  return useQuery({
    queryKey: postsKeys.list(page, pageSize),
    queryFn: () => getPosts(page, pageSize),
  })
}

export function usePost(id: number) {
  return useQuery({
    queryKey: postsKeys.detail(id),
    queryFn: () => getPostById(id),
    enabled: !!id,
  })
}

export function useCreatePost() {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "list"] })
      router.push("/posts")
    },
  })
}

export function useUpdatePost(id: number) {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdatePostPayload) => updatePost(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "list"] })
      queryClient.invalidateQueries({ queryKey: postsKeys.detail(id) })
      router.push("/posts")
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "list"] })
    },
  })
}
