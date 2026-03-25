import { NextResponse } from "next/server"
import { backendFetch } from "@/lib/api"

export async function GET() {
  try {
    // 调用后端API验证用户，后端会检查数据库中用户是否存在
    const res = await backendFetch("/api/users/me")
    if (!res.ok) {
      const data = await res.json()
      return NextResponse.json(
        { message: data.message || "未登录或用户不存在" },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json({ user: data.data })
  } catch (error) {
    return NextResponse.json({ message: "服务器错误" }, { status: 500 })
  }
}
