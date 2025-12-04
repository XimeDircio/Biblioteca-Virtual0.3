"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, Loader2 } from "lucide-react"
import { returnBook } from "@/app/actions/book-loans"
import { useRouter } from "next/navigation"

type ReturnButtonProps = {
  loanId: string
}

export function ReturnButton({ loanId }: ReturnButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleReturn = async () => {
    if (!confirm("¿Estás seguro de que quieres devolver este libro?")) {
      return
    }

    setIsLoading(true)
    const result = await returnBook(loanId)
    setIsLoading(false)

    if (result.error) {
      alert(result.error)
    } else {
      alert("¡Libro devuelto exitosamente!")
      router.refresh()
    }
  }

  return (
    <Button onClick={handleReturn} disabled={isLoading} variant="outline" size="sm">
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Procesando...
        </>
      ) : (
        <>
          <BookOpen className="h-4 w-4 mr-2" />
          Devolver
        </>
      )}
    </Button>
  )
}
