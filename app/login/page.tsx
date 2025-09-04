"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ThemeToggle from "@/components/ThemeToggle"
import { Progress } from "@/components/ui/progress"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const { data: session, status } = useSession()

  // Animate full-page progress while loading
  useEffect(() => {
    if (status === "loading" || loading) {
      setProgress(0)
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 100 : prev + Math.random() * 10))
      }, 100)
      return () => clearInterval(interval)
    }
  }, [status, loading])

  // Redirect immediately when authenticated
  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard")
  }, [status, router])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })
      if (res?.ok) router.replace("/dashboard")
      else alert(res?.error || "Login failed")
    } catch (err) {
      alert("Network error: " + err)
    } finally {
      setLoading(false)
    }
  }

  // Full-page white progress while loading
  if (status === "loading" || loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <div className="w-3/4 md:w-1/2">
          <Progress value={progress} className="h-2 rounded-xl bg-white" />
        </div>
      </div>
    )
  }

  // Only show login form if unauthenticated
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Login</CardTitle>
            <ThemeToggle />
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="flex items-center justify-center">
                Login
              </Button>
              <p className="text-sm text-center text-muted-foreground mt-2">
                Don’t have an account?{" "}
                <a
                  href="/register"
                  className="text-blue-500 hover:underline font-medium"
                >
                  Sign Up
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null // shouldn't render anything while redirecting
}
