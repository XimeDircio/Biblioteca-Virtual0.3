"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { BookOpen } from "lucide-react"

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsValidSession(!!session)
    }
    checkSession()
  }, [])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    const supabase = createClient()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      alert("Contraseña actualizada correctamente")
      router.push("/auth/login")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocurrió un error al actualizar la contraseña")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidSession) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6" style={{ backgroundColor: "#f5f5f5" }}>
        <Card className="border-2" style={{ borderColor: "#7c9d4f" }}>
          <CardHeader>
            <CardTitle style={{ color: "#2d5016" }}>Sesión Inválida</CardTitle>
            <CardDescription>
              El enlace ha expirado o es inválido. Por favor, solicita un nuevo correo de recuperación.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6" style={{ backgroundColor: "#f5f5f5" }}>
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "#2d5016" }}
            >
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "#2d5016" }}>
              Nueva Contraseña
            </h1>
            <p className="text-sm text-gray-600">Ingresa tu nueva contraseña</p>
          </div>

          <Card className="border-2" style={{ borderColor: "#7c9d4f" }}>
            <CardHeader>
              <CardTitle className="text-xl" style={{ color: "#2d5016" }}>
                Actualizar Contraseña
              </CardTitle>
              <CardDescription>Elige una contraseña segura para tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="password" style={{ color: "#2d5016" }}>
                      Nueva Contraseña
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-2"
                      style={{ borderColor: "#c5d9a4" }}
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword" style={{ color: "#2d5016" }}>
                      Confirmar Contraseña
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-2"
                      style={{ borderColor: "#c5d9a4" }}
                      placeholder="Repite tu contraseña"
                    />
                  </div>

                  {error && (
                    <div className="rounded-md p-3 text-sm" style={{ backgroundColor: "#fee", color: "#c00" }}>
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full text-white"
                    disabled={isLoading}
                    style={{ backgroundColor: "#2d5016" }}
                  >
                    {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
