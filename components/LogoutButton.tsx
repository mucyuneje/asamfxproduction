"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function LogoutButton() {
  return (
    <Button
      variant="destructive" // optional, makes it red
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      Logout
    </Button>
  )
}
