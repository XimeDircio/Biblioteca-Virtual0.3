"use client"

import { BookOpen, User, LogIn, Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Obtener usuario actual
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)

      if (user) {
        supabase
          .from("admin_users")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle()
          .then(({ data }) => {
            setIsAdmin(!!data)
          })
      }
    })

    // Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <BookOpen className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold">Biblioteca Virtual</h1>
          </div>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm hover:underline">
            Inicio
          </Link>
          <Link href="/categories" className="text-sm hover:underline">
            Categorías
          </Link>
          <Link href="/about" className="text-sm hover:underline">
            Acerca de
          </Link>
          {!loading && isAdmin && (
            <Link href="/admin" className="flex items-center gap-2 text-sm hover:underline">
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
          {!loading &&
            (user ? (
              <Link href="/profile" className="flex items-center gap-2 text-sm hover:underline">
                <User className="h-4 w-4" />
                Perfil
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button variant="secondary" size="sm" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Iniciar Sesión
                </Button>
              </Link>
            ))}
        </nav>
      </div>
    </header>
  )
}
