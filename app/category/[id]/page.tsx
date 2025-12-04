import { books, categories } from "@/lib/books-data"
import { Header } from "@/components/header"
import { BookCard } from "@/components/book-card"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function generateStaticParams() {
  return categories.map((category) => ({
    id: category.id,
  }))
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = categories.find((c) => c.id === id)

  if (!category) {
    notFound()
  }

  const categoryBooks = books.filter((book) => book.category === id)

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">{category.icon}</span>
            <div>
              <h1 className="text-4xl font-bold text-foreground text-balance">{category.name}</h1>
              <p className="text-muted-foreground mt-2">
                {categoryBooks.length} {categoryBooks.length === 1 ? "libro disponible" : "libros disponibles"}
              </p>
            </div>
          </div>
        </div>

        {categoryBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay libros disponibles en esta categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
