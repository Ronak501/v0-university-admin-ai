"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye, Edit } from "lucide-react"

interface Case {
  id: string
  studentId: string
  title: string
  type: string
  status: string
  priority: string
  assignedTo: string | null
  createdAt: string
  resolvedAt: string | null
}

interface CaseManagementTableProps {
  cases: Case[]
}

const statusColors = {
  resolved: "bg-green-100 text-green-800",
  in_progress: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  escalated: "bg-red-100 text-red-800",
  closed: "bg-gray-100 text-gray-800",
}

const priorityColors = {
  low: "bg-blue-50 text-blue-700",
  medium: "bg-yellow-50 text-yellow-700",
  high: "bg-orange-50 text-orange-700",
  urgent: "bg-red-50 text-red-700",
}

export default function CaseManagementTable({ cases }: CaseManagementTableProps) {
  return (
    <Card className="border-border/50">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-4 font-semibold text-muted-foreground">ID</th>
              <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Student</th>
              <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Title</th>
              <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Type</th>
              <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Status</th>
              <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Priority</th>
              <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Assigned To</th>
              <th className="text-right px-6 py-4 font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((caseItem) => (
              <tr key={caseItem.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-primary">{caseItem.id}</td>
                <td className="px-6 py-4">{caseItem.studentId}</td>
                <td className="px-6 py-4 font-medium">{caseItem.title}</td>
                <td className="px-6 py-4 text-muted-foreground capitalize">{caseItem.type.replace("_", " ")}</td>
                <td className="px-6 py-4">
                  <Badge className={statusColors[caseItem.status as keyof typeof statusColors]}>
                    {caseItem.status.replace("_", " ")}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge className={priorityColors[caseItem.priority as keyof typeof priorityColors]}>
                    {caseItem.priority}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{caseItem.assignedTo || "Unassigned"}</td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
