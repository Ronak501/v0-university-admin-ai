// Role-Based Access Control middleware

import type { UserRole } from "@/lib/types"

export const permissions: Record<UserRole, string[]> = {
  student: ["view:own-requests", "create:request", "view:own-documents", "upload:document", "view:own-status"],
  staff: ["view:all-requests", "update:request", "view:all-documents", "download:document", "view:analytics"],
  admin: [
    "view:all-requests",
    "update:request",
    "delete:request",
    "view:all-documents",
    "delete:document",
    "view:audit-logs",
    "manage:users",
    "manage:policies",
    "view:analytics",
    "export:data",
  ],
}

export function hasPermission(role: UserRole, permission: string): boolean {
  return permissions[role]?.includes(permission) || false
}

export function requireRole(allowedRoles: UserRole[]) {
  return (role: UserRole) => allowedRoles.includes(role)
}
