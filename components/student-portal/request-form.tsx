"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, AlertCircle } from "lucide-react"

interface RequestFormProps {
  onSubmit?: (data: any) => void
}

const REQUEST_TYPES = [
  { value: "fee_issue", label: "Fee Issue", description: "Payment, receipt, refund" },
  { value: "course_registration", label: "Course Registration", description: "Add/drop courses" },
  { value: "document_request", label: "Document Request", description: "Certificate, transcript" },
  { value: "exam_scheduling", label: "Exam Scheduling", description: "Exam date/time" },
  { value: "student_grievance", label: "Student Grievance", description: "Formal complaint" },
  { value: "general_inquiry", label: "General Inquiry", description: "Other questions" },
]

export default function RequestForm({ onSubmit }: RequestFormProps) {
  const [selectedType, setSelectedType] = useState<string>("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: selectedType,
          title,
          description,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        onSubmit?.(data.data)
        setSelectedType("")
        setTitle("")
        setDescription("")
      }
    } catch (error) {
      console.error("Error submitting request:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Create a New Request</CardTitle>
        <CardDescription>Describe your issue and our AI will help resolve it</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Request Type Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">What do you need help with?</label>
            <div className="grid sm:grid-cols-2 gap-3">
              {REQUEST_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setSelectedType(type.value)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedType === type.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <p className="font-medium">{type.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium mb-2 block">Brief Summary</label>
            <Input
              placeholder="e.g., Missing fee receipt for semester 5"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-2 block">Details</label>
            <Textarea
              placeholder="Provide more details about your issue. The more specific you are, the faster we can resolve it."
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Info Box */}
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-accent">Your request is secure</p>
              <p className="text-muted-foreground mt-1">
                All data is encrypted and handled per university policy. You'll receive updates in real-time.
              </p>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full gap-2"
            disabled={!selectedType || !title || !description || submitting}
          >
            <Send className="w-4 h-4" />
            {submitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
