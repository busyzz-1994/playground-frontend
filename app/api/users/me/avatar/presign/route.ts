import { randomUUID } from "crypto"
import { extname } from "path"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/lib/r2"

export async function POST(req: NextRequest) {
  // 1. 鉴权 — 直接从 cookie 验证 JWT，不走后端
  const token = req.cookies.get("token")?.value
  if (!token) {
    return NextResponse.json({ code: 401, message: "未登录" }, { status: 401 })
  }
  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.json(
      { code: 401, message: "token 无效" },
      { status: 401 }
    )
  }

  // 2. 校验参数
  const { filename, contentType } = (await req.json()) as {
    filename?: string
    contentType?: string
  }
  if (!filename || !contentType) {
    return NextResponse.json(
      { code: 400, message: "filename 和 contentType 不能为空" },
      { status: 400 }
    )
  }
  if (!contentType.startsWith("image/")) {
    return NextResponse.json(
      { code: 400, message: "只允许上传图片文件" },
      { status: 400 }
    )
  }

  // 3. 直接生成 R2 presigned URL，无需经过后端
  const ext = extname(filename) || ".jpg"
  const key = `avatars/${payload.userId}/${randomUUID()}${ext}`

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  })
  const presignedUrl = await getSignedUrl(r2, command, { expiresIn: 300 })
  const publicUrl = `${R2_PUBLIC_URL}/${key}`

  return NextResponse.json({
    code: 200,
    message: "ok",
    data: { presignedUrl, publicUrl },
  })
}
