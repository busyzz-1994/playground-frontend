import { NextResponse } from "next/server"
import { backendFetch } from "@/lib/api"

export async function POST() {
  try {
    const backendRes = await backendFetch("/api/users/logout", {
      method: "POST",
    })

    const data = await backendRes.json()
    const response = NextResponse.json(data, { status: backendRes.status })

    // 转发后端的 Set-Cookie（清除 token）
    const setCookie = backendRes.headers.get("set-cookie")
    if (setCookie) {
      response.headers.set("set-cookie", setCookie)
    } else {
      response.cookies.delete("token")
    }

    return response
  } catch {
    return NextResponse.json({ message: "服务器错误" }, { status: 500 })
  }
}
