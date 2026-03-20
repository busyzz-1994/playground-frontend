"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/lib/schemas"
import { useLogin, useRegister } from "@/hooks/use-auth"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login")

  const loginForm = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })
  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const [registerSuccess, setRegisterSuccess] = useState("")

  const loginMutation = useLogin()
  const registerMutation = useRegister()

  async function handleLogin(values: LoginInput) {
    loginMutation.mutate(values)
  }

  async function handleRegister(values: RegisterInput) {
    setRegisterSuccess("")
    registerMutation.mutate(values, {
      onSuccess: () => {
        setRegisterSuccess("注册成功，请登录")
        registerForm.reset()
        setTimeout(() => setActiveTab("login"), 1000)
      },
    })
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">登录</TabsTrigger>
          <TabsTrigger value="register">注册</TabsTrigger>
        </TabsList>

        {/* 登录 */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>欢迎回来</CardTitle>
              <CardDescription>使用邮箱和密码登录您的账号</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="login-email">邮箱</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    {...loginForm.register("email")}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">密码</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="请输入密码"
                    {...loginForm.register("password")}
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                {loginMutation.isError && (
                  <p className="text-sm text-destructive">{loginMutation.error?.message}</p>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "登录中..." : "登录"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 注册 */}
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>创建账号</CardTitle>
              <CardDescription>填写以下信息完成注册</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={registerForm.handleSubmit(handleRegister)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="register-username">用户名</Label>
                  <Input
                    id="register-username"
                    placeholder="请输入用户名"
                    {...registerForm.register("userName")}
                  />
                  {registerForm.formState.errors.userName && (
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.userName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">邮箱</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    {...registerForm.register("email")}
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">密码</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="至少 6 位"
                    {...registerForm.register("password")}
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm">确认密码</Label>
                  <Input
                    id="register-confirm"
                    type="password"
                    placeholder="再次输入密码"
                    {...registerForm.register("confirm")}
                  />
                  {registerForm.formState.errors.confirm && (
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.confirm.message}
                    </p>
                  )}
                </div>
                {registerMutation.isError && (
                  <p className="text-sm text-destructive">{registerMutation.error?.message}</p>
                )}
                {registerSuccess && (
                  <p className="text-sm text-green-600">{registerSuccess}</p>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "注册中..." : "注册"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
