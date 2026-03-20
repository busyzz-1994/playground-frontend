import { NextResponse } from "next/server"
import { backendFetch } from "@/lib/api"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // 去掉前端校验用的 confirm 字段，后端不需要
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirm: _, ...payload } = body as Record<string, unknown>
    const backendRes = await backendFetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch {
    return NextResponse.json({ message: "服务器错误" }, { status: 500 })
  }
}
