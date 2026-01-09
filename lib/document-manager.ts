// Secure document management with encryption and routing

import crypto from "crypto"
import { query } from "@/lib/db"

const ENCRYPTION_ALGORITHM = "aes-256-cbc"

export class DocumentManager {
  private encryptionKey: string

  constructor(key?: string) {
    this.encryptionKey = key || process.env.ENCRYPTION_KEY || "default-key-change-in-production"
  }

  /**
   * Encrypt file data
   */
  encryptFile(fileBuffer: Buffer, fileId: string): { encrypted: Buffer; iv: string } {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, crypto.scryptSync(this.encryptionKey, "salt", 32), iv)

    let encrypted = cipher.update(fileBuffer)
    encrypted = Buffer.concat([encrypted, cipher.final()])

    return {
      encrypted,
      iv: iv.toString("hex"),
    }
  }

  /**
   * Decrypt file data
   */
  decryptFile(encryptedBuffer: Buffer, iv: string): Buffer {
    const decipher = crypto.createDecipheriv(
      ENCRYPTION_ALGORITHM,
      crypto.scryptSync(this.encryptionKey, "salt", 32),
      Buffer.from(iv, "hex"),
    )

    let decrypted = decipher.update(encryptedBuffer)
    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted
  }

  /**
   * Store encrypted document
   */
  async storeDocument(data: {
    userId: string
    requestId?: string
    fileName: string
    fileBuffer: Buffer
    documentType: string
    fileType: string
  }): Promise<string> {
    const { encrypted, iv } = this.encryptFile(data.fileBuffer, data.fileName)
    const documentId = crypto.randomUUID()
    const filePath = `/encrypted/${documentId}/${data.fileName}`
    const encryptionKeyHash = crypto.createHash("sha256").update(iv).digest("hex")

    // Save to database
    await query(
      `INSERT INTO documents 
       (id, user_id, request_id, file_name, file_type, file_size, document_type, encrypted_file_path, encryption_key_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        documentId,
        data.userId,
        data.requestId,
        data.fileName,
        data.fileType,
        encrypted.length,
        data.documentType,
        filePath,
        encryptionKeyHash,
      ],
    )

    // In production, save encrypted file to secure storage (S3, Azure Blob, etc.)
    console.log(`[DocumentManager] Encrypted document stored: ${filePath}`)

    return documentId
  }

  /**
   * Generate fee receipt
   */
  async generateReceipt(data: {
    userId: string
    requestId: string
    amount: number
    date: string
    studentId: string
  }): Promise<string> {
    const receiptContent = `
UNIVERSITY FEE RECEIPT
========================

Receipt Date: ${new Date().toISOString().split("T")[0]}
Transaction Date: ${data.date}

Student ID: ${data.studentId}
Amount Paid: $${(data.amount / 100).toFixed(2)}

Status: PAID
Reference: ${data.requestId}

This is an official university document.
========================
    `

    return await this.storeDocument({
      userId: data.userId,
      requestId: data.requestId,
      fileName: `receipt_${data.requestId}.txt`,
      fileBuffer: Buffer.from(receiptContent),
      documentType: "fee_receipt",
      fileType: "text/plain",
    })
  }

  /**
   * Route document to recipient
   */
  async routeDocument(data: { documentId: string; recipientEmail: string; sendEmail?: boolean }): Promise<void> {
    // Log routing action
    await query("UPDATE documents SET status = $1 WHERE id = $2", ["active", data.documentId])

    if (data.sendEmail) {
      // Send via email (integrate with SendGrid, SMTP, etc.)
      console.log(`[DocumentManager] Document ${data.documentId} queued for email to ${data.recipientEmail}`)
    }
  }

  /**
   * Get document with decryption
   */
  async getDocument(documentId: string): Promise<Buffer | null> {
    const result = await query("SELECT * FROM documents WHERE id = $1 AND status = 'active'", [documentId])

    if (result.rows.length === 0) return null

    const doc = result.rows[0]

    // In production, fetch from secure storage
    // const encrypted = await s3.getObject(doc.encrypted_file_path);
    // return this.decryptFile(encrypted, doc.encryption_key_hash);

    console.log(`[DocumentManager] Retrieved document: ${documentId}`)
    return Buffer.from("Document content")
  }

  /**
   * Log document access for audit trail
   */
  async logAccess(data: { documentId: string; userId: string; action: string }): Promise<void> {
    await query(
      `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [data.userId, `DOCUMENT_${data.action}`, "document", data.documentId, "success"],
    )
  }
}

export const documentManager = new DocumentManager()
