"use client"

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
import { useCreatePost } from "@/hooks/use-posts"
import { useRouter } from "next/navigation"

export default function NewPostPage() {
  const router = useRouter()
  const { mutate: createPost, isPending, error } = useCreatePost()

  const form = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { title: "", content: "", published: false },
  })

  function onSubmit(values: CreatePostInput) {
    createPost(values)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">写文章</h1>
        <p className="text-muted-foreground text-sm">填写标题和内容，发布你的文章。</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>新建文章</CardTitle>
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

            {error && <p className="text-destructive text-sm">{(error as Error).message}</p>}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? "提交中..." : "发布文章"}
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
