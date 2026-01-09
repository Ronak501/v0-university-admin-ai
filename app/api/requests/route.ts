// Student request management API

import { type NextRequest, NextResponse } from "next/server"
import { createRequest, logAuditEvent } from "@/lib/db"
import { verifyAuth } from "@/lib/middleware/auth"
import type { APIResponse, IntakeRequest } from "@/lib/types"

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth()
    const userId = auth.userId as string

    const body = (await req.json()) as IntakeRequest

    // Validate input
    if (!body.requestType || !body.title || !body.description) {
      return NextResponse.json<APIResponse<null>>(
        {
          status: "error",
          message: "Missing required fields",
          timestamp: new Date(),
          requestId: crypto.randomUUID(),
        },
        { status: 400 },
      )
    }

    // Create request
    const request = await createRequest({
      userId,
      requestType: body.requestType,
      title: body.title,
      description: body.description,
      priority: body.priority,
    })

    // Log audit event
    await logAuditEvent({
      userId,
      action: "CREATE_REQUEST",
      resourceType: "request",
      resourceId: request.id,
      changes: body,
      status: "success",
    })

    return NextResponse.json<APIResponse<any>>(
      {
        status: "success",
        data: request,
        message: "Request created successfully",
        timestamp: new Date(),
        requestId: request.id,
      },
      { status: 201 },
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
