"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookCheck, Loader2, Clock } from "lucide-react"
import { borrowBook } from "@/app/actions/book-loans"
import { useRouter } from "next/navigation"

type BorrowButtonProps = {
  bookId: string
  availableCopies: number
  hasActiveLoan: boolean
  hasPendingLoan?: boolean
}

export function BorrowButton({ bookId, availableCopies, hasActiveLoan, hasPendingLoan }: BorrowButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleBorrow = async () => {
    setIsLoading(true)
    const result = await borrowBook(bookId)
    setIsLoading(false)

    if (result.error) {
      alert(result.error)
    } else {
      alert(result.message || "¡Solicitud enviada! Un administrador revisará tu préstamo.")
      router.refresh()
    }
  }

  if (hasPendingLoan) {
    return (
      <Button variant="secondary" disabled className="w-full bg-orange-100 text-orange-700 hover:bg-orange-100">
        <Clock className="h-4 w-4 mr-2" />
        Pendiente de aprobación
      </Button>
    )
  }

  if (hasActiveLoan) {
    return (
      <Button variant="secondary" disabled className="w-full">
        <BookCheck className="h-4 w-4 mr-2" />
        Ya lo tienes prestado
      </Button>
    )
  }

  if (availableCopies === 0) {
    return (
      <Button variant="destructive" disabled className="w-full">
        No disponible
      </Button>
    )
  }

  return (
    <Button onClick={handleBorrow} disabled={isLoading} className="w-full" variant="default">
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Procesando...
        </>
      ) : (
        <>
          <BookCheck className="h-4 w-4 mr-2" />
          Solicitar préstamo ({availableCopies} disponibles)
        </>
      )}
    </Button>
  )
}
