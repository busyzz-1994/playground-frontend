"use client"

import { useRef, useState } from "react"
import { format } from "date-fns"
import { Loader2, Pencil, Upload, X } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useMe, useUploadAvatar } from "@/hooks/use-users"

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">个人资料</h1>
        <p className="text-muted-foreground text-sm">查看和管理你的账号信息。</p>
      </div>
      <Card className="max-w-lg animate-pulse">
        <CardContent className="p-6">
          <div className="h-32 rounded bg-muted" />
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProfilePage() {
  const { data: user, isLoading, isError } = useMe()
  const { mutate: uploadAvatar, isPending } = useUploadAvatar()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  if (isLoading) return <ProfileSkeleton />

  if (isError || !user) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">个人资料</h1>
        <p className="text-muted-foreground text-sm">无法加载用户信息。</p>
      </div>
    )
  }

  const initials = (user.userName ?? user.email).slice(0, 2).toUpperCase()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("请选择图片文件")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("图片大小不能超过 5MB")
      return
    }
    setPendingFile(file)
    setPreview(URL.createObjectURL(file))
    // 清空 input，允许重复选同一文件
    e.target.value = ""
  }

  function handleCancel() {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setPendingFile(null)
  }

  function handleUpload() {
    if (!pendingFile) return
    uploadAvatar(pendingFile, {
      onSuccess: () => {
        toast.success("头像更新成功")
        handleCancel()
      },
      onError: (err) => {
        toast.error(err.message ?? "上传失败，请重试")
      },
    })
  }

  const displayAvatar = preview ?? user.avatarUrl

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">个人资料</h1>
        <p className="text-muted-foreground text-sm">查看和管理你的账号信息。</p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            {/* 头像区域 */}
            <div className="relative">
              <Avatar className="h-16 w-16">
                {displayAvatar && (
                  <AvatarImage src={displayAvatar} alt={user.userName} />
                )}
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              {/* 编辑按钮 */}
              {!preview && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending}
                  className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              )}
              {/* 上传中遮罩 */}
              {isPending && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex flex-col gap-1">
              <CardTitle>{user.userName}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              {/* 预览操作按钮 */}
              {preview && (
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleUpload}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    ) : (
                      <Upload className="mr-1 h-3 w-3" />
                    )}
                    上传
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isPending}
                  >
                    <X className="mr-1 h-3 w-3" />
                    取消
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-4 pt-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground text-xs">用户名</Label>
              <p className="text-sm font-medium">{user.userName}</p>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground text-xs">邮箱</Label>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground text-xs">用户 ID</Label>
              <p className="text-muted-foreground text-sm">{user.id}</p>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground text-xs">注册时间</Label>
              <p className="text-sm">
                {user.createdAt
                  ? format(new Date(user.createdAt), "yyyy-MM-dd HH:mm:ss")
                  : "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
