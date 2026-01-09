"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Clock, TrendingUp, FileText, Filter } from "lucide-react"
import CaseManagementTable from "@/components/admin-dashboard/case-management-table"
import EscalationPanel from "@/components/admin-dashboard/escalation-panel"
import Analytics from "@/components/admin-dashboard/analytics"

export default function AdminDashboard() {
  const [view, setView] = useState<"overview" | "cases" | "escalations" | "analytics">("overview")

  // Mock data
  const stats = {
    totalRequests: 127,
    resolved: 94,
    pending: 18,
    escalated: 15,
    averageResolutionTime: "2.3 hrs",
  }

  const recentCases = [
    {
      id: "REQ001",
      studentId: "STU2023CS101",
      title: "Missing Fee Receipt",
      type: "fee_issue",
      status: "resolved",
      priority: "high",
      assignedTo: "Admin User",
      createdAt: "2026-01-07",
      resolvedAt: "2026-01-08",
    },
    {
      id: "REQ002",
      studentId: "STU2023EC205",
      title: "Course Registration Issue",
      type: "course_registration",
      status: "in_progress",
      priority: "medium",
      assignedTo: "Admin User",
      createdAt: "2026-01-06",
      resolvedAt: null,
    },
    {
      id: "REQ003",
      studentId: "STU2023ME150",
      title: "Transcript Requested",
      type: "document_request",
      status: "pending",
      priority: "low",
      assignedTo: null,
      createdAt: "2026-01-08",
      resolvedAt: null,
    },
    {
      id: "REQ004",
      studentId: "STU2023CS456",
      title: "Exam Schedule Conflict",
      type: "exam_scheduling",
      status: "escalated",
      priority: "urgent",
      assignedTo: "Admin User",
      createdAt: "2026-01-05",
      resolvedAt: null,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-2">Manage cases, monitor agents, review escalations</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Logged in as</p>
              <p className="text-lg font-semibold">Admin User</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            {[
              { key: "overview", label: "Overview" },
              { key: "cases", label: "Case Management" },
              { key: "escalations", label: "Escalations" },
              { key: "analytics", label: "Analytics" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setView(tab.key as any)}
                className={`px-4 py-3 border-b-2 font-medium transition-colors ${
                  view === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview Tab */}
        {view === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-5 gap-4">
              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Requests</p>
                      <p className="text-3xl font-bold mt-2">{stats.totalRequests}</p>
                    </div>
                    <FileText className="w-10 h-10 text-primary opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Resolved</p>
                      <p className="text-3xl font-bold mt-2">{stats.resolved}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {Math.round((stats.resolved / stats.totalRequests) * 100)}%
                      </p>
                    </div>
                    <CheckCircle2 className="w-10 h-10 text-accent opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-3xl font-bold mt-2">{stats.pending}</p>
                      <p className="text-xs text-muted-foreground mt-2">Awaiting assignment</p>
                    </div>
                    <Clock className="w-10 h-10 text-yellow-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Escalated</p>
                      <p className="text-3xl font-bold mt-2">{stats.escalated}</p>
                      <p className="text-xs text-muted-foreground mt-2">Need review</p>
                    </div>
                    <AlertCircle className="w-10 h-10 text-destructive opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Resolution</p>
                      <p className="text-3xl font-bold mt-2">{stats.averageResolutionTime}</p>
                      <p className="text-xs text-muted-foreground mt-2">Time to resolve</p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-primary opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Cases */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Cases</h2>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>
              <CaseManagementTable cases={recentCases} />
            </div>
          </div>
        )}

        {/* Case Management Tab */}
        {view === "cases" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Cases</h2>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Filter className="w-4 h-4" />
                Advanced Filter
              </Button>
            </div>
            <CaseManagementTable cases={recentCases} />
          </div>
        )}

        {/* Escalations Tab */}
        {view === "escalations" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Escalated Cases</h2>
            <EscalationPanel
              escalations={recentCases.filter((c) => c.status === "escalated" || c.status === "pending")}
            />
          </div>
        )}

        {/* Analytics Tab */}
        {view === "analytics" && <Analytics />}
      </div>
    </div>
  )
}
