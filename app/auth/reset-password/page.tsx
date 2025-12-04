"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { BookOpen, CheckCircle2 } from "lucide-react"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (error) throw error

      setSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocurrió un error al enviar el correo")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="w-full max-w-md">
          <Card className="border-2" style={{ borderColor: "#7c9d4f" }}>
            <CardHeader className="text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: "#7c9d4f" }}
              >
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl" style={{ color: "#2d5016" }}>
                Correo Enviado
              </CardTitle>
              <CardDescription>
                Revisa tu correo electrónico para restablecer tu contraseña. Puede tardar unos minutos en llegar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/auth/login">
                <Button className="w-full text-white" style={{ backgroundColor: "#2d5016" }}>
                  Volver al inicio de sesión
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
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
              Restablecer Contraseña
            </h1>
            <p className="text-sm text-gray-600">Ingresa tu correo para recibir instrucciones</p>
          </div>

          <Card className="border-2" style={{ borderColor: "#7c9d4f" }}>
            <CardHeader>
              <CardTitle className="text-xl" style={{ color: "#2d5016" }}>
                Recupera tu Cuenta
              </CardTitle>
              <CardDescription>
                Te enviaremos un correo con instrucciones para restablecer tu contraseña
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email" style={{ color: "#2d5016" }}>
                      Correo Electrónico
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-2"
                      style={{ borderColor: "#c5d9a4" }}
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
                    {isLoading ? "Enviando..." : "Enviar Correo de Recuperación"}
                  </Button>
                </div>

                <div className="mt-4 text-center text-sm text-gray-600">
                  ¿Recordaste tu contraseña?{" "}
                  <Link
                    href="/auth/login"
                    className="font-semibold underline underline-offset-4"
                    style={{ color: "#2d5016" }}
                  >
                    Iniciar sesión
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
