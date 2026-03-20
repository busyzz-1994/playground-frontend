import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET || "540548050"

// 需要保护的路由前缀
const protectedPaths = ["/dashboard", "/profile", "/settings", "/posts"]

// 访问这些路由时若已登录则跳转到首页
const authPaths = ["/auth"]

async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value
  const payload = token ? await verifyToken(token) : null
  // 根路径直接跳转到 dashboard
  if (pathname === "/" && payload) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // 已登录用户访问登录/注册页 → 跳转首页
  if (authPaths.some((p) => pathname.startsWith(p)) && payload) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // 未登录访问受保护路由 → 跳转登录页
  if (protectedPaths.some((p) => pathname.startsWith(p)) && !payload) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
