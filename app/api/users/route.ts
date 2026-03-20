import { NextResponse } from "next/server"
import { backendFetch } from "@/lib/api"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get("page") || "1"
  const pageSize = searchParams.get("pageSize") || "10"

  try {
    const backendRes = await backendFetch(
      `/api/users?page=${page}&pageSize=${pageSize}`
    )
    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch {
    return NextResponse.json({ message: "服务器错误" }, { status: 500 })
  }
}
