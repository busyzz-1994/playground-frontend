import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "540548050"

export interface JwtPayload {
  userId: number
  email: string
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}
