import { backendFetch } from "@/lib/api"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const res = await backendFetch("/api/users/me")
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const res = await backendFetch("/api/users/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
