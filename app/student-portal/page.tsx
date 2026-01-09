"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Clock, Plus } from "lucide-react"
import RequestForm from "@/components/student-portal/request-form"
import RequestStatus from "@/components/student-portal/request-status"

export default function StudentPortal() {
  const [activeTab, setActiveTab] = useState<"new" | "requests">("new")
  const [requests, setRequests] = useState<any[]>([
    {
      id: "1",
      type: "Fee Issue",
      title: "Missing Fee Receipt for Semester 5",
      status: "resolved",
      createdAt: "2026-01-05",
      updatedAt: "2026-01-07",
      summary: "AI found the payment record in ERP and generated your receipt.",
    },
  ])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Student Portal</h1>
              <p className="text-muted-foreground mt-2">Resolve issues with AI assistance</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Student ID</p>
              <p className="text-lg font-semibold">STU2023CS101</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                  <p className="text-3xl font-bold mt-2">1</p>
                </div>
                <Plus className="w-10 h-10 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-3xl font-bold mt-2">1</p>
                </div>
                <CheckCircle2 className="w-10 h-10 text-accent opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold mt-2">0</p>
                </div>
                <Clock className="w-10 h-10 text-destructive opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("new")}
            className={`px-4 py-3 border-b-2 font-medium transition-colors ${
              activeTab === "new"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            New Request
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-3 border-b-2 font-medium transition-colors ${
              activeTab === "requests"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            My Requests
          </button>
        </div>

        {/* Content */}
        {activeTab === "new" && (
          <RequestForm
            onSubmit={(data) => {
              setRequests([...requests, data])
              setActiveTab("requests")
            }}
          />
        )}

        {activeTab === "requests" && (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <Card className="border-border/50 text-center py-12">
                <p className="text-muted-foreground">No requests yet. Create one to get started.</p>
              </Card>
            ) : (
              requests.map((request) => <RequestStatus key={request.id} request={request} />)
            )}
          </div>
        )}
      </div>
    </div>
  )
}
