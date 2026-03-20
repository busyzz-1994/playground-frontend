import { useQuery } from "@tanstack/react-query"
import { getUsers } from "@/services/users"

export const usersKeys = {
  list: (page: number, pageSize: number) =>
    ["users", "list", page, pageSize] as const,
}

export function useUsers(page: number, pageSize: number) {
  return useQuery({
    queryKey: usersKeys.list(page, pageSize),
    queryFn: () => getUsers(page, pageSize),
  })
}
