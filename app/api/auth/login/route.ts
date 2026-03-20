import { NextResponse } from "next/server"
import { backendFetch } from "@/lib/api"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const backendRes = await backendFetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await backendRes.json()
    const response = NextResponse.json(data, { status: backendRes.status })

    // 转发后端设置的 HttpOnly token cookie
    const setCookie = backendRes.headers.get("set-cookie")
    if (setCookie) {
      response.headers.set("set-cookie", setCookie)
    }

    return response
  } catch {
    return NextResponse.json({ message: "服务器错误" }, { status: 500 })
  }
}
