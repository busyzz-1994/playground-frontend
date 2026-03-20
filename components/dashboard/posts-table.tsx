"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { usePosts, useDeletePost } from "@/hooks/use-posts"
import { useMe } from "@/hooks/use-auth"

const PAGE_SIZE = 10

export function PostsTable() {
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const { data, isLoading, isError, error } = usePosts(page, PAGE_SIZE)
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost()
  const { data: currentUser } = useMe()

  // The JWT payload returns { userId: number, email: string }
  const currentUserId = (currentUser as unknown as { userId: number })?.userId

  function handleConfirmDelete() {
    if (deleteId === null) return
    deletePost(deleteId, {
      onSuccess: () => {
        toast.success("文章已删除")
        setDeleteId(null)
      },
      onError: (err) => {
        toast.error(err.message ?? "删除失败，请重试")
        setDeleteId(null)
      },
    })
  }

  return (
    <>
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              此操作不可撤销，文章删除后将无法恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "删除中..." : "确认删除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>文章列表</CardTitle>
          <Button asChild size="sm">
            <Link href="/posts/new">写文章</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>标题</TableHead>
                <TableHead>作者</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>发布时间</TableHead>
                <TableHead className="w-28 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-muted-foreground py-10 text-center text-sm"
                  >
                    加载中...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-destructive py-10 text-center text-sm"
                  >
                    {error?.message}
                  </TableCell>
                </TableRow>
              ) : data?.posts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-muted-foreground py-10 text-center text-sm"
                  >
                    暂无文章
                  </TableCell>
                </TableRow>
              ) : (
                data?.posts.map((post) => {
                  const isOwner = currentUserId === post.userId
                  return (
                    <TableRow key={post.id}>
                      <TableCell className="text-muted-foreground">
                        {post.id}
                      </TableCell>
                      <TableCell className="max-w-xs truncate font-medium">
                        {post.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {post.user.userName}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            post.published
                              ? "text-xs font-medium text-green-600"
                              : "text-muted-foreground text-xs font-medium"
                          }
                        >
                          {post.published ? "已发布" : "草稿"}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(post.createdAt), "yyyy-MM-dd HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        {isOwner && (
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              className="h-8 w-8"
                            >
                              <Link href={`/posts/${post.id}/edit`}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive h-8 w-8"
                              disabled={isDeleting}
                              onClick={() => setDeleteId(post.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>

          {/* 分页 */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-muted-foreground text-sm">
                第 {data.page} / {data.totalPages} 页，共 {data.total} 条
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || isLoading}
                  onClick={() => setPage((p) => p - 1)}
                >
                  上一页
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= data.totalPages || isLoading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  下一页
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
