import { notFound } from "next/navigation"
import { books, categories } from "@/lib/books-data"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, FileText, User, PackageCheck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PDFViewer } from "@/components/pdf-viewer"
import { createClient } from "@/lib/supabase/server"
import { BorrowButton } from "@/components/borrow-button"
import { Badge } from "@/components/ui/badge"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function BookPage({ params }: PageProps) {
  const { id } = await params
  const book = books.find((b) => b.id === id)

  if (!book) {
    notFound()
  }

  const category = categories.find((c) => c.id === book.category)
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: inventory } = await supabase.from("books_inventory").select("*").eq("book_id", id).maybeSingle()

  let hasActiveLoan = false
  if (user) {
    const { data: activeLoan } = await supabase
      .from("book_loans")
      .select("*")
      .eq("user_id", user.id)
      .eq("book_id", id)
      .eq("status", "active")
      .maybeSingle()

    hasActiveLoan = !!activeLoan
  }

  const availableCopies = inventory?.available_copies || 0
  const totalCopies = inventory?.total_copies || 0

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8 space-y-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la biblioteca
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
          {/* Book Info Sidebar */}
          <aside className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="relative h-96 w-full bg-muted rounded-lg overflow-hidden">
                  <Image src={book.coverImage || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-foreground text-balance">{book.title}</h1>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{book.author}</span>
                  </div>

                  {category && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{book.description}</p>

                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Año
                    </div>
                    <span className="font-medium text-foreground">{book.year}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Páginas
                    </div>
                    <span className="font-medium text-foreground">{book.pages}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <PackageCheck className="h-4 w-4" />
                      Disponibilidad
                    </div>
                    <Badge variant={availableCopies > 0 ? "default" : "destructive"}>
                      {availableCopies} / {totalCopies}
                    </Badge>
                  </div>
                </div>

                {user && (
                  <div className="pt-4 border-t border-border">
                    <BorrowButton bookId={id} availableCopies={availableCopies} hasActiveLoan={hasActiveLoan} />
                  </div>
                )}

                {!user && (
                  <div className="pt-4 border-t border-border">
                    <Link href="/auth/login" className="block">
                      <Button variant="outline" className="w-full bg-transparent">
                        Inicia sesión para pedir prestado
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* PDF Viewer */}
          <main>
            <Card>
              <CardContent className="p-0">
                <PDFViewer pdfUrl={book.pdfUrl} />
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}
