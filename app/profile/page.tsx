import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { books } from "@/lib/books-data"
import { BookOpen, Clock, Heart, BookMarked } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/logout-button"
import { ReturnButton } from "@/components/return-button"
import { Badge } from "@/components/ui/badge"
import { EditProfileForm } from "@/components/edit-profile-form"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  const { data: savedBooksData } = await supabase.from("saved_books").select("book_id").eq("user_id", user.id)

  const { data: activeLoans } = await supabase
    .from("book_loans")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("loan_date", { ascending: false })

  const savedBookIds = savedBooksData?.map((sb) => sb.book_id) || []
  const savedBooks = books.filter((book) => savedBookIds.includes(book.id))

  const borrowedBooks =
    activeLoans
      ?.map((loan) => {
        const book = books.find((b) => b.id === loan.book_id)
        return { ...loan, book }
      })
      .filter((loan) => loan.book !== undefined) || []

  // Estadísticas del usuario
  const stats = {
    booksRead: profile?.books_read || 0,
    hoursReading: profile?.hours_reading || 0,
    favorites: profile?.favorites || 0,
    activeLoans: borrowedBooks.length,
  }

  // Formatear fecha de creación
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("es-ES", { year: "numeric", month: "long" })
    : "Recientemente"

  const profileIncomplete = !profile || !profile.full_name || !profile.career

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-10 px-4">
        {profileIncomplete ? (
          <EditProfileForm
            userId={user.id}
            email={user.email || ""}
            currentName={profile?.full_name || ""}
            currentCareer={profile?.career || ""}
          />
        ) : (
          <>
            {/* Perfil Principal */}
            <Card className="max-w-5xl mx-auto bg-muted border-border shadow-lg">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start relative">
                  {/* Foto de Perfil */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-40 h-40 rounded-full border-[5px] border-secondary overflow-hidden bg-background">
                      <Image
                        src={profile?.avatar_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                        alt="Foto de perfil"
                        width={160}
                        height={160}
                        className="object-cover"
                      />
                    </div>
                    <h2 className="mt-4 text-2xl font-semibold text-primary">{profile?.full_name || "Usuario"}</h2>
                  </div>

                  {/* Información del Perfil */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-primary border-b-2 border-secondary pb-2 mb-4">
                      Información del Usuario
                    </h3>
                    <div className="space-y-2 text-foreground">
                      <p className="text-base">
                        <strong>Carrera:</strong> {profile?.career || "Sin especificar"}
                      </p>
                      <p className="text-base">
                        <strong>Correo:</strong> {user.email}
                      </p>
                      <p className="text-base">
                        <strong>Miembro desde:</strong> {memberSince}
                      </p>
                      <p className="text-base">
                        <strong>Libros leídos:</strong> {stats.booksRead}
                      </p>
                    </div>
                  </div>

                  {/* Botones de Acciones */}
                  <div className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
                    <LogoutButton />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas */}
            <div className="max-w-5xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="bg-card shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-4xl font-bold text-primary mb-2">{stats.booksRead}</h2>
                  <p className="text-base text-accent font-medium">Libros leídos</p>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-4xl font-bold text-primary mb-2">{stats.hoursReading}</h2>
                  <p className="text-base text-accent font-medium">Horas de lectura</p>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-4xl font-bold text-primary mb-2">{stats.favorites}</h2>
                  <p className="text-base text-accent font-medium">Favoritos</p>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <BookMarked className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-4xl font-bold text-primary mb-2">{stats.activeLoans}</h2>
                  <p className="text-base text-accent font-medium">Préstamos activos</p>
                </CardContent>
              </Card>
            </div>

            {borrowedBooks.length > 0 && (
              <Card className="max-w-5xl mx-auto mt-10 bg-secondary border-border shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-secondary-foreground border-b-2 border-secondary-foreground/40 pb-2 mb-6">
                    Mis Préstamos Activos
                  </h2>
                  <div className="space-y-4">
                    {borrowedBooks.map((loan) => {
                      const book = loan.book!
                      const dueDate = new Date(loan.due_date)
                      const today = new Date()
                      const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                      const isOverdue = daysLeft < 0

                      return (
                        <div
                          key={loan.id}
                          className="bg-secondary-foreground/10 p-4 rounded-lg flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                        >
                          <div className="flex-shrink-0">
                            <div className="w-20 h-28 relative rounded-md overflow-hidden bg-card">
                              <Image
                                src={book.coverImage || "/placeholder.svg"}
                                alt={book.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex-1 space-y-2">
                            <Link href={`/book/${book.id}`} className="hover:underline">
                              <h3 className="font-semibold text-secondary-foreground">{book.title}</h3>
                            </Link>
                            <p className="text-sm text-secondary-foreground/70">{book.author}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant={isOverdue ? "destructive" : "secondary"}>
                                {isOverdue ? `Vencido hace ${Math.abs(daysLeft)} días` : `${daysLeft} días restantes`}
                              </Badge>
                              <span className="text-xs text-secondary-foreground/70">
                                Prestado: {new Date(loan.loan_date).toLocaleDateString("es-ES")}
                              </span>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <ReturnButton loanId={loan.id} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Libros Guardados */}
            <Card className="max-w-5xl mx-auto mt-10 bg-secondary border-border shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-secondary-foreground border-b-2 border-secondary-foreground/40 pb-2 mb-6">
                  Mis Libros Guardados
                </h2>
                {savedBooks.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {savedBooks.map((book) => (
                      <Link
                        key={book.id}
                        href={`/book/${book.id}`}
                        className="bg-secondary-foreground/10 hover:bg-secondary-foreground/20 p-3 rounded-lg transition-all hover:scale-105"
                      >
                        <div className="aspect-[3/4] relative mb-2 rounded-md overflow-hidden bg-card">
                          <Image
                            src={book.coverImage || "/placeholder.svg"}
                            alt={book.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-sm text-secondary-foreground font-medium text-center line-clamp-2">
                          {book.title}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-secondary-foreground/70 py-8">
                    Aún no has guardado ningún libro. Explora la biblioteca y guarda tus favoritos.
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-4 mt-10">
        <div className="container text-center">
          <p className="text-sm">&copy; 2025 Biblioteca Virtual | Desarrollado por ISC Dircio</p>
        </div>
      </footer>
    </div>
  )
}
