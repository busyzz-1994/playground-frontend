"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createPostSchema, type CreatePostInput } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { usePost, useUpdatePost } from "@/hooks/use-posts"

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const postId = Number(params.id)

  const { data: post, isLoading, isError } = usePost(postId)
  const { mutate: updatePost, isPending, error } = useUpdatePost(postId)

  const form = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { title: "", content: "", published: false },
  })

  // Pre-fill form once post data is loaded
  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        content: post.content ?? "",
        published: post.published,
      })
    }
  }, [post, form])

  function onSubmit(values: CreatePostInput) {
    updatePost(values)
  }

  if (isLoading) {
    return (
      <div className="text-muted-foreground py-20 text-center text-sm">
        加载中...
      </div>
    )
  }

  if (isError || !post) {
    return (
      <div className="text-destructive py-20 text-center text-sm">
        文章不存在或加载失败
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">编辑文章</h1>
        <p className="text-muted-foreground text-sm">修改文章内容并保存。</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>编辑文章</CardTitle>
          <CardDescription>带 * 为必填项</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* 标题 */}
            <div className="space-y-2">
              <Label htmlFor="title">标题 *</Label>
              <Input
                id="title"
                placeholder="请输入文章标题"
                {...form.register("title")}
              />
              {form.formState.errors.title && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            {/* 正文 */}
            <div className="space-y-2">
              <Label htmlFor="content">正文</Label>
              <Textarea
                id="content"
                placeholder="请输入文章正文（选填）"
                className="min-h-40 resize-y"
                {...form.register("content")}
              />
            </div>

            {/* 是否发布 */}
            <div className="flex items-center gap-2">
              <input
                id="published"
                type="checkbox"
                className="h-4 w-4 rounded border"
                {...form.register("published")}
              />
              <Label htmlFor="published" className="cursor-pointer font-normal">
                立即发布
              </Label>
            </div>

            {error && (
              <p className="text-destructive text-sm">
                {(error as Error).message}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? "保存中..." : "保存更改"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                取消
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
