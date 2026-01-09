// TypeScript types for University Admin AI Platform

export type UserRole = "student" | "admin" | "staff"
export type UserStatus = "active" | "inactive" | "suspended"

export type RequestType =
  | "fee_issue"
  | "course_registration"
  | "document_request"
  | "exam_scheduling"
  | "student_grievance"
  | "general_inquiry"

export type RequestStatus = "pending" | "in_progress" | "resolved" | "escalated" | "closed"

export type Priority = "low" | "medium" | "high" | "urgent"

export type AgentActionStatus = "pending" | "executing" | "success" | "failed"

export type DocumentType = "fee_receipt" | "certificate" | "transcript" | "enrollment_letter" | "id_proof" | "other"

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  studentId?: string
  department?: string
  status: UserStatus
  createdAt: Date
  updatedAt: Date
}

export interface Request {
  id: string
  userId: string
  requestType: RequestType
  title: string
  description: string
  status: RequestStatus
  priority: Priority
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
}

export interface AgentAction {
  id: string
  requestId: string
  agentType: string
  action: string
  status: AgentActionStatus
  inputData?: Record<string, any>
  outputData?: Record<string, any>
  errorMessage?: string
  executionTimeMs?: number
  createdAt: Date
}

export interface Document {
  id: string
  requestId?: string
  userId: string
  fileName: string
  fileType: string
  fileSize: number
  documentType: DocumentType
  encryptedFilePath: string
  status: "active" | "deleted" | "archived"
  createdAt: Date
  deletedAt?: Date
}

export interface AuditLog {
  id: string
  userId?: string
  action: string
  resourceType?: string
  resourceId?: string
  changes?: Record<string, any>
  ipAddress?: string
  status: "success" | "failed" | "denied"
  errorDetails?: string
  createdAt: Date
}

export interface APIResponse<T> {
  status: "success" | "error"
  data?: T
  message: string
  timestamp: Date
  requestId: string
}

export interface IntakeRequest {
  userId: string
  requestType: RequestType
  title: string
  description: string
  priority?: Priority
}

export interface PlannerOutput {
  requestId: string
  steps: AgentStep[]
  requiresHumanApproval: boolean
  estimatedResolutionTime: number
}

export interface AgentStep {
  sequence: number
  agentType: string
  action: string
  params: Record<string, any>
  retryPolicy: {
    maxRetries: number
    backoffMs: number
  }
}

export interface PolicyValidationResult {
  compliant: boolean
  violations: string[]
  warnings: string[]
}
