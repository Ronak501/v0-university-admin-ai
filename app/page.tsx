"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, MessageCircle, FileText, Clock, ArrowRight, LogIn } from "lucide-react"

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">UA</span>
            </div>
            <span className="font-semibold text-lg">University Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/login?signup=true">
              <Button size="sm" className="gap-2">
                <LogIn className="w-4 h-4" />
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-2 mb-6 rounded-lg bg-accent/10 border border-accent/20">
            <span className="text-sm font-medium text-accent">AI-Powered Administration</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-balance">
            Resolve University Issues in <span className="text-accent">Minutes</span>, Not Days
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Intelligent AI agents instantly handle fee disputes, document requests, course registration, and more. Skip
            the paperwork, get answers fast.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/student-portal">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Student Portal
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/admin-dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Intelligent Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powered by autonomous AI agents that work 24/7 to resolve your issues
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>AI Chat Assistant</CardTitle>
                <CardDescription>Describe your issue naturally</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Simply tell our AI what you need. It understands context, classifies your request, and routes it to
                  the right department instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Real-Time Status Tracking</CardTitle>
                <CardDescription>Watch your issue being solved</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  See every step of the resolution process. From AI analysis to ERP updates to document generation—full
                  transparency.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Automatic Document Handling</CardTitle>
                <CardDescription>Receive certificates and receipts instantly</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Generate, encrypt, and deliver official documents securely. No more manual paperwork or multiple
                  visits to the office.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Policy Compliant</CardTitle>
                <CardDescription>University rules, always followed</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All actions validate against policies, ensure RBAC, and maintain immutable audit logs. Complete
                  governance built-in.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center bg-primary/5 border border-primary/20 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Administration?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
            Join students and staff experiencing instant resolution of academic and administrative issues.
          </p>
          <Link href="/student-portal">
            <Button size="lg" className="gap-2">
              Start Your Request
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/50 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2026 University Admin AI. All rights reserved.</p>
            <p>Powered by Autonomous AI Agents</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
