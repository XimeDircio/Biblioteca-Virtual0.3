"use client"

import { useState } from "react"
import { Search, Package, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateInventory } from "@/app/actions/admin-actions"
import type { Book, Category } from "@/lib/books-data"

interface InventoryManagementProps {
  books: Book[]
  categories: Category[]
}

export default function InventoryManagement({ books, categories }: InventoryManagementProps) {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [editingBook, setEditingBook] = useState<string | null>(null)
  const [newQuantity, setNewQuantity] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === "all" || book.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.name || categoryId
  }

  const handleSaveQuantity = async (bookId: string) => {
    setLoading(true)
    const result = await updateInventory(bookId, newQuantity)
    if (result.error) {
      alert(result.error)
    } else {
      alert("Inventario actualizado correctamente")
    }
    setEditingBook(null)
    setLoading(false)
  }

  return (
    <Card className="bg-[#c8d0b0] border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-[#6e7359] flex items-center gap-2">
          <Package className="h-5 w-5" />
          Gestión de Inventario
        </CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8c9270]" />
            <Input
              placeholder="Buscar por título o autor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white border-[#a8af8c]"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-64 bg-white border-[#a8af8c]">
              <SelectValue placeholder="Filtrar por carrera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las carreras</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#a8af8c] text-white">
                <th className="p-3 text-left rounded-tl-lg">Título</th>
                <th className="p-3 text-left">Autor</th>
                <th className="p-3 text-left">Carrera</th>
                <th className="p-3 text-center">Año</th>
                <th className="p-3 text-center">Cantidad Total</th>
                <th className="p-3 text-center rounded-tr-lg">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[#8c9270]">
                    No se encontraron libros
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book, index) => (
                  <tr key={book.id} className={index % 2 === 0 ? "bg-white" : "bg-[#f5f7f0]"}>
                    <td className="p-3 font-medium text-[#6e7359]">{book.title}</td>
                    <td className="p-3 text-[#8c9270]">{book.author}</td>
                    <td className="p-3 text-[#8c9270] text-sm">{getCategoryName(book.category)}</td>
                    <td className="p-3 text-center text-[#8c9270]">{book.year}</td>
                    <td className="p-3 text-center">
                      {editingBook === book.id ? (
                        <Input
                          type="number"
                          min="0"
                          value={newQuantity}
                          onChange={(e) => setNewQuantity(Number.parseInt(e.target.value) || 0)}
                          className="w-20 mx-auto text-center"
                        />
                      ) : (
                        <span className="font-semibold text-[#6e7359]">3</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {editingBook === book.id ? (
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveQuantity(book.id)}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Guardar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingBook(null)}>
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditingBook(book.id)
                            setNewQuantity(3)
                          }}
                          className="bg-[#6e7359] hover:bg-[#8c9270]"
                        >
                          Editar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
