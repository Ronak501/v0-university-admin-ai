// Admin case management API

import { NextResponse, type NextRequest } from "next/server"
import { query } from "@/lib/db"
import { verifyAuth } from "@/lib/middleware/auth"
import { requireRole } from "@/lib/middleware/rbac"
import type { APIResponse } from "@/lib/types"

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAuth()
    const role = auth.role as string

    // Check authorization
    if (!requireRole(["admin", "staff"])(role)) {
      return NextResponse.json<APIResponse<null>>(
        {
          status: "error",
          message: "Unauthorized",
          timestamp: new Date(),
          requestId: crypto.randomUUID(),
        },
        { status: 403 },
      )
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Build query
    let sql = "SELECT * FROM requests WHERE 1=1"
    const params: any[] = []

    if (status) {
      sql += " AND status = $" + (params.length + 1)
      params.push(status)
    }
    if (priority) {
      sql += " AND priority = $" + (params.length + 1)
      params.push(priority)
    }

    sql += " ORDER BY created_at DESC LIMIT $" + (params.length + 1) + " OFFSET $" + (params.length + 2)
    params.push(limit, offset)

    const result = await query(sql, params)

    return NextResponse.json<APIResponse<any>>(
      {
        status: "success",
        data: {
          cases: result.rows,
          total: result.rows.length,
          limit,
          offset,
        },
        message: "Cases retrieved successfully",
        timestamp: new Date(),
        requestId: crypto.randomUUID(),
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json<APIResponse<null>>(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Internal server error",
        timestamp: new Date(),
        requestId: crypto.randomUUID(),
      },
      { status: 500 },
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await verifyAuth()
    const role = auth.role as string
    const userId = auth.userId as string

    // Check authorization
    if (!requireRole(["admin"])(role)) {
      return NextResponse.json<APIResponse<null>>(
        {
          status: "error",
          message: "Unauthorized",
          timestamp: new Date(),
          requestId: crypto.randomUUID(),
        },
        { status: 403 },
      )
    }

    const body = await req.json()
    const { caseId, status, assignedTo, notes } = body

    // Update case
    const result = await query(
      "UPDATE requests SET status = $1, assigned_to = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
      [status, assignedTo, caseId],
    )

    return NextResponse.json<APIResponse<any>>(
      {
        status: "success",
        data: result.rows[0],
        message: "Case updated successfully",
        timestamp: new Date(),
        requestId: crypto.randomUUID(),
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json<APIResponse<null>>(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Internal server error",
        timestamp: new Date(),
        requestId: crypto.randomUUID(),
      },
      { status: 500 },
    )
  }
}
