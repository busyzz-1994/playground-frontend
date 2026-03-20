import { PostsTable } from "@/components/dashboard/posts-table"

export default function PostsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">文章</h1>
        <p className="text-muted-foreground text-sm">
          浏览所有用户发布的文章，你自己的文章支持编辑和删除。
        </p>
      </div>
      <PostsTable />
    </div>
  )
}
