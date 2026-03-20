import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("邮箱格式不正确"),
  password: z.string().min(1, "请输入密码"),
})

export const registerSchema = z
  .object({
    userName: z
      .string()
      .min(2, "用户名至少 2 个字符")
      .max(20, "用户名最多 20 个字符"),
    email: z.string().email("邮箱格式不正确"),
    password: z.string().min(6, "密码至少 6 位").max(50, "密码最多 50 个字符"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "两次输入的密码不一致",
    path: ["confirm"],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

export const createPostSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(100, "标题最多 100 个字符"),
  content: z.string().optional(),
  published: z.boolean().optional().default(false),
})

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(1, "标题不能为空")
    .max(100, "标题最多 100 个字符")
    .optional(),
  content: z.string().optional(),
  published: z.boolean().optional(),
})

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
