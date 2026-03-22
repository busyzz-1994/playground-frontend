import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getAvatarPresignedUrl,
  getMe,
  getUsers,
  updateMe,
} from "@/services/users"

export const usersKeys = {
  list: (page: number, pageSize: number) =>
    ["users", "list", page, pageSize] as const,
  me: () => ["users", "me"] as const,
}

export function useUsers(page: number, pageSize: number) {
  return useQuery({
    queryKey: usersKeys.list(page, pageSize),
    queryFn: () => getUsers(page, pageSize),
  })
}

export function useMe() {
  return useQuery({
    queryKey: usersKeys.me(),
    queryFn: getMe,
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      // 1. 获取预签名 URL
      const { presignedUrl, publicUrl } = await getAvatarPresignedUrl(
        file.name,
        file.type
      )
      // 2. 浏览器直传 R2
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      })
      if (!uploadRes.ok) throw new Error("上传到 R2 失败")
      // 3. 保存 URL 到 DB
      return updateMe({ avatarUrl: publicUrl })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.me() })
    },
  })
}
