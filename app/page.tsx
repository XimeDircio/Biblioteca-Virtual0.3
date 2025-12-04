"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { SearchBar } from "@/components/search-bar"
import { books, categories } from "@/lib/books-data"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBooks = useMemo(() => {
    if (!searchQuery) return books
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery])

  const destacados = filteredBooks.slice(0, 6)
  const recomendados = filteredBooks.slice(6, 9)
  const recientes = filteredBooks.slice(9)

  return (
    <div className="min-h-screen">
      <Header />

      {/* Buscador */}
      <div className="bg-muted py-5">
        <div className="container">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Sección Destacados - 2 columnas */}
          <section className="md:col-span-2 bg-secondary text-secondary-foreground rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-white/40">Libros Destacados</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {destacados.map((book) => (
                <Link
                  key={book.id}
                  href={`/book/${book.id}`}
                  className="bg-white/10 hover:bg-white/20 rounded-md p-3 text-center transition-transform hover:scale-105"
                >
                  <div className="relative aspect-[3/4] mb-2">
                    <Image
                      src={book.coverImage || "/placeholder.svg"}
                      alt={book.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <p className="text-sm font-medium line-clamp-2">{book.title}</p>
                  <p className="text-xs opacity-80 mt-1">{book.author}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Sección Recomendados - 1 columna */}
          <section className="bg-accent text-accent-foreground rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-white/40">Recomendados</h2>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
              {recomendados.map((book) => (
                <Link
                  key={book.id}
                  href={`/book/${book.id}`}
                  className="bg-white/10 hover:bg-white/20 rounded-md p-3 text-center transition-transform hover:scale-105"
                >
                  <div className="relative aspect-[3/4] mb-2">
                    <Image
                      src={book.coverImage || "/placeholder.svg"}
                      alt={book.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <p className="text-sm font-medium line-clamp-2">{book.title}</p>
                  <p className="text-xs opacity-80 mt-1">{book.author}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Sección Recientes - 3 columnas */}
          <section className="md:col-span-3 bg-primary text-primary-foreground rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-white/40">Agregados Recientemente</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recientes.map((book) => (
                <Link
                  key={book.id}
                  href={`/book/${book.id}`}
                  className="bg-white/10 hover:bg-white/20 rounded-md p-3 text-center transition-transform hover:scale-105"
                >
                  <div className="relative aspect-[3/4] mb-2">
                    <Image
                      src={book.coverImage || "/placeholder.svg"}
                      alt={book.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <p className="text-sm font-medium line-clamp-2">{book.title}</p>
                  <p className="text-xs opacity-80 mt-1">{book.author}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Sección de categorías */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Explora por Carrera</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((category) => {
              const categoryBooks = books.filter((book) => book.category === category.id)
              return (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="bg-card hover:bg-accent/10 border border-border rounded-lg p-6 text-center transition-colors group"
                >
                  <div className="text-5xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {categoryBooks.length} {categoryBooks.length === 1 ? "libro" : "libros"}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground text-center py-4 mt-12">
        <p className="text-sm">© 2025 Biblioteca Virtual - Todos los derechos reservados</p>
      </footer>
    </div>
  )
}
