"use client"

import { useState } from "react"
import { CheckCircle, XCircle, RotateCcw, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { approveLoan, rejectLoan, markAsReturned } from "@/app/actions/admin-actions"
import type { Book } from "@/lib/books-data"

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

interface LoanManagementProps {
  loans: Loan[]
  books: Book[]
}

export default function LoanManagement({ loans, books }: LoanManagementProps) {
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  const getBookTitle = (bookId: string) => {
    const book = books.find((b) => b.id === bookId)
    return book?.title || "Libro desconocido"
  }

  const getStatusBadge = (loan: Loan) => {
    if (loan.status === "returned") {
      return <Badge className="bg-green-100 text-green-700 border-green-300">Devuelto</Badge>
    }
    if (loan.status === "rejected") {
      return <Badge className="bg-red-100 text-red-700 border-red-300">Rechazado</Badge>
    }
    if (!loan.approved || loan.status === "pending") {
      return <Badge className="bg-orange-100 text-orange-700 border-orange-300">Pendiente</Badge>
    }
    if (new Date(loan.due_date) < new Date()) {
      return <Badge className="bg-red-100 text-red-700 border-red-300">Retrasado</Badge>
    }
    return <Badge className="bg-blue-100 text-blue-700 border-blue-300">Activo</Badge>
  }

  const filteredLoans = loans.filter((loan) => {
    const bookTitle = getBookTitle(loan.book_id).toLowerCase()
    const userName = loan.profiles?.full_name?.toLowerCase() || ""
    const matchesSearch = bookTitle.includes(search.toLowerCase()) || userName.includes(search.toLowerCase())

    if (!matchesSearch) return false

    if (filter === "all") return true
    if (filter === "pending") return !loan.approved && loan.status !== "rejected" && loan.status !== "returned"
    if (filter === "active") return loan.approved && loan.status === "active"
    if (filter === "returned") return loan.status === "returned"
    if (filter === "overdue") return loan.approved && loan.status === "active" && new Date(loan.due_date) < new Date()
    if (filter === "rejected") return loan.status === "rejected"
    return true
  })

  const handleApprove = async (loanId: string) => {
    setLoading(loanId)
    const result = await approveLoan(loanId)
    if (result.error) {
      alert(result.error)
    }
    setLoading(null)
  }

  const handleReject = async (loanId: string) => {
    if (!rejectReason.trim()) {
      alert("Por favor ingresa un motivo de rechazo")
      return
    }
    setLoading(loanId)
    const result = await rejectLoan(loanId, rejectReason)
    if (result.error) {
      alert(result.error)
    }
    setRejectingId(null)
    setRejectReason("")
    setLoading(null)
  }

  const handleReturn = async (loanId: string) => {
    setLoading(loanId)
    const result = await markAsReturned(loanId)
    if (result.error) {
      alert(result.error)
    }
    setLoading(null)
  }

  return (
    <Card className="bg-[#c8d0b0] border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-[#6e7359]">Gestión de Préstamos</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8c9270]" />
            <Input
              placeholder="Buscar por libro o usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white border-[#a8af8c]"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white border-[#a8af8c]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="overdue">Retrasados</SelectItem>
              <SelectItem value="returned">Devueltos</SelectItem>
              <SelectItem value="rejected">Rechazados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#a8af8c] text-white">
                <th className="p-3 text-left rounded-tl-lg">Libro</th>
                <th className="p-3 text-left">Usuario</th>
                <th className="p-3 text-left">Carrera</th>
                <th className="p-3 text-center">Fecha Préstamo</th>
                <th className="p-3 text-center">Fecha Límite</th>
                <th className="p-3 text-center">Estado</th>
                <th className="p-3 text-center rounded-tr-lg">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#8c9270]">
                    No se encontraron préstamos
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan, index) => (
                  <tr key={loan.id} className={index % 2 === 0 ? "bg-white" : "bg-[#f5f7f0]"}>
                    <td className="p-3 font-medium text-[#6e7359]">{getBookTitle(loan.book_id)}</td>
                    <td className="p-3 text-[#8c9270]">{loan.profiles?.full_name || "Usuario desconocido"}</td>
                    <td className="p-3 text-[#8c9270] text-sm">{loan.profiles?.career || "-"}</td>
                    <td className="p-3 text-center text-sm text-[#8c9270]">
                      {new Date(loan.loan_date).toLocaleDateString("es-MX")}
                    </td>
                    <td className="p-3 text-center text-sm text-[#8c9270]">
                      {new Date(loan.due_date).toLocaleDateString("es-MX")}
                    </td>
                    <td className="p-3 text-center">{getStatusBadge(loan)}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        {!loan.approved && loan.status !== "rejected" && loan.status !== "returned" && (
                          <>
                            {rejectingId === loan.id ? (
                              <div className="flex flex-col gap-2">
                                <Input
                                  placeholder="Motivo de rechazo"
                                  value={rejectReason}
                                  onChange={(e) => setRejectReason(e.target.value)}
                                  className="text-sm"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleReject(loan.id)}
                                    disabled={loading === loan.id}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Confirmar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setRejectingId(null)
                                      setRejectReason("")
                                    }}
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(loan.id)}
                                  disabled={loading === loan.id}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Aprobar
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => setRejectingId(loan.id)}
                                  disabled={loading === loan.id}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Rechazar
                                </Button>
                              </>
                            )}
                          </>
                        )}
                        {loan.approved && loan.status === "active" && (
                          <Button
                            size="sm"
                            onClick={() => handleReturn(loan.id)}
                            disabled={loading === loan.id}
                            className="bg-[#6e7359] hover:bg-[#8c9270]"
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Devolver
                          </Button>
                        )}
                        {loan.status === "rejected" && loan.rejection_reason && (
                          <span className="text-xs text-red-600">Motivo: {loan.rejection_reason}</span>
                        )}
                      </div>
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
