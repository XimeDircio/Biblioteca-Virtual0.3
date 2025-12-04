"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { BookOpen } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    console.log("[v0] Intentando iniciar sesión con:", email)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("[v0] Respuesta de Supabase:", { data, error })

      if (error) {
        console.log("[v0] Error al iniciar sesión:", error)
        if (error.message === "Invalid login credentials") {
          throw new Error("Correo o contraseña incorrectos")
        }
        throw error
      }

      console.log("[v0] Login exitoso, redirigiendo...")
      router.push("/profile")
      router.refresh()
    } catch (error: unknown) {
      console.log("[v0] Error capturado:", error)
      setError(error instanceof Error ? error.message : "Ocurrió un error")
    } finally {
      setIsLoading(false)
    }
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
              Biblioteca Virtual
            </h1>
            <p className="text-sm text-gray-600">Accede a tu cuenta para continuar</p>
          </div>

          <Card className="border-2" style={{ borderColor: "#7c9d4f" }}>
            <CardHeader>
              <CardTitle className="text-xl" style={{ color: "#2d5016" }}>
                Iniciar Sesión
              </CardTitle>
              <CardDescription>Ingresa tu correo y contraseña</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
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
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" style={{ color: "#2d5016" }}>
                        Contraseña
                      </Label>
                      <Link
                        href="/auth/reset-password"
                        className="text-sm font-medium underline underline-offset-4"
                        style={{ color: "#7c9d4f" }}
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                    {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm text-gray-600">
                  ¿No tienes una cuenta?{" "}
                  <Link
                    href="/auth/signup"
                    className="font-semibold underline underline-offset-4"
                    style={{ color: "#2d5016" }}
                  >
                    Regístrate aquí
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
