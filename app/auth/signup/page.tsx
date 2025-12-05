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

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [career, setCareer] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    if (!fullName.trim()) {
      setError("El nombre completo es requerido")
      setIsLoading(false)
      return
    }

    if (!career) {
      setError("Por favor selecciona una carrera")
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            career: career,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: fullName,
          career: career,
          avatar_url: null,
          books_read: 0,
          hours_reading: 0,
          favorites: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (profileError) {
          console.error("Error creating profile:", profileError)
        }

        router.push("/profile")
        router.refresh()
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocurrió un error")
    } finally {
      setIsLoading(false)
    }
  }

  const careers = [
    "Ingeniería en Sistemas Computacionales",
    "Ingeniería Bioquímica",
    "Ingeniería Electromecánica",
    "Ingeniería de Gestión Empresarial",
    "Arquitectura",
    "Administración",
    "Contador Público",
  ]

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
            <p className="text-sm text-gray-600">Crea tu cuenta para comenzar</p>
          </div>

          <Card className="border-2" style={{ borderColor: "#7c9d4f" }}>
            <CardHeader>
              <CardTitle className="text-xl" style={{ color: "#2d5016" }}>
                Crear Cuenta
              </CardTitle>
              <CardDescription>Completa el formulario para registrarte</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName" style={{ color: "#2d5016" }}>
                      Nombre Completo
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Juan Pérez"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="border-2"
                      style={{ borderColor: "#c5d9a4" }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="career" style={{ color: "#2d5016" }}>
                      Carrera
                    </Label>
                    <select
                      id="career"
                      required
                      value={career}
                      onChange={(e) => setCareer(e.target.value)}
                      className="flex h-10 w-full rounded-md border-2 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2"
                      style={{ borderColor: "#c5d9a4" }}
                    >
                      <option value="">Selecciona tu carrera</option>
                      {careers.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
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
                    <Label htmlFor="password" style={{ color: "#2d5016" }}>
                      Contraseña
                    </Label>
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
                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password" style={{ color: "#2d5016" }}>
                      Repetir Contraseña
                    </Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
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
                    {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm text-gray-600">
                  ¿Ya tienes una cuenta?{" "}
                  <Link
                    href="/auth/login"
                    className="font-semibold underline underline-offset-4"
                    style={{ color: "#2d5016" }}
                  >
                    Inicia sesión aquí
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
