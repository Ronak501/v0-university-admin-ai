// Document management API

import { NextResponse, type NextRequest } from "next/server"
import { documentManager } from "@/lib/document-manager"
import { verifyAuth } from "@/lib/middleware/auth"
import { query } from "@/lib/db"
import type { APIResponse } from "@/lib/types"

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth()
    const userId = auth.userId as string

    const formData = await req.formData()
    const file = formData.get("file") as File
    const requestId = formData.get("requestId") as string
    const documentType = formData.get("documentType") as string

    if (!file) {
      return NextResponse.json<APIResponse<null>>(
        {
          status: "error",
          message: "No file provided",
          timestamp: new Date(),
          requestId: crypto.randomUUID(),
        },
        { status: 400 },
      )
    }

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer())

    // Store encrypted document
    const documentId = await documentManager.storeDocument({
      userId,
      requestId,
      fileName: file.name,
      fileBuffer,
      documentType,
      fileType: file.type,
    })

    // Log access
    await documentManager.logAccess({
      documentId,
      userId,
      action: "UPLOAD",
    })

    return NextResponse.json<APIResponse<any>>(
      {
        status: "success",
        data: { documentId, fileName: file.name },
        message: "Document encrypted and stored",
        timestamp: new Date(),
        requestId: documentId,
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

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAuth()
    const userId = auth.userId as string

    const { searchParams } = new URL(req.url)
    const documentId = searchParams.get("id")

    if (!documentId) {
      return NextResponse.json<APIResponse<null>>(
        {
          status: "error",
          message: "Document ID required",
          timestamp: new Date(),
          requestId: crypto.randomUUID(),
        },
        { status: 400 },
      )
    }

    // Check access permissions
    const result = await query("SELECT * FROM documents WHERE id = $1 AND user_id = $2", [documentId, userId])

    if (result.rows.length === 0) {
      return NextResponse.json<APIResponse<null>>(
        {
          status: "error",
          message: "Document not found or access denied",
          timestamp: new Date(),
          requestId: crypto.randomUUID(),
        },
        { status: 403 },
      )
    }

    // Log access
    await documentManager.logAccess({
      documentId,
      userId,
      action: "DOWNLOAD",
    })

    const document = result.rows[0]

    return NextResponse.json<APIResponse<any>>(
      {
        status: "success",
        data: { ...document },
        message: "Document retrieved (access logged)",
        timestamp: new Date(),
        requestId: documentId,
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
