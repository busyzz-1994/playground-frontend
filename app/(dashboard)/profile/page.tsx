"use client"

import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { useMe } from "@/hooks/use-auth"

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

  if (isLoading) return <ProfileSkeleton />

  if (isError || !user) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">个人资料</h1>
        <p className="text-muted-foreground text-sm">无法加载用户信息。</p>
      </div>
    )
  }

  const initials = (user.username ?? user.email).slice(0, 2).toUpperCase()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">个人资料</h1>
        <p className="text-muted-foreground text-sm">查看和管理你的账号信息。</p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.username}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-4 pt-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground text-xs">用户名</Label>
              <p className="text-sm font-medium">{user.username}</p>
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
