// Authentication and JWT middleware

import { jwtVerify } from "jose"
import { cookies } from "next/headers"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export async function verifyAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    throw new Error("No authentication token found")
  }

  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload
  } catch (err) {
    throw new Error("Invalid or expired token")
  }
}

export async function createToken(userId: string, role: string) {
  const payload = {
    userId,
    role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  }

  return new (require("jose").SignJWT)(payload).setProtectedHeader({ alg: "HS256" }).sign(secret)
}
