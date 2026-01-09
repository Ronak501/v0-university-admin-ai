"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const requestsTrend = [
  { date: "Jan 1", requests: 12, resolved: 8, pending: 4 },
  { date: "Jan 2", requests: 18, resolved: 14, pending: 4 },
  { date: "Jan 3", requests: 15, resolved: 11, pending: 4 },
  { date: "Jan 4", requests: 22, resolved: 18, pending: 4 },
  { date: "Jan 5", requests: 25, resolved: 20, pending: 5 },
  { date: "Jan 6", requests: 28, resolved: 22, pending: 6 },
  { date: "Jan 7", requests: 27, resolved: 21, pending: 6 },
]

const requestsByType = [
  { type: "Fee Issue", count: 42 },
  { type: "Document Request", count: 28 },
  { type: "Course Registration", count: 22 },
  { type: "Exam Scheduling", count: 18 },
  { type: "Student Grievance", count: 12 },
  { type: "General Inquiry", count: 5 },
]

export default function Analytics() {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Requests Trend */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Requests Trend</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={requestsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="requests" stroke="var(--color-primary)" name="Total" />
                <Line type="monotone" dataKey="resolved" stroke="var(--color-accent)" name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Requests by Type */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Requests by Type</CardTitle>
            <CardDescription>Distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={requestsByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Average Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">2.3 hrs</p>
            <p className="text-sm text-accent mt-2">15% faster than last week</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">94%</p>
            <p className="text-sm text-accent mt-2">127 total requests processed</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Agent Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">87%</p>
            <p className="text-sm text-accent mt-2">Autonomous resolution rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
