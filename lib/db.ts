// Database connection and queries

import { Pool } from "pg"

let pool: Pool

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }
  return pool
}

export async function query(text: string, params?: any[]) {
  const client = await getPool().connect()
  try {
    return await client.query(text, params)
  } finally {
    client.release()
  }
}

export async function getUser(userId: string) {
  const result = await query("SELECT * FROM users WHERE id = $1", [userId])
  return result.rows[0]
}

export async function getUserByEmail(email: string) {
  const result = await query("SELECT * FROM users WHERE email = $1", [email])
  return result.rows[0]
}

export async function createRequest(data: {
  userId: string
  requestType: string
  title: string
  description: string
  priority?: string
}) {
  const result = await query(
    `INSERT INTO requests (user_id, request_type, title, description, priority, status)
     VALUES ($1, $2, $3, $4, $5, 'pending')
     RETURNING *`,
    [data.userId, data.requestType, data.title, data.description, data.priority || "medium"],
  )
  return result.rows[0]
}

export async function logAuditEvent(data: {
  userId?: string
  action: string
  resourceType?: string
  resourceId?: string
  changes?: any
  ipAddress?: string
  status: string
  errorDetails?: string
}) {
  await query(
    `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, changes, ip_address, status, error_details)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      data.userId,
      data.action,
      data.resourceType,
      data.resourceId,
      JSON.stringify(data.changes || {}),
      data.ipAddress,
      data.status,
      data.errorDetails,
    ],
  )
}
