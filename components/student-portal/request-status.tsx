"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RequestStatusProps {
  request: {
    id: string
    type: string
    title: string
    status: string
    createdAt: string
    updatedAt: string
    summary: string
  }
}

const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
  "in-progress": { color: "bg-blue-100 text-blue-800", icon: Clock },
  resolved: { color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  escalated: { color: "bg-red-100 text-red-800", icon: AlertCircle },
  closed: { color: "bg-gray-100 text-gray-800", icon: CheckCircle2 },
}

export default function RequestStatus({ request }: RequestStatusProps) {
  const status = statusConfig[request.status as keyof typeof statusConfig] || statusConfig.pending
  const StatusIcon = status.icon

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg">{request.title}</h3>
              <Badge className={status.color}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {request.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{request.type}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-secondary/50 rounded-lg p-4">
          <p className="text-sm font-medium mb-1">Resolution Summary</p>
          <p className="text-sm text-muted-foreground">{request.summary}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Submitted</p>
            <p className="font-medium">{new Date(request.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Updated</p>
            <p className="font-medium">{new Date(request.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {request.status === "resolved" && (
          <Button variant="outline" className="w-full gap-2 bg-transparent" size="sm">
            <Download className="w-4 h-4" />
            Download Documents
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
