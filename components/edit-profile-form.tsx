"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { User } from "lucide-react"

interface EditProfileFormProps {
  userId: string
  email: string
  currentName: string
  currentCareer: string
}

export function EditProfileForm({ userId, email, currentName, currentCareer }: EditProfileFormProps) {
  const [fullName, setFullName] = useState(currentName)
  const [career, setCareer] = useState(currentCareer)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const careers = [
    "Ingeniería en Sistemas Computacionales",
    "Ingeniería Bioquímica",
    "Ingeniería Electromecánica",
    "Ingeniería de Gestión Empresarial",
    "Arquitectura",
    "Administración",
    "Contador Público",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

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

    const supabase = createClient()

    try {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userId,
        full_name: fullName,
        career: career,
        books_read: 0,
        hours_reading: 0,
        favorites: 0,
        updated_at: new Date().toISOString(),
      })

      if (profileError) throw profileError

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el perfil")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-lg mx-auto bg-muted border-border shadow-lg">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-10 w-10 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl text-primary">Completa tu Perfil</CardTitle>
        <CardDescription>Para continuar, necesitamos algunos datos adicionales sobre ti.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Correo Electrónico
            </Label>
            <Input id="email" type="email" value={email} disabled className="bg-background/50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-foreground">
              Nombre Completo
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Tu nombre completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="border-2 border-secondary focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="career" className="text-foreground">
              Carrera
            </Label>
            <select
              id="career"
              value={career}
              onChange={(e) => setCareer(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border-2 border-secondary bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
            >
              <option value="">Selecciona tu carrera</option>
              {careers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="rounded-md p-3 text-sm bg-destructive/10 text-destructive">{error}</div>}

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar Perfil"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
