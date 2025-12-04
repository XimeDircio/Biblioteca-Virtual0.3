import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { categories } from "@/lib/books-data"
import Link from "next/link"

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-2">Categorías</h1>
          <p className="text-muted-foreground mb-8">Explora nuestra biblioteca por carrera y área de estudio</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
                  <CardContent className="p-6">
                    <div className="text-5xl mb-4">{category.icon}</div>
                    <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-primary text-primary-foreground py-4 mt-10">
        <div className="container text-center">
          <p className="text-sm">&copy; 2025 Biblioteca Virtual | Desarrollado por ISC Dircio</p>
        </div>
      </footer>
    </div>
  )
}
