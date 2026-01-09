"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle } from "lucide-react"

interface Escalation {
  id: string
  studentId: string
  title: string
  type: string
  status: string
  priority: string
  createdAt: string
}

interface EscalationPanelProps {
  escalations: Escalation[]
}

export default function EscalationPanel({ escalations }: EscalationPanelProps) {
  return (
    <div className="space-y-4">
      {escalations.length === 0 ? (
        <Card className="border-border/50 text-center py-12">
          <p className="text-muted-foreground">No escalated cases</p>
        </Card>
      ) : (
        escalations.map((escalation) => (
          <Card key={escalation.id} className="border-red-200/50 bg-red-50/30">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <CardTitle className="text-base">{escalation.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-muted-foreground">{escalation.studentId}</span>
                      <Badge className="bg-red-100 text-red-800">{escalation.priority}</Badge>
                    </div>
                  </div>
                </div>
                <Button size="sm" className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Review
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Type: <span className="font-medium">{escalation.type.replace("_", " ")}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Submitted: <span className="font-medium">{escalation.createdAt}</span>
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
