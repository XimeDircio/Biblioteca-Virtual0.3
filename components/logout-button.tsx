"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const confirmed = confirm("¿Estás seguro de que deseas cerrar sesión?")
    if (confirmed) {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
    }
  }

  return (
    <Button onClick={handleLogout} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
      <LogOut className="h-4 w-4" />
      Salir
    </Button>
  )
}
