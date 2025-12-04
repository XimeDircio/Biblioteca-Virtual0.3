"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookCheck, Loader2 } from "lucide-react"
import { borrowBook } from "@/app/actions/book-loans"
import { useRouter } from "next/navigation"

type BorrowButtonProps = {
  bookId: string
  availableCopies: number
  hasActiveLoan: boolean
}

export function BorrowButton({ bookId, availableCopies, hasActiveLoan }: BorrowButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleBorrow = async () => {
    setIsLoading(true)
    const result = await borrowBook(bookId)
    setIsLoading(false)

    if (result.error) {
      alert(result.error)
    } else {
      alert("¡Libro prestado exitosamente! Tienes 14 días para devolverlo.")
      router.refresh()
    }
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
          Pedir prestado ({availableCopies} disponibles)
        </>
      )}
    </Button>
  )
}
