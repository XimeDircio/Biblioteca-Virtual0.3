"use client"

import { useState } from "react"
import { Book, BookOpen, Users, Clock, CheckCircle, Package, BarChart3, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoanManagement from "./loan-management"
import InventoryManagement from "./inventory-management"
import type { Book as BookType, Category } from "@/lib/books-data"

interface Loan {
  id: string
  book_id: string
  user_id: string
  status: string
  approved: boolean
  loan_date: string
  due_date: string
  return_date?: string
  rejection_reason?: string
  profiles?: {
    full_name: string
    career: string
  }
}

interface Stats {
  totalBooks: number
  availableBooks: number
  activeLoans: number
  pendingLoans: number
  loanCounts: Record<string, number>
}

interface AdminDashboardProps {
  loans: Loan[]
  stats: Stats
  books: BookType[]
  categories: Category[]
}

export default function AdminDashboard({ loans, stats, books, categories }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Encontrar libro más y menos prestado
  const sortedByLoans = [...books].sort((a, b) => {
    const loansA = stats.loanCounts[a.id] || 0
    const loansB = stats.loanCounts[b.id] || 0
    return loansB - loansA
  })

  const mostBorrowed = sortedByLoans[0]
  const leastBorrowed = sortedByLoans[sortedByLoans.length - 1]

  const pendingLoans = loans.filter((l) => l.status === "pending" || (!l.approved && l.status === "active"))
  const activeLoans = loans.filter((l) => l.status === "active" && l.approved)
  const returnedLoans = loans.filter((l) => l.status === "returned")
  const overdueLoans = activeLoans.filter((l) => new Date(l.due_date) < new Date())

  return (
    <div className="min-h-screen bg-[#d9e0c6]">
      {/* Header */}
      <header className="bg-[#6e7359] text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white hover:bg-[#8c9270]">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold tracking-wide">Panel del Administrador - Biblioteca de Ingeniería</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-[#a8af8c] text-white">
              Administrador
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-[#c8d0b0] p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#6e7359] data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="loans" className="data-[state=active]:bg-[#6e7359] data-[state=active]:text-white">
              <BookOpen className="h-4 w-4 mr-2" />
              Préstamos
            </TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-[#6e7359] data-[state=active]:text-white">
              <Package className="h-4 w-4 mr-2" />
              Inventario
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-[#c8d0b0] border-none shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-[#6e7359]">Total de Libros</CardTitle>
                  <Book className="h-5 w-5 text-[#6e7359]" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#6e7359]">{stats.totalBooks}</div>
                  <p className="text-xs text-[#8c9270]">{stats.availableBooks} disponibles</p>
                </CardContent>
              </Card>

              <Card className="bg-[#c8d0b0] border-none shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-[#6e7359]">Préstamos Activos</CardTitle>
                  <Users className="h-5 w-5 text-[#6e7359]" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#6e7359]">{activeLoans.length}</div>
                  <p className="text-xs text-[#8c9270]">{overdueLoans.length} con retraso</p>
                </CardContent>
              </Card>

              <Card className="bg-[#c8d0b0] border-none shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-[#6e7359]">Pendientes</CardTitle>
                  <Clock className="h-5 w-5 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{pendingLoans.length}</div>
                  <p className="text-xs text-[#8c9270]">Esperando aprobación</p>
                </CardContent>
              </Card>

              <Card className="bg-[#c8d0b0] border-none shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-[#6e7359]">Devueltos</CardTitle>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{returnedLoans.length}</div>
                  <p className="text-xs text-[#8c9270]">Este mes</p>
                </CardContent>
              </Card>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#c8d0b0] border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#6e7359]">Estadísticas de Libros</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-[#8c9270] mb-1">Libro más solicitado:</p>
                    <p className="font-semibold text-[#6e7359]">
                      {mostBorrowed?.title || "-"}
                      {mostBorrowed && (
                        <span className="text-sm font-normal ml-2">
                          ({stats.loanCounts[mostBorrowed.id] || 0} préstamos)
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-[#8c9270] mb-1">Libro menos solicitado:</p>
                    <p className="font-semibold text-[#6e7359]">
                      {leastBorrowed?.title || "-"}
                      {leastBorrowed && (
                        <span className="text-sm font-normal ml-2">
                          ({stats.loanCounts[leastBorrowed.id] || 0} préstamos)
                        </span>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#c8d0b0] border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#6e7359]">Préstamos Pendientes de Aprobación</CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingLoans.length === 0 ? (
                    <p className="text-[#8c9270] text-center py-4">No hay préstamos pendientes</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {pendingLoans.slice(0, 5).map((loan) => {
                        const book = books.find((b) => b.id === loan.book_id)
                        return (
                          <div key={loan.id} className="bg-white rounded-lg p-3 flex items-center justify-between">
                            <div>
                              <p className="font-medium text-[#6e7359] text-sm">{book?.title || "Libro desconocido"}</p>
                              <p className="text-xs text-[#8c9270]">{loan.profiles?.full_name || "Usuario"}</p>
                            </div>
                            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                              Pendiente
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {pendingLoans.length > 0 && (
                    <Button
                      onClick={() => setActiveTab("loans")}
                      className="w-full mt-4 bg-[#6e7359] hover:bg-[#8c9270]"
                    >
                      Ver todos los préstamos
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Loans Tab */}
          <TabsContent value="loans">
            <LoanManagement loans={loans} books={books} />
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <InventoryManagement books={books} categories={categories} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-[#6e7359] text-white text-center py-4 mt-8">
        <p className="text-sm">© 2025 Biblioteca Virtual de Ingeniería | Panel de Administración</p>
      </footer>
    </div>
  )
}
