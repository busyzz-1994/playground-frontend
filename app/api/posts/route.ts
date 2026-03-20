import { NextResponse } from "next/server"
import { backendFetch } from "@/lib/api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page") ?? "1"
    const pageSize = searchParams.get("pageSize") ?? "10"
    const backendRes = await backendFetch(
      `/api/posts?page=${page}&pageSize=${pageSize}`
    )
    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch {
    return NextResponse.json({ message: "服务器错误" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log(body, "request body") // 添加日志输出请求体内容
    const backendRes = await backendFetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    console.log(backendRes, "backendRes") // 添加日志输出 backendRes 对象
    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch {
    return NextResponse.json({ message: "服务器错误" }, { status: 500 })
  }
}
